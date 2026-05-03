const path = require("path");
const fs = require("fs-extra");
const mri = require("mri");

const repoRoot = path.resolve(__dirname, "..");

function hashSeed(input) {
    const text = String(input);
    let hash = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

function mulberry32(seed) {
    let value = seed >>> 0;

    return () => {
        value = (value + 0x6D2B79F5) >>> 0;
        let mixed = Math.imul(value ^ (value >>> 15), value | 1);
        mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
}

function average(values) {
    if (values.length === 0) {
        return 0;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
    if (values.length === 0) {
        return 0;
    }

    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function percentile(values, p) {
    if (values.length === 0) {
        return 0;
    }

    const sorted = [...values].sort((left, right) => left - right);
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) {
        return sorted[lower];
    }

    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function round(value, digits = 2) {
    return Number(value.toFixed(digits));
}

function percentage(value, total) {
    if (!total) {
        return 0;
    }

    return Number(((value / total) * 100).toFixed(2));
}

function sanitizeFilePart(value) {
    return String(value).replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function timestampSlug() {
    return new Date().toISOString().replace(/[:.]/g, "-");
}

function createSilentTerm() {
    return {
        term: {
            clearScreen: () => undefined,
            prompt: () => undefined,
            hidePrompt: () => undefined,
            writelns: async () => undefined,
        },
    };
}

function loadEngine() {
    require(path.join(repoRoot, "js/ts/deadwood-model.js"));
    require(path.join(repoRoot, "js/ts/deadwood-game.js"));

    if (!globalThis.DeadwoodEngine || typeof globalThis.DeadwoodEngine.createGame !== "function") {
        throw new Error("DeadwoodEngine.createGame is unavailable. Run the TypeScript build first.");
    }

    return globalThis.DeadwoodEngine;
}

const COMMAND_CANONICAL = new Map([
    ["face", "face it"],
    ["face it", "face it"],
    ["face-it", "face it"],
    ["detour", "detour"],
    ["long way", "detour"],
    ["pass", "pass by"],
    ["pass by", "pass by"],
    ["pass-by", "pass by"],
    ["drive", "drive off"],
    ["drive off", "drive off"],
    ["drive-off", "drive off"],
    ["desperate", "desperate hunt"],
    ["occultist", "rite"],
]);

function canonicalCommand(command) {
    return COMMAND_CANONICAL.get(command) || command;
}

function availableCanonical(commands) {
    return new Set(commands.map(canonicalCommand));
}

function mapOutfitCommand(action, detail) {
    if (action === "start-drive") {
        return "start";
    }

    if (!action.startsWith("buy-")) {
        return null;
    }

    const quantityMatch = detail.match(/^(\d+)/);
    const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
    const item = action.replace(/^buy-/, "");
    const itemMap = {
        food: "food",
        ammo: "ammo",
        supplies: "supplies",
        whiskey: "whiskey",
        grain: "blessed grain",
        oil: "warding oil",
    };
    const target = itemMap[item];
    if (!target) {
        return null;
    }

    return `buy ${target} ${quantity}`;
}

function mapRecordedCommand(record) {
    const action = String(record.action || "").trim();
    const detail = String(record.detail || "").trim();

    if (!action) {
        return null;
    }

    if (record.phase === "outfit") {
        return mapOutfitCommand(action, detail);
    }

    if (record.phase === "day" || record.phase === "night") {
        if (action === "trade-entry") {
            return "trade";
        }
        return canonicalCommand(action);
    }

    if (record.phase === "repair" || record.phase === "trade" || record.phase === "blight" || record.phase === "scout" || record.phase === "encounter" || record.phase === "rations") {
        return canonicalCommand(action);
    }

    return null;
}

function recordBucketKey(record) {
    const detail = String(record.detail || "").trim();

    if (record.phase === "trade") {
        return `trade:${detail}`;
    }

    if (record.phase === "encounter") {
        return `encounter:${detail}`;
    }

    if (record.phase === "scout") {
        return detail ? `scout:${detail}` : "scout";
    }

    return record.phase;
}

function buildTraceTemplate(report) {
    const buckets = {};
    let recordedDecisions = 0;

    for (const record of report.actions || []) {
        const command = mapRecordedCommand(record);
        if (!command) {
            continue;
        }

        const bucketKey = recordBucketKey(record);
        if (!buckets[bucketKey]) {
            buckets[bucketKey] = [];
        }

        buckets[bucketKey].push({
            week: record.week,
            phase: record.phase,
            action: record.action,
            detail: record.detail,
            command,
        });
        recordedDecisions += 1;
    }

    return {
        sourceRunId: report.runId,
        sourceSummary: report.summary,
        recordedDecisions,
        buckets,
    };
}

function createTraceCursor(template) {
    return {
        indices: Object.fromEntries(Object.keys(template.buckets).map(key => [key, 0])),
        lastUsed: {},
        stats: {
            exact: 0,
            contextual: 0,
            memory: 0,
            fallback: 0,
            total: 0,
            skippedRecordedActions: 0,
            byContext: {},
        },
    };
}

function noteDecision(cursor, source, contextKey) {
    cursor.stats[source] += 1;
    cursor.stats.total += 1;
    cursor.stats.byContext[contextKey] = cursor.stats.byContext[contextKey] || {
        exact: 0,
        contextual: 0,
        memory: 0,
        fallback: 0,
    };
    cursor.stats.byContext[contextKey][source] += 1;
}

function consumeFromBucket(template, cursor, bucketKey, availableSet) {
    const bucket = template.buckets[bucketKey];
    if (!bucket || bucket.length === 0) {
        return null;
    }

    let index = cursor.indices[bucketKey] || 0;
    if (index >= bucket.length) {
        return null;
    }

    const exact = bucket[index];
    if (availableSet.has(canonicalCommand(exact.command))) {
        cursor.indices[bucketKey] = index + 1;
        cursor.lastUsed[bucketKey] = exact.command;
        noteDecision(cursor, "exact", bucketKey);
        return exact.command;
    }

    for (let scan = index + 1; scan < bucket.length; scan += 1) {
        const candidate = bucket[scan];
        if (!availableSet.has(canonicalCommand(candidate.command))) {
            continue;
        }

        cursor.indices[bucketKey] = scan + 1;
        cursor.lastUsed[bucketKey] = candidate.command;
        cursor.stats.skippedRecordedActions += scan - index;
        noteDecision(cursor, "contextual", bucketKey);
        return candidate.command;
    }

    return null;
}

function memoryCommand(cursor, bucketKey, availableSet) {
    const remembered = cursor.lastUsed[bucketKey];
    if (!remembered) {
        return null;
    }

    if (!availableSet.has(canonicalCommand(remembered))) {
        return null;
    }

    noteDecision(cursor, "memory", bucketKey);
    return remembered;
}

function fallbackCommand(state) {
    if (state.phase === "outfit") {
        return "start";
    }
    if (state.phase === "day") {
        return "travel";
    }
    if (state.phase === "repair") {
        return "back";
    }
    if (state.phase === "trade") {
        return "back";
    }
    if (state.phase === "rations") {
        return "moderate";
    }
    if (state.phase === "night") {
        return "guard";
    }
    if (state.phase === "blight") {
        if (state.ammo === 0 && state.food < 100) {
            return "take";
        }
        return "leave";
    }
    if (state.phase === "scout") {
        return "face it";
    }
    if (state.phase === "encounter") {
        if (state.pendingEncounter === "salt-chapel") {
            return "pass by";
        }
        if (state.pendingEncounter === "hollow-drover") {
            return "follow";
        }
        return "refuse";
    }

    return "quit";
}

function traceBucketKeysForState(state) {
    if (state.phase === "trade") {
        return [`trade:${state.tradeLocation}:${state.tradeTime}`, "trade"];
    }

    if (state.phase === "encounter") {
        return [`encounter:${state.pendingEncounter}`];
    }

    if (state.phase === "scout") {
        return [
            `scout:${state.pendingScoutEncounter || state.activeScoutEncounter || "unknown"}`,
            "scout",
        ];
    }

    return [state.phase];
}

function chooseTraceCommand({ game, state, template, cursor }) {
    const availableSet = availableCanonical(game.getAvailableCommands());
    const bucketKeys = traceBucketKeysForState(state);

    for (const bucketKey of bucketKeys) {
        const command = consumeFromBucket(template, cursor, bucketKey, availableSet);
        if (command) {
            return command;
        }
    }

    if ((state.phase === "trade" || state.phase === "repair") && availableSet.has("back")) {
        noteDecision(cursor, "fallback", bucketKeys[0] || state.phase);
        return "back";
    }

    for (const bucketKey of bucketKeys) {
        const command = memoryCommand(cursor, bucketKey, availableSet);
        if (command) {
            return command;
        }
    }

    const fallback = fallbackCommand(state);
    noteDecision(cursor, "fallback", bucketKeys[0] || state.phase);
    return fallback;
}

async function runTraceReplay({ template, seedLabel, maxSteps = 1000 }) {
    const { term } = createSilentTerm();
    const rng = mulberry32(hashSeed(seedLabel));
    const root = {
        DeadwoodTrailReports: {
            currentRun: null,
            lastCompletedRun: null,
            savePaths: [],
        },
    };
    const { createGame } = loadEngine();
    const game = createGame({
        term,
        root,
        hasDom: false,
        random: rng,
        seed: seedLabel,
    });

    await game.start({ runMode: "simulation" });
    const cursor = createTraceCursor(template);
    let steps = 0;

    while (game.isActive() && steps < maxSteps) {
        const state = game.getStateSnapshot();
        const command = chooseTraceCommand({ game, state, template, cursor });
        await game.handleInput(command);
        steps += 1;
    }

    if (game.isActive()) {
        await game.stop("TRACE REPLAY ABORTED: STEP LIMIT REACHED.");
    }

    const report = game.getRunReport();
    if (!report) {
        throw new Error(`Trace replay ${seedLabel} did not produce a run report.`);
    }

    const fidelity = cursor.stats.total > 0
        ? round(((cursor.stats.exact + cursor.stats.contextual + (cursor.stats.memory * 0.6)) / cursor.stats.total) * 100)
        : 0;

    return {
        seedLabel,
        steps,
        report,
        trace: {
            ...cursor.stats,
            fidelity,
            unusedRecordedActions: template.recordedDecisions - cursor.stats.exact - cursor.stats.contextual,
        },
    };
}

function spread(values) {
    return {
        average: round(average(values)),
        median: round(median(values)),
        min: values.length ? Math.min(...values) : 0,
        max: values.length ? Math.max(...values) : 0,
        p10: round(percentile(values, 0.1)),
        p90: round(percentile(values, 0.9)),
    };
}

function toCsv(rows) {
    if (rows.length === 0) {
        return "";
    }

    const columns = Object.keys(rows[0]);
    const escape = value => {
        const text = String(value ?? "");
        if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
            return `"${text.replace(/"/g, "\"\"")}"`;
        }
        return text;
    };

    return [
        columns.join(","),
        ...rows.map(row => columns.map(column => escape(row[column])).join(",")),
    ].join("\n");
}

function summarizeTraceRuns(runs, template, reportPath, seedBase) {
    const weeks = runs.map(run => run.report.summary.weekEnded);
    const miles = runs.map(run => run.report.summary.milesReached);
    const cattle = runs.map(run => run.report.summary.cattleRemaining);
    const crewAlive = runs.map(run => run.report.summary.crewAlive);
    const morale = runs.map(run => run.report.summary.morale);
    const fear = runs.map(run => run.report.summary.fear);
    const fidelity = runs.map(run => run.trace.fidelity);
    const exact = runs.map(run => run.trace.exact);
    const contextual = runs.map(run => run.trace.contextual);
    const memory = runs.map(run => run.trace.memory);
    const fallback = runs.map(run => run.trace.fallback);
    const outcomes = {};
    const failures = {};
    const contextTotals = {};

    for (const run of runs) {
        const outcome = run.report.summary.outcome || "unknown";
        outcomes[outcome] = (outcomes[outcome] || 0) + 1;
        const failureCause = run.report.summary.failureCause;
        if (failureCause) {
            failures[failureCause] = (failures[failureCause] || 0) + 1;
        }

        for (const [contextKey, counts] of Object.entries(run.trace.byContext)) {
            contextTotals[contextKey] = contextTotals[contextKey] || { exact: 0, contextual: 0, memory: 0, fallback: 0 };
            contextTotals[contextKey].exact += counts.exact;
            contextTotals[contextKey].contextual += counts.contextual;
            contextTotals[contextKey].memory += counts.memory;
            contextTotals[contextKey].fallback += counts.fallback;
        }
    }

    return {
        sourceReport: reportPath,
        seedBase,
        sourceRunId: template.sourceRunId,
        sourceSummary: template.sourceSummary,
        runs: runs.length,
        overall: {
            winRate: percentage(outcomes.victory || 0, runs.length),
            averageWeekEnded: round(average(weeks)),
            averageMilesReached: round(average(miles)),
            averageCattleRemaining: round(average(cattle)),
            averageCrewAlive: round(average(crewAlive)),
            averageMorale: round(average(morale)),
            averageFear: round(average(fear)),
        },
        variability: {
            weekEnded: spread(weeks),
            milesReached: spread(miles),
            cattleRemaining: spread(cattle),
            fidelity: spread(fidelity),
        },
        trace: {
            averageExactMatches: round(average(exact)),
            averageContextMatches: round(average(contextual)),
            averageMemoryMatches: round(average(memory)),
            averageFallbacks: round(average(fallback)),
            averageFidelity: round(average(fidelity)),
            contextTotals,
        },
        outcomes,
        failures,
    };
}

function buildSummaryMarkdown(summary) {
    const outcomeLines = Object.entries(summary.outcomes)
        .sort((left, right) => right[1] - left[1])
        .map(([key, value]) => `- ${key}: ${value} (${percentage(value, summary.runs)}%)`)
        .join("\n");
    const failureLines = Object.entries(summary.failures)
        .sort((left, right) => right[1] - left[1])
        .map(([key, value]) => `- ${key}: ${value} (${percentage(value, summary.runs)}%)`)
        .join("\n");
    const contextLines = Object.entries(summary.trace.contextTotals)
        .sort((left, right) => (right[1].exact + right[1].contextual + right[1].memory + right[1].fallback) - (left[1].exact + left[1].contextual + left[1].memory + left[1].fallback))
        .map(([key, counts]) => `- ${key}: exact ${counts.exact}, contextual ${counts.contextual}, memory ${counts.memory}, fallback ${counts.fallback}`)
        .join("\n");

    return [
        "# Deadwood Trace Replay Summary",
        "",
        `- Generated: ${new Date().toISOString()}`,
        `- Source report: ${summary.sourceReport}`,
        `- Source run id: ${summary.sourceRunId}`,
        `- Seed base: ${summary.seedBase}`,
        `- Runs: ${summary.runs}`,
        "",
        "## Source Run",
        "",
        `- Outcome: ${summary.sourceSummary.outcome}`,
        `- Week ended: ${summary.sourceSummary.weekEnded}`,
        `- Miles reached: ${summary.sourceSummary.milesReached}`,
        `- Cattle remaining: ${summary.sourceSummary.cattleRemaining}`,
        `- Crew alive: ${summary.sourceSummary.crewAlive}`,
        `- Morale: ${summary.sourceSummary.morale}`,
        `- Fear: ${summary.sourceSummary.fear}`,
        "",
        "## Replay Results",
        "",
        `- Win rate: ${summary.overall.winRate}%`,
        `- Average week ended: ${summary.overall.averageWeekEnded}`,
        `- Average miles reached: ${summary.overall.averageMilesReached}`,
        `- Average cattle remaining: ${summary.overall.averageCattleRemaining}`,
        `- Average crew alive: ${summary.overall.averageCrewAlive}`,
        `- Average morale: ${summary.overall.averageMorale}`,
        `- Average fear: ${summary.overall.averageFear}`,
        "",
        "## Variability",
        "",
        `- Week ended P10-P90: ${summary.variability.weekEnded.p10} -> ${summary.variability.weekEnded.p90}`,
        `- Miles reached P10-P90: ${summary.variability.milesReached.p10} -> ${summary.variability.milesReached.p90}`,
        `- Cattle remaining P10-P90: ${summary.variability.cattleRemaining.p10} -> ${summary.variability.cattleRemaining.p90}`,
        `- Fidelity average / median: ${summary.variability.fidelity.average}% / ${summary.variability.fidelity.median}%`,
        "",
        "## Trace Fidelity",
        "",
        `- Average exact matches: ${summary.trace.averageExactMatches}`,
        `- Average contextual matches: ${summary.trace.averageContextMatches}`,
        `- Average memory matches: ${summary.trace.averageMemoryMatches}`,
        `- Average fallbacks: ${summary.trace.averageFallbacks}`,
        `- Average fidelity: ${summary.trace.averageFidelity}%`,
        "",
        "## Outcomes",
        "",
        outcomeLines || "- None",
        "",
        "## Failure Causes",
        "",
        failureLines || "- None",
        "",
        "## Context Usage",
        "",
        contextLines || "- None",
        "",
    ].join("\n");
}

async function main() {
    const args = mri(process.argv.slice(2), {
        string: ["report", "seed"],
        boolean: [],
        default: {
            runs: 25,
            maxSteps: 1000,
        },
    });

    if (!args.report) {
        throw new Error("Missing required --report path.");
    }

    const reportPath = path.resolve(repoRoot, args.report);
    const report = await fs.readJson(reportPath);
    const template = buildTraceTemplate(report);
    const seedBase = args.seed || path.basename(reportPath, path.extname(reportPath));
    const runs = [];

    for (let index = 1; index <= Number(args.runs); index += 1) {
        const seedLabel = `${seedBase}:trace:${index}`;
        runs.push(await runTraceReplay({
            template,
            seedLabel,
            maxSteps: Number(args.maxSteps),
        }));
    }

    const summary = summarizeTraceRuns(runs, template, reportPath, seedBase);
    const reportDir = path.join(
        repoRoot,
        "reports",
        "deadwood-traces",
        `${timestampSlug()}_${sanitizeFilePart(seedBase)}_${runs.length}-runs`,
    );

    await fs.ensureDir(reportDir);
    await fs.writeJson(path.join(reportDir, "summary.json"), summary, { spaces: 2 });
    await fs.writeFile(path.join(reportDir, "summary.md"), buildSummaryMarkdown(summary));
    await fs.writeFile(path.join(reportDir, "runs.csv"), toCsv(runs.map(run => ({
        seed: run.seedLabel,
        outcome: run.report.summary.outcome,
        failureCause: run.report.summary.failureCause || "",
        weekEnded: run.report.summary.weekEnded,
        milesReached: run.report.summary.milesReached,
        cattleRemaining: run.report.summary.cattleRemaining,
        crewAlive: run.report.summary.crewAlive,
        morale: run.report.summary.morale,
        fear: run.report.summary.fear,
        exactMatches: run.trace.exact,
        contextualMatches: run.trace.contextual,
        memoryMatches: run.trace.memory,
        fallbacks: run.trace.fallback,
        fidelity: run.trace.fidelity,
    }))));

    console.log(`Trace output written to ${path.relative(repoRoot, reportDir)}`);
    console.log(`trace: runs ${runs.length}, win rate ${summary.overall.winRate}%, avg cattle ${summary.overall.averageCattleRemaining}, avg fidelity ${summary.trace.averageFidelity}%`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

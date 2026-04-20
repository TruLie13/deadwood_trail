declare const Term: {
    clearScreen: () => void;
    prompt: () => void;
    hidePrompt: () => void;
    writelns: (text: string) => Promise<void>;
};

declare const App: {
    deadwood: DeadwoodGameApi | null;
};

type Phase = "outfit" | "day" | "repair" | "trade" | "rations" | "night" | "blight" | "encounter" | "scout" | "ended";
type RationLevel = "poor" | "moderate" | "well";
type DayAction = "travel" | "hunt" | "repair" | "rest" | "trade" | "slaughter" | null;
type NightAction = "campfire" | "guard" | "whiskey" | "rite" | "night" | "trade" | null;
type EncounterType = "ash-drowner" | "salt-chapel" | "hollow-drover" | null;
type TradeTime = "day" | "night";
    type CowCondition = DeadwoodModel.CowCondition;
type CrewRole = DeadwoodModel.CrewRole;
type SpecialistRole = "hunter" | "scout" | "drover" | "hand";
type ScoutRoutePlan = "face" | "detour" | null;
type HuntBulletDebug = {
    shot: number;
    hit: boolean;
    clean: boolean | null;
    food: number;
};
type HuntResult = {
    actorId: number | null;
    actorName: string;
    actorRole: CrewRole | "none";
    fallbackShooter: boolean;
    bulletsSpent: number;
    hits: number;
    cleanFood: number;
    blightedFood: number;
    baseShotChance: number;
    shotChance: number;
    cleanChance: number;
    shotPenalty: number;
    bullets: HuntBulletDebug[];
};

type Landmark = {
    mile: number;
    name: string;
    onReach: (state: GameState) => string[];
};

    type Cow = DeadwoodModel.Cow;

type CrewMember = DeadwoodModel.CrewMember;

type GameState = {
    active: boolean;
    phase: Phase;
    week: number;
    miles: number;
    destinationMiles: number;
    crew: CrewMember[];
    herd: Cow[];
    cattle: number;
    herdHealth: number;
    herdStress: number;
    herdFatigue: number;
    herdBlight: number;
    food: number;
    blightedFood: number;
    supplies: number;
    ammo: number;
    morale: number;
    fear: number;
    wagonCondition: number;
    wagonSanctity: number;
    whiskey: number;
    blessedGrain: number;
    wardingOil: number;
    hasOccultist: boolean;
    occultHuntBonus: boolean;
    nightHuntPenalty: boolean;
    cash: number;
    rationLevel: RationLevel;
    lastDayAction: DayAction;
    lastNightAction: NightAction;
    pendingBlightedFood: number;
    pendingMessages: string[];
    reachedLandmarks: string[];
    canTrade: boolean;
    pendingPurchaseItem: "food" | "ammo" | "supplies" | "whiskey" | "grain" | "oil" | null;
    tradeLocation: "none" | "el-paso" | "damned-post";
    tradeTime: TradeTime;
    rationChangedThisWeek: boolean;
    pendingEncounter: EncounterType;
    pendingScoutEncounter: EncounterType;
    pendingScoutDetourMiles: number;
    activeScoutEncounter: EncounterType;
    activeScoutRoutePlan: ScoutRoutePlan;
    activeScoutDetourMiles: number;
    cattleSkillMilestones: number;
    damnedTradeCount: number;
    recentCattleLossWeeks: number;
    lastHuntResult: HuntResult | null;
};

type StoreItem = "food" | "ammo" | "supplies" | "whiskey" | "grain" | "oil";

    type HerdSummary = DeadwoodModel.HerdSummary;

type StatusSnapshot = Pick<
    GameState,
    "week" | "miles" | "cattle" | "food" | "blightedFood" | "ammo" | "supplies" | "cash" |
    "morale" | "fear" | "wagonCondition" | "wagonSanctity" | "whiskey" | "blessedGrain" | "wardingOil" |
    "herdHealth" | "herdStress" | "herdFatigue" | "herdBlight"
>;

type DeadwoodStartOptions = {
    debugMode?: boolean;
};

type DeadwoodGameApi = {
    start: (options?: DeadwoodStartOptions) => Promise<void>;
    handleInput: (input: string) => Promise<void>;
    isActive: () => boolean;
    stop: (reason?: string) => Promise<void>;
    autocomplete: (input: string) => string | null;
};

type SpecialistPassiveStatus = {
    week: number | null;
    memberId: number | null;
    eligible: boolean;
    chance: number;
    rolled: boolean;
    success: boolean;
    detail: string;
};

type WindowWithDeadwoodGame = Window & {
    DeadwoodGame?: DeadwoodGameApi;
    DeadwoodTrailReports?: {
        currentRun: DeadwoodRunReport | null;
        lastCompletedRun: DeadwoodRunReport | null;
        savePaths: string[];
    };
};

type RunOutcome = "victory" | "failure" | "quit";
type FailureCause = "herd-lost" | "crew-breaks" | "wagon-breaks" | "sanctity-collapses" | "drive-stalls" | null;
type CrewLossType = "death" | "desertion" | "exile";
type ReportPhase = Phase | "system";
type CattleLossCause =
    | "slaughter"
    | "campfire-stampede"
    | "night-panic"
    | "night-collapse"
    | "stampede"
    | "damned-trade"
    | "ash-drowner-encounter"
    | "salt-chapel-encounter"
    | "hollow-drover-encounter"
    | "scout-warning"
    | "event"
    | "unknown";
type CattleRecoveryCause = "drover-passive" | "hollow-drover-follow" | "unknown";
type NonNullDayAction = Exclude<DayAction, null>;
type NonNullNightAction = Exclude<NightAction, null>;
type SaveRunReportResponse = {
    ok: boolean;
    filePath?: string;
    error?: string;
};

type DeadwoodRunCrewSnapshot = {
    id: number;
    name: string;
    role: CrewRole;
    alive: boolean;
    isLeader: boolean;
    fear: number;
    morale: number;
    hunger: number;
    health: number;
    loyalty: number;
    cattleSkill: number;
    huntSkill: number;
    guardDutyCount: number;
    foodReceivedTotal: number;
    whiskeyReceivedTotal: number;
};

type DeadwoodCrewLossRecord = {
    week: number;
    phase: ReportPhase;
    memberId: number;
    name: string;
    role: CrewRole;
    type: CrewLossType;
    detail: string;
    snapshot: DeadwoodRunCrewSnapshot;
};

type DeadwoodCattleLossRecord = {
    week: number;
    phase: ReportPhase;
    count: number;
    cause: CattleLossCause;
    condition: CowCondition;
    mode: DeadwoodModel.RemovalMode | "collapsed";
};

type DeadwoodEventRecord = {
    week: number;
    phase: ReportPhase;
    key: string;
    title: string;
    detail: string;
};

type DeadwoodActionRecord = {
    week: number;
    phase: ReportPhase;
    action: string;
    detail: string;
};

type DeadwoodSnapshot = {
    week: number;
    phase: Phase;
    label: string;
    miles: number;
    cattle: number;
    crewAlive: number;
    food: number;
    blightedFood: number;
    ammo: number;
    supplies: number;
    cash: number;
    morale: number;
    fear: number;
    wagonCondition: number;
    wagonSanctity: number;
    herdHealth: number;
    herdStress: number;
    herdFatigue: number;
    herdBlight: number;
    rationLevel: RationLevel;
};

type DeadwoodSpecialistHistoryRecord = {
    week: number;
    memberId: number | null;
    eligible: boolean;
    chance: number;
    rolled: boolean;
    success: boolean;
    detail: string;
};

type DeadwoodRunReport = {
    schemaVersion: number;
    game: "deadwood-trail";
    runId: string;
    mode: "normal" | "test";
    startedAt: string;
    endedAt: string | null;
    durationMs: number | null;
    summary: {
        outcome: RunOutcome | null;
        failureCause: FailureCause;
        weekEnded: number;
        milesReached: number;
        destinationMiles: number;
        cattleRemaining: number;
        crewAlive: number;
        crewDead: number;
        crewExiled: number;
        crewDeserted: number;
        foodRemaining: number;
        blightedFoodRemaining: number;
        ammoRemaining: number;
        suppliesRemaining: number;
        cashRemaining: number;
        morale: number;
        fear: number;
        wagonCondition: number;
        wagonSanctity: number;
        landmarksReached: string[];
    };
    counters: {
        dayActions: Record<NonNullDayAction, number>;
        nightActions: Record<NonNullNightAction, number>;
        rationChoices: Record<RationLevel, number>;
        blight: {
            found: number;
            taken: number;
            left: number;
            consumed: number;
            contaminated: number;
        };
        hunt: {
            attempts: number;
            fallbackAttempts: number;
            shotsFired: number;
            hits: number;
            cleanFood: number;
            blightedFood: number;
        };
        scout: {
            warnings: number;
            finds: number;
            faced: number;
            detoured: number;
        };
        specialists: Record<SpecialistRole, {
            checks: number;
            eligibleChecks: number;
            successes: number;
            extraValue: number;
        }>;
        crewConsequences: {
            mutiny: number;
            guardExile: number;
            foodExile: number;
            whiskeyDesertion: number;
            paranoiaDeath: number;
            paranoiaExile: number;
            collapseDeath: number;
            collapseDesertion: number;
        };
        cattleLosses: {
            total: number;
            byCause: Record<CattleLossCause, number>;
        };
        cattleRecovered: {
            total: number;
            byCause: Record<CattleRecoveryCause, number>;
            wrongRecovered: number;
        };
        events: Record<string, number>;
        encounterChoices: Record<string, number>;
    };
    peaks: {
        maxFear: number;
        minMorale: number;
        maxCrewHunger: number;
        minCrewHealth: number;
        minWagonCondition: number;
        minWagonSanctity: number;
        minHerdHealth: number;
        maxHerdStress: number;
        maxHerdFatigue: number;
        maxHerdBlight: number;
        minCattle: number;
    };
    crew: {
        start: DeadwoodRunCrewSnapshot[];
        end: DeadwoodRunCrewSnapshot[];
        losses: DeadwoodCrewLossRecord[];
    };
    cattleLossHistory: DeadwoodCattleLossRecord[];
    specialists: Record<SpecialistRole, DeadwoodSpecialistHistoryRecord[]>;
    actions: DeadwoodActionRecord[];
    events: DeadwoodEventRecord[];
    snapshots: DeadwoodSnapshot[];
    persistence: {
        attempted: boolean;
        saved: boolean;
        filePath: string | null;
        error: string | null;
    };
};

(() => {
    const STARTING_CASH = 450;
    const STARTER_FOOD = 80;
    const STARTER_AMMO = 10;
    const STARTER_SUPPLIES = 10;
    const FOOD_PRICE = 1;
    const AMMO_PRICE = 2;
    const SUPPLIES_PRICE = 4;
    const WHISKEY_PRICE = 15;
    const GRAIN_PRICE = 20;
    const OIL_PRICE = 25;
    const FULL_HUNT_AMMO = 8;
    const FOOD_PER_HIT_MIN = 18;
    const FOOD_PER_HIT_MAX = 30;
    const BACKUP_HUNT_SKILL_CAP = 76;
    const TRAPLINE_FOOD_MIN = 4;
    const TRAPLINE_FOOD_MAX = 8;
    const DROVER_RECOVER_MIN = 1;
    const DROVER_RECOVER_MAX = 2;
    const HAND_REPAIR_MIN = 4;
    const HAND_REPAIR_MAX = 7;

    const LANDMARKS: Landmark[] = [
        {
            mile: 120,
            name: "Painted Canyons",
            onReach: state => {
                affectCrew({ fear: 8 });
                return [
                    "LANDMARK: THE PAINTED CANYONS.",
                    "BY DAY THEY LOOK LIKE A POSTCARD. BY NIGHT THE COLORS RUN LIKE WOUNDS.",
                ];
            },
        },
        {
            mile: 310,
            name: "El Paso",
            onReach: state => {
                affectCrew({ fear: -25, morale: 15 });
                state.canTrade = true;
                state.tradeLocation = "el-paso";
                return [
                    "LANDMARK: EL PASO.",
                    "THE SALT BENEATH THE CITY HOLDS THE VEIL BACK.",
                    "THIS IS THE LAST TRUE SAFE ZONE ON THE TRAIL.",
                    "YOU MAY TRADE HERE BEFORE HEADING WEST AGAIN.",
                ];
            },
        },
        {
            mile: 520,
            name: "Staked Plains",
            onReach: state => {
                affectCrew({ fear: 12 });
                return [
                    "LANDMARK: THE STAKED PLAINS.",
                    "THE HORIZON REPEATS ITSELF UNTIL EVEN THE CATTLE WALK NERVOUS CIRCLES.",
                ];
            },
        },
        {
            mile: 680,
            name: "Trading Post of the Damned",
            onReach: state => {
                state.canTrade = true;
                state.tradeLocation = "damned-post";
                affectCrew({ fear: 10 });
                const lines = [
                    "LANDMARK: THE TRADING POST OF THE DAMNED.",
                    "THE MERCHANTS SMILE TOO CALMLY. THEIR GOODS ARE GOOD. THEIR PRICES FEEL SPIRITUAL.",
                    "YOU MAY TRADE HERE IF YOU DARE.",
                ];
                const composition = herdCompositionLine("later-trail");
                if (composition) {
                    lines.push(composition);
                }
                return lines;
            },
        },
        {
            mile: 760,
            name: "Nevada Salt Flats",
            onReach: state => {
                affectCrew({ fear: 18 });
                const lines = [
                    "LANDMARK: THE NEVADA SALT FLATS.",
                    "OUT HERE THE UNSEEN BECOMES MANIFEST. THE HERD KNOWS IT BEFORE YOUR CREW DOES.",
                ];
                const composition = herdCompositionLine("later-trail");
                if (composition) {
                    lines.push(composition);
                }
                return lines;
            },
        },
    ];

    const state: GameState = createInitialState();
    const root = window as WindowWithDeadwoodGame;
    let lastStatusSnapshot: StatusSnapshot | null = null;
    let debugMode = false;
    let debugOverlayEl: HTMLDivElement | null = null;
    const debugCardOpenState: Record<string, boolean> = {};
    let specialistPassiveStatus = createInitialSpecialistPassiveStatus();
    let currentRunReport: DeadwoodRunReport | null = null;
    let runResolution: { outcome: RunOutcome; failureCause: FailureCause } | null = null;
    const capturedSnapshotKeys = new Set<string>();

    function incrementCounter(record: Record<string, number>, key: string, amount = 1) {
        record[key] = (record[key] ?? 0) + amount;
    }

    function livingCrewPeakVitals(crew: CrewMember[] = state.crew): { maxHunger: number; minHealth: number } | null {
        const living = livingCrew(crew);
        if (living.length === 0) {
            return null;
        }

        return {
            maxHunger: Math.max(...living.map(member => member.hunger)),
            minHealth: Math.min(...living.map(member => member.health)),
        };
    }

    function createRunId(): string {
        return `${new Date().toISOString().replace(/[:.]/g, "-")}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function createCrewSnapshot(member: CrewMember): DeadwoodRunCrewSnapshot {
        return {
            id: member.id,
            name: member.name,
            role: member.role,
            alive: member.alive,
            isLeader: member.isLeader,
            fear: member.fear,
            morale: member.morale,
            hunger: member.hunger,
            health: member.health,
            loyalty: member.loyalty,
            cattleSkill: member.cattleSkill,
            huntSkill: member.huntSkill,
            guardDutyCount: member.guardDutyCount,
            foodReceivedTotal: Number(member.foodReceivedTotal.toFixed(2)),
            whiskeyReceivedTotal: member.whiskeyReceivedTotal,
        };
    }

    function createSpecialistCounterMap() {
        return {
            hunter: { checks: 0, eligibleChecks: 0, successes: 0, extraValue: 0 },
            scout: { checks: 0, eligibleChecks: 0, successes: 0, extraValue: 0 },
            drover: { checks: 0, eligibleChecks: 0, successes: 0, extraValue: 0 },
            hand: { checks: 0, eligibleChecks: 0, successes: 0, extraValue: 0 },
        };
    }

    function createEmptyRunReport(): DeadwoodRunReport {
        const livingPeakVitals = livingCrewPeakVitals();
        return {
            schemaVersion: 1,
            game: "deadwood-trail",
            runId: createRunId(),
            mode: debugMode ? "test" : "normal",
            startedAt: new Date().toISOString(),
            endedAt: null,
            durationMs: null,
            summary: {
                outcome: null,
                failureCause: null,
                weekEnded: state.week,
                milesReached: state.miles,
                destinationMiles: state.destinationMiles,
                cattleRemaining: state.cattle,
                crewAlive: livingCrew().length,
                crewDead: 0,
                crewExiled: 0,
                crewDeserted: 0,
                foodRemaining: state.food,
                blightedFoodRemaining: state.blightedFood,
                ammoRemaining: state.ammo,
                suppliesRemaining: state.supplies,
                cashRemaining: state.cash,
                morale: state.morale,
                fear: state.fear,
                wagonCondition: state.wagonCondition,
                wagonSanctity: state.wagonSanctity,
                landmarksReached: [...state.reachedLandmarks],
            },
            counters: {
                dayActions: { travel: 0, hunt: 0, repair: 0, rest: 0, trade: 0, slaughter: 0 },
                nightActions: { campfire: 0, guard: 0, whiskey: 0, rite: 0, night: 0, trade: 0 },
                rationChoices: { poor: 0, moderate: 0, well: 0 },
                blight: { found: 0, taken: 0, left: 0, consumed: 0, contaminated: 0 },
                hunt: { attempts: 0, fallbackAttempts: 0, shotsFired: 0, hits: 0, cleanFood: 0, blightedFood: 0 },
                scout: { warnings: 0, finds: 0, faced: 0, detoured: 0 },
                specialists: createSpecialistCounterMap(),
                crewConsequences: {
                    mutiny: 0,
                    guardExile: 0,
                    foodExile: 0,
                    whiskeyDesertion: 0,
                    paranoiaDeath: 0,
                    paranoiaExile: 0,
                    collapseDeath: 0,
                    collapseDesertion: 0,
                },
                cattleLosses: {
                    total: 0,
                    byCause: {
                        slaughter: 0,
                        "campfire-stampede": 0,
                        "night-panic": 0,
                        "night-collapse": 0,
                        stampede: 0,
                        "damned-trade": 0,
                        "ash-drowner-encounter": 0,
                        "salt-chapel-encounter": 0,
                        "hollow-drover-encounter": 0,
                        "scout-warning": 0,
                        event: 0,
                        unknown: 0,
                    },
                },
                cattleRecovered: {
                    total: 0,
                    byCause: { "drover-passive": 0, "hollow-drover-follow": 0, unknown: 0 },
                    wrongRecovered: 0,
                },
                events: {},
                encounterChoices: {},
            },
            peaks: {
                maxFear: state.fear,
                minMorale: state.morale,
                maxCrewHunger: livingPeakVitals?.maxHunger ?? 0,
                minCrewHealth: livingPeakVitals?.minHealth ?? 0,
                minWagonCondition: state.wagonCondition,
                minWagonSanctity: state.wagonSanctity,
                minHerdHealth: state.herdHealth,
                maxHerdStress: state.herdStress,
                maxHerdFatigue: state.herdFatigue,
                maxHerdBlight: state.herdBlight,
                minCattle: state.cattle,
            },
            crew: {
                start: state.crew.map(createCrewSnapshot),
                end: [],
                losses: [],
            },
            cattleLossHistory: [],
            specialists: { hunter: [], scout: [], drover: [], hand: [] },
            actions: [],
            events: [],
            snapshots: [],
            persistence: {
                attempted: false,
                saved: false,
                filePath: null,
                error: null,
            },
        };
    }

    function publishRunReportState() {
        root.DeadwoodTrailReports = root.DeadwoodTrailReports ?? {
            currentRun: null,
            lastCompletedRun: null,
            savePaths: [],
        };
        root.DeadwoodTrailReports.currentRun = currentRunReport ? JSON.parse(JSON.stringify(currentRunReport)) : null;
    }

    function initializeRunReport() {
        capturedSnapshotKeys.clear();
        runResolution = null;
        currentRunReport = createEmptyRunReport();
        captureRunSnapshot("week-start");
        publishRunReportState();
    }

    function updateRunPeaks() {
        if (!currentRunReport) {
            return;
        }

        const livingPeakVitals = livingCrewPeakVitals();
        currentRunReport.peaks.maxFear = Math.max(currentRunReport.peaks.maxFear, state.fear);
        currentRunReport.peaks.minMorale = Math.min(currentRunReport.peaks.minMorale, state.morale);
        if (livingPeakVitals) {
            currentRunReport.peaks.maxCrewHunger = Math.max(currentRunReport.peaks.maxCrewHunger, livingPeakVitals.maxHunger);
            currentRunReport.peaks.minCrewHealth = Math.min(currentRunReport.peaks.minCrewHealth, livingPeakVitals.minHealth);
        }
        currentRunReport.peaks.minWagonCondition = Math.min(currentRunReport.peaks.minWagonCondition, state.wagonCondition);
        currentRunReport.peaks.minWagonSanctity = Math.min(currentRunReport.peaks.minWagonSanctity, state.wagonSanctity);
        currentRunReport.peaks.minHerdHealth = Math.min(currentRunReport.peaks.minHerdHealth, state.herdHealth);
        currentRunReport.peaks.maxHerdStress = Math.max(currentRunReport.peaks.maxHerdStress, state.herdStress);
        currentRunReport.peaks.maxHerdFatigue = Math.max(currentRunReport.peaks.maxHerdFatigue, state.herdFatigue);
        currentRunReport.peaks.maxHerdBlight = Math.max(currentRunReport.peaks.maxHerdBlight, state.herdBlight);
        currentRunReport.peaks.minCattle = Math.min(currentRunReport.peaks.minCattle, state.cattle);
    }

    function captureRunSnapshot(label: string) {
        if (!currentRunReport) {
            return;
        }

        const snapshotKey = `${state.week}:${label}`;
        if (capturedSnapshotKeys.has(snapshotKey)) {
            return;
        }

        capturedSnapshotKeys.add(snapshotKey);
        currentRunReport.snapshots.push({
            week: state.week,
            phase: state.phase,
            label,
            miles: state.miles,
            cattle: state.cattle,
            crewAlive: livingCrew().length,
            food: state.food,
            blightedFood: state.blightedFood,
            ammo: state.ammo,
            supplies: state.supplies,
            cash: state.cash,
            morale: state.morale,
            fear: state.fear,
            wagonCondition: state.wagonCondition,
            wagonSanctity: state.wagonSanctity,
            herdHealth: state.herdHealth,
            herdStress: state.herdStress,
            herdFatigue: state.herdFatigue,
            herdBlight: state.herdBlight,
            rationLevel: state.rationLevel,
        });
    }

    function recordAction(phase: ReportPhase, action: string, detail = "") {
        if (!currentRunReport) {
            return;
        }

        currentRunReport.actions.push({
            week: state.week,
            phase,
            action,
            detail,
        });
    }

    function recordEvent(key: string, title: string, detail = "", phase: ReportPhase = "system") {
        if (!currentRunReport) {
            return;
        }

        incrementCounter(currentRunReport.counters.events, key);
        currentRunReport.events.push({
            week: state.week,
            phase,
            key,
            title,
            detail,
        });
    }

    function recordEncounterChoice(encounter: EncounterType, choice: string) {
        if (!currentRunReport || !encounter) {
            return;
        }

        incrementCounter(currentRunReport.counters.encounterChoices, `${encounter}:${choice}`);
    }

    function recordCrewLoss(member: CrewMember, type: CrewLossType, detail: string) {
        if (!currentRunReport) {
            return;
        }

        currentRunReport.crew.losses.push({
            week: state.week,
            phase: state.phase,
            memberId: member.id,
            name: member.name,
            role: member.role,
            type,
            detail,
            snapshot: createCrewSnapshot(member),
        });
    }

    function recordCrewConsequence(outcome: NonNullable<DeadwoodModel.CrewConsequence>) {
        if (!currentRunReport) {
            return;
        }

        if (outcome.type === "mutiny") {
            currentRunReport.counters.crewConsequences.mutiny += 1;
        } else if (outcome.type === "guard-exile") {
            currentRunReport.counters.crewConsequences.guardExile += 1;
        } else if (outcome.type === "food-exile") {
            currentRunReport.counters.crewConsequences.foodExile += 1;
        } else if (outcome.type === "whiskey-desertion") {
            currentRunReport.counters.crewConsequences.whiskeyDesertion += 1;
        } else if (outcome.type === "paranoia-purge") {
            if (outcome.fatal) {
                currentRunReport.counters.crewConsequences.paranoiaDeath += 1;
            } else {
                currentRunReport.counters.crewConsequences.paranoiaExile += 1;
            }
        } else if (outcome.fatal) {
            currentRunReport.counters.crewConsequences.collapseDeath += 1;
        } else {
            currentRunReport.counters.crewConsequences.collapseDesertion += 1;
        }
    }

    function recordCattleLoss(count: number, cause: CattleLossCause, condition: CowCondition, mode: DeadwoodModel.RemovalMode | "collapsed") {
        if (!currentRunReport || count <= 0) {
            return;
        }

        currentRunReport.counters.cattleLosses.total += count;
        currentRunReport.counters.cattleLosses.byCause[cause] += count;
        currentRunReport.cattleLossHistory.push({
            week: state.week,
            phase: state.phase,
            count,
            cause,
            condition,
            mode,
        });
    }

    function recordCattleRecovered(count: number, cause: CattleRecoveryCause, wrong: boolean) {
        if (!currentRunReport || count <= 0) {
            return;
        }

        currentRunReport.counters.cattleRecovered.total += count;
        currentRunReport.counters.cattleRecovered.byCause[cause] += count;
        if (wrong) {
            currentRunReport.counters.cattleRecovered.wrongRecovered += count;
        }
    }

    async function persistRunReport() {
        if (!currentRunReport || !debugMode) {
            return;
        }

        currentRunReport.persistence.attempted = true;

        try {
            const response = await fetch("/api/deadwood/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentRunReport),
            });
            const result = await response.json() as SaveRunReportResponse;
            if (!response.ok || !result.ok || !result.filePath) {
                throw new Error(result.error ?? "REPORT SAVE FAILED");
            }

            currentRunReport.persistence.saved = true;
            currentRunReport.persistence.filePath = result.filePath;
            currentRunReport.persistence.error = null;
            root.DeadwoodTrailReports = root.DeadwoodTrailReports ?? {
                currentRun: null,
                lastCompletedRun: null,
                savePaths: [],
            };
            root.DeadwoodTrailReports.savePaths.push(result.filePath);
            root.DeadwoodTrailReports.lastCompletedRun = JSON.parse(JSON.stringify(currentRunReport));
            publishRunReportState();
            await Term.writelns(` TEST REPORT SAVED: ${result.filePath}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "UNKNOWN REPORT SAVE FAILURE";
            currentRunReport.persistence.saved = false;
            currentRunReport.persistence.error = message;
            root.DeadwoodTrailReports = root.DeadwoodTrailReports ?? {
                currentRun: null,
                lastCompletedRun: null,
                savePaths: [],
            };
            root.DeadwoodTrailReports.lastCompletedRun = JSON.parse(JSON.stringify(currentRunReport));
            publishRunReportState();
            await Term.writelns(` TEST REPORT SAVE FAILED: ${message}`);
        }
    }

    function finalizeRunReport(outcome: RunOutcome, failureCause: FailureCause) {
        if (!currentRunReport) {
            return;
        }

        captureRunSnapshot("run-end");
        updateRunPeaks();

        const deadCount = currentRunReport.crew.losses.filter(loss => loss.type === "death").length;
        const exiledCount = currentRunReport.crew.losses.filter(loss => loss.type === "exile").length;
        const desertedCount = currentRunReport.crew.losses.filter(loss => loss.type === "desertion").length;
        const startedAt = new Date(currentRunReport.startedAt).getTime();
        const endedAt = Date.now();

        currentRunReport.endedAt = new Date(endedAt).toISOString();
        currentRunReport.durationMs = Number.isNaN(startedAt) ? null : endedAt - startedAt;
        currentRunReport.summary = {
            outcome,
            failureCause,
            weekEnded: state.week,
            milesReached: Math.min(state.miles, state.destinationMiles),
            destinationMiles: state.destinationMiles,
            cattleRemaining: state.cattle,
            crewAlive: livingCrew().length,
            crewDead: deadCount,
            crewExiled: exiledCount,
            crewDeserted: desertedCount,
            foodRemaining: state.food,
            blightedFoodRemaining: state.blightedFood,
            ammoRemaining: state.ammo,
            suppliesRemaining: state.supplies,
            cashRemaining: state.cash,
            morale: state.morale,
            fear: state.fear,
            wagonCondition: state.wagonCondition,
            wagonSanctity: state.wagonSanctity,
            landmarksReached: [...state.reachedLandmarks],
        };
        currentRunReport.crew.end = state.crew.map(createCrewSnapshot);
        publishRunReportState();
        root.DeadwoodTrailReports = root.DeadwoodTrailReports ?? {
            currentRun: null,
            lastCompletedRun: null,
            savePaths: [],
        };
        root.DeadwoodTrailReports.lastCompletedRun = JSON.parse(JSON.stringify(currentRunReport));
    }

    function createInitialState(): GameState {
        const crew = createInitialCrew();
        const crewSummary = summarizeCrew(crew);
        const herd = createInitialHerd(500);
        const herdSummary = summarizeHerd(herd);
        return {
            active: false,
            phase: "outfit",
            week: 1,
            miles: 0,
            destinationMiles: 900,
            crew,
            herd,
            cattle: herdSummary.cattle,
            herdHealth: herdSummary.herdHealth,
            herdStress: herdSummary.herdStress,
            herdFatigue: herdSummary.herdFatigue,
            herdBlight: herdSummary.herdBlight,
            food: STARTER_FOOD,
            blightedFood: 0,
            supplies: STARTER_SUPPLIES,
            ammo: STARTER_AMMO,
            morale: crewSummary.morale,
            fear: crewSummary.fear,
            wagonCondition: 100,
            wagonSanctity: 100,
            whiskey: 0,
            blessedGrain: 0,
            wardingOil: 0,
            hasOccultist: true,
            occultHuntBonus: false,
            nightHuntPenalty: false,
            cash: STARTING_CASH - (STARTER_FOOD * FOOD_PRICE) - (STARTER_AMMO * AMMO_PRICE) - (STARTER_SUPPLIES * SUPPLIES_PRICE),
            rationLevel: "moderate",
            lastDayAction: null,
            lastNightAction: null,
            pendingBlightedFood: 0,
            pendingMessages: [],
            reachedLandmarks: [],
            canTrade: false,
            pendingPurchaseItem: null,
            tradeLocation: "none",
            tradeTime: "day",
            rationChangedThisWeek: false,
            pendingEncounter: null,
            pendingScoutEncounter: null,
            pendingScoutDetourMiles: 0,
            activeScoutEncounter: null,
            activeScoutRoutePlan: null,
            activeScoutDetourMiles: 0,
            cattleSkillMilestones: 0,
            damnedTradeCount: 0,
            recentCattleLossWeeks: 0,
            lastHuntResult: null,
        };
    }

    function createInitialSpecialistPassiveStatus(): Record<SpecialistRole, SpecialistPassiveStatus> {
        return {
            hunter: { week: null, memberId: null, eligible: false, chance: 0, rolled: false, success: false, detail: "NO CHECK YET" },
            scout: { week: null, memberId: null, eligible: false, chance: 0, rolled: false, success: false, detail: "NO CHECK YET" },
            drover: { week: null, memberId: null, eligible: false, chance: 0, rolled: false, success: false, detail: "NO CHECK YET" },
            hand: { week: null, memberId: null, eligible: false, chance: 0, rolled: false, success: false, detail: "NO CHECK YET" },
        };
    }

    function resetState() {
        Object.assign(state, createInitialState());
        lastStatusSnapshot = null;
        specialistPassiveStatus = createInitialSpecialistPassiveStatus();
        currentRunReport = null;
        runResolution = null;
        capturedSnapshotKeys.clear();
        publishRunReportState();
        syncDebugOverlay();
    }

    function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    function randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clampStat(value: number): number {
        return clamp(value, 0, 100);
    }

    function ensureDebugOverlay(): HTMLDivElement {
        if (debugOverlayEl) {
            return debugOverlayEl;
        }

        debugOverlayEl = document.createElement("div");
        debugOverlayEl.id = "deadwood-debug-overlay";
        debugOverlayEl.setAttribute("aria-hidden", "true");
        document.body.appendChild(debugOverlayEl);
        return debugOverlayEl;
    }

    function escapeHtml(value: string): string {
        return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function signedValue(value: number): string {
        if (value > 0) {
            return `+${value}`;
        }
        return `${value}`;
    }

    function debugBoolean(value: boolean): string {
        return value ? "YES" : "NO";
    }

    function countLivingCowsWhere(predicate: (cow: Cow) => boolean): number {
        return livingCows().filter(predicate).length;
    }

    function describeCrewConsequence(outcome: DeadwoodModel.CrewConsequence): string {
        if (!outcome) {
            return "none";
        }

        const target = state.crew.find(member => member.id === outcome.targetId);
        const targetName = target ? target.name : `CREW #${outcome.targetId}`;

        if (outcome.type === "paranoia-purge") {
            return `${outcome.type} -> ${targetName} (${outcome.cause}${outcome.fatal ? ", fatal" : ""})`;
        }

        if (outcome.type === "collapse") {
            return `${outcome.type} -> ${targetName}${outcome.fatal ? " (fatal)" : ""}`;
        }

        return `${outcome.type} -> ${targetName}`;
    }

    function renderDebugRows(rows: Array<[string, string]>): string {
        return rows.map(([label, value]) =>
            `<div class="deadwood-debug-row"><span class="deadwood-debug-key">${escapeHtml(label)}</span><span class="deadwood-debug-value">${escapeHtml(value)}</span></div>`
        ).join("");
    }

    function renderDebugList(lines: string[]): string {
        if (lines.length === 0) {
            return "";
        }

        return `<ul class="deadwood-debug-list">${lines.map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
    }

    function renderHuntBulletRows(result: HuntResult | null): string {
        if (!result || result.bullets.length === 0) {
            return '<div class="deadwood-debug-empty">NO HUNT RESOLVED YET.</div>';
        }

        return `
            <div class="deadwood-debug-hunt-rows">
                ${result.bullets.map(bullet => {
                    const outcome = !bullet.hit
                        ? "MISS"
                        : bullet.clean
                            ? `HIT / CLEAN / ${bullet.food} FOOD`
                            : `HIT / BLIGHTED / ${bullet.food} FOOD`;
                    return `
                        <div class="deadwood-debug-hunt-row">
                            <span class="deadwood-debug-hunt-shot">SHOT ${bullet.shot}</span>
                            <span class="deadwood-debug-hunt-outcome">${escapeHtml(outcome)}</span>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderCrewMemberInspector(members: CrewMember[]): string {
        return `
            <div class="deadwood-debug-members">
                ${members.map(member => {
                    const effectiveSkill = DeadwoodModel.effectiveCrewCattleSkill(member);
                    const status = member.alive ? "alive" : "gone";
                    const specialistRows = renderSpecialistDebugRows(member);
                    return `
                        <div class="deadwood-debug-member">
                            <div class="deadwood-debug-member-name">${escapeHtml(member.name)} <span class="deadwood-debug-member-role">[${escapeHtml(member.role)}]</span></div>
                            <div class="deadwood-debug-grid">
                                ${renderDebugRows([
                                    ["status", status],
                                    ["health", `${member.health}`],
                                    ["morale", `${member.morale}`],
                                    ["fear", `${member.fear}`],
                                    ["hunger", `${member.hunger}`],
                                    ["loyalty", `${member.loyalty}`],
                                    ["skill", `${member.cattleSkill} base / ${effectiveSkill} effective`],
                                    ["hunt skill", `${member.huntSkill}`],
                                    ["guard duty", `${member.guardDutyCount}`],
                                    ["food received", `${member.foodReceivedTotal.toFixed(1)}`],
                                    ["whiskey received", `${member.whiskeyReceivedTotal}`],
                                    ...specialistRows,
                                ])}
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }

    function specialistChance(member: CrewMember): number {
        if (member.role === "hunter") {
            return DeadwoodModel.hunterTraplineChance(member);
        }

        if (member.role === "scout") {
            return DeadwoodModel.scoutTrailSenseChance(member);
        }

        if (member.role === "drover") {
            return DeadwoodModel.droverHerdCareChance(member);
        }

        if (member.role === "hand") {
            return DeadwoodModel.handMaintenanceChance(member);
        }

        return 0;
    }

    function specialistStatusFor(member: CrewMember): SpecialistPassiveStatus | null {
        if (member.role === "hunter" || member.role === "scout" || member.role === "drover" || member.role === "hand") {
            return specialistPassiveStatus[member.role];
        }

        return null;
    }

    function specialistCurrentLabel(member: CrewMember): string {
        const passiveChance = specialistChance(member);
        if (!member.alive) {
            return "unavailable";
        }

        if (passiveChance <= 0) {
            return "blocked";
        }

        return `${passiveChance}% eligible`;
    }

    function specialistLastCheckLabel(member: CrewMember): string {
        const status = specialistStatusFor(member);
        if (!status || status.week === null) {
            return "none";
        }

        if (status.memberId !== member.id) {
            return `W${status.week} checked another ${member.role}`;
        }

        if (!status.eligible) {
            return `W${status.week} blocked`;
        }

        return `W${status.week} ${status.success ? "hit" : "miss"}`;
    }

    function renderSpecialistDebugRows(member: CrewMember): Array<[string, string]> {
        if (member.role !== "hunter" && member.role !== "scout" && member.role !== "drover" && member.role !== "hand") {
            return [];
        }

        const status = specialistStatusFor(member);
        return [
            ["weekly passive", specialistCurrentLabel(member)],
            ["last passive check", specialistLastCheckLabel(member)],
            ["last passive detail", status && status.memberId === member.id ? status.detail : "none"],
        ];
    }

    function renderDebugCard(key: string, title: string, body: string, open = true): string {
        const isOpen = Object.prototype.hasOwnProperty.call(debugCardOpenState, key)
            ? debugCardOpenState[key]
            : open;
        return `
            <details class="deadwood-debug-card" data-debug-card="${escapeHtml(key)}"${isOpen ? " open" : ""}>
                <summary class="deadwood-debug-card-summary">
                    <span class="deadwood-debug-card-title">${escapeHtml(title)}</span>
                    <span class="deadwood-debug-card-toggle">Toggle</span>
                </summary>
                <div class="deadwood-debug-card-body">${body}</div>
            </details>
        `;
    }

    function syncDebugOverlay() {
        if (!debugMode) {
            if (debugOverlayEl) {
                debugOverlayEl.innerHTML = "";
            }
            document.body.classList.remove("deadwood-debug-active");
            return;
        }

        const overlay = ensureDebugOverlay();
        document.body.classList.add("deadwood-debug-active");

        const crewSummary = DeadwoodModel.summarizeCrew(state.crew);
        const crewSignals = DeadwoodModel.crewWarningSignals(state.crew, state.cattle);
        const crewConsequence = DeadwoodModel.assessCrewConsequence(state.crew, state.morale, state.fear);
        const ambient = westwardAmbientPressure();
        const averages = crewAverages();
        const leader = findLivingLeader();
        const living = livingCrew();
        const injuredCount = countLivingCowsWhere(cow => cow.injured);
        const infectedCount = countLivingCowsWhere(cow => cow.infected);
        const traumatizedCount = countLivingCowsWhere(cow => cow.trauma >= 55);
        const blightedCount = countLivingCowsWhere(cow => cow.condition === "blighted");
        const maimedCount = countLivingCowsWhere(cow => cow.condition === "maimed");
        const sickCount = countLivingCowsWhere(cow => cow.condition === "sick");
        const topRisk = [...livingCows()]
            .sort((left, right) => DeadwoodModel.cowRiskScore(right) - DeadwoodModel.cowRiskScore(left))
            .slice(0, 3)
            .map(cow => `#${cow.id} ${cow.condition.toUpperCase()} RISK ${DeadwoodModel.cowRiskScore(cow)}`);
        const lastHunt = state.lastHuntResult;
        const triggerLines = [
            ...crewWarningMessages(),
            ...herdWarningMessages(),
        ];

        overlay.innerHTML = `
            <div class="deadwood-debug-shell">
                <div class="deadwood-debug-header">
                    <span class="deadwood-debug-title">Trail Inspector</span>
                    <span class="deadwood-debug-badge">TEST</span>
                </div>
                ${renderDebugCard("run", "Run", `
                    <div class="deadwood-debug-grid">
                        ${renderDebugRows([
                            ["state", state.active ? `${state.phase.toUpperCase()} / WEEK ${state.week}` : "ENDED"],
                            ["miles", `${state.miles}/${state.destinationMiles}`],
                            ["trade window", state.canTrade ? `${state.tradeLocation} / ${state.tradeTime}` : "closed"],
                            ["encounter", state.pendingEncounter ?? "none"],
                            ["scout warning", state.pendingScoutEncounter ?? "none"],
                            ["scout route", state.activeScoutRoutePlan ? `${state.activeScoutRoutePlan}${state.activeScoutRoutePlan === "detour" ? ` / -${state.activeScoutDetourMiles} mi` : ""}` : "none"],
                            ["blighted stores", `${state.blightedFood}`],
                            ["pending blight", `${state.pendingBlightedFood}`],
                            ["damned trades", `${state.damnedTradeCount}/3 used`],
                            ["recent cattle loss", `${state.recentCattleLossWeeks} week(s)`],
                            ["rite ready", debugBoolean(state.hasOccultist)],
                            ["hunt bonus", debugBoolean(state.occultHuntBonus)],
                            ["night hunt penalty", debugBoolean(state.nightHuntPenalty)],
                        ])}
                    </div>
                `)}
                ${renderDebugCard("crew-hidden", "Crew Hidden", `
                    <div class="deadwood-debug-grid">
                        ${renderDebugRows([
                            ["leader", leader ? leader.name : "none"],
                            ["living crew", `${living.length}/${state.crew.length}`],
                            ["avg hunger", `${averages.hunger}`],
                            ["avg loyalty", `${averages.loyalty}`],
                            ["base skill", `${crewSummary.baseCattleSkill}`],
                            ["effective skill", `${crewSummary.effectiveCattleSkill}`],
                            ["handling cap", `${crewSummary.handlingCapacity}`],
                            ["breaking hand", crewSignals.breakingMemberName ?? "none"],
                            ["guard resentment", crewSignals.guardImbalanceName ?? "none"],
                            ["portion resentment", crewSignals.portionImbalanceName ?? "none"],
                            ["whiskey imbalance", debugBoolean(crewSignals.whiskeyImbalance)],
                            ["predicted consequence", describeCrewConsequence(crewConsequence)],
                        ])}
                    </div>
                    ${renderCrewMemberInspector(state.crew)}
                `)}
                ${renderDebugCard("herd-hidden", "Herd Hidden", `
                    <div class="deadwood-debug-grid">
                        ${renderDebugRows([
                            ["injured", `${injuredCount}`],
                            ["infected", `${infectedCount}`],
                            ["traumatized", `${traumatizedCount}`],
                            ["maimed", `${maimedCount}`],
                            ["sick", `${sickCount}`],
                            ["blighted", `${blightedCount}`],
                            ["over capacity", `${Math.max(0, state.cattle - crewSummary.handlingCapacity)}`],
                            ["composition", herdCompositionLine("later-trail") ?? "none"],
                        ])}
                    </div>
                    ${renderDebugList(topRisk)}
                `)}
                ${renderDebugCard("hunt", "Hunt", `
                    <div class="deadwood-debug-grid">
                        ${renderDebugRows([
                            ["mode", state.ammo > 0 ? "HUNT READY" : "OUT OF AMMO"],
                            ["lead shooter", huntLeadText()],
                            ["next shot rate", `${huntPreviewShotChance()}%`],
                            ["next clean rate", `${huntCleanChance()}%`],
                            ["fallback penalty", `${huntPreviewPenalty()}`],
                            ["last bullets", lastHunt ? `${lastHunt.bulletsSpent}` : "none"],
                            ["last shooter", lastHunt ? `${lastHunt.actorName} (${lastHunt.actorRole})` : "none"],
                            ["last hits", lastHunt ? `${lastHunt.hits}` : "none"],
                            ["last clean food", lastHunt ? `${lastHunt.cleanFood}` : "none"],
                            ["last blighted food", lastHunt ? `${lastHunt.blightedFood}` : "none"],
                        ])}
                    </div>
                    ${lastHunt ? `
                        <div class="deadwood-debug-hunt-rates">
                            <span>LAST SHOT RATE ${escapeHtml(`${lastHunt.shotChance}%`)}</span>
                            <span>LAST CLEAN RATE ${escapeHtml(`${lastHunt.cleanChance}%`)}</span>
                        </div>
                    ` : ""}
                    ${renderHuntBulletRows(lastHunt)}
                `)}
                ${renderDebugCard("triggers", "Triggers", `
                    <div class="deadwood-debug-grid">
                        ${renderDebugRows([
                            ["ambient zone", ambient.label],
                            ["ambient fear", signedValue(ambient.fear)],
                            ["ambient sanctity", signedValue(ambient.sanctity)],
                            ["ambient herd stress", signedValue(ambient.herdStress)],
                            ["ambient herd blight", signedValue(ambient.herdBlight)],
                            ["ration locked", debugBoolean(state.rationChangedThisWeek)],
                        ])}
                    </div>
                    ${renderDebugList(triggerLines.length > 0 ? triggerLines : ["No current hidden trigger warnings."])}
                `)}
            </div>
        `;

        overlay.querySelectorAll(".deadwood-debug-card").forEach(card => {
            card.addEventListener("toggle", () => {
                const details = card as HTMLDetailsElement;
                const key = details.dataset.debugCard;
                if (key) {
                    debugCardOpenState[key] = details.open;
                }
            });
        });
    }

    function setDebugMode(nextDebugMode: boolean) {
        debugMode = nextDebugMode;
        syncDebugOverlay();
    }

    function createCow(id: number): Cow {
        return {
            id,
            alive: true,
            health: randInt(68, 76),
            stress: randInt(14, 22),
            fatigue: randInt(8, 16),
            blight: 0,
            condition: "healthy",
            injured: false,
            infected: false,
            trauma: 0,
        };
    }

    function createInitialCrew(): CrewMember[] {
        const leader: CrewMember = {
            id: 1,
            name: "EZEKIEL VALE",
            role: "leader",
            alive: true,
            isLeader: true,
            fear: 12,
            morale: 78,
            hunger: 18,
            health: 88,
            cattleSkill: 92,
            huntSkill: 58,
            loyalty: 92,
            guardDutyCount: 0,
            foodReceivedTotal: 0,
            whiskeyReceivedTotal: 0,
        };

        for (let attempt = 0; attempt < 20; attempt += 1) {
            const crew: CrewMember[] = [
                leader,
                { id: 2, name: "MARA QUILL", role: "scout", alive: true, isLeader: false, fear: randInt(16, 22), morale: randInt(60, 70), hunger: randInt(18, 22), health: randInt(75, 82), cattleSkill: randInt(54, 72), huntSkill: randInt(58, 74), loyalty: randInt(68, 76), guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
                { id: 3, name: "JONAH REED", role: "drover", alive: true, isLeader: false, fear: randInt(14, 20), morale: randInt(62, 72), hunger: randInt(17, 21), health: randInt(78, 86), cattleSkill: randInt(60, 78), huntSkill: randInt(46, 60), loyalty: randInt(72, 80), guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
                { id: 4, name: "ELIAS VOSS", role: "hunter", alive: true, isLeader: false, fear: randInt(18, 24), morale: randInt(56, 66), hunger: randInt(19, 23), health: randInt(72, 79), cattleSkill: randInt(48, 68), huntSkill: randInt(82, 94), loyalty: randInt(64, 72), guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
                { id: 5, name: "RUTH CALDWELL", role: "hand", alive: true, isLeader: false, fear: randInt(15, 21), morale: randInt(58, 68), hunger: randInt(18, 22), health: randInt(76, 84), cattleSkill: randInt(46, 66), huntSkill: randInt(34, 50), loyalty: randInt(66, 74), guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
            ];

            if (summarizeCrew(crew).handlingCapacity >= 540) {
                return crew;
            }
        }

        return [
            leader,
            { id: 2, name: "MARA QUILL", role: "scout", alive: true, isLeader: false, fear: 18, morale: 66, hunger: 20, health: 79, cattleSkill: 68, huntSkill: 66, loyalty: 72, guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
            { id: 3, name: "JONAH REED", role: "drover", alive: true, isLeader: false, fear: 16, morale: 68, hunger: 19, health: 82, cattleSkill: 76, huntSkill: 54, loyalty: 76, guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
            { id: 4, name: "ELIAS VOSS", role: "hunter", alive: true, isLeader: false, fear: 20, morale: 61, hunger: 21, health: 75, cattleSkill: 62, huntSkill: 88, loyalty: 68, guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
            { id: 5, name: "RUTH CALDWELL", role: "hand", alive: true, isLeader: false, fear: 17, morale: 64, hunger: 19, health: 80, cattleSkill: 60, huntSkill: 42, loyalty: 70, guardDutyCount: 0, foodReceivedTotal: 0, whiskeyReceivedTotal: 0 },
        ];
    }

    function createInitialHerd(count: number): Cow[] {
        const herd = Array.from({ length: count }, (_, index) => createCow(index));
        updateAllCowConditions(herd);
        return herd;
    }

    function livingCrew(crew: CrewMember[] = state.crew): CrewMember[] {
        return crew.filter(member => member.alive);
    }

    function crewFirstName(member: CrewMember): string {
        return member.name.split(" ")[0];
    }

    function formatNameList(names: string[]): string {
        if (names.length <= 1) {
            return names[0] ?? "";
        }

        if (names.length === 2) {
            return `${names[0]} AND ${names[1]}`;
        }

        return `${names.slice(0, -1).join(", ")}, AND ${names[names.length - 1]}`;
    }

    function findLivingLeader(crew: CrewMember[] = state.crew): CrewMember | undefined {
        return livingCrew(crew).find(member => member.isLeader);
    }

    function crewMemberHandlingContribution(member: CrewMember): number {
        return DeadwoodModel.crewHandlingContribution(member);
    }

    function healthDeathDetail(member: CrewMember): string {
        const firstName = crewFirstName(member);

        if (member.hunger >= 85) {
            return `${firstName} FINALLY STARVES OUT ON THE TRAIL AFTER TOO MANY SHORT RATIONS AND TOO MANY BAD WEEKS.`;
        }

        if (member.fear >= 85 && member.morale <= 20) {
            return `${firstName} DIES SHAKING AND HALF-MAD, WORN OUT BY FEAR BEFORE THE BODY CAN HOLD ON ANY LONGER.`;
        }

        if (member.morale <= 15) {
            return `${firstName} SIMPLY GIVES OUT AFTER TOO MANY HARD WEEKS, TOO LITTLE HOPE, AND NO STRENGTH LEFT TO RISE AGAIN.`;
        }

        return `${firstName} DIES OF WOUNDS, SICKNESS, AND TRAIL WEAR THAT NEVER CLOSED CLEAN.`;
    }

    function updateCrewMember(member: CrewMember) {
        const wasAlive = member.alive;
        member.fear = clampStat(member.fear);
        member.morale = clampStat(member.morale);
        member.hunger = clampStat(member.hunger);
        member.health = clampStat(member.health);
        member.loyalty = clampStat(member.loyalty);
        member.cattleSkill = Math.max(0, member.cattleSkill);
        member.huntSkill = clamp(member.huntSkill, 0, 100);

        if (member.health <= 0) {
            member.alive = false;
            member.health = 0;
            if (wasAlive) {
                recordCrewLoss(member, "death", healthDeathDetail(member));
                state.pendingMessages.push(`CREW LOSS: ${member.name} DIES. ${healthDeathDetail(member)}`);
            }
            return;
        }

        if (member.morale <= 10 && member.fear >= 90) {
            member.alive = false;
            member.health = 0;
            member.morale = 0;
            if (wasAlive) {
                recordCrewLoss(member, "death", `${crewFirstName(member)} CANNOT CARRY THE FEAR ANY FARTHER AND TAKES THEIR OWN LIFE BEFORE DAWN.`);
                state.pendingMessages.push(`CREW LOSS: ${member.name} DIES. ${crewFirstName(member)} CANNOT CARRY THE FEAR ANY FARTHER AND TAKES THEIR OWN LIFE BEFORE DAWN.`);
            }
        }
    }

    function summarizeCrew(crew: CrewMember[] = state.crew): { morale: number; fear: number; handlingCapacity: number } {
        return DeadwoodModel.summarizeCrew(crew);
    }

    function syncCrewSummary() {
        for (const member of state.crew) {
            updateCrewMember(member);
        }
        const summary = summarizeCrew();
        state.morale = summary.morale;
        state.fear = summary.fear;
        syncDebugOverlay();
    }

    function crewHandlingCapacity(): number {
        return summarizeCrew().handlingCapacity;
    }

    function applyCrewTrailExperience() {
        const milestoneSize = 150;
        const milestonesEarned = Math.floor(state.miles / milestoneSize);
        if (milestonesEarned <= state.cattleSkillMilestones) {
            return;
        }

        const gainsToApply = milestonesEarned - state.cattleSkillMilestones;
        for (let i = 0; i < gainsToApply; i += 1) {
            for (const member of livingCrew()) {
                const gain =
                    member.isLeader ? 1 :
                    member.role === "drover" ? 2 :
                    member.role === "hand" ? 2 :
                    member.role === "scout" ? 1 :
                    1;
                member.cattleSkill = Math.min(110, member.cattleSkill + gain);
            }
        }

        state.cattleSkillMilestones = milestonesEarned;
        syncCrewSummary();
        state.pendingMessages.push("THE CREW LEARNS THE HERD A LITTLE BETTER. THE LONG DRIVE IS MAKING DROVERS OUT OF THEM.");
    }

    function removeCrewMember(member: CrewMember, fate: "dies" | "deserts" | "is exiled", detail: string, aftermath?: { morale?: number; fear?: number; loyalty?: number; health?: number }) {
        if (!member.alive) {
            return;
        }

        const resolvedFate =
            member.isLeader && (fate === "deserts" || fate === "is exiled")
                ? "dies"
                : fate;
        const resolvedDetail =
            member.isLeader && fate === "deserts"
                ? `${crewFirstName(member)} REFUSES TO ABANDON THE DRIVE. ${crewFirstName(member)} GOES DOWN WITH THE SHIP BEFORE DAWN.`
                : member.isLeader && fate === "is exiled"
                    ? `THE CREW TURNS MUTINOUS AGAINST THE TRAIL LEADER. IF THEY MEAN TO PUT ${crewFirstName(member)} OFF THE DRIVE, THEY DO NOT LET ${crewFirstName(member)} WALK AWAY FROM IT.`
                    : detail;
        const lossType =
            resolvedFate === "dies" ? "death" :
            resolvedFate === "deserts" ? "desertion" :
            "exile";
        member.alive = false;
        member.health = 0;
        member.morale = 0;
        member.hunger = 100;
        recordCrewLoss(member, lossType, resolvedDetail);
        state.pendingMessages.push(`CREW LOSS: ${member.name} ${resolvedFate.toUpperCase()}. ${resolvedDetail}`);
        if (aftermath) {
            affectCrew(aftermath);
        } else {
            syncCrewSummary();
        }
    }

    function crewAverages() {
        const living = livingCrew();
        if (living.length === 0) {
            return { hunger: 100, loyalty: 0 };
        }

        const totals = living.reduce((sum, member) => {
            sum.hunger += member.hunger;
            sum.loyalty += member.loyalty;
            return sum;
        }, { hunger: 0, loyalty: 0 });

        return {
            hunger: Math.round(totals.hunger / living.length),
            loyalty: Math.round(totals.loyalty / living.length),
        };
    }

    function affectCrew(stats: { morale?: number; fear?: number; hunger?: number; health?: number; loyalty?: number }) {
        for (const member of livingCrew()) {
            member.morale += (stats.morale ?? 0) + randInt(-1, 1);
            member.fear += (stats.fear ?? 0) + randInt(-1, 1);
            member.hunger += (stats.hunger ?? 0) + randInt(-1, 1);
            member.health += (stats.health ?? 0) + randInt(-1, 1);
            member.loyalty += (stats.loyalty ?? 0) + randInt(-1, 1);
        }
        syncCrewSummary();
    }

    function distributeCrewFood(level: RationLevel) {
        const living = livingCrew();
        const baseline =
            level === "poor" ? 1.5 :
            level === "well" ? 4.1 :
            2.8;

        for (const member of living) {
            const spread =
                level === "poor" ? 0.9 :
                level === "well" ? 0.42 :
                0.58;
            const moraleBias = level === "poor" ? ((100 - member.morale) / 120) : ((100 - member.morale) / 210);
            const hungerBias =
                level === "poor" ? ((100 - member.hunger) / 140) :
                level === "well" ? ((100 - member.hunger) / 260) :
                ((100 - member.hunger) / 185);
            const fortuneShift = Math.random() * (spread * 2) - spread;
            const share = Math.max(0.4, baseline + moraleBias + hungerBias + fortuneShift);
            member.foodReceivedTotal += share;
            if (level === "poor") {
                const deprivation = share <= baseline - 0.35 ? 2 : share >= baseline + 0.35 ? -1 : 0;
                member.hunger += randInt(6, 9) + deprivation;
                member.morale -= randInt(2, 5) + Math.max(0, deprivation);
            } else if (level === "well") {
                const comfort = share >= baseline + 0.4 ? 2 : share <= baseline - 0.4 ? -1 : 0;
                member.hunger -= randInt(6, 10) + comfort;
                member.morale += randInt(2, 5) + Math.max(0, comfort);
                member.health += randInt(0, 2);
            } else {
                const lean = share <= baseline - 0.3 ? 2 : share >= baseline + 0.3 ? -1 : 0;
                member.hunger += randInt(0, 2) + lean;
                member.morale += randInt(0, 1) - Math.max(0, lean - 1);
            }
        }
        syncCrewSummary();
    }

    function rationFoodCost(level: RationLevel): number {
        if (level === "poor") {
            return 8;
        }

        if (level === "well") {
            return 20;
        }

        return 14;
    }

    function applyStoredBlightContamination() {
        if (state.blightedFood <= 0 || state.food <= 0) {
            return;
        }

        const spoiled = Math.min(state.food, DeadwoodModel.blightedFoodContaminationAmount(state.blightedFood));
        if (spoiled <= 0) {
            return;
        }

        state.food -= spoiled;
        state.blightedFood += spoiled;
        if (currentRunReport) {
            currentRunReport.counters.blight.contaminated += spoiled;
        }
        state.pendingMessages.push(`BLIGHT: ${spoiled} CLEAN FOOD SPOILS IN THE WAGON AND JOINS THE TAINTED STORES.`);
    }

    function chooseBlightedEaters(blightedUsed: number, requiredFood: number): CrewMember[] {
        const living = [...livingCrew()].sort((left, right) =>
            right.hunger - left.hunger ||
            left.health - right.health ||
            left.morale - right.morale
        );

        if (living.length === 0 || blightedUsed <= 0 || requiredFood <= 0) {
            return [];
        }

        const coverage = blightedUsed / requiredFood;
        const eaterCount = clamp(Math.ceil(living.length * coverage), 1, living.length);
        return living.slice(0, eaterCount);
    }

    function applyBlightedMealConsequences(blightedUsed: number, requiredFood: number) {
        const eaters = chooseBlightedEaters(blightedUsed, requiredFood);
        if (eaters.length === 0) {
            return;
        }

        const coverage = blightedUsed / requiredFood;
        const healthPenalty =
            coverage >= 0.75 ? 6 :
            coverage >= 0.5 ? 5 :
            coverage >= 0.25 ? 4 :
            3;
        const fearPenalty =
            coverage >= 0.75 ? 8 :
            coverage >= 0.5 ? 7 :
            coverage >= 0.25 ? 6 :
            5;
        const moralePenalty =
            coverage >= 0.75 ? 6 :
            coverage >= 0.5 ? 5 :
            4;
        const loyaltyPenalty = coverage >= 0.5 ? 2 : 1;

        for (const member of eaters) {
            member.health -= healthPenalty + randInt(-1, 1);
            member.fear += fearPenalty + randInt(-1, 1);
            member.morale -= moralePenalty + randInt(-1, 1);
            member.loyalty -= loyaltyPenalty + randInt(0, 1);
            updateCrewMember(member);
        }

        syncCrewSummary();
        const names = formatNameList(eaters.map(member => crewFirstName(member)));
        const verb = eaters.length === 1 ? "EATS" : "EAT";
        state.pendingMessages.push(`DESPERATION: ${names} ${verb} THE TAINTED PORTION. BY MORNING THE MEAT SITS WRONG IN THEIR BONES.`);
    }

    function distributeWhiskey() {
        const living = livingCrew();
        if (living.length === 0) {
            return;
        }

        const servings = Math.min(2, living.length);
        const chosen = [...living].sort(() => Math.random() - 0.5).slice(0, servings);
        for (const member of chosen) {
            member.whiskeyReceivedTotal += 1;
            member.morale += randInt(7, 12);
            member.fear -= randInt(4, 8);
        }
        for (const member of living.filter(candidate => !chosen.includes(candidate))) {
            member.morale += randInt(1, 3);
            member.fear -= randInt(0, 2);
        }
        syncCrewSummary();
    }

    function assignGuardDuty(): CrewMember[] {
        const living = livingCrew();
        const sorted = [...living].sort((left, right) => left.guardDutyCount - right.guardDutyCount || right.health - left.health);
        const chosen: CrewMember[] = [];
        while (chosen.length < Math.min(2, sorted.length)) {
            const band = sorted.slice(0, Math.min(3, sorted.length));
            const pick = band[randInt(0, band.length - 1)];
            if (!chosen.includes(pick)) {
                chosen.push(pick);
            }
        }

        for (const member of chosen) {
            member.guardDutyCount += 1;
            member.hunger += randInt(2, 5);
            member.morale -= randInt(2, 4);
            member.health -= randInt(0, 2);
        }
        syncCrewSummary();
        return chosen;
    }

    function resolveCrewConsequences() {
        const outcome = DeadwoodModel.assessCrewConsequence(state.crew, state.morale, state.fear);
        if (!outcome) {
            return;
        }

        recordCrewConsequence(outcome);

        const target = state.crew.find(member => member.id === outcome.targetId && member.alive);
        if (!target) {
            return;
        }

        if (outcome.type === "mutiny") {
            removeCrewMember(
                target,
                "dies",
                "THE CREW TURNS ON THE TRAIL LEADER IN THE DARK. WHEN IT IS OVER, THE DRIVE HAS NO TRUE HAND ON THE REINS.",
                { morale: -10, fear: 16, loyalty: -8 },
            );
            return;
        }

        if (outcome.type === "guard-exile") {
            removeCrewMember(
                target,
                "is exiled",
                `${crewFirstName(target)} DREW TOO LITTLE NIGHT WATCH FOR TOO LONG. THE OTHERS DECIDE FAIRNESS WITH A GUNBELT AND SEND THEM OFF.`,
                { morale: -6, fear: 8, loyalty: -6 },
            );
            return;
        }

        if (outcome.type === "food-exile") {
            removeCrewMember(
                target,
                "is exiled",
                `${crewFirstName(target)} HAS BEEN EATING TOO WELL WHILE THE OTHERS COUNT BONES AND PORTIONS. THE CREW WILL NOT TOLERATE IT ANY LONGER.`,
                { morale: -5, fear: 7, loyalty: -7 },
            );
            return;
        }

        if (outcome.type === "whiskey-desertion") {
            removeCrewMember(
                target,
                "deserts",
                `${crewFirstName(target)} VANISHES BEFORE DAWN WITH THE BOTTLE. WHATEVER THE CREW WAS GOING TO DO ABOUT IT, THE DECISION IS MADE FOR THEM.`,
                { morale: -4, fear: 6, loyalty: -5 },
            );
            return;
        }

        if (outcome.type === "paranoia-purge") {
            const detail =
                outcome.cause === "food"
                    ? `${crewFirstName(target)} HAS BEEN EATING TOO WELL FOR TOO LONG. IN THE DARK, THE OTHERS DECIDE THAT FAVOR LIKE THAT MUST HAVE COME FROM SOMETHING WEARING THEIR FACE.`
                    : outcome.cause === "whiskey"
                        ? `${crewFirstName(target)} HAS KEPT LANDING NEAR THE BOTTLE. WITH FEAR THIS HIGH, THE CREW DECIDES THAT LUCK LIKE THAT LOOKS TOO MUCH LIKE A MONSTER'S PROTECTION.`
                        : `${crewFirstName(target)} HAS BEEN AVOIDING TOO MUCH OF THE NIGHT WATCH. THE REST DECIDE NO HUMAN HAND COULD KEEP COMING UP THAT CLEAN.`;

            removeCrewMember(
                target,
                outcome.fatal ? "dies" : "is exiled",
                detail,
                { morale: -7, fear: 10, loyalty: -8 },
            );
            return;
        }

        removeCrewMember(
            target,
            outcome.fatal ? "dies" : "deserts",
            outcome.fatal
                ? `${crewFirstName(target)} FINALLY COLLAPSES AFTER TOO MANY BAD WEEKS ON THE TRAIL.`
                : `${crewFirstName(target)} BREAKS AND SLIPS AWAY FROM CAMP BEFORE FIRST LIGHT.`,
            { morale: -6, fear: 8, loyalty: -4 },
        );
    }

    function crewWarningMessages(): string[] {
        const living = livingCrew();
        const warnings: string[] = [];
        if (living.length === 0) {
            return warnings;
        }

        const signals = DeadwoodModel.crewWarningSignals(state.crew, state.cattle);
        const summary = summarizeCrew();
        const mostWorked = [...living].sort((left, right) => right.guardDutyCount - left.guardDutyCount)[0];
        const leastWorked = [...living].sort((left, right) => left.guardDutyCount - right.guardDutyCount)[0];
        const guardGap = mostWorked.guardDutyCount - leastWorked.guardDutyCount;
        const mostFed = [...living].sort((left, right) => right.foodReceivedTotal - left.foodReceivedTotal)[0];
        const leastFed = [...living].sort((left, right) => left.foodReceivedTotal - right.foodReceivedTotal)[0];
        const foodGap = mostFed.foodReceivedTotal - leastFed.foodReceivedTotal;
        const hungriest = [...living].sort((left, right) => right.hunger - left.hunger)[0];
        const mostAfraid = [...living].sort((left, right) => right.fear - left.fear)[0];
        const mostSpent = [...living].sort((left, right) => left.health - right.health)[0];

        if (signals.breakingMemberName) {
            warnings.push(`${signals.breakingMemberName} IS ON THE VERGE OF SNAPPING.`);
        }
        if (hungriest.hunger >= 72) {
            warnings.push("THE CREW IS GETTING TOO HUNGRY TO WORK THE LINE CLEANLY.");
        }
        if (mostAfraid.fear >= 72) {
            warnings.push("TOO MANY OF YOUR HANDS ARE SHAKING. FEAR IS STARTING TO RUIN GOOD WORK.");
        }
        if (mostSpent.health <= 35) {
            warnings.push("SOME OF YOUR HANDS ARE TOO WORN DOWN TO HOLD THE HERD WELL.");
        }
        if (guardGap >= 3) {
            warnings.push("THE NIGHT WATCH IS FALLING TOO OFTEN ON THE SAME HANDS.");
        }
        if (signals.guardImbalanceName) {
            warnings.push(`${signals.guardImbalanceName} HAS BEEN DRAWING TOO LITTLE OF THE NIGHT WATCH, AND THE OTHERS KNOW IT.`);
        }
        if (foodGap >= 7 && state.morale <= 46 && state.fear >= 34) {
            warnings.push("SOMEONE HAS STARTED COUNTING PORTIONS.");
        }
        if (signals.portionImbalanceName) {
            warnings.push(`${signals.portionImbalanceName} HAS BEEN EATING NOTICEABLY BETTER THAN THE REST.`);
        }
        if (signals.whiskeyImbalance) {
            warnings.push("THE BOTTLE IS NOT CHANGING HANDS FAIRLY ENOUGH TO GO UNNOTICED.");
        }
        if (signals.noLeader) {
            warnings.push("THE TRAIL LEADER IS GONE. THE CREW IS HOLDING TOGETHER BY HABIT AND FEAR.");
        }
        if (state.cattle > summary.handlingCapacity + 25 && !signals.overCapacity) {
            warnings.push("THE HERD IS STARTING TO PRESS THE CREW, EVEN IF THEY CAN STILL HOLD IT.");
        }
        if (signals.overCapacity) {
            warnings.push("THE HERD IS TOO BIG FOR THE SHAPE THIS CREW IS IN.");
        }
        if (signals.severeOverCapacity) {
            warnings.push("THIS DRIVE IS OVER THE CREW'S HANDLING CAPACITY. THE HERD IS STARTING TO OWN YOU.");
        }

        return warnings;
    }

    function herdWarningMessages(): string[] {
        const warnings: string[] = [];
        if (state.herdFatigue >= 55) {
            warnings.push("THE HERD IS GETTING TOO TIRED. EVEN GOOD GROUND WILL NOT SAVE MILES IF YOU KEEP PUSHING.");
        }
        if (state.herdStress >= 55) {
            warnings.push("THE HERD IS TOO ALERT AND TOUCHY. ANOTHER HARD SCARE COULD TURN STRAIN INTO A RUN.");
        }
        if (state.herdHealth <= 45) {
            warnings.push("TOO MANY CATTLE ARE LIMPING, THINNING, OR FAILING TO RECOVER CLEANLY.");
        }
        if (state.herdBlight >= 25) {
            warnings.push("SOMETHING WRONG IS STARTING TO TAKE HOLD IN PART OF THE HERD.");
        }
        if (state.herdFatigue >= 70) {
            warnings.push("THE HERD IS EXHAUSTED. IF YOU DO NOT GIVE IT RECOVERY, LOSSES WILL START COMPOUNDING.");
        }
        return warnings;
    }

    function livingCows(herd: Cow[] = state.herd): Cow[] {
        return herd.filter(cow => cow.alive);
    }

    function updateCowCondition(cow: Cow) {
        DeadwoodModel.updateCowCondition(cow);
    }

    function updateAllCowConditions(herd: Cow[] = state.herd) {
        for (const cow of herd) {
            updateCowCondition(cow);
        }
    }

    function summarizeHerd(herd: Cow[] = state.herd): HerdSummary {
        return DeadwoodModel.summarizeHerd(herd);
    }

    function syncHerdSummary() {
        updateAllCowConditions();
        const summary = summarizeHerd();
        state.cattle = summary.cattle;
        state.herdHealth = summary.herdHealth;
        state.herdStress = summary.herdStress;
        state.herdFatigue = summary.herdFatigue;
        state.herdBlight = summary.herdBlight;
        syncDebugOverlay();
    }

    function applyToLivingCows(effect: (cow: Cow) => void) {
        for (const cow of livingCows()) {
            effect(cow);
        }
        syncHerdSummary();
    }

    function removeCattle(count: number, condition: CowCondition = "dead", mode: "weakest" | "injured" | "infected" | "mixed" = "weakest", cause: CattleLossCause = "unknown") {
        const active = livingCows();
        if (active.length === 0 || count <= 0) {
            return 0;
        }

        const removed = DeadwoodModel.chooseRemovalCandidates(active, count, mode);
        for (const cow of removed) {
            cow.alive = false;
            cow.condition = condition;
            cow.health = 0;
        }

        if (removed.length > 0) {
            state.recentCattleLossWeeks = Math.max(state.recentCattleLossWeeks, 2);
            recordCattleLoss(removed.length, cause, condition, mode);
        }

        syncHerdSummary();
        return removed.length;
    }

    function addRecoveredCattle(count: number, wrong: boolean, cause: CattleRecoveryCause = "unknown") {
        if (count <= 0) {
            return 0;
        }

        let nextId = state.herd.reduce((maxId, cow) => Math.max(maxId, cow.id), -1) + 1;
        for (let i = 0; i < count; i += 1) {
            const cow = createCow(nextId);
            nextId += 1;
            cow.health = wrong ? randInt(52, 64) : randInt(60, 72);
            cow.stress = wrong ? randInt(44, 62) : randInt(26, 40);
            cow.fatigue = wrong ? randInt(34, 50) : randInt(20, 34);
            cow.blight = wrong ? randInt(18, 30) : randInt(0, 6);
            cow.injured = cow.health < 58;
            cow.infected = wrong && chance(55);
            cow.trauma = wrong ? randInt(16, 34) : randInt(4, 14);
            updateCowCondition(cow);
            state.herd.push(cow);
        }

        syncHerdSummary();
        recordCattleRecovered(count, cause, wrong);
        return count;
    }

    function relieveInfectedCattle(count: number, strength = 8): number {
        const targets = chooseCowSubset(count, "blighted");
        let relieved = 0;
        applyToCowSubset(targets, cow => {
            if (cow.infected || cow.blight >= 15) {
                relieved += 1;
            }
            cow.blight -= randInt(strength - 3, strength + 1);
            cow.health += randInt(2, 5);
            cow.stress -= randInt(2, 5);
            if (cow.blight < 15) {
                cow.infected = false;
            }
        });
        return relieved;
    }

    function calmTraumatizedCattle(count: number, strength = 10): number {
        const targets = chooseCowSubset(count, "stressed");
        let calmed = 0;
        applyToCowSubset(targets, cow => {
            if (cow.trauma >= 35 || cow.stress >= 55) {
                calmed += 1;
            }
            cow.stress -= randInt(strength - 3, strength + 2);
            cow.trauma = clampStat(cow.trauma - randInt(Math.max(4, strength - 4), strength + 1));
        });
        return calmed;
    }

    function cowRiskScore(cow: Cow): number {
        return (100 - cow.health) + cow.stress + cow.fatigue + cow.blight;
    }

    function chooseCowSubset(count: number, mode: "weakest" | "stressed" | "fatigued" | "blighted" | "injured" | "infected" | "mixed"): Cow[] {
        const active = livingCows();
        if (active.length === 0 || count <= 0) {
            return [];
        }

        const scored = [...active].sort((left, right) => {
            const leftScore =
                mode === "weakest" ? cowRiskScore(left) :
                mode === "stressed" ? left.stress + Math.floor(left.fatigue / 2) + (100 - left.health) / 4 :
                mode === "fatigued" ? left.fatigue + Math.floor(left.stress / 2) + (100 - left.health) / 3 :
                mode === "blighted" ? left.blight + (100 - left.health) / 2 + left.stress / 3 :
                mode === "injured" ? (left.injured ? 120 : 0) + (100 - left.health) + left.fatigue :
                mode === "infected" ? (left.infected ? 120 : 0) + left.blight + left.stress / 2 :
                cowRiskScore(left) + left.stress;
            const rightScore =
                mode === "weakest" ? cowRiskScore(right) :
                mode === "stressed" ? right.stress + Math.floor(right.fatigue / 2) + (100 - right.health) / 4 :
                mode === "fatigued" ? right.fatigue + Math.floor(right.stress / 2) + (100 - right.health) / 3 :
                mode === "blighted" ? right.blight + (100 - right.health) / 2 + right.stress / 3 :
                mode === "injured" ? (right.injured ? 120 : 0) + (100 - right.health) + right.fatigue :
                mode === "infected" ? (right.infected ? 120 : 0) + right.blight + right.stress / 2 :
                cowRiskScore(right) + right.stress;
            return rightScore - leftScore;
        });

        return scored.slice(0, Math.min(count, scored.length));
    }

    function applyToCowSubset(cows: Cow[], effect: (cow: Cow) => void) {
        for (const cow of cows) {
            if (cow.alive) {
                effect(cow);
            }
        }
        syncHerdSummary();
    }

    function percentOfHerd(percent: number): number {
        return Math.max(1, Math.round(state.cattle * (percent / 100)));
    }

    function markDeadIfCollapsed(cows: Cow[]): number {
        let deaths = 0;
        for (const cow of cows) {
            if (cow.alive && cow.health <= 0) {
                cow.alive = false;
                cow.condition = "dead";
                cow.health = 0;
                deaths += 1;
            }
        }
        syncHerdSummary();
        return deaths;
    }

    function resolveCowTags() {
        for (const cow of livingCows()) {
            if (cow.stress >= 70) {
                cow.trauma = clampStat(cow.trauma + 6);
            } else if (cow.stress <= 35) {
                cow.trauma = clampStat(cow.trauma - 4);
            } else {
                cow.trauma = clampStat(cow.trauma - 1);
            }

            cow.injured = cow.injured && cow.health < 65;
            cow.infected = cow.infected && cow.blight >= 20;

            if (cow.health >= 70 && cow.fatigue <= 45) {
                cow.injured = false;
            }

            if (cow.blight < 15) {
                cow.infected = false;
            }
        }
        syncHerdSummary();
    }

    function describeCowSubset(cows: Cow[]): string {
        const alive = cows.filter(cow => cow.alive);
        if (alive.length === 0) {
            return "the herd";
        }

        let maimed = 0;
        let sick = 0;
        let blighted = 0;
        let exhausted = 0;
        let panicked = 0;
        let infected = 0;
        let traumatized = 0;

        for (const cow of alive) {
            if (cow.condition === "maimed") maimed += 1;
            if (cow.condition === "sick") sick += 1;
            if (cow.condition === "blighted") blighted += 1;
            if (cow.fatigue >= 65) exhausted += 1;
            if (cow.stress >= 65) panicked += 1;
            if (cow.infected) infected += 1;
            if (cow.trauma >= 55) traumatized += 1;
        }

        const tags = [
            { label: "infected cattle", count: infected },
            { label: "blighted cattle", count: blighted },
            { label: "maimed cattle", count: maimed },
            { label: "sick cattle", count: sick },
            { label: "exhausted cattle", count: exhausted },
            { label: "panicked cattle", count: panicked },
            { label: "traumatized cattle", count: traumatized },
        ].sort((left, right) => right.count - left.count);

        if (tags[0].count === 0) {
            return "the weakest edge of the herd";
        }

        if (tags[0].count >= Math.max(2, Math.ceil(alive.length / 3))) {
            return `the ${tags[0].label}`;
        }

        return "the weakest edge of the herd";
    }

    function herdCompositionLine(context: "later-trail" | "arrival"): string | null {
        return DeadwoodModel.herdCompositionLine(livingCows(), context);
    }

    function damnedTradeCost(item: DeadwoodModel.DamnedTradeItem): number {
        return DeadwoodModel.damnedTradeCost(state.tradeTime, item, state.damnedTradeCount);
    }

    function damnedTradesRemaining(): number {
        return Math.max(0, 3 - state.damnedTradeCount);
    }

    function westwardAmbientPressure() {
        return DeadwoodModel.westwardAmbientPressure(state.miles);
    }

    function distributedStatDelta(cow: Cow, stat: "health" | "stress" | "fatigue" | "blight", base: number): number {
        if (base === 0) {
            return 0;
        }

        let delta = base + randInt(-1, 1);

        if (stat === "health") {
            if (delta < 0) {
                if (cow.health < 45) delta -= 1;
                else if (cow.health < 60) delta -= 1;
                if (cow.condition === "sick" || cow.condition === "blighted" || cow.injured || cow.infected) delta -= 1;
            } else {
                if (cow.health < 40) delta += 1;
                if (cow.condition === "blighted" || cow.infected) delta -= 1;
            }
        }

        if (stat === "stress") {
            if (delta > 0) {
                if (cow.stress > 55) delta += 1;
                if (cow.condition === "maimed" || cow.condition === "sick") delta += 1;
                if (cow.trauma >= 50) delta += 1;
            } else {
                if (cow.stress > 55) delta -= 1;
                if (cow.fatigue < 40) delta -= 1;
            }
        }

        if (stat === "fatigue") {
            if (delta > 0) {
                if (cow.fatigue > 55) delta += 1;
                if (cow.health < 45) delta += 1;
            } else {
                if (cow.fatigue > 55) delta -= 1;
                if (cow.condition === "maimed" || cow.condition === "sick" || cow.injured) delta -= 1;
            }
        }

        if (stat === "blight") {
            if (delta > 0) {
                if (cow.blight > 25) delta += 1;
                if (state.miles >= 520) delta += 1;
                if (cow.infected) delta += 1;
            } else if (cow.blight > 35) {
                delta -= 1;
            }
        }

        return delta;
    }

    function chance(percent: number): boolean {
        return Math.random() * 100 < percent;
    }

    function locationName(): string {
        if (state.miles >= state.destinationMiles) {
            return "THE SILVER FOLD";
        }

        let current = "SAN ANTONIO";
        for (const landmark of LANDMARKS) {
            if (state.miles >= landmark.mile) {
                current = landmark.name.toUpperCase();
            }
        }

        return current;
    }

    function fearLabel(): string {
        if (state.fear < 20) return "STEADY";
        if (state.fear < 40) return "UNEASY";
        if (state.fear < 60) return "RATTLED";
        if (state.fear < 80) return "TERRIFIED";
        return "BREAKING";
    }

    function rationLabel(): string {
        if (state.rationLevel === "poor") return "POOR";
        if (state.rationLevel === "well") return "WELL";
        return "MODERATE";
    }

    function herdStressLabel(): string {
        if (state.herdStress < 20) return "CALM";
        if (state.herdStress < 40) return "WATCHFUL";
        if (state.herdStress < 60) return "SKITTISH";
        if (state.herdStress < 80) return "PANICKED";
        return "BREAKING";
    }

    function herdConditionLabel(): string {
        if (state.herdHealth >= 75 && state.herdFatigue < 35) return "STRONG";
        if (state.herdHealth >= 55 && state.herdFatigue < 55) return "SERVICEABLE";
        if (state.herdHealth >= 35) return "WEAKENING";
        return "FAILING";
    }

    function snapshotStatus(): StatusSnapshot {
        return {
            week: state.week,
            miles: state.miles,
            cattle: state.cattle,
            food: state.food,
            blightedFood: state.blightedFood,
            ammo: state.ammo,
            supplies: state.supplies,
            cash: state.cash,
            morale: state.morale,
            fear: state.fear,
            wagonCondition: state.wagonCondition,
            wagonSanctity: state.wagonSanctity,
            whiskey: state.whiskey,
            blessedGrain: state.blessedGrain,
            wardingOil: state.wardingOil,
            herdHealth: state.herdHealth,
            herdStress: state.herdStress,
            herdFatigue: state.herdFatigue,
            herdBlight: state.herdBlight,
        };
    }

    function deltaText(current: number, previous: number | undefined): string {
        if (previous === undefined) {
            return "";
        }

        const delta = current - previous;
        if (delta === 0) {
            return "";
        }

        return delta > 0 ? ` (+${delta})` : ` (${delta})`;
    }

    function statusLines(): string[] {
        const previous = lastStatusSnapshot;
        if (state.phase === "outfit") {
            return [
                `FOOD ${state.food}${deltaText(state.food, previous?.food)}`,
                `AMMO ${state.ammo}${deltaText(state.ammo, previous?.ammo)}`,
                `SUPPLIES ${state.supplies}${deltaText(state.supplies, previous?.supplies)}`,
                `WHISKEY ${state.whiskey}${deltaText(state.whiskey, previous?.whiskey)}`,
                `BLESSED GRAIN ${state.blessedGrain}${deltaText(state.blessedGrain, previous?.blessedGrain)}`,
                `WARDING OIL ${state.wardingOil}${deltaText(state.wardingOil, previous?.wardingOil)}`,
                `CASH ${state.cash}${deltaText(state.cash, previous?.cash)}`,
            ];
        }

        return [
            `WEEK ${state.week}${deltaText(state.week, previous?.week)}   MILES ${state.miles}/${state.destinationMiles}${deltaText(state.miles, previous?.miles)}   LOCATION ${locationName()}`,
            "",
            `FOOD ${state.food}${deltaText(state.food, previous?.food)}`,
            `BLIGHTED FOOD ${state.blightedFood}${deltaText(state.blightedFood, previous?.blightedFood)}`,
            `AMMO ${state.ammo}${deltaText(state.ammo, previous?.ammo)}`,
            `SUPPLIES ${state.supplies}${deltaText(state.supplies, previous?.supplies)}`,
            `WHISKEY ${state.whiskey}${deltaText(state.whiskey, previous?.whiskey)}`,
            `BLESSED GRAIN ${state.blessedGrain}${deltaText(state.blessedGrain, previous?.blessedGrain)}`,
            `WARDING OIL ${state.wardingOil}${deltaText(state.wardingOil, previous?.wardingOil)}`,
            `CASH ${state.cash}${deltaText(state.cash, previous?.cash)}`,
            "",
            `CREW: MORALE ${state.morale}${deltaText(state.morale, previous?.morale)}   FEAR ${state.fear}${deltaText(state.fear, previous?.fear)} (${fearLabel()})`,
            `WAGON: STRUCTURE ${state.wagonCondition}${deltaText(state.wagonCondition, previous?.wagonCondition)}   SANCTITY ${state.wagonSanctity}${deltaText(state.wagonSanctity, previous?.wagonSanctity)}`,
            "",
            `CATTLE ${state.cattle}${deltaText(state.cattle, previous?.cattle)}`,
            `HERD: HEALTH ${state.herdHealth}${deltaText(state.herdHealth, previous?.herdHealth)}   STRESS ${state.herdStress}${deltaText(state.herdStress, previous?.herdStress)} (${herdStressLabel()})   FATIGUE ${state.herdFatigue}${deltaText(state.herdFatigue, previous?.herdFatigue)}`,
            `BLIGHT ${state.herdBlight}${deltaText(state.herdBlight, previous?.herdBlight)}   CONDITION (${herdConditionLabel()})`,
        ];
    }

    function boxLabel(label: string): string {
        return `[${label}]`;
    }

    async function printSection(label: string, lines: string[]) {
        await Term.writelns("");
        await Term.writelns(boxLabel(label));
        for (const line of lines) {
            await Term.writelns(line);
        }
    }

    async function printBlock(lines: string[]) {
        for (const line of lines) {
            await Term.writelns(line);
        }
    }

    async function printStatus() {
        await printSection("STATUS", statusLines());
        await printStatusWarnings();
        lastStatusSnapshot = snapshotStatus();
        syncDebugOverlay();
    }

    async function printStatusWarnings() {
        if (state.phase === "outfit") {
            return;
        }

        if (state.wagonCondition <= 20) {
            await Term.writelns(`${boxLabel("WARNING")} WAGON CONDITION IS CRITICAL. ANOTHER HARD HIT COULD BREAK THE FRAME.`);
        } else if (state.wagonCondition <= 40) {
            await Term.writelns(`${boxLabel("WARNING")} WAGON CONDITION IS LOW. PHYSICAL REPAIRS ARE STRONGLY ADVISED.`);
        }

        if (state.wagonSanctity <= 15) {
            await Term.writelns(`${boxLabel("WARNING")} WAGON SANCTITY IS CRITICAL. THE VEIL IS ALMOST THROUGH.`);
        } else if (state.wagonSanctity <= 30) {
            await Term.writelns(`${boxLabel("WARNING")} WAGON SANCTITY IS LOW. THE CREW FEELS EXPOSED TO THE DARK.`);
        }

        if (state.fear >= 70) {
            await Term.writelns(`${boxLabel("WARNING")} FEAR IS HIGH ENOUGH TO TRIGGER A SERIOUS STAMPEDE.`);
        }

        if (state.herdStress >= 70) {
            await Term.writelns(`${boxLabel("WARNING")} HERD STRESS IS CRITICAL. A BAD CALL COULD COST CATTLE FAST.`);
        }

        if (state.herdHealth <= 30) {
            await Term.writelns(`${boxLabel("WARNING")} HERD HEALTH IS FAILING. LOSSES WILL START COMPOUNDING.`);
        }

        if (state.canTrade) {
            if (state.tradeLocation === "damned-post" && damnedTradesRemaining() <= 0) {
                await Term.writelns(`${boxLabel("NOTICE")} THE DAMNED POST HAS NO CLEAN DEALS LEFT FOR THIS DRIVE.`);
            } else {
                await Term.writelns(`${boxLabel("NOTICE")} A TRADING OPPORTUNITY IS AVAILABLE HERE. TYPE TRADE DURING TRAIL ORDERS.`);
            }
        }

        for (const warning of herdWarningMessages()) {
            await Term.writelns(`${boxLabel("NOTICE")} ${warning}`);
        }

        for (const warning of crewWarningMessages()) {
            await Term.writelns(`${boxLabel("NOTICE")} ${warning}`);
        }
    }

    async function printOutfitPrompt() {
        await printSection("OUTFITTING", [
            "BUY FOOD <N>  BUY AMMO <N>  BUY SUPPLIES <N>",
            "BUY WHISKEY <N>  BUY BLESSED GRAIN <N>  BUY WARDING OIL <N>  START",
            "",
            `FOOD $${FOOD_PRICE}  AMMO $${AMMO_PRICE}  SUPPLIES $${SUPPLIES_PRICE}`,
            `WHISKEY $${WHISKEY_PRICE}  BLESSED GRAIN $${GRAIN_PRICE}  WARDING OIL $${OIL_PRICE}`,
            `CASH ON HAND: $${state.cash}`,
        ]);
        Term.prompt();
    }

    function storeItemLabel(item: StoreItem): string {
        if (item === "grain") {
            return "BLESSED GRAIN";
        }

        if (item === "oil") {
            return "WARDING OIL";
        }

        return item.toUpperCase();
    }

    function normalizeStoreItem(raw: string): StoreItem | null {
        const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ");

        switch (normalized) {
            case "food":
                return "food";
            case "ammo":
                return "ammo";
            case "supplies":
                return "supplies";
            case "whiskey":
                return "whiskey";
            case "grain":
            case "bless grain":
            case "blessed grain":
                return "grain";
            case "oil":
            case "warding oil":
                return "oil";
            default:
                return null;
        }
    }

    async function printPurchasePrompt(item: NonNullable<GameState["pendingPurchaseItem"]>) {
        await printSection("OUTFITTING", [`HOW MANY ${storeItemLabel(item)} DO YOU WANT TO BUY?`]);
        Term.prompt();
    }

    function availableDayCommands(): string[] {
        const commands = ["travel"];
        if (state.ammo > 0) {
            commands.push("hunt");
        }
        commands.push("repair", "rest", "rations");
        if (state.canTrade) {
            commands.push("trade");
        }
        commands.push("slaughter", "status", "help", "quit");
        return commands;
    }

    async function printDayPrompt() {
        const orders = availableDayCommands().map(command => command.toUpperCase());
        await printSection("ORDERS", [`TRAIL: ${orders.join(", ")}`]);
        await Term.writelns(`CURRENT RATIONS: ${rationLabel()}. ${state.rationChangedThisWeek ? "YOU HAVE ALREADY CHANGED THEM THIS WEEK." : 'TYPE "RATIONS" TO CHANGE THEM ONCE THIS WEEK.'}`);
        if (state.activeScoutEncounter && state.activeScoutRoutePlan === "face") {
            await Term.writelns(`SCOUT ROUTE: FACE ${scoutEncounterName(state.activeScoutEncounter)} ON YOUR NEXT TRAVEL.`);
        } else if (state.activeScoutEncounter && state.activeScoutRoutePlan === "detour") {
            await Term.writelns(`SCOUT ROUTE: DETOUR AROUND ${scoutEncounterName(state.activeScoutEncounter)}. NEXT TRAVEL LOSES ${state.activeScoutDetourMiles} MILES.`);
        }
        if (state.supplies < 4) {
            await Term.writelns("REPAIR OPTIONS REQUIRE SUPPLIES. YOU ARE SHORT ON MATERIALS.");
        } else {
            await Term.writelns("REPAIR LETS YOU RESTORE THE WAGON'S FRAME OR ITS SANCTITY.");
        }
        Term.prompt();
    }

    async function printScoutPrompt() {
        if (!state.pendingScoutEncounter) {
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        await printSection("SCOUT", [
            `${designatedScout()?.name ?? "YOUR SCOUT"} FINDS SIGN OF ${scoutEncounterName(state.pendingScoutEncounter)} AHEAD.`,
            "FACE IT   - KEEP THE DIRECT LINE AND MEET IT HEAD-ON",
            `DETOUR    - SWING WIDE AND LOSE ${state.pendingScoutDetourMiles} MILES ON YOUR NEXT TRAVEL`,
        ]);
        Term.prompt();
    }

    async function printRepairPrompt() {
        await printSection("REPAIR", [
            "PATCH      - COST 4 SUPPLIES, RESTORE WAGON CONDITION",
            "REINFORCE  - COST 8 SUPPLIES, RESTORE MORE CONDITION",
            "IRON       - COST 6 SUPPLIES, RESTORE SANCTITY WITH COLD IRON",
            "BACK       - RETURN TO TRAIL ORDERS",
        ]);
        Term.prompt();
    }

    async function printTradePrompt() {
        await Term.writelns("");
        await Term.writelns(boxLabel("MARKET"));
        if (state.tradeLocation === "el-paso" && state.tradeTime === "day") {
            await Term.writelns(" FOOD       - COST $20, GAIN 30 FOOD");
            await Term.writelns(" AMMO       - COST $16, GAIN 12 AMMO");
            await Term.writelns(" SUPPLIES   - COST $24, GAIN 8 SUPPLIES");
            await Term.writelns(" OIL        - COST $25, GAIN 1 WARDING OIL");
            await Term.writelns(" GRAIN      - COST $20, GAIN 1 BLESSED GRAIN");
        } else if (state.tradeLocation === "el-paso") {
            await Term.writelns(" CHARM      - COST $18, LOWER FEAR AND HERD STRESS");
            await Term.writelns(" VIGIL      - COST $24, GAIN SANCTITY AND WARDING OIL");
            await Term.writelns(" TONIC      - COST $20, STEADY HERD HEALTH AND FATIGUE");
            await Term.writelns(" GRAIN      - COST $18, GAIN 1 BLESSED GRAIN");
        } else if (state.tradeTime === "day") {
            if (damnedTradesRemaining() > 0) {
                await Term.writelns(` OIL        - COST ${damnedTradeCost("oil")} CATTLE, GAIN 2 WARDING OIL`);
                await Term.writelns(` MIRROR     - COST ${damnedTradeCost("mirror")} CATTLE, LOWER FEAR`);
                await Term.writelns(` NAILS      - COST ${damnedTradeCost("nails")} CATTLE, GAIN 10 SUPPLIES`);
            } else {
                await Term.writelns(" THE POST HAS GIVEN ALL THE FAIRNESS IT INTENDS TO GIVE.");
            }
        } else {
            if (damnedTradesRemaining() > 0) {
                await Term.writelns(` VIGIL      - COST ${damnedTradeCost("vigil")} CATTLE, LOWER FEAR AND RAISE SANCTITY`);
                await Term.writelns(` BLESSING   - COST ${damnedTradeCost("blessing")} CATTLE, STEADY HERD HEALTH AND BLIGHT`);
                await Term.writelns(` CACHE      - COST ${damnedTradeCost("cache")} CATTLE, GAIN FOOD AND SUPPLIES`);
            } else {
                await Term.writelns(" THE POST HAS SHUT ITS TEETH. NO MORE DEALS WILL COME EASY HERE.");
            }
        }
        await Term.writelns(" BACK       - LEAVE THE MARKET");
        if (state.tradeLocation === "el-paso") {
            await Term.writelns(` CASH ON HAND: $${state.cash}`);
        } else {
            await Term.writelns(` CATTLE AVAILABLE FOR TRADE: ${state.cattle}`);
            await Term.writelns(` DEALS REMAINING: ${damnedTradesRemaining()}`);
        }
        Term.prompt();
    }

    async function printRationsPrompt() {
        await printSection("RATIONS", ["HOW WELL DO YOU FEED THE CREW THIS WEEK?", "POOR, MODERATE, WELL, BACK"]);
        Term.prompt();
    }

    async function printNightPrompt() {
        const options = [
            "CAMPFIRE  - LIFT MORALE, ATTRACT ATTENTION",
            "GUARD     - PUSH FEAR DOWN, EXHAUST THE CREW",
            "WHISKEY   - BUY COURAGE WITH A BOTTLE",
            "RITE      - LEARN WHAT IS HUNTING YOU",
            "NIGHT     - KEEP MOVING THROUGH THE VEIL",
        ];
        if (state.canTrade) {
            options.splice(4, 0, "TRADE     - DEAL AFTER DARK FOR STRANGER, MORE IMMEDIATE AID");
        }
        await printSection("NIGHT", options);
        Term.prompt();
    }

    async function printBlightPrompt() {
        await printSection("BLIGHT", [
            `${state.pendingBlightedFood} FOOD IS BLIGHTED.`,
            "TYPE TAKE TO STOW THE BLIGHTED MEAT WITH YOUR STORES, OR LEAVE TO WALK AWAY FROM IT.",
        ]);
        Term.prompt();
    }

    async function printEncounterPrompt() {
        if (state.pendingEncounter === "ash-drowner") {
            await printSection("ENCOUNTER", [
                "THE ASH-DROWNER WALKS BESIDE THE LEAD COWS AND NAMES THREE PRICES.",
                "PASSAGE  - LOSE 8 CATTLE, GAIN 40 MILES, LOWER FEAR AND HERD STRESS",
                "WARD     - LOSE 6 CATTLE, RESTORE SANCTITY AND HERD HEALTH",
                "PROVENDER - LOSE 5 CATTLE, GAIN FOOD, SUPPLIES, AND A LITTLE HERD RECOVERY",
                "REFUSE   - KEEP THE HERD, ACCEPT A SHARP SPIKE IN STRESS",
            ]);
        } else if (state.pendingEncounter === "salt-chapel") {
            await printSection("ENCOUNTER", [
                "THE SALT CHAPEL OFFERS WARDING, BUT IT DOES NOT OFFER IT FOR FREE.",
                "TITHE    - LOSE 6 CATTLE, RESTORE SANCTITY, PUSH BACK BLIGHT",
                "CONFESS  - PAY IN MORALE AND LOYALTY, GAIN A LESSER WARD",
                "PASS BY  - KEEP MOVING, KEEP YOUR HERD, ACCEPT THE WESTERN PRESSURE",
            ]);
        } else if (state.pendingEncounter === "hollow-drover") {
            await printSection("ENCOUNTER", [
                "THE HOLLOW DROVER OFFERS TO SHOW YOU WHERE THE TRAIL THINNED WRONG.",
                "FOLLOW    - TRUST HIS TRAIL, GAIN MILES OR RECOVER CATTLE, RISK BLIGHT AND FEAR",
                "BARGAIN   - PAY 4 CATTLE, GAIN A CLEANER, SAFER FAVOR",
                "DRIVE OFF - REFUSE HIM, KEEP THE HERD CLOSE, ACCEPT A SPIKE IN TENSION",
            ]);
        }
        Term.prompt();
    }

    async function printEnvironment(lines: string[]) {
        await printSection("ENVIRONMENT", lines);
    }

    function environmentLines(): string[] {
        if (state.miles < 120) {
            return ["THE TRAIL STILL LOOKS NORMAL AT A DISTANCE, BUT THE NIGHTS NO LONGER FEEL NATURAL."];
        }
        if (state.miles < 310) {
            return ["THE PAINTED CANYONS HOLD COLOR TOO LONG AFTER SUNSET. EVEN THE CATTLE NOTICE."];
        }
        if (state.miles < 520) {
            return ["WEST OF EL PASO, THE SALT PROTECTION FADES FAST. THE VEIL STARTS CROWDING THE WAGON AGAIN."];
        }
        if (state.miles < 680) {
            return ["THE STAKED PLAINS FEEL EMPTY IN THE WRONG WAY. DISTANCE STOPS FEELING TRUSTWORTHY."];
        }
        if (state.miles < 760) {
            return ["THIS FAR WEST, EVERY FIRELIGHT DECISION FEELS LIKE A SIGNAL TO SOMETHING WATCHING."];
        }
        return ["THE NEVADA REACH IS OPENLY HOSTILE. WHAT FOLLOWED YOU NO LONGER BOTHERS TO HIDE."];
    }

    function travelWearLine(wear: number, fearGain: number): string {
        if (state.miles < 120) {
            return "ROUGH TRAIL WEARS ON THE WAGON. THE CREW GROWS UNEASIER AS THE LAST SAFE CITY FALLS BEHIND.";
        }
        if (state.miles < 310) {
            return "CANYON STONE BATTERS THE WAGON. FEAR RISES AS THE PAINTED COUNTRY TURNS WRONG AFTER DUSK.";
        }
        if (state.miles < 520) {
            return "WEST OF EL PASO, THE TRAIL FEELS EXPOSED. THE WAGON SUFFERS AND THE CREW FEELS IT.";
        }
        if (state.miles < 760) {
            return "THE OPEN PLAINS GIVE YOU NO COVER. THE WAGON TAKES THE STRAIN UNDER THE EMPTY SKY, AND THE CREW'S NERVES FRAY WITH IT.";
        }
        return "THE FINAL WEST HITS LIKE MALICE. THE WAGON TAKES THE PUNISHMENT AS THE LAND STOPS PRETENDING TO BE NATURAL.";
    }

    function nightDriveLine(wear: number, fearGain: number): string {
        if (state.miles < 310) {
            return "NIGHT DRIVING THROUGH HALF-SEEN COUNTRY WEARS THE WAGON AND RATTLES THE CREW.";
        }
        if (state.miles < 680) {
            return "THE VEIL PRESSES CLOSER ON A NIGHT DRIVE. THE WAGON SUFFERS AND THE CREW FEELS THE DARK LEAN IN.";
        }
        return "OUT HERE THE NIGHT DRIVE FEELS LIKE A CHALLENGE THROWN AT THE DARK. THE WAGON TAKES THE HIT AND FEAR COMES WITH IT.";
    }

    function travelMiles(baseMin: number, baseMax: number): number {
        const base = randInt(baseMin, baseMax);
        const fatiguePenalty = Math.floor(state.herdFatigue / 4);
        const stressPenalty = Math.floor(state.herdStress / 6);
        const fearPenalty = state.fear >= 75 ? 6 : 0;
        const moralePenalty = state.morale <= 20 ? 4 : 0;
        const healthPenalty = state.herdHealth <= 40 ? 12 : state.herdHealth <= 55 ? 6 : 0;
        const overload = Math.max(0, state.cattle - (crewHandlingCapacity() + 40));
        const capacityPenalty = Math.min(22, Math.floor(overload / 18));
        return Math.max(12, base - fatiguePenalty - stressPenalty - fearPenalty - moralePenalty - healthPenalty - capacityPenalty);
    }

    function designatedHunter(): CrewMember | undefined {
        return livingCrew().find(member => member.role === "hunter");
    }

    function designatedScout(): CrewMember | undefined {
        return livingCrew().find(member => member.role === "scout");
    }

    function designatedDrover(): CrewMember | undefined {
        return livingCrew().find(member => member.role === "drover");
    }

    function designatedHand(): CrewMember | undefined {
        return livingCrew().find(member => member.role === "hand");
    }

    function recordSpecialistPassiveStatus(role: SpecialistRole, member: CrewMember | undefined, chanceValue: number, eligible: boolean, rolled: boolean, success: boolean, detail: string) {
        specialistPassiveStatus[role] = {
            week: state.week + 1,
            memberId: member?.id ?? null,
            eligible,
            chance: chanceValue,
            rolled,
            success,
            detail,
        };
        if (currentRunReport) {
            const counter = currentRunReport.counters.specialists[role];
            counter.checks += 1;
            if (eligible) {
                counter.eligibleChecks += 1;
            }
            if (success) {
                counter.successes += 1;
            }
            currentRunReport.specialists[role].push({
                week: state.week + 1,
                memberId: member?.id ?? null,
                eligible,
                chance: chanceValue,
                rolled,
                success,
                detail,
            });
        }
        syncDebugOverlay();
    }

    function huntFallbackPool(): CrewMember[] {
        return livingCrew().filter(member => member.role !== "hunter");
    }

    function scoutEncounterName(encounter: EncounterType): string {
        if (encounter === "salt-chapel") {
            return "THE SALT CHAPEL";
        }

        if (encounter === "ash-drowner") {
            return "THE ASH-DROWNER";
        }

        if (encounter === "hollow-drover") {
            return "THE HOLLOW DROVER";
        }

        return "TROUBLE";
    }

    function scoutForewarnedEncounter(): EncounterType {
        if (state.miles >= 520 && (state.wagonSanctity <= 55 || state.herdBlight >= 20 || state.fear >= 45)) {
            return "salt-chapel";
        }

        if (state.miles >= 520 && (state.fear >= 45 || state.herdStress >= 55 || state.wagonSanctity <= 55)) {
            return "ash-drowner";
        }

        if (state.miles >= 310 && (state.recentCattleLossWeeks > 0 || state.herdStress >= 45 || state.fear >= 40)) {
            return "hollow-drover";
        }

        return null;
    }

    function scoutDetourMiles(encounter: EncounterType): number {
        if (encounter === "salt-chapel" || encounter === "ash-drowner") {
            return randInt(20, 30);
        }

        if (encounter === "hollow-drover") {
            return randInt(12, 20);
        }

        return 0;
    }

    function applyScoutFind(scout: CrewMember): { detail: string; message: string } {
        const roll = Math.random();
        if (roll < 0.7) {
            const supplies = randInt(3, 6);
            state.supplies += supplies;
            return {
                detail: `FOUND ${supplies} SUPPLIES`,
                message: `SCOUT: ${scout.name} TURNS UP A HARDWARE CACHE OFF THE TRAIL. SUPPLIES +${supplies}.`,
            };
        }

        if (roll < 0.85) {
            state.wardingOil += 1;
            return {
                detail: "FOUND 1 WARDING OIL",
                message: `SCOUT: ${scout.name} FINDS A SEALED BOTTLE OF WARDING OIL LEFT IN DRY SHADE. WARDING OIL +1.`,
            };
        }

        state.blessedGrain += 1;
        return {
            detail: "FOUND 1 BLESSED GRAIN",
            message: `SCOUT: ${scout.name} BRINGS BACK A SMALL SACK OF BLESSED GRAIN FROM A FORGOTTEN SHRINE. BLESSED GRAIN +1.`,
        };
    }

    function clearScoutRoutePlan() {
        state.activeScoutEncounter = null;
        state.activeScoutRoutePlan = null;
        state.activeScoutDetourMiles = 0;
    }

    function clearScoutWarning() {
        state.pendingScoutEncounter = null;
        state.pendingScoutDetourMiles = 0;
    }

    async function triggerEncounterByType(encounter: EncounterType) {
        if (encounter === "salt-chapel") {
            await saltChapelEncounter();
            return;
        }

        if (encounter === "ash-drowner") {
            await ashDrownerEncounter();
            return;
        }

        if (encounter === "hollow-drover") {
            await hollowDroverEncounter();
        }
    }

    function chooseActingHunter(): { actor: CrewMember | null; fallbackShooter: boolean } {
        const hunter = designatedHunter();
        if (hunter) {
            return { actor: hunter, fallbackShooter: false };
        }

        const pool = huntFallbackPool();
        if (pool.length === 0) {
            return { actor: null, fallbackShooter: false };
        }

        return {
            actor: [...pool].sort((left, right) =>
                right.huntSkill - left.huntSkill ||
                right.health - left.health ||
                left.fear - right.fear
            )[0],
            fallbackShooter: true,
        };
    }

    function huntShotPenaltyFor(actor: CrewMember | null, fallbackShooter: boolean): number {
        if (!actor || !fallbackShooter) {
            return 0;
        }

        return DeadwoodModel.backupHunterPenalty(actor);
    }

    function huntShotChanceFor(actor: CrewMember | null, fallbackShooter: boolean): number {
        const baseChance = huntShotChance();
        if (!actor || !fallbackShooter) {
            return baseChance;
        }

        return DeadwoodModel.backupHuntShotChance(baseChance, actor);
    }

    function huntLeadText(): string {
        const hunter = designatedHunter();
        if (hunter) {
            return `${hunter.name} (HUNTER)`;
        }

        const pool = huntFallbackPool();
        if (pool.length === 0) {
            return "NO SHOOTER";
        }

        const backup = [...pool].sort((left, right) =>
            right.huntSkill - left.huntSkill ||
            right.health - left.health ||
            left.fear - right.fear
        )[0];
        return `${backup.name} (BACKUP)`;
    }

    function huntPreviewShotChance(): number {
        const hunter = designatedHunter();
        if (hunter) {
            return huntShotChance();
        }

        const pool = huntFallbackPool();
        if (pool.length === 0) {
            return 0;
        }

        const total = pool.reduce((sum, member) => sum + DeadwoodModel.backupHuntShotChance(huntShotChance(), member), 0);
        return Math.round(total / pool.length);
    }

    function huntPreviewPenalty(): string {
        const hunter = designatedHunter();
        if (hunter) {
            return "0";
        }

        const pool = huntFallbackPool();
        if (pool.length === 0) {
            return "n/a";
        }

        const penalties = pool.map(member => DeadwoodModel.backupHunterPenalty(member));
        const minPenalty = Math.min(...penalties);
        const maxPenalty = Math.max(...penalties);
        return minPenalty === maxPenalty ? `-${minPenalty}` : `-${minPenalty} to -${maxPenalty}`;
    }

    function applyBackupHuntExperience(actor: CrewMember, result: HuntResult): number {
        if (!result.fallbackShooter || actor.role === "hunter") {
            return 0;
        }

        const gain = DeadwoodModel.backupHuntSkillGain(result.hits, result.bulletsSpent);
        if (gain <= 0) {
            return 0;
        }

        const before = actor.huntSkill;
        actor.huntSkill = Math.min(BACKUP_HUNT_SKILL_CAP, actor.huntSkill + gain);
        return actor.huntSkill - before;
    }

    function resolveHunterTrapline(): void {
        const hunter = designatedHunter();
        if (!hunter) {
            recordSpecialistPassiveStatus("hunter", undefined, 0, false, false, false, "NO HUNTER IN CREW");
            return;
        }

        const trapChance = DeadwoodModel.hunterTraplineChance(hunter);
        if (trapChance <= 0) {
            recordSpecialistPassiveStatus("hunter", hunter, trapChance, false, false, false, "BLOCKED BY CURRENT CONDITION");
            return;
        }

        const triggered = chance(trapChance);
        if (!triggered) {
            recordSpecialistPassiveStatus("hunter", hunter, trapChance, true, true, false, `MISSED ${trapChance}% ROLL`);
            return;
        }

        const foodFound = randInt(TRAPLINE_FOOD_MIN, TRAPLINE_FOOD_MAX);
        state.food += foodFound;
        if (currentRunReport) {
            currentRunReport.counters.specialists.hunter.extraValue += foodFound;
        }
        recordSpecialistPassiveStatus("hunter", hunter, trapChance, true, true, true, `TRAPLINE BROUGHT IN ${foodFound} FOOD`);
        state.pendingMessages.push(`TRAPLINE: ${hunter.name} CHECKS THE SNARES AT FIRST LIGHT AND BRINGS IN ${foodFound} CLEAN FOOD.`);
    }

    function resolveScoutTrailSense(): void {
        const scout = designatedScout();
        if (!scout) {
            recordSpecialistPassiveStatus("scout", undefined, 0, false, false, false, "NO SCOUT IN CREW");
            return;
        }

        const trailChance = DeadwoodModel.scoutTrailSenseChance(scout);
        if (trailChance <= 0) {
            recordSpecialistPassiveStatus("scout", scout, trailChance, false, false, false, "BLOCKED BY CURRENT CONDITION");
            return;
        }

        const triggered = chance(trailChance);
        if (!triggered) {
            recordSpecialistPassiveStatus("scout", scout, trailChance, true, true, false, `MISSED ${trailChance}% ROLL`);
            return;
        }

        if (!state.pendingScoutEncounter) {
            const warnedEncounter = scoutForewarnedEncounter();
            if (warnedEncounter) {
                state.pendingScoutEncounter = warnedEncounter;
                state.pendingScoutDetourMiles = scoutDetourMiles(warnedEncounter);
                if (currentRunReport) {
                    currentRunReport.counters.scout.warnings += 1;
                }
                recordSpecialistPassiveStatus("scout", scout, trailChance, true, true, true, `SPOTTED ${scoutEncounterName(warnedEncounter)}`);
                return;
            }
        }

        const find = applyScoutFind(scout);
        if (currentRunReport) {
            currentRunReport.counters.scout.finds += 1;
        }
        recordSpecialistPassiveStatus("scout", scout, trailChance, true, true, true, find.detail);
        state.pendingMessages.push(find.message);
    }

    function droverReliefPriority(): "recover" | "stress" | "fatigue" | "blight" {
        const recoverScore =
            state.recentCattleLossWeeks > 0
                ? 78 + Math.max(0, 500 - state.cattle) / 10
                : 0;
        const stressScore = state.herdStress + Math.max(0, state.herdFatigue - 40) / 3;
        const fatigueScore = state.herdFatigue + Math.max(0, state.herdStress - 40) / 4;
        const blightScore = state.herdBlight + Math.max(0, state.herdStress - 45) / 5;

        const priorities = [
            { kind: "recover" as const, score: recoverScore },
            { kind: "stress" as const, score: stressScore },
            { kind: "fatigue" as const, score: fatigueScore },
            { kind: "blight" as const, score: blightScore },
        ];

        return [...priorities].sort((left, right) => right.score - left.score)[0].kind;
    }

    function resolveDroverHerdCare(): void {
        const drover = designatedDrover();
        if (!drover) {
            recordSpecialistPassiveStatus("drover", undefined, 0, false, false, false, "NO DROVER IN CREW");
            return;
        }

        const careChance = DeadwoodModel.droverHerdCareChance(drover);
        if (careChance <= 0) {
            recordSpecialistPassiveStatus("drover", drover, careChance, false, false, false, "BLOCKED BY CURRENT CONDITION");
            return;
        }

        const triggered = chance(careChance);
        if (!triggered) {
            recordSpecialistPassiveStatus("drover", drover, careChance, true, true, false, `MISSED ${careChance}% ROLL`);
            return;
        }

        const priority = droverReliefPriority();
        if (priority === "recover") {
            const recovered = addRecoveredCattle(randInt(DROVER_RECOVER_MIN, DROVER_RECOVER_MAX), false, "drover-passive");
            if (recovered > 0) {
                state.recentCattleLossWeeks = 0;
                affectHerd({ stress: -4, fatigue: -2 });
                if (currentRunReport) {
                    currentRunReport.counters.specialists.drover.extraValue += recovered;
                }
                recordSpecialistPassiveStatus("drover", drover, careChance, true, true, true, `RECOVERED ${recovered} LOST CATTLE`);
                state.pendingMessages.push(`DROVER: ${drover.name} FINDS ${recovered} STRAY HEAD AT FIRST LIGHT AND WALKS THEM BACK INTO THE DRIVE.`);
            } else {
                recordSpecialistPassiveStatus("drover", drover, careChance, true, true, true, "FOUND NO STRAYS TO BRING BACK");
            }
            return;
        }

        if (priority === "blight") {
            const relieved = relieveInfectedCattle(percentOfHerd(6), 7);
            affectHerd({ blight: -2, stress: -2, health: 1 });
            recordSpecialistPassiveStatus("drover", drover, careChance, true, true, true, relieved > 0 ? `STABILIZED ${relieved} SICKER CATTLE` : "WORKED THE SICKER EDGE OF THE HERD");
            state.pendingMessages.push(`DROVER: ${drover.name} WORKS THE SICKER EDGE OF THE HERD UNTIL THE LINE STEADIES${relieved > 0 ? " AND SOME OF THE WORST STOCK CLEARS A LITTLE" : ""}.`);
            return;
        }

        if (priority === "fatigue") {
            affectHerd({ fatigue: -8, stress: -3, health: 2 });
            recordSpecialistPassiveStatus("drover", drover, careChance, true, true, true, "REDUCED HERD FATIGUE");
            state.pendingMessages.push(`DROVER: ${drover.name} SETS AN EASIER PACE BEFORE DAWN AND TAKES SOME OF THE WEAR OFF THE HERD.`);
            return;
        }

        const calmed = calmTraumatizedCattle(percentOfHerd(10), 10);
        affectHerd({ stress: -6, fatigue: -2 });
        recordSpecialistPassiveStatus("drover", drover, careChance, true, true, true, calmed > 0 ? `CALMED ${calmed} SKITTISH CATTLE` : "REDUCED HERD STRESS");
        state.pendingMessages.push(`DROVER: ${drover.name} RIDES THE NERVOUS EDGE OF THE DRIVE UNTIL IT QUIETS${calmed > 0 ? " AND THE WORST OF THE SKITTISHNESS BREAKS" : ""}.`);
    }

    function resolveHandMaintenance(): void {
        const hand = designatedHand();
        if (!hand) {
            recordSpecialistPassiveStatus("hand", undefined, 0, false, false, false, "NO HAND IN CREW");
            return;
        }

        const maintenanceChance = DeadwoodModel.handMaintenanceChance(hand);
        if (maintenanceChance <= 0) {
            recordSpecialistPassiveStatus("hand", hand, maintenanceChance, false, false, false, "BLOCKED BY CURRENT CONDITION");
            return;
        }

        const triggered = chance(maintenanceChance);
        if (!triggered) {
            recordSpecialistPassiveStatus("hand", hand, maintenanceChance, true, true, false, `MISSED ${maintenanceChance}% ROLL`);
            return;
        }

        let repair = randInt(HAND_REPAIR_MIN, HAND_REPAIR_MAX);
        if (state.wagonCondition <= 45) {
            repair += 2;
        } else if (state.wagonCondition <= 65) {
            repair += 1;
        }

        state.wagonCondition += repair;
        if (currentRunReport) {
            currentRunReport.counters.specialists.hand.extraValue += repair;
        }
        recordSpecialistPassiveStatus("hand", hand, maintenanceChance, true, true, true, `REPAIRED ${repair} WAGON STRUCTURE`);
        state.pendingMessages.push(`HAND: ${hand.name} PATCHES THE FRAME AND TIGHTENS THE IRON. WAGON STRUCTURE +${repair}.`);
    }

    function resolveCrewRolePassives(): void {
        resolveHunterTrapline();
        resolveScoutTrailSense();
        resolveDroverHerdCare();
        resolveHandMaintenance();
    }

    function huntCleanChance(): number {
        return DeadwoodModel.huntCleanChance(state.miles, state.occultHuntBonus, state.nightHuntPenalty);
    }

    function huntShotChance(): number {
        return DeadwoodModel.huntShotChance(state.miles, state.occultHuntBonus, state.nightHuntPenalty);
    }

    function resolveHunt(bulletsSpent: number, actor: CrewMember | null, fallbackShooter: boolean): HuntResult {
        const baseShotChance = huntShotChance();
        const shotChance = huntShotChanceFor(actor, fallbackShooter);
        const cleanChance = huntCleanChance();
        const shotPenalty = huntShotPenaltyFor(actor, fallbackShooter);
        let hits = 0;
        let cleanFood = 0;
        let blightedFood = 0;
        const bullets: HuntBulletDebug[] = [];

        for (let shot = 0; shot < bulletsSpent; shot += 1) {
            const hit = chance(shotChance);
            if (!hit) {
                bullets.push({
                    shot: shot + 1,
                    hit: false,
                    clean: null,
                    food: 0,
                });
                continue;
            }

            hits += 1;
            const food = randInt(FOOD_PER_HIT_MIN, FOOD_PER_HIT_MAX);
            const clean = chance(cleanChance);
            bullets.push({
                shot: shot + 1,
                hit: true,
                clean,
                food,
            });
            if (clean) {
                cleanFood += food;
            } else {
                blightedFood += food;
            }
        }

        return {
            actorId: actor?.id ?? null,
            actorName: actor?.name ?? "NO SHOOTER",
            actorRole: actor?.role ?? "none",
            fallbackShooter,
            bulletsSpent,
            hits,
            cleanFood,
            blightedFood,
            baseShotChance,
            shotChance,
            cleanChance,
            shotPenalty,
            bullets,
        };
    }

    async function resolveHuntAction(bulletsSpent: number) {
        state.lastDayAction = "hunt";
        const { actor, fallbackShooter } = chooseActingHunter();
        if (!actor) {
            await Term.writelns("NO ONE LEFT IN THE CREW CAN TAKE A HUNTING RIFLE INTO THE FIELD.");
            await printDayPrompt();
            return;
        }
        state.ammo -= bulletsSpent;
        affectHerd({ fatigue: -6, stress: -4, health: 1 });

        const result = resolveHunt(bulletsSpent, actor, fallbackShooter);
        if (currentRunReport) {
            currentRunReport.counters.hunt.attempts += 1;
            currentRunReport.counters.hunt.shotsFired += result.bulletsSpent;
            currentRunReport.counters.hunt.hits += result.hits;
            currentRunReport.counters.hunt.cleanFood += result.cleanFood;
            currentRunReport.counters.hunt.blightedFood += result.blightedFood;
            currentRunReport.counters.blight.found += result.blightedFood;
            if (result.fallbackShooter) {
                currentRunReport.counters.hunt.fallbackAttempts += 1;
            }
        }
        state.lastHuntResult = result;
        const huntSkillGain = applyBackupHuntExperience(actor, result);
        const shotLabel = `${result.bulletsSpent} SHOT${result.bulletsSpent === 1 ? "" : "S"}`;
        const hitLabel = `${result.hits} HEAD`;
        state.occultHuntBonus = false;
        syncDebugOverlay();

        if (result.fallbackShooter) {
            await Term.writelns(`WITH NO TRUE HUNTER LEFT, ${result.actorName} TAKES THE HUNT. THE SHOTS COME LESS SURELY.`);
        } else {
            await Term.writelns(`${result.actorName} TAKES THE HUNT.`);
        }

        if (huntSkillGain > 0) {
            await Term.writelns(`${result.actorName} LEARNS THE RIFLE A LITTLE BETTER. HUNT SKILL +${huntSkillGain}.`);
        }

        if (result.hits === 0) {
            affectCrew({ morale: -2, fear: 2 });
            await Term.writelns(`YOU FIRE ${shotLabel} INTO BAD COUNTRY AND BRING BACK NOTHING.`);
            await transitionToRations();
            return;
        }

        affectCrew({ morale: 2, hunger: -1 });
        await Term.writelns(`YOU FIRE ${shotLabel} AND BRING DOWN ${hitLabel}.`);

        if (result.cleanFood > 0) {
            state.food += result.cleanFood;
            await Term.writelns(`YOU DRESS AND STOW ${result.cleanFood} CLEAN FOOD.`);
        }

        if (result.blightedFood > 0) {
            state.pendingBlightedFood = result.blightedFood;
            state.phase = "blight";
            if (result.cleanFood > 0) {
                await Term.writelns(`ANOTHER ${result.blightedFood} FOOD IS BLIGHTED. YOU CAN TAKE IT TOO, OR LEAVE IT BEHIND.`);
            } else {
                await Term.writelns(`NOTHING FROM THE KILL COMES BACK CLEAN. ${result.blightedFood} FOOD IS BLIGHTED.`);
            }
            await printBlightPrompt();
            return;
        }

        await Term.writelns("THE HUNT GOES CLEAN.");
        await transitionToRations();
    }

    function herdLossRiskBonus(): number {
        let bonus = 0;
        if (state.herdStress >= 60) bonus += 4;
        if (state.herdFatigue >= 60) bonus += 3;
        if (state.herdHealth <= 40) bonus += 3;
        if (state.fear >= 70) bonus += 4;
        if (state.morale <= 25) bonus += 2;
        return bonus;
    }

    function affectHerd(stats: { health?: number; stress?: number; fatigue?: number; blight?: number }) {
        applyToLivingCows(cow => {
            if (stats.health) {
                cow.health += distributedStatDelta(cow, "health", stats.health);
            }
            if (stats.stress) {
                cow.stress += distributedStatDelta(cow, "stress", stats.stress);
            }
            if (stats.fatigue) {
                cow.fatigue += distributedStatDelta(cow, "fatigue", stats.fatigue);
            }
            if (stats.blight) {
                cow.blight += distributedStatDelta(cow, "blight", stats.blight);
            }
        });
    }

    function nightlyFatigueShift(): number {
        switch (state.lastDayAction) {
            case "travel":
                return 6;
            case "rest":
                return -8;
            case "hunt":
                return -3;
            case "repair":
                return -2;
            case "trade":
                return -2;
            case "slaughter":
                return 1;
            default:
                return 0;
        }
    }

    async function start(options?: DeadwoodStartOptions) {
        if (state.active) {
            await Term.writelns(" DEADWOOD TRAIL IS ALREADY RUNNING.");
            Term.prompt();
            return;
        }

        setDebugMode(Boolean(options?.debugMode));
        resetState();
        initializeRunReport();
        state.active = true;
        state.phase = "outfit";
        syncDebugOverlay();

        Term.hidePrompt();
        Term.clearScreen();

        await printBlock([
            "DEADWOOD TRAIL",
            "",
            "1888. SAN ANTONIO IS THE LAST PLACE THE SUN STILL FEELS HONEST.",
            "YOU ARE DRIVING 500 UNTAINTED CATTLE TO THE SILVER FOLD IN NEVADA.",
            "THE HERD IS THE SCORE. EVERYTHING ELSE EXISTS TO GET THEM THERE.",
            "",
            "THE OLD TRAIL LOGIC STILL APPLIES: OUTFIT THE DRIVE, MANAGE YOUR FOOD,",
            "TAKE YOUR ACTIONS CAREFULLY, AND DO NOT LET BAD LUCK COMPOUND.",
            "THE DIFFERENCE IS THAT HERE, THE DARK IS ALSO PLAYING.",
            "",
            `YOU ARRIVE TO OUTFIT THE DRIVE WITH $${STARTING_CASH}.`,
            `THE MERCHANT INSISTS ON A STARTER KIT: ${STARTER_FOOD} FOOD, ${STARTER_AMMO} AMMO, AND ${STARTER_SUPPLIES} SUPPLIES.`,
            `YOU PAY $${(STARTER_FOOD * FOOD_PRICE) + (STARTER_AMMO * AMMO_PRICE) + (STARTER_SUPPLIES * SUPPLIES_PRICE)} BEFORE HE WILL LET YOU SHOP FREELY.`,
            "",
            `REMAINING CASH: $${state.cash}.`,
            `FOOD $${FOOD_PRICE}, AMMO $${AMMO_PRICE}, SUPPLIES $${SUPPLIES_PRICE}, WHISKEY $${WHISKEY_PRICE}, GRAIN $${GRAIN_PRICE}, OIL $${OIL_PRICE}.`,
            "",
        ]);

        await printStatus();
        await printOutfitPrompt();
    }

    async function stop(reason?: string) {
        if (!state.active) {
            return;
        }

        state.active = false;
        state.phase = "ended";
        finalizeRunReport(runResolution?.outcome ?? "quit", runResolution?.failureCause ?? null);
        syncDebugOverlay();
        await Term.writelns("");
        if (reason) {
            await Term.writelns(` ${reason}`);
        } else {
            await Term.writelns(" RUN COMPLETE.");
        }
        await Term.writelns(` FINAL TALLY: CATTLE ${state.cattle}   WEEKS ${state.week}   MILES ${Math.min(state.miles, state.destinationMiles)}/${state.destinationMiles}`);
        await persistRunReport();
        await Term.writelns(' TYPE "RUN DEADWOOD" TO START A NEW DRIVE.');
        Term.prompt();
    }

    async function handleInput(rawInput: string) {
        const input = rawInput.trim().toLowerCase();

        if (!state.active) {
            Term.prompt();
            return;
        }

        if (input === "quit" || input === "exit") {
            runResolution = { outcome: "quit", failureCause: null };
            await stop("RUN COMPLETE.");
            return;
        }

        if (input === "status") {
            await printStatus();
            await reprompt();
            return;
        }

        if (input === "help") {
            await printHelp();
            await reprompt();
            return;
        }

        if (state.phase === "outfit") {
            await handleOutfitCommand(input);
            return;
        }

        if (state.phase === "day") {
            await handleDayCommand(input);
            return;
        }

        if (state.phase === "repair") {
            await handleRepairCommand(input);
            return;
        }

        if (state.phase === "trade") {
            await handleTradeCommand(input);
            return;
        }

        if (state.phase === "rations") {
            await handleRationCommand(input);
            return;
        }

        if (state.phase === "night") {
            await handleNightCommand(input);
            return;
        }

        if (state.phase === "blight") {
            await handleBlightCommand(input);
            return;
        }

        if (state.phase === "encounter") {
            await handleEncounterCommand(input);
            return;
        }

        if (state.phase === "scout") {
            await handleScoutCommand(input);
        }
    }

    async function reprompt() {
        if (!state.active) {
            return;
        }

        switch (state.phase) {
            case "outfit":
                await printOutfitPrompt();
                break;
            case "day":
                await printDayPrompt();
                break;
            case "repair":
                await printRepairPrompt();
                break;
            case "trade":
                await printTradePrompt();
                break;
            case "rations":
                await printRationsPrompt();
                break;
            case "night":
                await printNightPrompt();
                break;
            case "blight":
                await printBlightPrompt();
                break;
            case "encounter":
                await printEncounterPrompt();
                break;
            case "scout":
                await printScoutPrompt();
                break;
        }
        syncDebugOverlay();
    }

    async function printHelp() {
        let lines: string[] = [];

        if (state.phase === "outfit") {
            lines = [
                "BUY FOOD <N>      - BUY FOOD FOR THE DRIVE",
                "BUY AMMO <N>      - BUY AMMO FOR HUNTING AND DEFENSE",
                "BUY SUPPLIES <N>  - BUY TRAIL AND REPAIR SUPPLIES",
                "BUY WHISKEY <N>   - BUY MORALE BOOSTS",
                "BUY BLESSED GRAIN <N> - BUY BLESSED GRAIN FOR STAMPEDES",
                "BUY WARDING OIL <N>   - BUY WARDING OIL AGAINST RUST-MOTHS",
                "START             - LEAVE SAN ANTONIO",
            ];
        } else if (state.phase === "day") {
            lines = [
                "TRAVEL    - PUSH WEST AND ACCEPT A TRAIL EVENT",
                "REPAIR    - ENTER A REPAIR RITE TO RESTORE WAGON SANCTITY",
                "REST      - SACRIFICE TIME FOR MORALE AND LOWER FEAR",
                "RATIONS   - CHANGE HOW WELL THE CREW EATS THIS WEEK",
                "SLAUGHTER - KILL 1 HEAD OF CATTLE FOR EMERGENCY FOOD",
            ];
            if (state.ammo >= FULL_HUNT_AMMO) {
                lines.splice(1, 0, "HUNT      - FIRE UP TO 8 SHOTS; CLEAN AND BLIGHTED MEAT ARE COUNTED SEPARATELY");
            } else if (state.ammo > 0) {
                lines.splice(1, 0, "HUNT      - FIRE YOUR REMAINING SHOTS; CLEAN AND BLIGHTED MEAT ARE COUNTED SEPARATELY");
            } else {
                lines.splice(1, 0, "HUNT      - REQUIRES AMMO");
            }
            if (state.canTrade) {
                lines.splice(5, 0, "TRADE     - ENTER THE MARKET WHEN A SAFE OR STRANGE POST IS OPEN");
            }
        } else if (state.phase === "repair") {
            lines = [
                "PATCH     - SMALL REPAIR USING FEWER SUPPLIES",
                "REINFORCE - HEAVIER REPAIR TO RESTORE MORE SANCTITY",
                "IRON      - COLD IRON PATCH TO BLUNT SUPERNATURAL DECAY",
                "BACK      - RETURN TO TRAIL ORDERS",
            ];
        } else if (state.phase === "trade") {
            lines = [
                "TYPE AN OFFER NAME TO TRADE FOR IT",
                "BACK      - LEAVE THE MARKET",
            ];
        } else if (state.phase === "rations") {
            lines = [
                "POOR      - SAVE FOOD, LOWER MORALE",
                "MODERATE  - BALANCED FOOD CONSUMPTION",
                "WELL      - SPEND MORE FOOD TO STEADY THE CREW",
                "BACK      - KEEP CURRENT RATIONS",
            ];
        } else if (state.phase === "night") {
            lines = [
                "CAMPFIRE  - RAISE MORALE, LOWER FEAR, RISK AN AMBUSH",
                "GUARD     - LOWER FEAR, BUT TIRED CREW LOSSES STACK UP",
                "WHISKEY   - SPEND WHISKEY FOR A MORALE SPIKE",
                "RITE      - TRADE COMFORT FOR SUPERNATURAL CLARITY",
                "NIGHT     - NIGHT DRIVE FOR DISTANCE AND DANGER",
            ];
        } else if (state.phase === "encounter") {
            lines = [
                "PASSAGE   - SACRIFICE CATTLE FOR A SAFER PUSH WEST",
                "WARD      - SACRIFICE CATTLE TO STRENGTHEN THE DRIVE",
                "PROVENDER - SACRIFICE CATTLE FOR FOOD AND MATERIALS",
                "REFUSE    - KEEP THE HERD AND TAKE THE CONSEQUENCES",
            ];
        } else if (state.phase === "scout") {
            lines = [
                "FACE IT   - TAKE THE DIRECT LINE INTO THE THING YOUR SCOUT SPOTTED",
                "DETOUR    - LOSE MILES TO GO AROUND IT",
            ];
        } else if (state.phase === "blight") {
            lines = [
                "TAKE      - KEEP THE BLIGHTED MEAT, RAISE FEAR",
                "LEAVE     - WALK AWAY FROM THE BLIGHTED PORTION",
            ];
        }

        await printBlock(lines.concat(["STATUS    - REVIEW THE DRIVE", "QUIT      - RETURN TO THE TERMINAL"]));
    }

    async function handleOutfitCommand(input: string) {
        if (input === "start") {
            recordAction("outfit", "start-drive");
            state.phase = "day";
            await Term.writelns("YOU LEAVE SAN ANTONIO UNDER A CLEAN SUN THAT NONE OF YOU FULLY TRUST.");
            await printStatus();
            await printEnvironment(environmentLines());
            await printDayPrompt();
            return;
        }

        if (state.pendingPurchaseItem) {
            const quantity = parseInt(input, 10);
            if (Number.isNaN(quantity)) {
                await Term.writelns("TYPE A NUMBER OR START OVER WITH A BUY COMMAND.");
                await printPurchasePrompt(state.pendingPurchaseItem);
                return;
            }

            await completePurchase(state.pendingPurchaseItem, quantity);
            return;
        }

        const directShortMatch = input.match(/^(.+?)\s+(\d+)$/);
        if (directShortMatch) {
            const item = normalizeStoreItem(directShortMatch[1]);
            if (item) {
                await completePurchase(item, parseInt(directShortMatch[2], 10));
                return;
            }
        }

        const promptShortItem = normalizeStoreItem(input);
        if (promptShortItem) {
            state.pendingPurchaseItem = promptShortItem;
            await printPurchasePrompt(state.pendingPurchaseItem);
            return;
        }

        if (!input.startsWith("buy ")) {
            await Term.writelns("UNKNOWN ORDER.");
            await printOutfitPrompt();
            return;
        }

        const buyInput = input.replace(/^buy\s+/, "");
        const directMatch = buyInput.match(/^(.+?)\s+(\d+)$/);
        if (directMatch) {
            const item = normalizeStoreItem(directMatch[1]);
            if (item) {
                await completePurchase(item, parseInt(directMatch[2], 10));
                return;
            }
        }

        const promptMatchItem = normalizeStoreItem(buyInput);
        if (promptMatchItem) {
            state.pendingPurchaseItem = promptMatchItem;
            await printPurchasePrompt(state.pendingPurchaseItem);
            return;
        }

        if (input.match(/^buy\s+/)) {
            await Term.writelns("USE BUY FOOD <N>, BUY BLESSED GRAIN <N>, BUY WARDING OIL <N>, OR TYPE THE ITEM NAME AND I WILL ASK FOR THE AMOUNT.");
            await printOutfitPrompt();
            return;
        }

        await Term.writelns("UNKNOWN ORDER.");
        await printOutfitPrompt();
    }

    async function completePurchase(item: NonNullable<GameState["pendingPurchaseItem"]>, quantity: number) {
        state.pendingPurchaseItem = null;

        if (quantity <= 0) {
            await Term.writelns("BUY A REAL AMOUNT.");
            await printOutfitPrompt();
            return;
        }

        const unitCost =
            item === "food" ? FOOD_PRICE :
            item === "ammo" ? AMMO_PRICE :
            item === "supplies" ? SUPPLIES_PRICE :
            item === "whiskey" ? WHISKEY_PRICE :
            item === "grain" ? GRAIN_PRICE :
            OIL_PRICE;
        const totalCost = quantity * unitCost;

        if (quantity <= 0) {
            await Term.writelns("BUY A REAL AMOUNT.");
            await printOutfitPrompt();
            return;
        }

        if (totalCost > state.cash) {
            await Term.writelns("YOU DO NOT HAVE THAT MUCH CASH LEFT.");
            await printOutfitPrompt();
            return;
        }

        state.cash -= totalCost;
        if (item === "food") state.food += quantity;
        if (item === "ammo") state.ammo += quantity;
        if (item === "supplies") state.supplies += quantity;
        if (item === "whiskey") state.whiskey += quantity;
        if (item === "grain") state.blessedGrain += quantity;
        if (item === "oil") state.wardingOil += quantity;
        recordAction("outfit", `buy-${item}`, `${quantity} for $${totalCost}`);

        await Term.writelns(`PURCHASED ${quantity} ${item.toUpperCase()} FOR $${totalCost}.`);
        await printStatus();
        await printOutfitPrompt();
    }

    async function handleDayCommand(input: string) {
        if (input === "travel") {
            if (currentRunReport) {
                currentRunReport.counters.dayActions.travel += 1;
            }
            recordAction("day", "travel", state.activeScoutRoutePlan ? `scout plan ${state.activeScoutRoutePlan}` : "");
            state.lastDayAction = "travel";
            state.occultHuntBonus = false;
            const plannedEncounter = state.activeScoutRoutePlan === "face" ? state.activeScoutEncounter : null;
            const detourPenalty = state.activeScoutRoutePlan === "detour" ? state.activeScoutDetourMiles : 0;
            let miles = travelMiles(55, 95);
            if (detourPenalty > 0) {
                miles = Math.max(12, miles - detourPenalty);
            }
            const wear = randInt(3, 7);
            const fearGain = 2;
            state.miles += miles;
            state.wagonCondition -= wear;
            affectCrew({ fear: fearGain });
            affectHerd({
                fatigue: 10 + (state.rationLevel === "poor" ? 3 : 0),
                stress: 6,
                health: state.rationLevel === "poor" ? -4 : -1,
            });
            await Term.writelns(`YOU PUSH THE DRIVE FORWARD AND COVER ${miles} MILES THIS WEEK.`);
            await Term.writelns(travelWearLine(wear, fearGain));
            if (detourPenalty > 0 && state.activeScoutEncounter) {
                await Term.writelns(`YOU TAKE THE LONGER LINE AND GIVE ${scoutEncounterName(state.activeScoutEncounter)} A WIDE BERTH.`);
            }

            if (plannedEncounter) {
                clearScoutRoutePlan();
                await triggerEncounterByType(plannedEncounter);
            } else {
                const blockedEncounter = state.activeScoutRoutePlan === "detour" ? state.activeScoutEncounter : null;
                clearScoutRoutePlan();
                await trailEvent(blockedEncounter);
            }
            if (state.phase === "encounter") {
                return;
            }
            await reachLandmarks();
            await transitionToRations();
            return;
        }

        if (input === "hunt") {
            if (state.ammo <= 0) {
                await Term.writelns("YOU ARE OUT OF AMMO.");
                await printDayPrompt();
                return;
            }

            if (currentRunReport) {
                currentRunReport.counters.dayActions.hunt += 1;
            }
            recordAction("day", "hunt", `ammo ${Math.min(state.ammo, FULL_HUNT_AMMO)}`);
            await resolveHuntAction(Math.min(state.ammo, FULL_HUNT_AMMO));
            return;
        }

        if (input === "desperate hunt" || input === "desperate") {
            if (state.ammo <= 0) {
                await Term.writelns("YOU ARE OUT OF AMMO.");
                await printDayPrompt();
                return;
            }

            if (currentRunReport) {
                currentRunReport.counters.dayActions.hunt += 1;
            }
            recordAction("day", "desperate-hunt", `ammo ${state.ammo}`);
            await resolveHuntAction(state.ammo);
            return;
        }

        if (input === "repair") {
            if (currentRunReport) {
                currentRunReport.counters.dayActions.repair += 1;
            }
            recordAction("day", "repair");
            state.lastDayAction = "repair";
            state.occultHuntBonus = false;
            if (state.supplies < 4) {
                await Term.writelns("YOU DO NOT HAVE ENOUGH SUPPLIES TO ATTEMPT A REPAIR RITE.");
                await printDayPrompt();
                return;
            }
            state.phase = "repair";
            await Term.writelns("YOU DRAW THE WAGON OFF THE TRAIL AND DECIDE HOW TO RESTORE ITS SANCTITY.");
            await printRepairPrompt();
            return;
        }

        if (input === "rations") {
            if (state.rationChangedThisWeek) {
                await Term.writelns("YOU HAVE ALREADY CHANGED RATIONS THIS WEEK.");
                await printDayPrompt();
                return;
            }
            state.phase = "rations";
            await printRationsPrompt();
            return;
        }

        if (input === "rest") {
            if (currentRunReport) {
                currentRunReport.counters.dayActions.rest += 1;
            }
            recordAction("day", "rest");
            state.lastDayAction = "rest";
            state.occultHuntBonus = false;
            affectCrew({ morale: 8, fear: -6, hunger: -3, health: 2, loyalty: 1 });
            affectHerd({ health: 8, stress: -12, fatigue: -20, blight: -1 });
            const restedInjured = chooseCowSubset(percentOfHerd(10), "injured");
            applyToCowSubset(restedInjured, cow => {
                cow.health += randInt(5, 9);
                cow.fatigue -= randInt(6, 10);
                if (cow.health >= 68 && cow.fatigue <= 45) {
                    cow.injured = false;
                }
            });
            await Term.writelns("YOU HOLD POSITION FOR A DAY. THE HERD GRAZES. THE CREW STOPS SHAKING FOR A LITTLE WHILE.");
            await transitionToRations();
            return;
        }

        if (input === "trade") {
            if (currentRunReport) {
                currentRunReport.counters.dayActions.trade += 1;
            }
            recordAction("day", "trade-entry", state.tradeLocation);
            state.lastDayAction = "trade";
            state.occultHuntBonus = false;
            if (!state.canTrade) {
                await Term.writelns("THERE IS NOWHERE TO TRADE HERE. YOU ARE STILL OUT ON THE TRAIL.");
                await printDayPrompt();
                return;
            }
            await enterTrade();
            return;
        }

        if (input === "slaughter") {
            if (currentRunReport) {
                currentRunReport.counters.dayActions.slaughter += 1;
            }
            recordAction("day", "slaughter");
            state.lastDayAction = "slaughter";
            state.occultHuntBonus = false;
            if (state.cattle <= 0) {
                await Term.writelns("THERE ARE NO SPARE CATTLE LEFT TO KILL.");
                await printDayPrompt();
                return;
            }

            removeCattle(1, "dead", "injured", "slaughter");
            state.food += 160;
            affectCrew({ morale: -12, fear: 2 });
            affectHerd({ stress: 10 });
            await Term.writelns("YOU SLAUGHTER ONE OF YOUR OWN CATTLE. THE BUTCHER'S KNIFE FINDS THE MOST HURT STOCK FIRST, BUT IT STILL DAMAGES THE PURPOSE OF THE DRIVE.");
            await transitionToRations();
            return;
        }

        await Term.writelns("UNKNOWN ORDER.");
        await printDayPrompt();
    }

    async function handleScoutCommand(input: string) {
        if (!state.pendingScoutEncounter) {
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        if (input === "face it" || input === "face") {
            if (currentRunReport) {
                currentRunReport.counters.scout.faced += 1;
            }
            recordAction("scout", "face-it", state.pendingScoutEncounter ?? "");
            const encounter = state.pendingScoutEncounter;
            state.activeScoutEncounter = encounter;
            state.activeScoutRoutePlan = "face";
            state.activeScoutDetourMiles = 0;
            clearScoutWarning();
            await Term.writelns(`${designatedScout()?.name ?? "THE SCOUT"} MARKS THE DIRECT LINE. IF YOU TRAVEL THIS WEEK, YOU WILL MEET ${scoutEncounterName(encounter)} HEAD-ON.`);
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        if (input === "detour" || input === "long way") {
            if (currentRunReport) {
                currentRunReport.counters.scout.detoured += 1;
            }
            recordAction("scout", "detour", state.pendingScoutEncounter ?? "");
            const encounter = state.pendingScoutEncounter;
            const detourMiles = state.pendingScoutDetourMiles;
            state.activeScoutEncounter = encounter;
            state.activeScoutRoutePlan = "detour";
            state.activeScoutDetourMiles = detourMiles;
            clearScoutWarning();
            await Term.writelns(`${designatedScout()?.name ?? "THE SCOUT"} MARKS A WIDER LINE. YOUR NEXT TRAVEL THIS WEEK WILL LOSE ${detourMiles} MILES BUT AVOIDS ${scoutEncounterName(encounter)}.`);
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        await Term.writelns("TYPE FACE IT OR DETOUR.");
        await printScoutPrompt();
    }

    async function enterTrade() {
        state.tradeTime = state.phase === "night" ? "night" : "day";
        if (!state.canTrade) {
            await Term.writelns("THERE IS NO MARKET OPEN TO YOU HERE YET. THE FIRST CLEAR SAFE-ZONE TRADE IS IN EL PASO.");
            if (state.tradeTime === "night") {
                await printNightPrompt();
            } else {
                await printDayPrompt();
            }
            return;
        }

        state.phase = "trade";
        if (state.tradeLocation === "damned-post") {
            await Term.writelns(state.tradeTime === "night"
                ? "AT NIGHT THE DAMNED POST STOPS PRETENDING TO BE A MARKET. IT FEELS MORE LIKE A SHRINE THAT TAKES PAYMENT IN HERD."
                : "THE MERCHANTS OF THE DAMNED POST DO NOT WANT YOUR CASH. THEIR EYES KEEP DRIFTING TO THE HERD.");
            if (damnedTradesRemaining() > 0) {
                await Term.writelns(`THEIR OFFERS HAVE ${damnedTradesRemaining()} CLEAN DEAL${damnedTradesRemaining() === 1 ? "" : "S"} LEFT IN THEM BEFORE THE PRICE TURNS TRULY HUNGRY.`);
            } else {
                await Term.writelns("THE POST HAS ALREADY TAKEN ENOUGH FROM THIS DRIVE. WHAT REMAINS HERE IS NOT TRADE ANYMORE.");
            }
        } else if (state.tradeLocation === "el-paso") {
            await Term.writelns(state.tradeTime === "night"
                ? "EL PASO CHANGES AFTER DARK. CANDLES BURN LOW, AND THE OFFERS TURN QUIETER AND STRANGER."
                : "EL PASO OFFERS A CLEANER MARKET THAN ANYWHERE ELSE LEFT ON THE TRAIL.");
        } else {
            await Term.writelns("A MAKESHIFT MARKET STIRS HERE, BUT IT DOES NOT FEEL LIKE A PLACE THAT WANTS TO BE FOUND TWICE.");
        }
        await printTradePrompt();
    }

    async function handleTradeCommand(input: string) {
        if (input === "back") {
            state.canTrade = false;
            state.tradeLocation = "none";
            await Term.writelns("YOU LEAVE THE MARKET AND RETURN TO THE WAGON.");
            if (state.tradeTime === "night") {
                state.phase = "night";
                await printNightPrompt();
            } else {
                await transitionToRations();
            }
            return;
        }

        if (state.tradeLocation === "el-paso") {
            if (state.tradeTime === "day" && input === "food") {
                if (state.cash < 20) {
                    await Term.writelns("YOU DO NOT HAVE $20 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 20;
                state.food += 30;
            } else if (state.tradeTime === "day" && input === "ammo") {
                if (state.cash < 16) {
                    await Term.writelns("YOU DO NOT HAVE $16 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 16;
                state.ammo += 12;
            } else if (state.tradeTime === "day" && input === "supplies") {
                if (state.cash < 24) {
                    await Term.writelns("YOU DO NOT HAVE $24 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 24;
                state.supplies += 8;
            } else if (state.tradeTime === "day" && input === "oil") {
                if (state.cash < 25) {
                    await Term.writelns("YOU DO NOT HAVE $25 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 25;
                state.wardingOil += 1;
            } else if (state.tradeTime === "day" && (input === "grain" || input === "blessed grain")) {
                if (state.cash < 20) {
                    await Term.writelns("YOU DO NOT HAVE $20 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 20;
                state.blessedGrain += 1;
            } else if (state.tradeTime === "night" && input === "charm") {
                if (state.cash < 18) {
                    await Term.writelns("YOU DO NOT HAVE $18 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 18;
                affectCrew({ fear: -10 });
                affectHerd({ stress: -8 });
            } else if (state.tradeTime === "night" && input === "vigil") {
                if (state.cash < 24) {
                    await Term.writelns("YOU DO NOT HAVE $24 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 24;
                state.wagonSanctity += 10;
                state.wardingOil += 1;
                affectCrew({ morale: 1, fear: -3 });
            } else if (state.tradeTime === "night" && input === "tonic") {
                if (state.cash < 20) {
                    await Term.writelns("YOU DO NOT HAVE $20 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 20;
                affectHerd({ health: 8, fatigue: -8 });
            } else if (state.tradeTime === "night" && (input === "grain" || input === "blessed grain")) {
                if (state.cash < 18) {
                    await Term.writelns("YOU DO NOT HAVE $18 FOR THAT TRADE.");
                    await printTradePrompt();
                    return;
                }
                state.cash -= 18;
                state.blessedGrain += 1;
            } else {
                await Term.writelns("THAT OFFER IS NOT AVAILABLE HERE.");
                await printTradePrompt();
                return;
            }

            affectCrew({ morale: 2 });
            recordAction("trade", input, `${state.tradeLocation}:${state.tradeTime}`);
            await Term.writelns(`EL PASO DEAL CLOSED: ${input.toUpperCase()} SECURED.`);
            await printStatus();
            await printTradePrompt();
            return;
        }

        if (damnedTradesRemaining() <= 0) {
            await Term.writelns("THE DAMNED POST HAS NO FURTHER OFFERS FOR YOU. THE NEXT PRICE WOULD NOT LOOK LIKE TRADE.");
            await printTradePrompt();
            return;
        }

        if (state.cattle < 1) {
            await Term.writelns("THE DAMNED POST DEMANDS PAYMENT IN HERD. YOU CANNOT AFFORD IT.");
            await printTradePrompt();
            return;
        }

        let cattleCost = 0;
        if (state.tradeTime === "day" && input === "oil") {
            cattleCost = damnedTradeCost("oil");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            state.wardingOil += 2;
            affectCrew({ fear: 4 });
            await Term.writelns(`YOU TRADE ${cattleCost} HEAD OF CATTLE FOR TWO BOTTLES OF WARDING OIL.`);
        } else if (state.tradeTime === "day" && input === "mirror") {
            cattleCost = damnedTradeCost("mirror");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            affectCrew({ fear: -18, morale: -4 });
            await Term.writelns("A SILVER MIRROR PASSES INTO YOUR HANDS. IT CALMS THE CREW AND UNSETTLES THEM ALL THE SAME.");
        } else if (state.tradeTime === "day" && input === "nails") {
            cattleCost = damnedTradeCost("nails");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            state.supplies += 10;
            state.wagonCondition += 6;
            state.wagonSanctity += 4;
            await Term.writelns("COLD IRON NAILS CHANGE HANDS. THE WAGON FEELS HEAVIER, AND THE DARK KEEPS A LITTLE MORE DISTANCE.");
        } else if (state.tradeTime === "night" && input === "vigil") {
            cattleCost = damnedTradeCost("vigil");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            affectCrew({ fear: -14 });
            state.wagonSanctity += 12;
            await Term.writelns(`THE NIGHT VIGIL TAKES ${cattleCost} HEAD FROM THE HERD AND LEAVES THE CAMP RINGED IN A THIN, SALTY PEACE.`);
        } else if (state.tradeTime === "night" && input === "blessing") {
            cattleCost = damnedTradeCost("blessing");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            affectHerd({ health: 6, blight: -4, stress: -4 });
            const relieved = relieveInfectedCattle(percentOfHerd(10), 10);
            await Term.writelns(`${cattleCost} HEAD ARE LED AWAY. THE REMAINING HERD BREATHES EASIER, AS IF SOMETHING HUNGRIER HAS BEEN FED. ${relieved > 0 ? "THE WORST OF THE INFECTED STOCK SETTLES AFTER." : ""}`.trim());
        } else if (state.tradeTime === "night" && input === "cache") {
            cattleCost = damnedTradeCost("cache");
            if (state.cattle < cattleCost) {
                await Term.writelns(`THE OFFER REQUIRES ${cattleCost} HEAD OF CATTLE.`);
                await printTradePrompt();
                return;
            }
            removeCattle(cattleCost, "dead", "injured", "damned-trade");
            state.food += 60;
            state.supplies += 6;
            await Term.writelns(`${cattleCost} HEAD BUY A CACHE OF FEED AND HARDWARE THAT NO ONE ADMITS WAS HERE A MOMENT AGO.`);
        } else {
            await Term.writelns("THAT OFFER IS NOT AVAILABLE HERE.");
            await printTradePrompt();
            return;
        }

        state.damnedTradeCount += 1;
        recordAction("trade", input, `${state.tradeLocation}:${state.tradeTime}`);
        await printStatus();
        await printTradePrompt();
    }

    async function handleRepairCommand(input: string) {
        if (input === "back") {
            state.phase = "day";
            await Term.writelns("YOU STEP BACK FROM THE WAGON AND RETURN TO TRAIL ORDERS.");
            await printDayPrompt();
            return;
        }

        if (input === "patch") {
            if (state.supplies < 4) {
                await Term.writelns("YOU DO NOT HAVE 4 SUPPLIES FOR A PATCH JOB.");
                await printRepairPrompt();
                return;
            }
            state.supplies -= 4;
            state.wagonCondition += 10;
            affectHerd({ fatigue: -4, stress: -3 });
            recordAction("repair", "patch");
            await Term.writelns("YOU PATCH CRACKED WOOD, REWRAP JOINTS, AND MURMUR WHAT PASSES FOR A BLESSING.");
            await transitionToRations();
            return;
        }

        if (input === "reinforce") {
            if (state.supplies < 8) {
                await Term.writelns("YOU DO NOT HAVE 8 SUPPLIES FOR A FULL REINFORCEMENT.");
                await printRepairPrompt();
                return;
            }
            state.supplies -= 8;
            state.wagonCondition += 22;
            affectCrew({ morale: -2, hunger: 1 });
            affectHerd({ fatigue: -5, health: 3 });
            recordAction("repair", "reinforce");
            applyToCowSubset(chooseCowSubset(percentOfHerd(8), "injured"), cow => {
                cow.health += randInt(3, 6);
                cow.fatigue -= randInt(3, 6);
                if (cow.health >= 65) {
                    cow.injured = false;
                }
            });
            await Term.writelns("YOU SPEND HALF THE DAY REINFORCING THE FRAME UNTIL THE WAGON FEELS LIKE A BARRIER AGAIN.");
            await transitionToRations();
            return;
        }

        if (input === "iron") {
            if (state.supplies < 6) {
                await Term.writelns("YOU DO NOT HAVE 6 SUPPLIES FOR A COLD IRON PATCH.");
                await printRepairPrompt();
                return;
            }
            state.supplies -= 6;
            state.wagonSanctity += 12;
            affectCrew({ fear: -4 });
            affectHerd({ stress: -6, blight: -2 });
            recordAction("repair", "iron");
            const relieved = relieveInfectedCattle(percentOfHerd(8), 7);
            state.pendingMessages.push("COLD IRON PATCHED INTO THE FRAME BLUNTS THE VEIL'S REACH FOR A LITTLE WHILE.");
            await Term.writelns(`YOU HAMMER COLD IRON INTO THE FRAME. THE SOUND MAKES THE NIGHT FEEL FARTHER AWAY.${relieved > 0 ? " SOME OF THE GLASSY-EYED STOCK SETTLES AFTER THE RITE." : ""}`);
            await transitionToRations();
            return;
        }

        await Term.writelns("TYPE PATCH, REINFORCE, IRON, OR BACK.");
        await printRepairPrompt();
    }

    async function handleRationCommand(input: string) {
        if (input === "back") {
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        if (input !== "poor" && input !== "moderate" && input !== "well") {
            await Term.writelns("TYPE POOR, MODERATE, WELL, OR BACK.");
            await printRationsPrompt();
            return;
        }

        state.rationLevel = input;
        state.rationChangedThisWeek = true;
        if (currentRunReport) {
            currentRunReport.counters.rationChoices[input] += 1;
        }
        recordAction("rations", input);
        await Term.writelns(`RATIONS SET TO ${rationLabel()} FOR THIS WEEK. THIS SETTING WILL PERSIST UNTIL YOU CHANGE IT AGAIN.`);
        state.phase = "day";
        await printDayPrompt();
    }

    function applyRations(level: RationLevel) {
        const requiredFood = rationFoodCost(level);
        applyStoredBlightContamination();
        const cleanUsed = Math.min(state.food, requiredFood);
        state.food -= cleanUsed;
        const remainingNeed = requiredFood - cleanUsed;
        const blightedUsed = Math.min(state.blightedFood, remainingNeed);
        state.blightedFood -= blightedUsed;
        if (currentRunReport && blightedUsed > 0) {
            currentRunReport.counters.blight.consumed += blightedUsed;
        }

        if (level === "poor") {
            affectCrew({ morale: -7, fear: 5, hunger: 6, health: -1, loyalty: -2 });
            distributeCrewFood(level);
            affectHerd({ health: -6, stress: 6, fatigue: 5 });
            state.pendingMessages.push("POOR RATIONS KEEP FOOD IN THE WAGON AND MISERY IN THE CREW. HUNGER MAKES EVERY SHADOW FEEL CLOSER.");
        } else if (level === "well") {
            affectCrew({ morale: 6, fear: -5, hunger: -7, health: 2, loyalty: 1 });
            distributeCrewFood(level);
            affectHerd({ health: 4, stress: -6, fatigue: -4 });
            state.pendingMessages.push("WELL-FED CREW. FOR ONE NIGHT, HOPE OUTWEIGHS DREAD.");
        } else {
            affectCrew({ hunger: 1, morale: 2, fear: -1, health: 1 });
            distributeCrewFood(level);
            affectHerd({ health: 1, stress: -1, fatigue: -1 });
            state.pendingMessages.push("MODERATE RATIONS. NOBODY IS HAPPY, BUT NOBODY MUTINIES.");
        }

        if (blightedUsed > 0) {
            applyBlightedMealConsequences(blightedUsed, requiredFood);
        }
    }

    async function handleNightCommand(input: string) {
        state.occultHuntBonus = false;
        state.nightHuntPenalty = false;

        if (input === "campfire") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.campfire += 1;
            }
            recordAction("night", "campfire");
            state.lastNightAction = "campfire";
            affectCrew({ morale: 10, fear: -5, hunger: -1 });
            affectHerd({ stress: -3, fatigue: -2 });
            await Term.writelns("THE CAMPFIRE DRAWS THE CREW TOGETHER.");
            if (chance(28)) {
                affectCrew({ fear: 10, morale: -2 });
                affectHerd({ stress: 16 });
                removeCattle(randInt(2, 7) + herdLossRiskBonus(), "lost", "weakest", "campfire-stampede");
                await Term.writelns("THE FLAMES DRAW GLOAM-WALKERS TO THE EDGE OF CAMP. SOME OF THE HERD BOLTS.");
            }
            await endNight();
            return;
        }

        if (input === "guard") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.guard += 1;
            }
            recordAction("night", "guard");
            state.lastNightAction = "guard";
            const guards = assignGuardDuty();
            affectCrew({ morale: -1, fear: -14, loyalty: 1 });
            affectHerd({ stress: -12, fatigue: -10, health: 2 });
            const calmed = calmTraumatizedCattle(percentOfHerd(10), 11);
            await Term.writelns("DOUBLE GUARD DUTY COSTS REST, BUT IT KEEPS THE CAMP ORDERLY AND THE HERD DOWN OFF ITS NERVES.");
            if (guards.length > 0) {
                await Term.writelns(`${guards.map(member => member.name.split(" ")[0]).join(" AND ")} WALK THE LINE TONIGHT.`);
            }
            if (calmed > 0) {
                await Term.writelns("THE SKITTISH EDGE OF THE HERD SETTLES UNDER A STEADY WATCH.");
            }
            await endNight();
            return;
        }

        if (input === "whiskey") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.whiskey += 1;
            }
            recordAction("night", "whiskey");
            state.lastNightAction = "whiskey";
            if (state.whiskey < 1) {
                await Term.writelns("THE BOTTLE IS DRY.");
                await printNightPrompt();
                return;
            }

            state.whiskey -= 1;
            distributeWhiskey();
            affectHerd({ stress: -8, fatigue: -2 });
            await Term.writelns("THE WHISKEY PUTS A LITTLE FIRE BACK IN THE CREW.");
            await endNight();
            return;
        }

        if (input === "rite" || input === "occultist") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.rite += 1;
            }
            recordAction("night", "rite");
            state.lastNightAction = "rite";
            if (!state.hasOccultist) {
                await Term.writelns("NO RITE IS READY.");
                await printNightPrompt();
                return;
            }

            affectCrew({ morale: -8, fear: -20 });
            state.occultHuntBonus = true;
            affectHerd({ stress: -12, health: -2, fatigue: -1 });
            const relieved = relieveInfectedCattle(percentOfHerd(6), 6);
            const calmed = calmTraumatizedCattle(percentOfHerd(8), 8);
            await Term.writelns("THE RITE NAMES THE THING FOLLOWING THE WAGON. NOBODY SLEEPS BETTER, BUT EVERYONE SLEEPS WARNED.");
            if (relieved > 0 || calmed > 0) {
                await Term.writelns("A FEW OF THE GLASSY-EYED, SKITTISH CATTLE QUIET DOWN AFTER THE RITE.");
            }
            await endNight();
            return;
        }

        if (input === "night") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.night += 1;
            }
            recordAction("night", "night-drive");
            state.lastNightAction = "night";
            state.nightHuntPenalty = true;
            const miles = travelMiles(18, 36);
            const fearGain = 16;
            const wear = randInt(5, 11);
            state.miles += miles;
            affectCrew({ fear: fearGain, morale: -3, hunger: 2, health: -1 });
            state.wagonCondition -= wear;
            affectHerd({
                fatigue: 18,
                stress: 16,
                health: -4,
                blight: state.miles >= 520 ? 2 : 0,
            });
            await Term.writelns(`YOU NIGHT DRIVE THROUGH THE VEIL AND STEAL ${miles} MILES FROM THE DARK.`);
            await Term.writelns(nightDriveLine(wear, fearGain));
            await nightEvent();
            if (state.phase === "encounter") {
                return;
            }
            await reachLandmarks();
            await endNight();
            return;
        }

        if (input === "trade") {
            if (currentRunReport) {
                currentRunReport.counters.nightActions.trade += 1;
            }
            recordAction("night", "trade-entry", state.tradeLocation);
            state.lastDayAction = "trade";
            state.lastNightAction = "trade";
            if (!state.canTrade) {
                await Term.writelns("THERE IS NOWHERE TO TRADE HERE TONIGHT.");
                await printNightPrompt();
                return;
            }
            await enterTrade();
            return;
        }

        await Term.writelns("UNKNOWN WATCH ORDER.");
        await printNightPrompt();
    }

    async function handleBlightCommand(input: string) {
        if (input === "take" || input === "feed") {
            if (currentRunReport) {
                currentRunReport.counters.blight.taken += state.pendingBlightedFood;
            }
            recordAction("blight", "take", `${state.pendingBlightedFood} food`);
            state.blightedFood += state.pendingBlightedFood;
            affectCrew({ fear: 12, morale: -6, health: -4 });
            await Term.writelns(`YOU KEEP ${state.pendingBlightedFood} FOOD AND WRAP IT INTO THE STORES. THE CAMP FEELS WRONG THE MOMENT THE TAINTED MEAT JOINS THE WAGON.`);
            state.pendingBlightedFood = 0;
            await transitionToRations();
            return;
        }

        if (input === "leave" || input === "discard") {
            if (currentRunReport) {
                currentRunReport.counters.blight.left += state.pendingBlightedFood;
            }
            recordAction("blight", "leave", `${state.pendingBlightedFood} food`);
            affectCrew({ morale: -4 });
            await Term.writelns("YOU LEAVE THE BLIGHTED MEAT WHERE IT LIES.");
            state.pendingBlightedFood = 0;
            await transitionToRations();
            return;
        }

        await Term.writelns("TYPE TAKE OR LEAVE.");
        await printBlightPrompt();
    }

    async function handleEncounterCommand(input: string) {
        if (!state.pendingEncounter) {
            state.phase = "day";
            await printDayPrompt();
            return;
        }

        if (state.pendingEncounter === "ash-drowner") {
            if (input === "passage") {
                recordEncounterChoice("ash-drowner", "passage");
                recordAction("encounter", "passage", "ash-drowner");
                if (state.cattle < 8) {
                    await Term.writelns("YOU CANNOT MAKE THAT OFFER. THE HERD IS TOO THIN.");
                    await printEncounterPrompt();
                    return;
                }
                removeCattle(8, "dead", "weakest", "ash-drowner-encounter");
                state.miles += 40;
                affectCrew({ fear: -12 });
                affectHerd({ stress: -16, fatigue: -6 });
                await Term.writelns("EIGHT HEAD WALK INTO THE ASH WITH THE STRANGER. THE TRAIL AHEAD OPENS LIKE IT WAS WAITING FOR PAYMENT.");
            } else if (input === "ward") {
                recordEncounterChoice("ash-drowner", "ward");
                recordAction("encounter", "ward", "ash-drowner");
                if (state.cattle < 6) {
                    await Term.writelns("YOU CANNOT MAKE THAT OFFER. THE HERD IS TOO THIN.");
                    await printEncounterPrompt();
                    return;
                }
                removeCattle(6, "dead", "weakest", "ash-drowner-encounter");
                state.wagonSanctity += 18;
                state.wagonCondition += 8;
                affectHerd({ health: 8, stress: -10, blight: -5 });
                await Term.writelns("SIX HEAD ARE TAKEN BEHIND A SALT CURTAIN. WHAT RETURNS IS SILENCE, AND A STRONGER WARD AROUND YOUR DRIVE.");
            } else if (input === "provender") {
                recordEncounterChoice("ash-drowner", "provender");
                recordAction("encounter", "provender", "ash-drowner");
                if (state.cattle < 5) {
                    await Term.writelns("YOU CANNOT MAKE THAT OFFER. THE HERD IS TOO THIN.");
                    await printEncounterPrompt();
                    return;
                }
                removeCattle(5, "dead", "weakest", "ash-drowner-encounter");
                state.food += 120;
                state.supplies += 10;
                affectHerd({ health: 5, fatigue: -8, stress: -4 });
                await Term.writelns("FIVE HEAD BUY BACK A WEEK OF STRENGTH IN FEED, TOOLS, AND BREATHING ROOM.");
            } else if (input === "refuse") {
                recordEncounterChoice("ash-drowner", "refuse");
                recordAction("encounter", "refuse", "ash-drowner");
                affectCrew({ fear: 8, morale: -4, loyalty: -2 });
                affectHerd({ stress: 14, fatigue: 5 });
                await Term.writelns("YOU KEEP EVERY HEAD, BUT THE THING WALKS THE HERDLINE UNTIL MORNING. NONE OF THE CATTLE FORGET IT.");
            } else {
                await Term.writelns("TYPE PASSAGE, WARD, PROVENDER, OR REFUSE.");
                await printEncounterPrompt();
                return;
            }
        } else if (state.pendingEncounter === "salt-chapel") {
            if (input === "tithe") {
                recordEncounterChoice("salt-chapel", "tithe");
                recordAction("encounter", "tithe", "salt-chapel");
                if (state.cattle < 6) {
                    await Term.writelns("YOU CANNOT MAKE THAT OFFER. THE HERD IS TOO THIN.");
                    await printEncounterPrompt();
                    return;
                }
                removeCattle(6, "dead", "injured", "salt-chapel-encounter");
                state.wagonSanctity += 18;
                affectCrew({ fear: -8 });
                affectHerd({ blight: -6, stress: -4 });
                await Term.writelns("SIX HEAD BLEED INTO SALT THAT SHOULD NOT TAKE LIQUID. THE BELL STOPS MOVING. THE CAMP BREATHES EASIER AFTER.");
            } else if (input === "confess") {
                recordEncounterChoice("salt-chapel", "confess");
                recordAction("encounter", "confess", "salt-chapel");
                affectCrew({ morale: -8, loyalty: -6, fear: -6 });
                state.wagonSanctity += 10;
                affectHerd({ stress: -2 });
                await Term.writelns("THE CREW SPEAKS INTO THE RUIN ONE BY ONE. NOBODY REPEATS WHAT THEY SAID, BUT THE WAGON FEELS LESS EXPOSED AFTER.");
            } else if (input === "pass" || input === "pass by") {
                recordEncounterChoice("salt-chapel", "pass");
                recordAction("encounter", "pass", "salt-chapel");
                affectCrew({ fear: 6 });
                state.wagonSanctity -= 8;
                affectHerd({ blight: 3 });
                await Term.writelns("YOU LEAVE THE CHAPEL TO ITS BELL AND KEEP THE HERD MOVING. THE SOUND FOLLOWS LONGER THAN IT SHOULD.");
            } else {
                await Term.writelns("TYPE TITHE, CONFESS, OR PASS BY.");
                await printEncounterPrompt();
                return;
            }
        } else if (state.pendingEncounter === "hollow-drover") {
            if (input === "follow") {
                recordEncounterChoice("hollow-drover", "follow");
                recordAction("encounter", "follow", "hollow-drover");
                if (chance(60)) {
                    state.miles += 35;
                    addRecoveredCattle(4, false, "hollow-drover-follow");
                    affectCrew({ fear: 8 });
                    affectHerd({ stress: 4 });
                    await Term.writelns("HE LEADS YOU THROUGH A LOW SALT DRAW WHERE STRAYS STILL HUDDLE. SOME OF THEM ANSWER YOUR BRANDS.");
                } else {
                    state.miles += 20;
                    addRecoveredCattle(6, true, "hollow-drover-follow");
                    affectCrew({ fear: 12 });
                    affectHerd({ stress: 6, blight: 5 });
                    applyToCowSubset(chooseCowSubset(percentOfHerd(8), "infected"), cow => {
                        cow.infected = true;
                        cow.blight += randInt(3, 6);
                        cow.stress += randInt(2, 5);
                    });
                    await Term.writelns("THE CATTLE HE RETURNS WALK QUIETLY AND KEEP THEIR EYES TOO LEVEL. THE CREW DOES NOT LIKE THEM.");
                }
            } else if (input === "bargain") {
                recordEncounterChoice("hollow-drover", "bargain");
                recordAction("encounter", "bargain", "hollow-drover");
                if (state.cattle < 4) {
                    await Term.writelns("YOU CANNOT MAKE THAT OFFER. THE HERD IS TOO THIN.");
                    await printEncounterPrompt();
                    return;
                }
                removeCattle(4, "dead", "injured", "hollow-drover-encounter");
                affectCrew({ fear: -10 });
                affectHerd({ stress: -8 });
                state.supplies += 8;
                state.wagonSanctity += 6;
                await Term.writelns("HE TAKES PAYMENT WITHOUT TOUCHING THE ROPE. THE HERD SETTLES AFTER, AS IF SOMETHING FOLLOWING YOU HAS BEEN FED ELSEWHERE.");
            } else if (input === "drive off" || input === "drive") {
                recordEncounterChoice("hollow-drover", "drive-off");
                recordAction("encounter", "drive-off", "hollow-drover");
                affectCrew({ fear: 5 });
                affectHerd({ stress: 5 });
                await Term.writelns("YOU TURN THE HERD AWAY FROM HIM AND DO NOT LOOK BACK. NOBODY SAYS WHAT THEY HEARD IN HIS VOICE.");
            } else {
                await Term.writelns("TYPE FOLLOW, BARGAIN, OR DRIVE OFF.");
                await printEncounterPrompt();
                return;
            }
        }

        state.pendingEncounter = null;
        await reachLandmarks();
        await transitionToRations();
    }

    async function transitionToRations() {
        normalizeState();
        if (await evaluateEndings()) {
            return;
        }

        applyRations(state.rationLevel);
        normalizeState();
        if (await evaluateEndings()) {
            return;
        }

        state.phase = "night";
        await printStatus();
        await printEnvironment(environmentLines());
        await printNightPrompt();
    }

    async function endNight() {
        resolveNightDecay();
        resolveCrewConsequences();
        normalizeState();
        resolveCrewRolePassives();
        normalizeState();
        if (await evaluateEndings()) {
            return;
        }

        state.week += 1;
        state.recentCattleLossWeeks = Math.max(0, state.recentCattleLossWeeks - 1);
        state.rationChangedThisWeek = false;
        clearScoutRoutePlan();
        state.phase = state.pendingScoutEncounter ? "scout" : "day";
        captureRunSnapshot("week-start");
        await printStatus();
        await printEnvironment(environmentLines());
        if (state.phase === "scout") {
            await printScoutPrompt();
        } else {
            await printDayPrompt();
        }
    }

    function normalizeState() {
        state.wagonCondition = clamp(state.wagonCondition, 0, 100);
        state.wagonSanctity = clamp(state.wagonSanctity, 0, 100);
        state.food = Math.max(0, state.food);
        state.blightedFood = Math.max(0, state.blightedFood);
        state.supplies = Math.max(0, state.supplies);
        state.ammo = Math.max(0, state.ammo);
        state.whiskey = Math.max(0, state.whiskey);
        state.blessedGrain = Math.max(0, state.blessedGrain);
        state.wardingOil = Math.max(0, state.wardingOil);
        state.cash = Math.max(0, state.cash);
        state.pendingBlightedFood = Math.max(0, state.pendingBlightedFood);
        state.pendingScoutDetourMiles = Math.max(0, state.pendingScoutDetourMiles);
        syncCrewSummary();
        syncHerdSummary();
        updateRunPeaks();
    }

    function resolveNightDecay() {
        affectCrew({ fear: 4, hunger: 1 });
        state.wagonSanctity -= 4;
        const ambient = westwardAmbientPressure();
        if (ambient.sanctity !== 0) {
            state.wagonSanctity += ambient.sanctity;
        }
        if (ambient.fear !== 0) {
            affectCrew({ fear: ambient.fear });
        }
        affectHerd({
            stress: 3 + ambient.herdStress + (state.fear >= 60 ? 2 : 0),
            fatigue: nightlyFatigueShift(),
            blight: (state.miles >= 520 ? 1 : 0) + ambient.herdBlight,
        });
        if (state.miles < 310) {
            state.pendingMessages.push("CAUSE: ANOTHER EXPOSED NIGHT ON THE TRAIL LEAVES THE CREW RESTLESS AND DIMS THE WAGON'S SANCTITY.");
        } else if (ambient.label === "western") {
            state.pendingMessages.push("CAUSE: THE WESTERN DARK PRESSES CLOSER EACH NIGHT AND STRAINS THE WAGON'S WARDING.");
        } else if (ambient.label === "staked-plains") {
            state.pendingMessages.push("CAUSE: EVEN A STILL WEEK DRAWS A PRICE OUT HERE. THE STAKED PLAINS WORK ON SANCTITY AND BLIGHT WHETHER YOU PUSH MILES OR NOT.");
        } else {
            state.pendingMessages.push("CAUSE: THIS FAR WEST, THE TRAIL ITSELF WEARS ON THE DRIVE. EVEN RESTED WEEKS FEED FEAR, BLIGHT, AND THE LOSS OF SANCTITY.");
        }

        if (chance(30)) {
            if (state.wardingOil > 0) {
                state.wardingOil -= 1;
                affectCrew({ fear: -4 });
                state.pendingMessages.push("WARDING OIL FLARES ALONG THE IRON AND DRIVES THE RUST-MOTHS OFF FOR ONE MORE NIGHT.");
            } else {
                state.wagonCondition -= 8;
                state.pendingMessages.push("CAUSE: RUST-MOTHS WORK THE IRON WHILE THE CAMP SLEEPS.");
            }
        }

        if (state.wagonCondition < 45) {
            state.wagonSanctity -= 3;
            state.pendingMessages.push("CAUSE: THE FRAME IS DAMAGED ENOUGH THAT THE WAGON CAN NO LONGER HOLD ITS WARDS AS WELL.");
        }

        if (!designatedDrover()) {
            affectHerd({ stress: 4, fatigue: 3, health: -1 });
            state.pendingMessages.push("CAUSE: WITH NO TRUE DROVER LEFT, THE HERD STARTS LOSING DISCIPLINE EVEN ON QUIETER WEEKS.");
        }

        if (!designatedHand()) {
            state.wagonCondition -= 5;
            state.pendingMessages.push("CAUSE: WITH NO TRUE HAND LEFT, BOLTS LOOSEN, WOOD WARPS, AND THE WAGON WEARS FASTER.");
        }

        if (state.wagonSanctity < 50) {
            affectCrew({ fear: 8, morale: -2 });
            state.pendingMessages.push("CAUSE: THE WAGON FEELS THIN AND EXPOSED. THE CREW CAN SENSE THE SANCTITY FAILING.");
        }

        const starvingCrew = livingCrew().filter(member => member.hunger >= 85);
        if (starvingCrew.length > 0) {
            for (const member of starvingCrew) {
                const healthLoss =
                    member.hunger >= 95 ? randInt(3, 5) :
                    member.hunger >= 90 ? randInt(2, 4) :
                    randInt(1, 2);
                member.health -= healthLoss;
                member.morale -= randInt(1, 3);
                updateCrewMember(member);
            }

            syncCrewSummary();
            const names = formatNameList(starvingCrew.map(member => crewFirstName(member)));
            const verb = starvingCrew.length === 1 ? "IS" : "ARE";
            state.pendingMessages.push(`CAUSE: ${names} ${verb} STARVING BADLY ENOUGH THAT THEIR HEALTH STARTS TO FAIL.`);
        }

        if (state.food === 0 && state.blightedFood === 0) {
            const hungryTargets = chooseCowSubset(percentOfHerd(18), "weakest");
            affectCrew({ morale: -12, fear: 6, hunger: 8, health: -2, loyalty: -3 });
            affectHerd({ health: -4, stress: 5, fatigue: 4 });
            applyToCowSubset(hungryTargets, cow => {
                cow.health -= randInt(6, 11);
                cow.stress += randInt(4, 8);
                cow.fatigue += randInt(3, 6);
                cow.injured = cow.injured || cow.health < 48;
            });
            state.pendingMessages.push(`CAUSE: THE CREW GOES TO SLEEP HUNGRY. ${describeCowSubset(hungryTargets).toUpperCase()} TAKE THE WORST OF IT.`);
        }

        if (state.lastDayAction === "travel" && chance(24)) {
            state.pendingMessages.push("CAUSE: THE LONG DRIVE WEARS ON THE CREW WORSE THAN THEY LET ON.");
            affectCrew({ morale: -4, health: -1, hunger: 2 });
        }

        if (state.fear >= 75) {
            const fearTargets = chooseCowSubset(percentOfHerd(16), "stressed");
            affectHerd({ stress: 2 });
            applyToCowSubset(fearTargets, cow => {
                cow.stress += randInt(4, 7);
                cow.trauma = clampStat(cow.trauma + randInt(2, 5));
                if (cow.fatigue > 60) {
                    cow.health -= 1;
                }
            });
            state.pendingMessages.push(`CAUSE: THE CREW'S FEAR PASSES INTO THE HERD. ${describeCowSubset(fearTargets).toUpperCase()} STARTLE FIRST.`);
        }

        if (state.morale <= 22) {
            const mishandled = chooseCowSubset(percentOfHerd(10), "mixed");
            applyToCowSubset(mishandled, cow => {
                cow.stress += randInt(2, 4);
                cow.trauma = clampStat(cow.trauma + randInt(1, 3));
            });
            state.pendingMessages.push(`CAUSE: A SHAKEN CREW HANDLES THE HERD BADLY. ${describeCowSubset(mishandled).toUpperCase()} FEEL IT FIRST.`);
        }

        resolveHerdConsequences();
    }

    function resolveHerdConsequences() {
        const guardedNight = state.lastNightAction === "guard";
        const fatigueTargets = chooseCowSubset(percentOfHerd(guardedNight ? 6 : 10), "fatigued");
        const blightTargets = chooseCowSubset(percentOfHerd(10), "blighted");

        if (state.herdFatigue >= 72) {
            applyToCowSubset(fatigueTargets, cow => {
                cow.health -= guardedNight ? randInt(2, 4) : randInt(4, 7);
                cow.fatigue += guardedNight ? randInt(0, 1) : randInt(1, 4);
                cow.injured = cow.injured || cow.health < 50;
            });
            state.pendingMessages.push(guardedNight
                ? `CAUSE: THE HERD WAS ALREADY RUN HARD BEFORE NIGHTFALL. GUARD DUTY HELPS, BUT ${describeCowSubset(fatigueTargets).toUpperCase()} STILL PAY FOR EARLIER STRAIN.`
                : `CAUSE: THE HERD IS RUN TOO HARD. ${describeCowSubset(fatigueTargets).toUpperCase()} START FALLING BEHIND.`);
        } else if (state.herdFatigue >= 55) {
            applyToCowSubset(chooseCowSubset(percentOfHerd(guardedNight ? 4 : 8), "fatigued"), cow => {
                cow.health -= guardedNight ? randInt(0, 1) : randInt(1, 3);
            });
        }

        if (state.herdBlight >= 40) {
            applyToCowSubset(blightTargets, cow => {
                cow.health -= randInt(3, 6);
                cow.stress += randInt(2, 5);
                cow.blight += randInt(2, 5);
                cow.infected = true;
            });
            state.pendingMessages.push(`CAUSE: SOMETHING WRONG HAS STARTED MOVING THROUGH THE HERD. ${describeCowSubset(blightTargets).toUpperCase()} DEGRADE FASTEST.`);
        }

        const collapseTargets = chooseCowSubset(percentOfHerd(guardedNight ? 4 : 7), "weakest");
        applyToCowSubset(collapseTargets, cow => {
            if (cow.health < 22) {
                cow.health -= randInt(2, 5);
            }
        });

        const collapsed = markDeadIfCollapsed(collapseTargets);
        if (collapsed > 0) {
            recordCattleLoss(collapsed, "night-collapse", "dead", "collapsed");
            state.pendingMessages.push(guardedNight
                ? `HERD LOSS: ${collapsed} HEAD FROM ${describeCowSubset(collapseTargets).toUpperCase()} STILL GIVE OUT OVERNIGHT. THE GUARD LINE HELD THE CAMP TOGETHER, BUT IT COULD NOT UNDO EARLIER STRAIN.`
                : `HERD LOSS: ${collapsed} HEAD FROM ${describeCowSubset(collapseTargets).toUpperCase()} GIVE OUT FROM SICKNESS, LAMENESS, OR SHEER EXHAUSTION.`);
        }

        if (state.herdStress >= 76 && chance(14 + herdLossRiskBonus())) {
            const panicked = chooseCowSubset(randInt(3, 8) + Math.floor((state.herdStress - 70) / 10), "stressed");
            applyToCowSubset(panicked, cow => {
                cow.stress += randInt(5, 9);
                cow.fatigue += randInt(2, 5);
                cow.trauma = clampStat(cow.trauma + randInt(4, 7));
            });
            const lost = removeCattle(panicked.length, "lost", "weakest", "night-panic");
            if (lost > 0) {
                state.pendingMessages.push(`HERD LOSS: ${lost} HEAD FROM ${describeCowSubset(panicked).toUpperCase()} BOLT INTO THE DARK WHEN THE LINE LOSES ITS NERVE.`);
            }
        }

        resolveCowTags();
    }

    async function trailEvent(blockedEncounter: EncounterType = null) {
        const location = locationName();

        if (location === "SAN ANTONIO" || state.miles < 120) {
            if (chance(24)) {
                await hummingRustEvent();
            } else if (chance(16)) {
                await thirstyCrossingEvent();
            }
            return;
        }

        if (location === "EL PASO") {
            if (chance(15)) {
                await mirrorTwinEvent();
            }
            return;
        }

        if (location === "STAKED PLAINS") {
            if (chance(30)) {
                await circlesEvent();
                return;
            }
        }

        if (blockedEncounter !== "salt-chapel" && state.miles >= 520 && (state.wagonSanctity <= 55 || state.herdBlight >= 20 || state.fear >= 45) && chance(16)) {
            await saltChapelEncounter();
        } else if (blockedEncounter !== "ash-drowner" && state.miles >= 520 && (state.fear >= 45 || state.herdStress >= 55 || state.wagonSanctity <= 55) && chance(18)) {
            await ashDrownerEncounter();
        } else if (blockedEncounter !== "hollow-drover" && state.miles >= 310 && (state.recentCattleLossWeeks > 0 || state.herdStress >= 45 || state.fear >= 40) && chance(12)) {
            await hollowDroverEncounter();
        } else if (chance(22)) {
            await bloodRainEvent();
        } else if (chance(20)) {
            await gravityHiccupEvent();
        } else if (chance(18)) {
            await whisperingCacheEvent();
        } else if (chance(18)) {
            await hoofRotEvent();
        } else if (chance(16)) {
            await driftEvent();
        }
    }

    async function nightEvent() {
        if (chance(50)) {
            if (chance(55)) {
                await howlingEvent();
            } else {
                await bloodRainEvent();
            }
        }
    }

    async function hummingRustEvent() {
        recordEvent("humming-rust", "The Humming Rust", "", "day");
        state.supplies -= 8;
        affectCrew({ morale: -4 });
        await Term.writelns("EVENT: THE HUMMING RUST.");
        await Term.writelns("THE WHEELS START TO SING. YOU BURN SUPPLIES MUFFLING THE AXLES BEFORE THE RUST-MOTHS CAN FEED.");
        await Term.writelns("EFFECT: YOU SPEND SUPPLIES AND SPIRIT TO STOP A WORSE LOSS.");
    }

    async function gravityHiccupEvent() {
        recordEvent("gravity-hiccup", "The Gravity Hiccup", "", "day");
        state.wagonCondition -= 12;
        affectCrew({ morale: -6, fear: 3, health: -1 });
        affectHerd({ stress: 7, health: -4, fatigue: 4 });
        await Term.writelns("EVENT: THE GRAVITY HICCUP.");
        await Term.writelns("FOR ONE HOUR THE WAGON GLIDES WEIGHTLESSLY. WHEN IT FALLS BACK TO EARTH, THE FRAME PAYS THE PRICE.");
        await Term.writelns("EFFECT: THE IMPACT HITS BOTH THE WAGON AND THE CREW HARD.");
    }

    async function bloodRainEvent() {
        recordEvent("blood-rain", "Blood-Rain", "", state.phase === "night" ? "night" : "day");
        state.wagonCondition -= 15;
        affectCrew({ morale: -6, fear: 4, health: -1 });
        affectHerd({ stress: 10, health: -3, blight: 4 });
        await Term.writelns("EVENT: BLOOD-RAIN.");
        if (state.miles < 520) {
            await Term.writelns("A LOCALIZED STORM FALLS RED AND VISCID. THE WAGON COVER HISSSES UNDER IT.");
        } else {
            await Term.writelns("THE RAIN COMES DOWN LIKE THIN BLOOD. IT EATS AT THE WAGON WHILE THE CREW PRETENDS NOT TO PRAY.");
        }
        await Term.writelns("EFFECT: THE STORM CHEWS UP THE WAGON AND LEAVES THE CREW SHAKEN.");
    }

    async function whisperingCacheEvent() {
        recordEvent("whispering-cache", "The Whispering Cache", "", "day");
        state.food += 35;
        state.supplies += 4;
        affectCrew({ fear: 15, morale: -1 });
        affectHerd({ stress: 5 });
        await Term.writelns("EVENT: THE WHISPERING CACHE.");
        await Term.writelns("YOU BREAK THE SALT SEAL AND TAKE THE GOODS. THE CREW DOES NOT LIKE WHAT THE CRATE WHISPERS BACK.");
        await Term.writelns("EFFECT: THE CACHE HELPS YOU, BUT IT LEAVES THE CREW BADLY UNSETTLED.");
    }

    async function mirrorTwinEvent() {
        recordEvent("mirror-twin", "The Mirror-Twin", "", "day");
        affectCrew({ fear: 12, morale: -5 });
        affectHerd({ stress: 6 });
        await Term.writelns("EVENT: THE MIRROR-TWIN.");
        await Term.writelns("SOMEONE ON THE TRAIL LOOKS EXACTLY LIKE ONE OF YOUR HANDS. YOU DO NOT STOP, BUT NOBODY TALKS ABOUT IT AFTER.");
        await Term.writelns("EFFECT: THE ENCOUNTER LEAVES THE CREW SHAKEN.");
    }

    async function circlesEvent() {
        recordEvent("lost-in-the-staked-plains", "Lost In The Staked Plains", "", "day");
        affectCrew({ fear: 14, morale: -2 });
        state.miles = Math.max(0, state.miles - 20);
        affectHerd({ fatigue: 8, stress: 10 });
        await Term.writelns("EVENT: LOST IN THE STAKED PLAINS.");
        await Term.writelns("THE LANDSCAPE FOLDS BACK ON ITSELF. YOU REALIZE TOO LATE THAT YOU HAVE DRIVEN PART OF THE DAY IN A CIRCLE.");
        await Term.writelns("EFFECT: YOU LOSE GROUND AND THE CREW LOSES ITS BEARING.");
    }

    async function howlingEvent() {
        recordEvent("howling-in-the-dark", "Howling In The Dark", "", "night");
        affectCrew({ fear: 12 });
        affectHerd({ stress: 12 });
        await Term.writelns("EVENT: HOWLING IN THE DARK.");
        if (state.miles < 520) {
            await Term.writelns("SOMETHING BEYOND THE FIRELIGHT CALLS TO THE HERD.");
        } else {
            await Term.writelns("THE HOWLING IS CLOSER NOW, AND THE CATTLE RECOGNIZE IT BEFORE THE CREW DOES.");
        }
        await Term.writelns("EFFECT: THE SOUND PUTS THE HERD ON EDGE.");
        await stampedeCheck();
    }

    async function stampedeCheck() {
        if (state.fear <= 70 && state.herdStress <= 65) {
            await Term.writelns("THE CATTLE SHIVER BUT HOLD THEIR GROUND.");
            return;
        }

        let lost = Math.max(4, Math.round(state.cattle * ((Math.max(state.fear, state.herdStress) - 55) / 220)));

        if (state.morale >= 65) {
            lost = Math.max(1, Math.floor(lost * 0.6));
            await Term.writelns("HIGH MORALE LETS THE CREW CALM PART OF THE HERD.");
        }

        applyToCowSubset(chooseCowSubset(Math.max(lost * 3, percentOfHerd(10)), "stressed"), cow => {
            cow.stress += randInt(8, 16);
            cow.fatigue += randInt(4, 9);
        });

        if (state.blessedGrain > 0) {
            state.blessedGrain -= 1;
            lost = Math.max(0, lost - 10);
            applyToCowSubset(chooseCowSubset(percentOfHerd(8), "stressed"), cow => {
                cow.stress -= randInt(10, 18);
                cow.fatigue -= randInt(2, 5);
            });
            await Term.writelns("YOU THROW BLESSED GRAIN AND STEADY THE FRONT OF THE DRIVE.");
        }

        const doomed = chooseCowSubset(lost, "stressed");
        applyToCowSubset(doomed, cow => {
            cow.stress += randInt(10, 18);
            cow.fatigue += randInt(6, 10);
            cow.health -= randInt(6, 14);
        });
        const actuallyLost = removeCattle(doomed.length, "lost", "weakest", "stampede");
        affectHerd({ stress: 8, fatigue: 6 });
        await Term.writelns(`STAMPEDE. YOU LOSE ${actuallyLost} HEAD OF CATTLE.`);
    }

    async function thirstyCrossingEvent() {
        recordEvent("thirsty-crossing", "Thirsty Crossing", "", "day");
        affectHerd({ health: -3, fatigue: 4, stress: 3 });
        const thirsty = chooseCowSubset(percentOfHerd(20), "fatigued");
        applyToCowSubset(thirsty, cow => {
            cow.health -= randInt(5, 9);
            cow.fatigue += randInt(6, 10);
            cow.stress += randInt(3, 6);
        });
        await Term.writelns("EVENT: THIRSTY CROSSING.");
        await Term.writelns("THE WATER HOLE FAILS YOU. THE HERD HAS TO PUSH DRY MILES BEFORE IT CAN DRINK AGAIN.");
        await Term.writelns(`EFFECT: ${describeCowSubset(thirsty).toUpperCase()} COME OUT OF THE DAY THINNER, SLOWER, AND EASIER TO RATTLE.`);
    }

    async function hoofRotEvent() {
        recordEvent("hoof-rot", "Hoof Rot", "", "day");
        affectHerd({ health: -3, fatigue: 2 });
        const afflicted = chooseCowSubset(percentOfHerd(12), "weakest");
        applyToCowSubset(afflicted, cow => {
            cow.health -= randInt(8, 14);
            cow.fatigue += randInt(4, 8);
            cow.stress += randInt(2, 5);
            cow.injured = true;
            if (cow.health < 50) {
                cow.condition = "maimed";
            }
        });
        await Term.writelns("EVENT: HOOF ROT.");
        await Term.writelns("MUD AND BAD GROUND GET INTO THE HOOVES. A PORTION OF THE HERD STARTS MOVING WITH A BAD STAGGER.");
        await Term.writelns(`EFFECT: ${describeCowSubset(afflicted).toUpperCase()} TAKE THE WORST OF IT. IF YOU KEEP PUSHING HARD, LOSSES WILL FOLLOW.`);
    }

    async function driftEvent() {
        recordEvent("night-drift", "Night Drift", "", "day");
        affectHerd({ stress: 6, fatigue: 2 });
        const drifting = chooseCowSubset(percentOfHerd(15), "stressed");
        applyToCowSubset(drifting, cow => {
            cow.stress += randInt(8, 14);
            cow.fatigue += randInt(2, 5);
            cow.trauma = clampStat(cow.trauma + randInt(3, 7));
        });
        await Term.writelns("EVENT: NIGHT DRIFT.");
        await Term.writelns("A FRACTION OF THE HERD STARTS FOLLOWING SOMETHING OFF THE MAIN LINE. YOU GET THEM BACK, BUT NOT CLEANLY.");
        await Term.writelns(`EFFECT: ${describeCowSubset(drifting).toUpperCase()} ARE MUCH HARDER TO CONTROL NOW.`);
    }

    async function ashDrownerEncounter() {
        recordEvent("ash-drowner", "The Ash-Drowner", "", "encounter");
        state.pendingEncounter = "ash-drowner";
        state.phase = "encounter";
        await Term.writelns("ENCOUNTER: THE ASH-DROWNER.");
        await Term.writelns("AFTER EL PASO, THE TRAIL FINDS NEW WAYS TO CHARGE TOLL. THIS THING WANTS PAYMENT IN HERD.");
        await printEncounterPrompt();
    }

    async function saltChapelEncounter() {
        recordEvent("salt-chapel", "The Salt Chapel", "", "encounter");
        state.pendingEncounter = "salt-chapel";
        state.phase = "encounter";
        await Term.writelns("ENCOUNTER: THE SALT CHAPEL.");
        await Term.writelns("A WHITE RUIN SITS OFF THE TRAIL LIKE IT WAS LEFT FOR SOMETHING TALLER THAN MEN.");
        await Term.writelns("ITS BELL MOVES WITHOUT WIND. ITS ALTAR IS CLEAN.");
        await Term.writelns("THE PLACE OFFERS WARDING, BUT IT DOES NOT OFFER IT FOR FREE.");
        await printEncounterPrompt();
    }

    async function hollowDroverEncounter() {
        recordEvent("hollow-drover", "The Hollow Drover", "", "encounter");
        state.pendingEncounter = "hollow-drover";
        state.phase = "encounter";
        await Term.writelns("ENCOUNTER: THE HOLLOW DROVER.");
        await Term.writelns("A RIDER PACES YOUR HERD WITHOUT LEAVING TRACKS.");
        await Term.writelns("HE NAMES CATTLE YOU LOST WEEKS AGO AND CLAIMS THEY ARE STILL WALKING, JUST NOT WITH YOU.");
        await Term.writelns("HE OFFERS TO SHOW YOU WHERE THE TRAIL THINNED WRONG.");
        await printEncounterPrompt();
    }

    async function reachLandmarks() {
        applyCrewTrailExperience();
        for (const landmark of LANDMARKS) {
            if (state.miles >= landmark.mile && !state.reachedLandmarks.includes(landmark.name)) {
                state.reachedLandmarks.push(landmark.name);
                recordEvent(`landmark:${landmark.name.toLowerCase().replace(/\s+/g, "-")}`, `Landmark Reached: ${landmark.name}`, "", "system");
                await printBlock(["", ...landmark.onReach(state), ""]);
            }
        }
    }

    async function evaluateEndings(): Promise<boolean> {
        normalizeState();

        while (state.pendingMessages.length > 0) {
            const message = state.pendingMessages.shift();
            if (message) {
                await Term.writelns(message);
            }
        }

        if (state.cattle <= 0) {
            runResolution = { outcome: "failure", failureCause: "herd-lost" };
            await printBlock([
                "",
                "FAILURE: HERD LOST.",
                "THE DRIVE IS OVER.",
                "YOU HAVE NO CATTLE LEFT TO DELIVER. THE TRAIL TAKES THE REST.",
            ]);
            await stop();
            return true;
        }

        if (state.morale <= 0 && state.fear >= 70) {
            runResolution = { outcome: "failure", failureCause: "crew-breaks" };
            await printBlock([
                "",
                "FAILURE: THE CREW BREAKS.",
                "THE CREW HITS A BREAKING POINT.",
                "SOME VANISH INTO THE NIGHT. SOME STARE BACK FROM THE DARK WITH THE WRONG EYES.",
            ]);
            await stop();
            return true;
        }

        if (state.wagonCondition <= 0) {
            runResolution = { outcome: "failure", failureCause: "wagon-breaks" };
            await printBlock([
                "",
                "FAILURE: WAGON BREAKS.",
                "THE WAGON FRAME GIVES OUT.",
                "WITHOUT THE WAGON, THE DRIVE CANNOT CONTINUE.",
            ]);
            await stop();
            return true;
        }

        if (state.wagonSanctity <= 0) {
            runResolution = { outcome: "failure", failureCause: "sanctity-collapses" };
            await printBlock([
                "",
                "FAILURE: SANCTITY COLLAPSES.",
                "THE WAGON'S WARDING FAILS.",
                "ONCE THE BARRIER GOES DARK, THE VEIL DOES THE REST.",
            ]);
            await stop();
            return true;
        }

        if (state.week > 20 && state.food <= 0) {
            runResolution = { outcome: "failure", failureCause: "drive-stalls" };
            await printBlock([
                "",
                "FAILURE: THE DRIVE STALLS.",
                "THE DRIVE COLLAPSES UNDER HUNGER AND DELAY.",
                "YOU STILL HAVE CATTLE, BUT NOT A CARAVAN CAPABLE OF FINISHING THE TRAIL.",
            ]);
            await stop();
            return true;
        }

        if (state.miles >= state.destinationMiles) {
            runResolution = { outcome: "victory", failureCause: null };
            await printBlock(["", "ARRIVAL: THE SILVER FOLD.", "YOU HAVE REACHED THE SILVER FOLD."]);
            if (state.cattle >= 500 && state.fear < 60 && state.morale > 40) {
                await Term.writelns("THE HERD ARRIVES WHOLE ENOUGH TO FEEL LIKE A MIRACLE.");
            } else if (state.cattle >= 350) {
                await Term.writelns("YOU DELIVER A WOUNDED BUT LIVING HERD. SURVIVAL IS NOT CLEAN, BUT IT COUNTS.");
            } else {
                await Term.writelns("YOU REACH SANCTUARY WITH TOO LITTLE LEFT TO CALL IT A VICTORY.");
            }

            const composition = herdCompositionLine("arrival");
            if (composition) {
                await Term.writelns(composition);
            }

            if (state.fear >= 80 || state.morale <= 20) {
                await Term.writelns("THE ENDING IS SOUR: WHATEVER FOLLOWED YOU WEST MAY HAVE CROSSED THE GATE WITH YOU.");
            }

            await stop();
            return true;
        }

        return false;
    }

    function autocomplete(input: string): string | null {
        const raw = input;
        const trimmedStart = raw.replace(/^\s+/, "");
        const options = getAutocompleteOptions();
        const metaCommands = new Set(["status", "help", "quit"]);

        if (trimmedStart.length === 0) {
            return null;
        }

        const normalizedInput = trimmedStart.toLowerCase().replace(/\s+/g, " ").trim();
        const exactPhraseMatches = options.filter(option => option.startsWith(normalizedInput));
        if (exactPhraseMatches.length !== 1) {
            const nonMetaPhraseMatches = exactPhraseMatches.filter(option => !metaCommands.has(option));
            if (nonMetaPhraseMatches.length === 1) {
                return raw.replace(/\S.*$/, nonMetaPhraseMatches[0].toUpperCase()) || nonMetaPhraseMatches[0].toUpperCase();
            }
        } else {
            return raw.replace(/\S.*$/, exactPhraseMatches[0].toUpperCase()) || exactPhraseMatches[0].toUpperCase();
        }

        const parts = normalizedInput.split(/\s+/);
        const last = parts[parts.length - 1].toLowerCase();

        if (/^\d+$/.test(last)) {
            return null;
        }

        const matches = options.filter(option => option.startsWith(last));
        if (matches.length !== 1) {
            const nonMetaMatches = matches.filter(option => !metaCommands.has(option));
            if (nonMetaMatches.length !== 1) {
                return null;
            }
            parts[parts.length - 1] = nonMetaMatches[0];
            return raw.replace(/\S+$/, nonMetaMatches[0].toUpperCase()) || parts.join(" ").toUpperCase();
        }

        parts[parts.length - 1] = matches[0];
        return raw.replace(/\S+$/, matches[0].toUpperCase()) || parts.join(" ").toUpperCase();
    }

    function getAutocompleteOptions(): string[] {
        if (state.phase === "outfit") {
            if (state.pendingPurchaseItem) {
                return [];
            }
            return [
                "buy",
                "buy food",
                "buy ammo",
                "buy supplies",
                "buy whiskey",
                "buy blessed grain",
                "buy warding oil",
                "food",
                "ammo",
                "supplies",
                "whiskey",
                "blessed grain",
                "warding oil",
                "grain",
                "oil",
                "start",
                "status",
                "help",
                "quit",
            ];
        }

        if (state.phase === "day") {
            return availableDayCommands();
        }

        if (state.phase === "repair") {
            return ["patch", "reinforce", "iron", "back", "status", "help", "quit"];
        }

        if (state.phase === "trade") {
            if (state.tradeLocation === "el-paso") {
                return state.tradeTime === "day"
                    ? ["food", "ammo", "supplies", "oil", "grain", "blessed grain", "warding oil", "back", "status", "help", "quit"]
                    : ["charm", "vigil", "tonic", "grain", "blessed grain", "back", "status", "help", "quit"];
            }
            return state.tradeTime === "day"
                ? ["oil", "mirror", "nails", "back", "status", "help", "quit"]
                : ["vigil", "blessing", "cache", "back", "status", "help", "quit"];
        }

        if (state.phase === "rations") {
            return ["poor", "moderate", "well", "back", "status", "help", "quit"];
        }

        if (state.phase === "night") {
            const options = ["campfire", "guard", "whiskey", "rite", "night", "status", "help", "quit"];
            if (state.canTrade) {
                options.splice(4, 0, "trade");
            }
            return options;
        }

        if (state.phase === "blight") {
            return ["take", "leave", "status", "help", "quit"];
        }

        if (state.phase === "encounter") {
            if (state.pendingEncounter === "salt-chapel") {
                return ["tithe", "confess", "pass by", "pass", "status", "help", "quit"];
            }
            if (state.pendingEncounter === "hollow-drover") {
                return ["follow", "bargain", "drive off", "drive", "status", "help", "quit"];
            }
            return ["passage", "ward", "provender", "refuse", "status", "help", "quit"];
        }

        if (state.phase === "scout") {
            return ["face it", "face", "detour", "long way", "status", "help", "quit"];
        }

        return [];
    }

    const api: DeadwoodGameApi = {
        start,
        handleInput,
        isActive: () => state.active,
        stop,
        autocomplete,
    };

    root.DeadwoodGame = api;
    App.deadwood = api;
})();

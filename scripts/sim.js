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

function round(value, digits = 2) {
    return Number(value.toFixed(digits));
}

function standardDeviation(values) {
    if (values.length <= 1) {
        return 0;
    }

    const mean = average(values);
    const variance = average(values.map(value => (value - mean) ** 2));
    return Math.sqrt(variance);
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

function createSilentTerm(captureLog = false) {
    const lines = [];

    return {
        lines,
        term: {
            clearScreen: () => undefined,
            prompt: () => undefined,
            hidePrompt: () => undefined,
            writelns: async text => {
                if (captureLog) {
                    lines.push(text);
                }
            },
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

const POLICY_PROFILES = {
    cautious: {
        name: "cautious",
        outfit: { food: 190, ammo: 18, supplies: 28, whiskey: 1, grain: 2, oil: 3 },
        ration: { poorAt: 18, wellAt: 120, fearForWell: 44, moraleForWell: 58, fatigueForWell: 48 },
        repair: { dayConditionAt: 60, daySanctityAt: 62, ironAt: 58, reinforceAt: 48, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 58, detourSanctityAt: 60, detourStressAt: 50, detourBlightAt: 18, detourFearAt: 50 },
        blight: { takeAtFood: 10, takeAtFoodNoAmmo: 20 },
        day: { tradeFoodAt: 90, tradeAmmoAt: 10, tradeSuppliesAt: 10, tradeSanctityAt: 68, damnedTradeFoodAt: 16, damnedTradeSanctityAt: 34, huntFoodAt: 28, restFatigueAt: 58, restHealthAt: 50, restFearAt: 66, restMoraleAt: 38, slaughterFoodAt: 8 },
        night: { tradeSanctityAt: 60, tradeHealthAt: 56, tradeFearAt: 62, riteSanctityAt: 32, riteFearAt: 78, guardStressAt: 48, guardFatigueAt: 52, guardFearAt: 48, whiskeyMoraleAt: 24, whiskeyFearMax: 70, nightWeekAt: 14, nightMilesPerWeek: 38, nightFearMax: 24, nightConditionAt: 82, nightFatigueMax: 34, campfireMoraleAt: 38, campfireFearMax: 42 },
        trade: { elPasoFoodAt: 90, elPasoAmmoAt: 10, elPasoSuppliesAt: 10, elPasoOilSanctityAt: 68, elPasoVigilSanctityAt: 62, elPasoTonicHealthAt: 56, elPasoTonicFatigueAt: 56, elPasoCharmFearAt: 60, elPasoCharmStressAt: 56, damnedMaxTrades: 2, damnedNightSanctityAt: 30, damnedNightFoodAt: 16, damnedNightBlightAt: 28, damnedNightStressAt: 56, damnedDaySanctityAt: 32, damnedDaySuppliesAt: 6, damnedDayFearAt: 82 },
    },
    balanced: {
        name: "balanced",
        outfit: { food: 160, ammo: 28, supplies: 22, whiskey: 2, grain: 2, oil: 2 },
        ration: { poorAt: 24, wellAt: 140, fearForWell: 55, moraleForWell: 48, fatigueForWell: 60 },
        repair: { dayConditionAt: 48, daySanctityAt: 50, ironAt: 48, reinforceAt: 40, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 42, detourSanctityAt: 45, detourStressAt: 58, detourBlightAt: 24, detourFearAt: 58 },
        blight: { takeAtFood: 18, takeAtFoodNoAmmo: 36 },
        day: { tradeFoodAt: 70, tradeAmmoAt: 8, tradeSuppliesAt: 8, tradeSanctityAt: 60, damnedTradeFoodAt: 24, damnedTradeSanctityAt: 40, huntFoodAt: 40, restFatigueAt: 70, restHealthAt: 42, restFearAt: 72, restMoraleAt: 28, slaughterFoodAt: 16 },
        night: { tradeSanctityAt: 52, tradeHealthAt: 50, tradeFearAt: 68, riteSanctityAt: 36, riteFearAt: 82, guardStressAt: 58, guardFatigueAt: 62, guardFearAt: 58, whiskeyMoraleAt: 34, whiskeyFearMax: 82, nightWeekAt: 11, nightMilesPerWeek: 40, nightFearMax: 34, nightConditionAt: 72, nightFatigueMax: 42, campfireMoraleAt: 48, campfireFearMax: 58 },
        trade: { elPasoFoodAt: 70, elPasoAmmoAt: 8, elPasoSuppliesAt: 8, elPasoOilSanctityAt: 60, elPasoVigilSanctityAt: 58, elPasoTonicHealthAt: 52, elPasoTonicFatigueAt: 60, elPasoCharmFearAt: 65, elPasoCharmStressAt: 60, damnedMaxTrades: 2, damnedNightSanctityAt: 42, damnedNightFoodAt: 28, damnedNightBlightAt: 28, damnedNightStressAt: 62, damnedDaySanctityAt: 42, damnedDaySuppliesAt: 8, damnedDayFearAt: 70 },
    },
    morale: {
        name: "morale",
        outfit: { food: 180, ammo: 20, supplies: 24, whiskey: 3, grain: 2, oil: 2 },
        ration: { poorAt: 18, wellAt: 115, fearForWell: 42, moraleForWell: 62, fatigueForWell: 48 },
        repair: { dayConditionAt: 52, daySanctityAt: 58, ironAt: 54, reinforceAt: 42, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 46, detourSanctityAt: 52, detourStressAt: 52, detourBlightAt: 22, detourFearAt: 52 },
        blight: { takeAtFood: 14, takeAtFoodNoAmmo: 26 },
        day: { tradeFoodAt: 84, tradeAmmoAt: 6, tradeSuppliesAt: 10, tradeSanctityAt: 62, damnedTradeFoodAt: 20, damnedTradeSanctityAt: 44, huntFoodAt: 34, restFatigueAt: 60, restHealthAt: 52, restFearAt: 58, restMoraleAt: 46, slaughterFoodAt: 10 },
        night: { tradeSanctityAt: 58, tradeHealthAt: 56, tradeFearAt: 60, riteSanctityAt: 44, riteFearAt: 72, guardStressAt: 52, guardFatigueAt: 56, guardFearAt: 48, whiskeyMoraleAt: 52, whiskeyFearMax: 88, nightWeekAt: 18, nightMilesPerWeek: 36, nightFearMax: 22, nightConditionAt: 78, nightFatigueMax: 30, campfireMoraleAt: 60, campfireFearMax: 54 },
        trade: { elPasoFoodAt: 84, elPasoAmmoAt: 6, elPasoSuppliesAt: 10, elPasoOilSanctityAt: 64, elPasoVigilSanctityAt: 62, elPasoTonicHealthAt: 58, elPasoTonicFatigueAt: 52, elPasoCharmFearAt: 56, elPasoCharmStressAt: 54, damnedMaxTrades: 1, damnedNightSanctityAt: 46, damnedNightFoodAt: 20, damnedNightBlightAt: 26, damnedNightStressAt: 56, damnedDaySanctityAt: 46, damnedDaySuppliesAt: 8, damnedDayFearAt: 58 },
    },
    mutiny: {
        name: "mutiny",
        outfit: { food: 125, ammo: 18, supplies: 14, whiskey: 0, grain: 0, oil: 1 },
        ration: { poorAt: 82, wellAt: 999, fearForWell: 999, moraleForWell: -999, fatigueForWell: 999 },
        repair: { dayConditionAt: 26, daySanctityAt: 24, ironAt: 18, reinforceAt: 18, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 18, detourSanctityAt: 18, detourStressAt: 88, detourBlightAt: 36, detourFearAt: 88 },
        blight: { takeAtFood: 58, takeAtFoodNoAmmo: 90 },
        day: { tradeFoodAt: 22, tradeAmmoAt: 2, tradeSuppliesAt: 2, tradeSanctityAt: 18, damnedTradeFoodAt: 10, damnedTradeSanctityAt: 18, huntFoodAt: 20, restFatigueAt: 90, restHealthAt: 26, restFearAt: 96, restMoraleAt: 8, slaughterFoodAt: 4 },
        night: { tradeSanctityAt: 10, tradeHealthAt: 18, tradeFearAt: 96, riteSanctityAt: 0, riteFearAt: 101, guardStressAt: 101, guardFatigueAt: 101, guardFearAt: 101, whiskeyMoraleAt: 0, whiskeyFearMax: -1, nightWeekAt: 1, nightMilesPerWeek: 60, nightFearMax: 100, nightConditionAt: 0, nightFatigueMax: 100, campfireMoraleAt: 0, campfireFearMax: -1 },
        trade: { elPasoFoodAt: 18, elPasoAmmoAt: 2, elPasoSuppliesAt: 2, elPasoOilSanctityAt: 18, elPasoVigilSanctityAt: 14, elPasoTonicHealthAt: 18, elPasoTonicFatigueAt: 90, elPasoCharmFearAt: 96, elPasoCharmStressAt: 96, damnedMaxTrades: 0, damnedNightSanctityAt: 18, damnedNightFoodAt: 10, damnedNightBlightAt: 40, damnedNightStressAt: 84, damnedDaySanctityAt: 18, damnedDaySuppliesAt: 2, damnedDayFearAt: 96 },
    },
    greedy: {
        name: "greedy",
        outfit: { food: 130, ammo: 34, supplies: 16, whiskey: 2, grain: 1, oil: 1 },
        ration: { poorAt: 30, wellAt: 180, fearForWell: 68, moraleForWell: 34, fatigueForWell: 72 },
        repair: { dayConditionAt: 38, daySanctityAt: 40, ironAt: 38, reinforceAt: 32, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 28, detourSanctityAt: 32, detourStressAt: 72, detourBlightAt: 30, detourFearAt: 72 },
        blight: { takeAtFood: 26, takeAtFoodNoAmmo: 48 },
        day: { tradeFoodAt: 52, tradeAmmoAt: 4, tradeSuppliesAt: 6, tradeSanctityAt: 44, damnedTradeFoodAt: 20, damnedTradeSanctityAt: 28, huntFoodAt: 55, restFatigueAt: 82, restHealthAt: 34, restFearAt: 82, restMoraleAt: 18, slaughterFoodAt: 12 },
        night: { tradeSanctityAt: 42, tradeHealthAt: 42, tradeFearAt: 80, riteSanctityAt: 24, riteFearAt: 90, guardStressAt: 68, guardFatigueAt: 72, guardFearAt: 66, whiskeyMoraleAt: 40, whiskeyFearMax: 90, nightWeekAt: 8, nightMilesPerWeek: 44, nightFearMax: 42, nightConditionAt: 64, nightFatigueMax: 48, campfireMoraleAt: 56, campfireFearMax: 66 },
        trade: { elPasoFoodAt: 52, elPasoAmmoAt: 4, elPasoSuppliesAt: 6, elPasoOilSanctityAt: 42, elPasoVigilSanctityAt: 44, elPasoTonicHealthAt: 44, elPasoTonicFatigueAt: 68, elPasoCharmFearAt: 74, elPasoCharmStressAt: 66, damnedMaxTrades: 2, damnedNightSanctityAt: 34, damnedNightFoodAt: 24, damnedNightBlightAt: 34, damnedNightStressAt: 70, damnedDaySanctityAt: 34, damnedDaySuppliesAt: 6, damnedDayFearAt: 66 },
    },
    desperate: {
        name: "desperate",
        outfit: { food: 145, ammo: 24, supplies: 18, whiskey: 1, grain: 1, oil: 1 },
        ration: { poorAt: 26, wellAt: 150, fearForWell: 60, moraleForWell: 42, fatigueForWell: 62 },
        repair: { dayConditionAt: 42, daySanctityAt: 44, ironAt: 42, reinforceAt: 34, patchSuppliesAt: 4 },
        scout: { detourConditionAt: 34, detourSanctityAt: 38, detourStressAt: 66, detourBlightAt: 28, detourFearAt: 66 },
        blight: { takeAtFood: 40, takeAtFoodNoAmmo: 70 },
        day: { tradeFoodAt: 62, tradeAmmoAt: 8, tradeSuppliesAt: 7, tradeSanctityAt: 50, damnedTradeFoodAt: 34, damnedTradeSanctityAt: 44, huntFoodAt: 52, restFatigueAt: 76, restHealthAt: 38, restFearAt: 80, restMoraleAt: 22, slaughterFoodAt: 26 },
        night: { tradeSanctityAt: 48, tradeHealthAt: 46, tradeFearAt: 76, riteSanctityAt: 30, riteFearAt: 84, guardStressAt: 62, guardFatigueAt: 66, guardFearAt: 60, whiskeyMoraleAt: 44, whiskeyFearMax: 88, nightWeekAt: 10, nightMilesPerWeek: 42, nightFearMax: 36, nightConditionAt: 68, nightFatigueMax: 44, campfireMoraleAt: 52, campfireFearMax: 62 },
        trade: { elPasoFoodAt: 62, elPasoAmmoAt: 8, elPasoSuppliesAt: 7, elPasoOilSanctityAt: 48, elPasoVigilSanctityAt: 50, elPasoTonicHealthAt: 48, elPasoTonicFatigueAt: 64, elPasoCharmFearAt: 70, elPasoCharmStressAt: 64, damnedMaxTrades: 2, damnedNightSanctityAt: 40, damnedNightFoodAt: 34, damnedNightBlightAt: 30, damnedNightStressAt: 64, damnedDaySanctityAt: 40, damnedDaySuppliesAt: 7, damnedDayFearAt: 68 },
    },
};

function getPolicyProfile(name) {
    const profile = POLICY_PROFILES[name];
    if (!profile) {
        throw new Error(`Unknown policy "${name}". Available policies: ${Object.keys(POLICY_PROFILES).join(", ")}`);
    }

    return profile;
}

function chooseOutfitCommand(state, policy) {
    const purchases = [
        { current: state.food, target: policy.outfit.food, command: "buy food", cost: 1 },
        { current: state.ammo, target: policy.outfit.ammo, command: "buy ammo", cost: 2 },
        { current: state.supplies, target: policy.outfit.supplies, command: "buy supplies", cost: 4 },
        { current: state.whiskey, target: policy.outfit.whiskey, command: "buy whiskey", cost: 15 },
        { current: state.blessedGrain, target: policy.outfit.grain, command: "buy blessed grain", cost: 20 },
        { current: state.wardingOil, target: policy.outfit.oil, command: "buy warding oil", cost: 25 },
    ];

    for (const purchase of purchases) {
        if (purchase.current < purchase.target) {
            const desired = purchase.target - purchase.current;
            const affordable = Math.floor(state.cash / purchase.cost);
            const quantity = Math.min(desired, affordable);
            if (quantity > 0) {
                return `${purchase.command} ${quantity}`;
            }
        }
    }

    return "start";
}

function chooseRationCommand(state, policy) {
    if (state.food <= policy.ration.poorAt) {
        return "poor";
    }

    if (
        state.food >= policy.ration.wellAt &&
        (
            state.fear >= policy.ration.fearForWell ||
            state.morale <= policy.ration.moraleForWell ||
            state.herdFatigue >= policy.ration.fatigueForWell
        )
    ) {
        return "well";
    }

    return "moderate";
}

function chooseRepairCommand(state, policy) {
    if (state.wagonCondition <= policy.repair.reinforceAt && state.supplies >= 8) {
        return "reinforce";
    }

    if (state.wagonCondition <= policy.repair.dayConditionAt && state.supplies >= policy.repair.patchSuppliesAt) {
        return "patch";
    }

    if (state.wagonSanctity <= policy.repair.daySanctityAt && state.supplies >= 6) {
        return "iron";
    }

    return "back";
}

function chooseScoutCommand(state, policy) {
    if (
        state.wagonCondition <= policy.scout.detourConditionAt ||
        state.wagonSanctity <= policy.scout.detourSanctityAt ||
        state.herdStress >= policy.scout.detourStressAt ||
        state.herdBlight >= policy.scout.detourBlightAt ||
        state.fear >= policy.scout.detourFearAt
    ) {
        return "detour";
    }

    return "face";
}

function chooseBlightCommand(state, policy) {
    if (state.food <= policy.blight.takeAtFood || (state.food <= policy.blight.takeAtFoodNoAmmo && state.ammo === 0)) {
        return "take";
    }

    return "leave";
}

function chooseEncounterCommand(state, policy) {
    if (state.pendingEncounter === "ash-drowner") {
        if (state.food <= policy.day.huntFoodAt) {
            return "provender";
        }
        if (state.wagonSanctity <= policy.trade.damnedNightSanctityAt || state.herdBlight >= policy.trade.damnedNightBlightAt) {
            return "ward";
        }
        if (policy.name === "greedy" && state.cattle >= 380 && state.miles <= 760) {
            return "passage";
        }
        if (policy.name === "desperate" && state.cattle >= 350 && state.food <= 48) {
            return "passage";
        }
        if (state.miles <= 650 && state.cattle >= 420) {
            return "passage";
        }
        return "refuse";
    }

    if (state.pendingEncounter === "salt-chapel") {
        if (state.wagonSanctity <= policy.trade.damnedNightSanctityAt || state.herdBlight >= policy.trade.damnedNightBlightAt) {
            return "tithe";
        }
        if (state.fear >= policy.trade.elPasoCharmFearAt || state.morale <= policy.night.whiskeyMoraleAt) {
            return "confess";
        }
        return "pass";
    }

    if (state.pendingEncounter === "hollow-drover") {
        if (state.cattle <= (policy.name === "greedy" ? 470 : 430) && state.herdBlight <= 25) {
            return "follow";
        }
        if (state.fear >= policy.night.riteFearAt - 10 || state.herdStress >= policy.trade.damnedNightStressAt) {
            return "bargain";
        }
        return "drive";
    }

    return "refuse";
}

function chooseTradeCommand(state, policy) {
    if (state.tradeLocation === "el-paso") {
        if (state.tradeTime === "day") {
            if (state.food <= policy.trade.elPasoFoodAt && state.cash >= 20) {
                return "food";
            }
            if (state.ammo <= policy.trade.elPasoAmmoAt && state.cash >= 16) {
                return "ammo";
            }
            if (state.supplies <= policy.trade.elPasoSuppliesAt && state.cash >= 24) {
                return "supplies";
            }
            if (state.wardingOil <= 1 && state.wagonSanctity <= policy.trade.elPasoOilSanctityAt && state.cash >= 25) {
                return "oil";
            }
            if (state.blessedGrain === 0 && state.cash >= 20) {
                return "grain";
            }
            return "back";
        }

        if (state.wagonSanctity <= policy.trade.elPasoVigilSanctityAt && state.cash >= 24) {
            return "vigil";
        }
        if ((state.herdHealth <= policy.trade.elPasoTonicHealthAt || state.herdFatigue >= policy.trade.elPasoTonicFatigueAt) && state.cash >= 20) {
            return "tonic";
        }
        if ((state.fear >= policy.trade.elPasoCharmFearAt || state.herdStress >= policy.trade.elPasoCharmStressAt) && state.cash >= 18) {
            return "charm";
        }
        if (state.blessedGrain === 0 && state.cash >= 18) {
            return "grain";
        }
        return "back";
    }

    if (state.damnedTradeCount >= policy.trade.damnedMaxTrades) {
        return "back";
    }

    if (state.tradeTime === "night") {
        if (state.wagonSanctity <= policy.trade.damnedNightSanctityAt && state.cattle >= 1) {
            return "vigil";
        }
        if (state.food <= policy.trade.damnedNightFoodAt && state.cattle >= 1) {
            return "cache";
        }
        if ((state.herdBlight >= policy.trade.damnedNightBlightAt || state.herdStress >= policy.trade.damnedNightStressAt) && state.cattle >= 1) {
            return "blessing";
        }
        return "back";
    }

    if (state.wagonSanctity <= policy.trade.damnedDaySanctityAt && state.cattle >= 1) {
        return "oil";
    }
    if (state.supplies <= policy.trade.damnedDaySuppliesAt && state.cattle >= 1) {
        return "nails";
    }
    if (state.fear >= policy.trade.damnedDayFearAt && state.cattle >= 1) {
        return "mirror";
    }
    return "back";
}

function chooseDayCommand(state, policy) {
    if (state.canTrade && state.tradeLocation === "el-paso" && (
        state.food <= policy.day.tradeFoodAt ||
        state.ammo <= policy.day.tradeAmmoAt ||
        state.supplies <= policy.day.tradeSuppliesAt ||
        state.wagonSanctity <= policy.day.tradeSanctityAt
    )) {
        return "trade";
    }

    if (state.canTrade && state.tradeLocation === "damned-post" && (
        state.damnedTradeCount < policy.trade.damnedMaxTrades &&
        (state.wagonSanctity <= policy.day.damnedTradeSanctityAt || state.food <= policy.day.damnedTradeFoodAt)
    )) {
        return "trade";
    }

    if (
        (state.wagonCondition <= policy.repair.dayConditionAt && state.supplies >= 4) ||
        (state.wagonSanctity <= policy.repair.daySanctityAt && state.supplies >= 6)
    ) {
        return "repair";
    }

    if (state.food <= policy.day.huntFoodAt && state.ammo > 0) {
        return "hunt";
    }

    if (
        state.herdFatigue >= policy.day.restFatigueAt ||
        state.herdHealth <= policy.day.restHealthAt ||
        state.fear >= policy.day.restFearAt ||
        state.morale <= policy.day.restMoraleAt
    ) {
        return "rest";
    }

    if (state.food <= policy.day.slaughterFoodAt && state.ammo === 0 && state.cattle > 0) {
        return "slaughter";
    }

    return "travel";
}

function chooseNightCommand(state, policy) {
    if (state.canTrade && state.tradeLocation === "el-paso" && (
        state.wagonSanctity <= policy.night.tradeSanctityAt ||
        state.herdHealth <= policy.night.tradeHealthAt ||
        state.fear >= policy.night.tradeFearAt
    )) {
        return "trade";
    }

    if (state.wagonSanctity <= policy.night.riteSanctityAt || state.fear >= policy.night.riteFearAt) {
        return "rite";
    }

    if (
        state.herdStress >= policy.night.guardStressAt ||
        state.herdFatigue >= policy.night.guardFatigueAt ||
        state.fear >= policy.night.guardFearAt
    ) {
        return "guard";
    }

    if (state.whiskey > 0 && state.morale <= policy.night.whiskeyMoraleAt && state.fear <= policy.night.whiskeyFearMax) {
        return "whiskey";
    }

    if (
        state.week >= policy.night.nightWeekAt &&
        state.miles < (state.week * policy.night.nightMilesPerWeek) &&
        state.fear <= policy.night.nightFearMax &&
        state.wagonCondition >= policy.night.nightConditionAt &&
        state.herdFatigue <= policy.night.nightFatigueMax
    ) {
        return "night";
    }

    if (state.morale <= policy.night.campfireMoraleAt && state.fear <= policy.night.campfireFearMax) {
        return "campfire";
    }

    return "guard";
}

function chooseCommand(state, policy) {
    switch (state.phase) {
        case "outfit":
            return chooseOutfitCommand(state, policy);
        case "day":
            return chooseDayCommand(state, policy);
        case "repair":
            return chooseRepairCommand(state, policy);
        case "trade":
            return chooseTradeCommand(state, policy);
        case "rations":
            return chooseRationCommand(state, policy);
        case "night":
            return chooseNightCommand(state, policy);
        case "blight":
            return chooseBlightCommand(state, policy);
        case "encounter":
            return chooseEncounterCommand(state, policy);
        case "scout":
            return chooseScoutCommand(state, policy);
        default:
            return "quit";
    }
}

async function runAutoplay({ seedLabel, policyName, captureLog = false, maxSteps = 1000 }) {
    const policy = getPolicyProfile(policyName);
    const { term, lines } = createSilentTerm(captureLog);
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

    let steps = 0;
    while (game.isActive() && steps < maxSteps) {
        const state = game.getStateSnapshot();
        const command = chooseCommand(state, policy);
        await game.handleInput(command);
        steps += 1;
    }

    if (game.isActive()) {
        await game.stop("SIMULATION ABORTED: STEP LIMIT REACHED.");
    }

    const report = game.getRunReport();
    if (!report) {
        throw new Error(`Simulation ${seedLabel} did not produce a run report.`);
    }

    return {
        seedLabel,
        sharedSeed: seedLabel,
        policyName,
        steps,
        report: {
            ...report,
            simulationPolicy: policyName,
        },
        logLines: lines,
    };
}

function flattenRun(run) {
    const summary = run.report.summary;

    return {
        policy: run.policyName,
        sharedSeed: run.sharedSeed,
        seed: run.seedLabel,
        mode: run.report.mode,
        outcome: summary.outcome,
        failureCause: summary.failureCause || "",
        weekEnded: summary.weekEnded,
        milesReached: summary.milesReached,
        cattleRemaining: summary.cattleRemaining,
        crewAlive: summary.crewAlive,
        crewDead: summary.crewDead,
        crewExiled: summary.crewExiled,
        crewDeserted: summary.crewDeserted,
        foodRemaining: summary.foodRemaining,
        ammoRemaining: summary.ammoRemaining,
        suppliesRemaining: summary.suppliesRemaining,
        morale: summary.morale,
        fear: summary.fear,
        wagonCondition: summary.wagonCondition,
        wagonSanctity: summary.wagonSanctity,
        steps: run.steps,
    };
}

function spreadStats(values) {
    return {
        average: round(average(values)),
        median: round(median(values)),
        stddev: round(standardDeviation(values)),
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        p10: round(percentile(values, 0.1)),
        p25: round(percentile(values, 0.25)),
        p75: round(percentile(values, 0.75)),
        p90: round(percentile(values, 0.9)),
    };
}

function aggregateWeeklyTrends(runs) {
    const metrics = [
        "miles",
        "cattle",
        "crewAlive",
        "food",
        "blightedFood",
        "morale",
        "fear",
        "wagonCondition",
        "wagonSanctity",
        "herdHealth",
        "herdStress",
        "herdFatigue",
        "herdBlight",
    ];
    const weekMap = new Map();

    for (const run of runs) {
        const snapshots = (run.report.snapshots || []).filter(snapshot => snapshot.label === "week-start");
        for (const snapshot of snapshots) {
            if (!weekMap.has(snapshot.week)) {
                weekMap.set(snapshot.week, { count: 0 });
                for (const metric of metrics) {
                    weekMap.get(snapshot.week)[metric] = [];
                }
            }

            const bucket = weekMap.get(snapshot.week);
            bucket.count += 1;
            for (const metric of metrics) {
                bucket[metric].push(snapshot[metric]);
            }
        }
    }

    return [...weekMap.entries()]
        .sort((left, right) => left[0] - right[0])
        .map(([week, bucket]) => ({
            week,
            sampleSize: bucket.count,
            miles: round(average(bucket.miles)),
            cattle: round(average(bucket.cattle)),
            crewAlive: round(average(bucket.crewAlive)),
            food: round(average(bucket.food)),
            blightedFood: round(average(bucket.blightedFood)),
            morale: round(average(bucket.morale)),
            fear: round(average(bucket.fear)),
            wagonCondition: round(average(bucket.wagonCondition)),
            wagonSanctity: round(average(bucket.wagonSanctity)),
            herdHealth: round(average(bucket.herdHealth)),
            herdStress: round(average(bucket.herdStress)),
            herdFatigue: round(average(bucket.herdFatigue)),
            herdBlight: round(average(bucket.herdBlight)),
        }));
}

function firstThresholdWeek(trends, metric, predicate) {
    const entry = trends.find(week => predicate(week[metric]));
    return entry ? entry.week : null;
}

function summarizeThresholds(trends) {
    return {
        wagonConditionBelow75: firstThresholdWeek(trends, "wagonCondition", value => value < 75),
        wagonConditionBelow50: firstThresholdWeek(trends, "wagonCondition", value => value < 50),
        wagonSanctityBelow75: firstThresholdWeek(trends, "wagonSanctity", value => value < 75),
        wagonSanctityBelow50: firstThresholdWeek(trends, "wagonSanctity", value => value < 50),
        herdHealthBelow75: firstThresholdWeek(trends, "herdHealth", value => value < 75),
        herdHealthBelow50: firstThresholdWeek(trends, "herdHealth", value => value < 50),
        herdStressAbove50: firstThresholdWeek(trends, "herdStress", value => value > 50),
        herdFatigueAbove50: firstThresholdWeek(trends, "herdFatigue", value => value > 50),
        herdBlightAbove20: firstThresholdWeek(trends, "herdBlight", value => value > 20),
        fearAbove50: firstThresholdWeek(trends, "fear", value => value > 50),
        fearAbove75: firstThresholdWeek(trends, "fear", value => value > 75),
        moraleBelow40: firstThresholdWeek(trends, "morale", value => value < 40),
    };
}

function summarizeFailureTiming(runs) {
    const byCause = {};

    for (const run of runs) {
        const cause = run.report.summary.failureCause;
        if (!cause) {
            continue;
        }

        byCause[cause] = byCause[cause] || [];
        byCause[cause].push(run.report.summary.weekEnded);
    }

    return Object.fromEntries(
        Object.entries(byCause).map(([cause, weeks]) => [
            cause,
            {
                count: weeks.length,
                rate: percentage(weeks.length, runs.length),
                averageWeek: round(average(weeks)),
                medianWeek: round(median(weeks)),
                minWeek: Math.min(...weeks),
                maxWeek: Math.max(...weeks),
            },
        ]),
    );
}

function buildConsistencySummary(runs, summary, trends) {
    const topFailureEntry = Object.entries(summary.failures).sort((left, right) => right[1] - left[1])[0];
    const topFailureRate = topFailureEntry ? percentage(topFailureEntry[1], runs.length) : 0;
    const cattleSpread = summary.variability.cattleRemaining.p90 - summary.variability.cattleRemaining.p10;
    const milesSpread = summary.variability.milesReached.p90 - summary.variability.milesReached.p10;
    const weekSpread = summary.variability.weekEnded.p90 - summary.variability.weekEnded.p10;

    return {
        dominantFailureCause: topFailureEntry ? topFailureEntry[0] : "",
        dominantFailureRate: topFailureRate,
        uniqueFailureCauses: Object.keys(summary.failures).length,
        cattleP10toP90Spread: round(cattleSpread),
        milesP10toP90Spread: round(milesSpread),
        weekP10toP90Spread: round(weekSpread),
        lateWeekSampleSize: trends[trends.length - 1]?.sampleSize ?? 0,
    };
}

function buildBalanceFlags(runs, summary) {
    const flags = [];
    const totalRuns = runs.length;

    if (summary.overall.winRate < 20) {
        flags.push(`Win rate is only ${summary.overall.winRate}%. The baseline may be too punishing.`);
    }

    if (summary.overall.winRate > 80) {
        flags.push(`Win rate is ${summary.overall.winRate}%. The baseline may be too forgiving.`);
    }

    const dominantFailure = Object.entries(summary.failures)
        .sort((left, right) => right[1] - left[1])[0];
    if (dominantFailure && percentage(dominantFailure[1], totalRuns) >= 45) {
        flags.push(`Failure cause "${dominantFailure[0]}" dominates at ${percentage(dominantFailure[1], totalRuns)}% of runs.`);
    }

    for (const [role, stats] of Object.entries(summary.specialists)) {
        if (stats.procRate < 5) {
            flags.push(`${role} procs only ${stats.procRate}% of checks and may be too hard to feel.`);
        }
    }

    if (summary.resources.blightTakenRate === 0) {
        flags.push("Blighted food was never taken in this batch, which may mean the tradeoff is too unattractive.");
    }

    if (summary.thresholds.wagonConditionBelow50 && summary.thresholds.wagonConditionBelow50 <= 6) {
        flags.push(`Wagon condition falls below 50 by week ${summary.thresholds.wagonConditionBelow50} on average, which suggests structural decay may be too front-loaded.`);
    }

    if (summary.thresholds.wagonSanctityBelow50 && summary.thresholds.wagonSanctityBelow50 <= 10) {
        flags.push(`Wagon sanctity falls below 50 by week ${summary.thresholds.wagonSanctityBelow50} on average, which suggests sanctity pressure may be arriving too early.`);
    }

    if (summary.consistency.dominantFailureRate >= 70 && summary.consistency.cattleP10toP90Spread <= 20) {
        flags.push(`This policy ends very consistently in ${summary.consistency.dominantFailureCause} with only a ${summary.consistency.cattleP10toP90Spread} cattle spread between the 10th and 90th percentile.`);
    }

    if (summary.consistency.cattleP10toP90Spread >= 120 || summary.consistency.weekP10toP90Spread >= 8) {
        flags.push("Outcome spread is wide for this policy, which suggests randomness or compounding branches may be dominating the result.");
    }

    return flags;
}

function summarizeRuns(runs) {
    const policyName = runs[0]?.policyName ?? "unknown";
    const totals = {
        failures: {},
        dayActions: {},
        nightActions: {},
        encounterChoices: {},
        events: {},
    };
    const crewConsequenceTotals = {
        mutiny: 0,
        guardExile: 0,
        foodExile: 0,
        whiskeyDesertion: 0,
        paranoiaDeath: 0,
        paranoiaExile: 0,
        collapseDeath: 0,
        collapseDesertion: 0,
    };
    const specialistTotals = {};
    const numeric = {
        weekEnded: [],
        milesReached: [],
        cattleRemaining: [],
        crewAlive: [],
        crewDead: [],
        crewDeserted: [],
        wagonCondition: [],
        wagonSanctity: [],
        morale: [],
        fear: [],
    };

    let wins = 0;
    let blightTakenRuns = 0;
    let blightConsumedRuns = 0;
    let mutinyRuns = 0;
    let mutinyEligibleRuns = 0;
    let deathRuns = 0;
    let exileRuns = 0;
    let desertionRuns = 0;
    let mutinyEligibleChecks = 0;
    let mutinyRolls = 0;
    let mutinyTotalChance = 0;
    let mutinyPeakChance = 0;
    let mutinyBlockedByExile = 0;
    let mutinyBlockedByCollapse = 0;
    let mutinyBlockedByOther = 0;

    for (const run of runs) {
        const report = run.report;
        const summary = report.summary;

        if (summary.outcome === "victory") {
            wins += 1;
        }

        if (summary.failureCause) {
            totals.failures[summary.failureCause] = (totals.failures[summary.failureCause] || 0) + 1;
        }

        for (const [key, value] of Object.entries(report.counters.dayActions)) {
            totals.dayActions[key] = (totals.dayActions[key] || 0) + value;
        }

        for (const [key, value] of Object.entries(report.counters.nightActions)) {
            totals.nightActions[key] = (totals.nightActions[key] || 0) + value;
        }

        for (const [key, value] of Object.entries(report.counters.encounterChoices)) {
            totals.encounterChoices[key] = (totals.encounterChoices[key] || 0) + value;
        }

        for (const [key, value] of Object.entries(report.counters.events)) {
            totals.events[key] = (totals.events[key] || 0) + value;
        }

        for (const [key, value] of Object.entries(report.counters.crewConsequences)) {
            crewConsequenceTotals[key] += value;
        }

        for (const [role, stats] of Object.entries(report.counters.specialists)) {
            specialistTotals[role] = specialistTotals[role] || {
                checks: 0,
                eligibleChecks: 0,
                successes: 0,
                extraValue: 0,
            };
            specialistTotals[role].checks += stats.checks;
            specialistTotals[role].eligibleChecks += stats.eligibleChecks;
            specialistTotals[role].successes += stats.successes;
            specialistTotals[role].extraValue += stats.extraValue;
        }

        if (report.counters.blight.taken > 0) {
            blightTakenRuns += 1;
        }
        if (report.counters.blight.consumed > 0) {
            blightConsumedRuns += 1;
        }

        if (report.counters.crewConsequences.mutiny > 0) {
            mutinyRuns += 1;
        }
        if (report.counters.mutiny.eligibleChecks > 0) {
            mutinyEligibleRuns += 1;
        }
        if (summary.crewDead > 0) {
            deathRuns += 1;
        }
        if (summary.crewExiled > 0) {
            exileRuns += 1;
        }
        if (summary.crewDeserted > 0) {
            desertionRuns += 1;
        }

        mutinyEligibleChecks += report.counters.mutiny.eligibleChecks;
        mutinyRolls += report.counters.mutiny.rolls;
        mutinyTotalChance += report.counters.mutiny.totalChance;
        mutinyPeakChance = Math.max(mutinyPeakChance, report.counters.mutiny.peakChance);
        mutinyBlockedByExile += report.counters.mutiny.blockedByExile;
        mutinyBlockedByCollapse += report.counters.mutiny.blockedByCollapse;
        mutinyBlockedByOther += report.counters.mutiny.blockedByOther;

        numeric.weekEnded.push(summary.weekEnded);
        numeric.milesReached.push(summary.milesReached);
        numeric.cattleRemaining.push(summary.cattleRemaining);
        numeric.crewAlive.push(summary.crewAlive);
        numeric.crewDead.push(summary.crewDead);
        numeric.crewDeserted.push(summary.crewDeserted);
        numeric.wagonCondition.push(summary.wagonCondition);
        numeric.wagonSanctity.push(summary.wagonSanctity);
        numeric.morale.push(summary.morale);
        numeric.fear.push(summary.fear);
    }

    const trends = aggregateWeeklyTrends(runs);

    const summary = {
        policy: policyName,
        overall: {
            runs: runs.length,
            wins,
            winRate: percentage(wins, runs.length),
            averageWeekEnded: Number(average(numeric.weekEnded).toFixed(2)),
            medianWeekEnded: median(numeric.weekEnded),
            averageMilesReached: Number(average(numeric.milesReached).toFixed(2)),
            averageCattleRemaining: Number(average(numeric.cattleRemaining).toFixed(2)),
            medianCattleRemaining: median(numeric.cattleRemaining),
        },
        variability: {
            weekEnded: spreadStats(numeric.weekEnded),
            milesReached: spreadStats(numeric.milesReached),
            cattleRemaining: spreadStats(numeric.cattleRemaining),
            morale: spreadStats(numeric.morale),
            fear: spreadStats(numeric.fear),
            wagonCondition: spreadStats(numeric.wagonCondition),
            wagonSanctity: spreadStats(numeric.wagonSanctity),
        },
        failures: totals.failures,
        failureTiming: summarizeFailureTiming(runs),
        crew: {
            averageAlive: Number(average(numeric.crewAlive).toFixed(2)),
            averageDead: Number(average(numeric.crewDead).toFixed(2)),
            averageDeserted: Number(average(numeric.crewDeserted).toFixed(2)),
            deathRunRate: percentage(deathRuns, runs.length),
            exileRunRate: percentage(exileRuns, runs.length),
            desertionRunRate: percentage(desertionRuns, runs.length),
        },
        crewConsequences: crewConsequenceTotals,
        mutiny: {
            runRate: percentage(mutinyRuns, runs.length),
            totalRuns: mutinyRuns,
            eligibleRunRate: percentage(mutinyEligibleRuns, runs.length),
            eligibleRuns: mutinyEligibleRuns,
            eligibleChecks: mutinyEligibleChecks,
            rolls: mutinyRolls,
            averageChanceWhenEligible: mutinyEligibleChecks > 0 ? round(mutinyTotalChance / mutinyEligibleChecks) : 0,
            peakChance: mutinyPeakChance,
            blockedByExile: mutinyBlockedByExile,
            blockedByCollapse: mutinyBlockedByCollapse,
            blockedByOther: mutinyBlockedByOther,
        },
        wagon: {
            averageCondition: Number(average(numeric.wagonCondition).toFixed(2)),
            averageSanctity: Number(average(numeric.wagonSanctity).toFixed(2)),
        },
        emotions: {
            averageMorale: Number(average(numeric.morale).toFixed(2)),
            averageFear: Number(average(numeric.fear).toFixed(2)),
        },
        resources: {
            blightTakenRate: percentage(blightTakenRuns, runs.length),
            blightConsumedRate: percentage(blightConsumedRuns, runs.length),
        },
        dayActions: totals.dayActions,
        nightActions: totals.nightActions,
        encounterChoices: totals.encounterChoices,
        events: totals.events,
        specialists: Object.fromEntries(
            Object.entries(specialistTotals).map(([role, stats]) => [
                role,
                {
                    checks: stats.checks,
                    eligibleChecks: stats.eligibleChecks,
                    successes: stats.successes,
                    procRate: percentage(stats.successes, stats.checks),
                    averageExtraValuePerRun: Number((stats.extraValue / runs.length).toFixed(2)),
                },
            ]),
        ),
        trends,
        thresholds: summarizeThresholds(trends),
    };

    summary.consistency = buildConsistencySummary(runs, summary, trends);
    summary.balanceFlags = buildBalanceFlags(runs, summary);
    return summary;
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

function buildSummaryMarkdown(summary, config) {
    const failureLines = Object.entries(summary.failures)
        .sort((left, right) => right[1] - left[1])
        .map(([cause, count]) => `- ${cause}: ${count} (${percentage(count, config.runs)}%)`)
        .join("\n");
    const failureTimingLines = Object.entries(summary.failureTiming)
        .sort((left, right) => right[1].count - left[1].count)
        .map(([cause, timing]) => `- ${cause}: avg week ${timing.averageWeek}, median ${timing.medianWeek}, range ${timing.minWeek}-${timing.maxWeek}`)
        .join("\n");

    const specialistLines = Object.entries(summary.specialists)
        .map(([role, stats]) => `- ${role}: ${stats.successes}/${stats.checks} successes (${stats.procRate}% proc rate), avg extra value ${stats.averageExtraValuePerRun}/run`)
        .join("\n");
    const trendRows = summary.trends.slice(0, 8)
        .map(week => `- week ${week.week}: wagon ${week.wagonCondition}/${week.wagonSanctity}, herd ${week.herdHealth}/${week.herdStress}/${week.herdFatigue}/${week.herdBlight}, morale ${week.morale}, fear ${week.fear}, cattle ${week.cattle}`)
        .join("\n");

    const flagLines = summary.balanceFlags.length > 0
        ? summary.balanceFlags.map(flag => `- ${flag}`).join("\n")
        : "- No automatic balance flags were triggered in this batch.";
    const crewConsequenceLines = Object.entries(summary.crewConsequences)
        .filter(([, count]) => count > 0)
        .sort((left, right) => right[1] - left[1])
        .map(([key, count]) => `- ${key}: ${count}`)
        .join("\n");

    return [
        "# Deadwood Simulation Summary",
        "",
        `- Generated: ${new Date().toISOString()}`,
        `- Policy: ${summary.policy}`,
        `- Runs: ${config.runs}`,
        `- Seed Base: ${config.seedBase}`,
        "",
        "## Overall",
        "",
        `- Average week ended: ${summary.overall.averageWeekEnded}`,
        `- Average miles reached: ${summary.overall.averageMilesReached}`,
        `- Average cattle remaining: ${summary.overall.averageCattleRemaining}`,
        `- Median cattle remaining: ${summary.overall.medianCattleRemaining}`,
        "",
        "## Consistency",
        "",
        `- Dominant failure: ${summary.consistency.dominantFailureCause || "none"} (${summary.consistency.dominantFailureRate}%)`,
        `- Cattle spread (P10-P90): ${summary.consistency.cattleP10toP90Spread}`,
        `- Miles spread (P10-P90): ${summary.consistency.milesP10toP90Spread}`,
        `- Week spread (P10-P90): ${summary.consistency.weekP10toP90Spread}`,
        "",
        "## Failure Timing",
        "",
        failureTimingLines || "- None",
        "",
        "## Failure Causes",
        "",
        failureLines || "- None",
        "",
        "## Crew Pressure",
        "",
        `- Death runs: ${summary.crew.deathRunRate}%`,
        `- Exile runs: ${summary.crew.exileRunRate}%`,
        `- Desertion runs: ${summary.crew.desertionRunRate}%`,
        `- Mutiny runs: ${summary.mutiny.runRate}% (${summary.mutiny.totalRuns}/${config.runs})`,
        `- Mutiny-eligible runs: ${summary.mutiny.eligibleRunRate}% (${summary.mutiny.eligibleRuns}/${config.runs})`,
        `- Mutiny eligible checks: ${summary.mutiny.eligibleChecks}`,
        `- Average mutiny chance when eligible: ${summary.mutiny.averageChanceWhenEligible}%`,
        `- Peak mutiny chance: ${summary.mutiny.peakChance}%`,
        `- Mutiny blocked by exile/collapse/other: ${summary.mutiny.blockedByExile}/${summary.mutiny.blockedByCollapse}/${summary.mutiny.blockedByOther}`,
        crewConsequenceLines || "- No crew consequences recorded.",
        "",
        "## Trend Thresholds",
        "",
        `- Wagon <75 by week: ${summary.thresholds.wagonConditionBelow75 ?? "never"}`,
        `- Wagon <50 by week: ${summary.thresholds.wagonConditionBelow50 ?? "never"}`,
        `- Sanctity <75 by week: ${summary.thresholds.wagonSanctityBelow75 ?? "never"}`,
        `- Sanctity <50 by week: ${summary.thresholds.wagonSanctityBelow50 ?? "never"}`,
        `- Herd health <50 by week: ${summary.thresholds.herdHealthBelow50 ?? "never"}`,
        `- Herd stress >50 by week: ${summary.thresholds.herdStressAbove50 ?? "never"}`,
        `- Fear >50 by week: ${summary.thresholds.fearAbove50 ?? "never"}`,
        "",
        "## Early Weekly Trends",
        "",
        trendRows || "- No trend rows available.",
        "",
        "## Specialists",
        "",
        specialistLines || "- None",
        "",
        "## Balance Flags",
        "",
        flagLines,
        "",
    ].join("\n");
}

function topFailure(summary) {
    const entry = Object.entries(summary.failures).sort((left, right) => right[1] - left[1])[0];
    return entry ? { cause: entry[0], count: entry[1] } : { cause: "", count: 0 };
}

function buildComparisonRows(policySummaries) {
    return policySummaries.map(summary => {
        const failure = topFailure(summary);
        return {
            policy: summary.policy,
            runs: summary.overall.runs,
            winRate: summary.overall.winRate,
            averageWeekEnded: summary.overall.averageWeekEnded,
            averageMilesReached: summary.overall.averageMilesReached,
            averageCattleRemaining: summary.overall.averageCattleRemaining,
            averageCrewAlive: summary.crew.averageAlive,
            averageCrewDead: summary.crew.averageDead,
            averageCrewDeserted: summary.crew.averageDeserted,
            mutinyRunRate: summary.mutiny.runRate,
            mutinyEligibleRunRate: summary.mutiny.eligibleRunRate,
            averageMutinyChance: summary.mutiny.averageChanceWhenEligible,
            averageMorale: summary.emotions.averageMorale,
            averageFear: summary.emotions.averageFear,
            averageWagonCondition: summary.wagon.averageCondition,
            averageWagonSanctity: summary.wagon.averageSanctity,
            blightTakenRate: summary.resources.blightTakenRate,
            cattleSpreadP10P90: summary.consistency.cattleP10toP90Spread,
            weekSpreadP10P90: summary.consistency.weekP10toP90Spread,
            wagon50Week: summary.thresholds.wagonConditionBelow50 ?? "",
            sanctity50Week: summary.thresholds.wagonSanctityBelow50 ?? "",
            topFailure: failure.cause,
            topFailureRate: percentage(failure.count, summary.overall.runs),
        };
    });
}

function buildComparisonInsights(policySummaries) {
    const insights = [];
    const topFailures = policySummaries.map(summary => topFailure(summary).cause).filter(Boolean);
    const allSameTopFailure = topFailures.length > 0 && topFailures.every(cause => cause === topFailures[0]);
    const avgWeekValues = policySummaries.map(summary => summary.overall.averageWeekEnded);
    const avgMilesValues = policySummaries.map(summary => summary.overall.averageMilesReached);
    const cattleValues = policySummaries.map(summary => summary.overall.averageCattleRemaining);
    const sanctityWeeks = policySummaries.map(summary => summary.thresholds.wagonSanctityBelow50).filter(value => value !== null);
    const wagonWeeks = policySummaries.map(summary => summary.thresholds.wagonConditionBelow50).filter(value => value !== null);

    if (allSameTopFailure) {
        insights.push(`All compared strategies are dominated by the same top failure cause: ${topFailures[0]}.`);
    }

    if (Math.max(...avgWeekValues) - Math.min(...avgWeekValues) <= 3 && Math.max(...avgMilesValues) - Math.min(...avgMilesValues) <= 120) {
        insights.push("Different strategy profiles are converging on very similar end timing and distance, which suggests the game may be constraining decision impact.");
    }

    if (Math.max(...cattleValues) - Math.min(...cattleValues) >= 25) {
        insights.push("Strategies are meaningfully separating on cattle outcome, so herd-preservation choices are producing visible divergence.");
    }

    if (sanctityWeeks.length === policySummaries.length && Math.max(...sanctityWeeks) - Math.min(...sanctityWeeks) <= 3) {
        insights.push(`Sanctity falls below 50 for every strategy within a ${Math.max(...sanctityWeeks) - Math.min(...sanctityWeeks)}-week window, suggesting a highly consistent sanctity clock.`);
    }

    if (wagonWeeks.length === policySummaries.length && Math.max(...wagonWeeks) <= 8) {
        insights.push("Wagon condition falls below 50 by week 8 or earlier for every strategy, which suggests wagon decay may be front-loaded regardless of style.");
    }

    return insights;
}

function buildComparisonMarkdown(policySummaries, config) {
    const rows = buildComparisonRows(policySummaries);
    const insights = buildComparisonInsights(policySummaries);
    const sortedByWins = [...rows].sort((left, right) =>
        right.winRate - left.winRate ||
        right.averageCattleRemaining - left.averageCattleRemaining
    );

    return [
        "# Deadwood Policy Comparison",
        "",
        `- Generated: ${new Date().toISOString()}`,
        `- Policies: ${config.policies.join(", ")}`,
        `- Runs per policy: ${config.runs}`,
        `- Seed Base: ${config.seedBase}`,
        "",
        "## Cross-Strategy Insights",
        "",
        ...(insights.length > 0 ? insights.map(item => `- ${item}`) : ["- No strong cross-strategy convergence/divergence insights triggered."]),
        "",
        "## Rankings",
        "",
        ...sortedByWins.map((row, index) => `${index + 1}. ${row.policy}: win rate ${row.winRate}%, avg cattle ${row.averageCattleRemaining}, top failure ${row.topFailure || "none"} (${row.topFailureRate}%)`),
        "",
        "## Policy Rows",
        "",
        ...rows.map(row =>
            `- ${row.policy}: week ${row.averageWeekEnded}, miles ${row.averageMilesReached}, cattle ${row.averageCattleRemaining}, morale ${row.averageMorale}, fear ${row.averageFear}, mutiny ${row.mutinyRunRate}% (eligible ${row.mutinyEligibleRunRate}%, avg chance ${row.averageMutinyChance}%), wagon<50 week ${row.wagon50Week || "never"}, sanctity<50 week ${row.sanctity50Week || "never"}, blight-taken ${row.blightTakenRate}%`
        ),
        "",
    ].join("\n");
}

function buildPairedSeedRows(policyResults) {
    const policies = policyResults.map(result => result.summary.policy);
    const rowsBySeed = new Map();

    for (const result of policyResults) {
        for (const run of result.runs) {
            const row = rowsBySeed.get(run.sharedSeed) || { sharedSeed: run.sharedSeed };
            const summary = run.report.summary;
            row[`${run.policyName}_outcome`] = summary.outcome;
            row[`${run.policyName}_failureCause`] = summary.failureCause || "";
            row[`${run.policyName}_weekEnded`] = summary.weekEnded;
            row[`${run.policyName}_milesReached`] = summary.milesReached;
            row[`${run.policyName}_cattleRemaining`] = summary.cattleRemaining;
            row[`${run.policyName}_wagonCondition`] = summary.wagonCondition;
            row[`${run.policyName}_wagonSanctity`] = summary.wagonSanctity;
            row[`${run.policyName}_morale`] = summary.morale;
            row[`${run.policyName}_fear`] = summary.fear;
            row[`${run.policyName}_win`] = summary.outcome === "victory" ? 1 : 0;
            rowsBySeed.set(run.sharedSeed, row);
        }
    }

    return [...rowsBySeed.values()]
        .sort((left, right) => left.sharedSeed.localeCompare(right.sharedSeed))
        .map(row => {
            const ordered = { sharedSeed: row.sharedSeed };
            for (const policy of policies) {
                ordered[`${policy}_outcome`] = row[`${policy}_outcome`] ?? "";
                ordered[`${policy}_failureCause`] = row[`${policy}_failureCause`] ?? "";
                ordered[`${policy}_weekEnded`] = row[`${policy}_weekEnded`] ?? "";
                ordered[`${policy}_milesReached`] = row[`${policy}_milesReached`] ?? "";
                ordered[`${policy}_cattleRemaining`] = row[`${policy}_cattleRemaining`] ?? "";
                ordered[`${policy}_wagonCondition`] = row[`${policy}_wagonCondition`] ?? "";
                ordered[`${policy}_wagonSanctity`] = row[`${policy}_wagonSanctity`] ?? "";
                ordered[`${policy}_morale`] = row[`${policy}_morale`] ?? "";
                ordered[`${policy}_fear`] = row[`${policy}_fear`] ?? "";
                ordered[`${policy}_win`] = row[`${policy}_win`] ?? "";
            }
            return ordered;
        });
}

function buildMetricSkillChance(metricKey, label, policyResults, accessor) {
    const policies = policyResults.map(result => result.summary.policy);
    const policyMeans = {};
    const policyStddevs = {};
    const perSeedRanges = [];
    const groupedBySeed = new Map();

    for (const result of policyResults) {
        const values = result.runs.map(run => accessor(run));
        policyMeans[result.summary.policy] = round(average(values));
        policyStddevs[result.summary.policy] = round(standardDeviation(values));

        for (const run of result.runs) {
            const bucket = groupedBySeed.get(run.sharedSeed) || {};
            bucket[result.summary.policy] = accessor(run);
            groupedBySeed.set(run.sharedSeed, bucket);
        }
    }

    for (const valuesByPolicy of groupedBySeed.values()) {
        const values = policies
            .map(policy => valuesByPolicy[policy])
            .filter(value => typeof value === "number");
        if (values.length >= 2) {
            perSeedRanges.push(Math.max(...values) - Math.min(...values));
        }
    }

    const meanValues = Object.values(policyMeans);
    const policyMeanSpread = meanValues.length > 0 ? round(Math.max(...meanValues) - Math.min(...meanValues)) : 0;
    const averageWithinPolicyStddev = round(average(Object.values(policyStddevs)));
    const averagePairedSeedRange = round(average(perSeedRanges));
    const medianPairedSeedRange = round(median(perSeedRanges));
    const signalRatio = averageWithinPolicyStddev > 0 ? round(policyMeanSpread / averageWithinPolicyStddev) : 0;
    const interpretation =
        signalRatio >= 1.25 ? "strategy-leaning" :
        signalRatio <= 0.75 ? "chance-leaning" :
        "mixed";

    return {
        key: metricKey,
        label,
        policyMeans,
        policyStddevs,
        policyMeanSpread,
        averageWithinPolicyStddev,
        averagePairedSeedRange,
        medianPairedSeedRange,
        signalRatio,
        interpretation,
    };
}

function buildSeedWinnerCounts(policyResults, metricKey, accessor) {
    const counts = {};
    const groupedBySeed = new Map();
    const policies = policyResults.map(result => result.summary.policy);

    for (const policy of policies) {
        counts[policy] = 0;
    }
    counts.tied = 0;

    for (const result of policyResults) {
        for (const run of result.runs) {
            const bucket = groupedBySeed.get(run.sharedSeed) || {};
            bucket[result.summary.policy] = accessor(run);
            groupedBySeed.set(run.sharedSeed, bucket);
        }
    }

    for (const valuesByPolicy of groupedBySeed.values()) {
        const entries = Object.entries(valuesByPolicy);
        if (entries.length === 0) {
            continue;
        }
        const bestValue = Math.max(...entries.map(([, value]) => value));
        const winners = entries.filter(([, value]) => value === bestValue).map(([policy]) => policy);
        if (winners.length === 1) {
            counts[winners[0]] += 1;
        } else {
            counts.tied += 1;
        }
    }

    return {
        metric: metricKey,
        counts,
    };
}

function buildSkillVsChanceReport(policyResults, config) {
    const pairedSeedRows = buildPairedSeedRows(policyResults);
    const winRates = Object.fromEntries(policyResults.map(result => [result.summary.policy, result.summary.overall.winRate]));
    const sortedWinRates = Object.entries(winRates).sort((left, right) => right[1] - left[1]);
    const bestWinPolicy = sortedWinRates[0]?.[0] || "";
    const winRateSpread = sortedWinRates.length > 1
        ? round(sortedWinRates[0][1] - sortedWinRates[sortedWinRates.length - 1][1])
        : 0;

    return {
        generatedAt: new Date().toISOString(),
        seedBase: config.seedBase,
        runsPerPolicy: config.runs,
        sharedSeedCount: pairedSeedRows.length,
        policies: policyResults.map(result => result.summary.policy),
        winRates,
        winRateSpread,
        bestWinPolicy,
        metrics: [
            buildMetricSkillChance("cattleRemaining", "Cattle Remaining", policyResults, run => run.report.summary.cattleRemaining),
            buildMetricSkillChance("milesReached", "Miles Reached", policyResults, run => run.report.summary.milesReached),
            buildMetricSkillChance("weekEnded", "Week Ended", policyResults, run => run.report.summary.weekEnded),
            buildMetricSkillChance("wagonCondition", "Wagon Condition", policyResults, run => run.report.summary.wagonCondition),
            buildMetricSkillChance("wagonSanctity", "Wagon Sanctity", policyResults, run => run.report.summary.wagonSanctity),
        ],
        seedWinners: [
            buildSeedWinnerCounts(policyResults, "cattleRemaining", run => run.report.summary.cattleRemaining),
            buildSeedWinnerCounts(policyResults, "milesReached", run => run.report.summary.milesReached),
        ],
        pairedSeedRows,
    };
}

function buildSkillVsChanceMarkdown(report) {
    const metricLines = report.metrics.map(metric => {
        const bestPolicy = Object.entries(metric.policyMeans).sort((left, right) => right[1] - left[1])[0]?.[0] || "none";
        return [
            `### ${metric.label}`,
            "",
            `- Best policy mean: ${bestPolicy} (${metric.policyMeans[bestPolicy] ?? 0})`,
            `- Policy mean spread: ${metric.policyMeanSpread}`,
            `- Average within-policy stddev: ${metric.averageWithinPolicyStddev}`,
            `- Average paired-seed range: ${metric.averagePairedSeedRange}`,
            `- Median paired-seed range: ${metric.medianPairedSeedRange}`,
            `- Signal ratio (policy spread / within-policy stddev): ${metric.signalRatio}`,
            `- Read: ${metric.interpretation}`,
            "",
        ].join("\n");
    }).join("\n");

    const winnerLines = report.seedWinners
        .map(result => `- ${result.metric}: ${Object.entries(result.counts).map(([policy, count]) => `${policy} ${count}`).join(", ")}`)
        .join("\n");

    return [
        "# Deadwood Skill Vs Chance",
        "",
        `- Generated: ${report.generatedAt}`,
        `- Policies: ${report.policies.join(", ")}`,
        `- Runs per policy: ${report.runsPerPolicy}`,
        `- Shared seeds compared: ${report.sharedSeedCount}`,
        `- Seed Base: ${report.seedBase}`,
        "",
        "## Headline",
        "",
        `- Win-rate spread across strategies: ${report.winRateSpread} points`,
        `- Best win-rate policy: ${report.bestWinPolicy || "none"} (${report.bestWinPolicy ? report.winRates[report.bestWinPolicy] : 0}%)`,
        "",
        "## Metric Analysis",
        "",
        metricLines,
        "## Shared-Seed Winners",
        "",
        winnerLines || "- No shared-seed winner counts available.",
        "",
        "## Interpretation",
        "",
        "- `strategy-leaning` means policy differences are larger than the typical run-to-run spread within a policy.",
        "- `chance-leaning` means randomness inside a single policy is as large as or larger than the policy gap.",
        "- `mixed` means both strategy and chance are materially shaping the results.",
        "",
    ].join("\n");
}

async function runPolicyBatch(config, policyName, outputDir, seedLabels) {
    const runsDir = path.join(outputDir, "runs");
    await fs.ensureDir(outputDir);
    if (config.savePerRun) {
        await fs.ensureDir(runsDir);
    }

    const runs = [];
    for (let index = 0; index < config.runs; index += 1) {
        const seedLabel = seedLabels[index];
        const run = await runAutoplay({
            seedLabel,
            policyName,
            captureLog: config.captureLog,
            maxSteps: config.maxSteps,
        });
        runs.push(run);

        if (config.savePerRun) {
            const filePath = path.join(runsDir, `${sanitizeFilePart(run.report.runId)}.json`);
            await fs.writeJson(filePath, run.report, { spaces: 2 });
        }
    }

    const summary = summarizeRuns(runs);
    const rows = runs.map(flattenRun);

    await fs.writeJson(path.join(outputDir, "summary.json"), summary, { spaces: 2 });
    await fs.writeFile(path.join(outputDir, "summary.md"), buildSummaryMarkdown(summary, config), "utf8");
    await fs.writeFile(path.join(outputDir, "runs.csv"), toCsv(rows), "utf8");

    if (config.captureLog) {
        const combinedLogs = runs
            .map(run => [`# ${run.seedLabel}`, ...run.logLines, ""].join("\n"))
            .join("\n");
        await fs.writeFile(path.join(outputDir, "sample-log.txt"), combinedLogs, "utf8");
    }

    return { outputDir, summary, runs };
}

async function runBatch(config) {
    const defaultOutDir = path.join(
        repoRoot,
        "reports",
        "deadwood-sims",
        `${timestampSlug()}_${sanitizeFilePart(config.seedBase)}_${config.policies.join("-")}_${config.runs}-runs`,
    );
    const outputDir = config.outputDir || defaultOutDir;
    await fs.ensureDir(outputDir);
    const sharedSeedLabels = Array.from({ length: config.runs }, (_, index) => `${config.seedBase}:run:${index + 1}`);

    const policyResults = [];
    const allRows = [];
    for (const policyName of config.policies) {
        const policyDir = config.policies.length === 1 ? outputDir : path.join(outputDir, policyName);
        const result = await runPolicyBatch(config, policyName, policyDir, sharedSeedLabels);
        policyResults.push(result);
        allRows.push(...result.runs.map(flattenRun));
    }

    if (config.policies.length > 1) {
        const policySummaries = policyResults.map(result => result.summary);
        const skillVsChance = buildSkillVsChanceReport(policyResults, config);
        await fs.writeJson(path.join(outputDir, "comparison.json"), {
            policies: policySummaries,
            rows: buildComparisonRows(policySummaries),
            insights: buildComparisonInsights(policySummaries),
        }, { spaces: 2 });
        await fs.writeFile(path.join(outputDir, "comparison.md"), buildComparisonMarkdown(policySummaries, config), "utf8");
        await fs.writeFile(path.join(outputDir, "comparison.csv"), toCsv(buildComparisonRows(policySummaries)), "utf8");
        await fs.writeFile(path.join(outputDir, "all-runs.csv"), toCsv(allRows), "utf8");
        await fs.writeJson(path.join(outputDir, "skill-vs-chance.json"), skillVsChance, { spaces: 2 });
        await fs.writeFile(path.join(outputDir, "skill-vs-chance.md"), buildSkillVsChanceMarkdown(skillVsChance), "utf8");
        await fs.writeFile(path.join(outputDir, "paired-seeds.csv"), toCsv(skillVsChance.pairedSeedRows), "utf8");
    }

    return {
        outputDir,
        summaries: policyResults.map(result => result.summary),
    };
}

async function main() {
    const args = mri(process.argv.slice(2), {
        boolean: ["capture-log", "per-run"],
        string: ["seed", "out", "policy", "policies"],
        default: {
            runs: 100,
            seed: "deadwood-balanced",
            policy: "balanced",
            "capture-log": false,
            "per-run": true,
            "max-steps": 1000,
        },
    });

    const requestedPolicies = args.policies
        ? String(args.policies).split(",").map(value => value.trim()).filter(Boolean)
        : [String(args.policy)];
    const policies = requestedPolicies.includes("all")
        ? Object.keys(POLICY_PROFILES)
        : requestedPolicies;
    policies.forEach(getPolicyProfile);

    const config = {
        runs: Math.max(1, Number.parseInt(String(args.runs), 10) || 100),
        seedBase: String(args.seed),
        outputDir: args.out ? path.resolve(repoRoot, String(args.out)) : null,
        policies,
        savePerRun: args["per-run"] !== false,
        captureLog: Boolean(args["capture-log"]),
        maxSteps: Math.max(100, Number.parseInt(String(args["max-steps"]), 10) || 1000),
    };

    const { outputDir, summaries } = await runBatch(config);

    console.log(`Simulation output written to ${path.relative(repoRoot, outputDir)}`);
    summaries.forEach(summary => {
        console.log(`${summary.policy}: runs ${summary.overall.runs}, win rate ${summary.overall.winRate}%, avg cattle ${summary.overall.averageCattleRemaining}, avg week ${summary.overall.averageWeekEnded}`);
    });
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

namespace DeadwoodModel {
    export type CrewRole = "leader" | "scout" | "drover" | "hunter" | "hand";
    export type CowCondition = "healthy" | "maimed" | "sick" | "blighted" | "lost" | "dead";
    export type RemovalMode = "weakest" | "injured" | "infected" | "mixed";
    export type HerdCompositionContext = "later-trail" | "arrival";
    export type TradeTime = "day" | "night";
    export type DamnedTradeItem = "oil" | "mirror" | "nails" | "vigil" | "blessing" | "cache";

    export type AmbientPressure = {
        fear: number;
        sanctity: number;
        herdBlight: number;
        herdStress: number;
        label: "none" | "western" | "staked-plains" | "salt-flats";
    };

    export type Cow = {
        id: number;
        alive: boolean;
        health: number;
        stress: number;
        fatigue: number;
        blight: number;
        condition: CowCondition;
        injured: boolean;
        infected: boolean;
        trauma: number;
    };

    export type HerdSummary = {
        cattle: number;
        herdHealth: number;
        herdStress: number;
        herdFatigue: number;
        herdBlight: number;
    };

    export type CrewMember = {
        id: number;
        name: string;
        role: CrewRole;
        alive: boolean;
        isLeader: boolean;
        fear: number;
        morale: number;
        hunger: number;
        health: number;
        cattleSkill: number;
        huntSkill: number;
        loyalty: number;
        guardDutyCount: number;
        foodReceivedTotal: number;
        whiskeyReceivedTotal: number;
    };

    export type CrewSummary = {
        morale: number;
        fear: number;
        baseCattleSkill: number;
        effectiveCattleSkill: number;
        handlingCapacity: number;
    };

    export type CrewWarningSignals = {
        breakingMemberName: string | null;
        guardImbalanceName: string | null;
        portionImbalanceName: string | null;
        whiskeyImbalance: boolean;
        noLeader: boolean;
        overCapacity: boolean;
        severeOverCapacity: boolean;
    };

    export type CrewConsequence =
        | { type: "mutiny"; targetId: number }
        | { type: "guard-exile"; targetId: number }
        | { type: "food-exile"; targetId: number }
        | { type: "whiskey-desertion"; targetId: number }
        | { type: "paranoia-purge"; targetId: number; fatal: boolean; cause: "food" | "whiskey" | "guard" }
        | { type: "collapse"; targetId: number; fatal: boolean }
        | null;

    export function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    export function clampStat(value: number): number {
        return clamp(value, 0, 100);
    }

    export function crewSkillModifier(member: CrewMember): number {
        const fearFactor = clamp(1 - (member.fear / 220), 0.7, 1.02);
        const moraleFactor = clamp(0.78 + (member.morale / 260), 0.65, 1.05);
        const healthFactor = clamp(0.7 + (member.health / 300), 0.65, 1.0);
        const hungerFactor = clamp(1 - (member.hunger / 260), 0.68, 1.0);
        return Number((fearFactor * moraleFactor * healthFactor * hungerFactor).toFixed(3));
    }

    export function effectiveCrewCattleSkill(member: CrewMember): number {
        return Math.round(member.cattleSkill * crewSkillModifier(member));
    }

    export function huntSkillModifier(member: CrewMember): number {
        const fearFactor = clamp(1 - (member.fear / 180), 0.55, 1.0);
        const moraleFactor = clamp(0.76 + (member.morale / 240), 0.65, 1.03);
        const healthFactor = clamp(0.68 + (member.health / 260), 0.6, 1.0);
        const hungerFactor = clamp(1 - (member.hunger / 230), 0.62, 1.0);
        return Number((fearFactor * moraleFactor * healthFactor * hungerFactor).toFixed(3));
    }

    export function effectiveHuntSkill(member: CrewMember): number {
        return Math.round(member.huntSkill * huntSkillModifier(member));
    }

    export function backupHunterPenalty(member: CrewMember): number {
        const effective = effectiveHuntSkill(member);
        return Math.max(0, Math.round((60 - effective) * 0.6));
    }

    export function backupHuntShotChance(baseChance: number, member: CrewMember): number {
        const chanceValue = baseChance - backupHunterPenalty(member);
        return clamp(chanceValue, 15, baseChance);
    }

    export function backupHuntSkillGain(hits: number, bulletsSpent: number): number {
        if (bulletsSpent <= 0) {
            return 0;
        }

        if (hits <= 0) {
            return 1;
        }

        if (hits >= Math.max(4, Math.ceil(bulletsSpent * 0.6))) {
            return 3;
        }

        return 2;
    }

    export function blightedFoodContaminationAmount(blightedFood: number): number {
        if (blightedFood <= 0) {
            return 0;
        }

        if (blightedFood <= 10) {
            return 1;
        }

        if (blightedFood <= 25) {
            return 2;
        }

        if (blightedFood <= 50) {
            return 4;
        }

        if (blightedFood <= 80) {
            return 7;
        }

        return 10;
    }

    export function hunterTraplineChance(member: CrewMember): number {
        if (!member.alive || member.role !== "hunter") {
            return 0;
        }

        if (member.health <= 30 || member.fear >= 88) {
            return 0;
        }

        let chanceValue = 10;

        if (member.morale >= 75) {
            chanceValue += 12;
        } else if (member.morale >= 60) {
            chanceValue += 7;
        } else if (member.morale >= 45) {
            chanceValue += 3;
        }

        if (member.health >= 78) {
            chanceValue += 4;
        } else if (member.health >= 62) {
            chanceValue += 2;
        }

        if (member.fear >= 70) {
            chanceValue -= 8;
        } else if (member.fear >= 50) {
            chanceValue -= 4;
        }

        if (member.hunger >= 75) {
            chanceValue -= 6;
        } else if (member.hunger >= 55) {
            chanceValue -= 3;
        }

        return clamp(chanceValue, 0, 30);
    }

    export function droverHerdCareChance(member: CrewMember): number {
        if (!member.alive || member.role !== "drover") {
            return 0;
        }

        if (member.health <= 30 || member.fear >= 88) {
            return 0;
        }

        let chanceValue = 9;

        if (member.morale >= 75) {
            chanceValue += 11;
        } else if (member.morale >= 60) {
            chanceValue += 7;
        } else if (member.morale >= 45) {
            chanceValue += 3;
        }

        if (member.health >= 80) {
            chanceValue += 4;
        } else if (member.health >= 64) {
            chanceValue += 2;
        }

        if (member.fear >= 70) {
            chanceValue -= 8;
        } else if (member.fear >= 50) {
            chanceValue -= 4;
        }

        if (member.hunger >= 75) {
            chanceValue -= 6;
        } else if (member.hunger >= 55) {
            chanceValue -= 3;
        }

        return clamp(chanceValue, 0, 28);
    }

    export function handMaintenanceChance(member: CrewMember): number {
        if (!member.alive || member.role !== "hand") {
            return 0;
        }

        if (member.health <= 30 || member.fear >= 88) {
            return 0;
        }

        let chanceValue = 11;

        if (member.morale >= 75) {
            chanceValue += 12;
        } else if (member.morale >= 60) {
            chanceValue += 7;
        } else if (member.morale >= 45) {
            chanceValue += 3;
        }

        if (member.health >= 80) {
            chanceValue += 4;
        } else if (member.health >= 64) {
            chanceValue += 2;
        }

        if (member.fear >= 70) {
            chanceValue -= 8;
        } else if (member.fear >= 50) {
            chanceValue -= 4;
        }

        if (member.hunger >= 75) {
            chanceValue -= 6;
        } else if (member.hunger >= 55) {
            chanceValue -= 3;
        }

        return clamp(chanceValue, 0, 30);
    }

    export function scoutTrailSenseChance(member: CrewMember): number {
        if (!member.alive || member.role !== "scout") {
            return 0;
        }

        if (member.health <= 30 || member.fear >= 88) {
            return 0;
        }

        let chanceValue = 10;

        if (member.morale >= 75) {
            chanceValue += 12;
        } else if (member.morale >= 60) {
            chanceValue += 7;
        } else if (member.morale >= 45) {
            chanceValue += 3;
        }

        if (member.health >= 80) {
            chanceValue += 4;
        } else if (member.health >= 64) {
            chanceValue += 2;
        }

        if (member.fear >= 70) {
            chanceValue -= 8;
        } else if (member.fear >= 50) {
            chanceValue -= 4;
        }

        if (member.hunger >= 75) {
            chanceValue -= 6;
        } else if (member.hunger >= 55) {
            chanceValue -= 3;
        }

        return clamp(chanceValue, 0, 30);
    }

    export function crewHandlingContribution(member: CrewMember): number {
        const leaderBonus = member.isLeader ? 1.08 : 1;
        return Math.round(effectiveCrewCattleSkill(member) * leaderBonus);
    }

    export function summarizeCrew(crew: CrewMember[]): CrewSummary {
        const living = crew.filter(member => member.alive);
        if (living.length === 0) {
            return { morale: 0, fear: 100, baseCattleSkill: 0, effectiveCattleSkill: 0, handlingCapacity: 0 };
        }

        const totals = living.reduce((sum, member) => {
            sum.morale += member.morale;
            sum.fear += member.fear;
            sum.baseCattleSkill += member.cattleSkill;
            sum.effectiveCattleSkill += effectiveCrewCattleSkill(member);
            sum.handlingCapacity += crewHandlingContribution(member);
            return sum;
        }, { morale: 0, fear: 0, baseCattleSkill: 0, effectiveCattleSkill: 0, handlingCapacity: 0 });

        if (!living.some(member => member.isLeader)) {
            totals.effectiveCattleSkill = Math.round(totals.effectiveCattleSkill * 0.9);
            totals.handlingCapacity = Math.round(totals.handlingCapacity * 0.88);
        }

        totals.handlingCapacity = Math.round(totals.handlingCapacity * 2.1);

        return {
            morale: Math.round(totals.morale / living.length),
            fear: Math.round(totals.fear / living.length),
            baseCattleSkill: totals.baseCattleSkill,
            effectiveCattleSkill: totals.effectiveCattleSkill,
            handlingCapacity: totals.handlingCapacity,
        };
    }

    export function crewWarningSignals(crew: CrewMember[], cattle: number): CrewWarningSignals {
        const living = crew.filter(member => member.alive);
        const crewHands = living.filter(member => !member.isLeader);
        if (living.length === 0) {
            return {
                breakingMemberName: null,
                guardImbalanceName: null,
                portionImbalanceName: null,
                whiskeyImbalance: false,
                noLeader: true,
                overCapacity: cattle > 0,
                severeOverCapacity: cattle > 0,
            };
        }

        const summary = summarizeCrew(living);
        const breaking = [...living].sort((left, right) =>
            ((100 - right.health) + right.hunger + right.fear + (100 - right.morale)) -
            ((100 - left.health) + left.hunger + left.fear + (100 - left.morale))
        )[0];
        const grievancePool = crewHands.length >= 2 ? crewHands : living;
        const mostWorked = [...grievancePool].sort((left, right) => right.guardDutyCount - left.guardDutyCount)[0];
        const leastWorked = [...grievancePool].sort((left, right) => left.guardDutyCount - right.guardDutyCount)[0];
        const mostFed = [...grievancePool].sort((left, right) => right.foodReceivedTotal - left.foodReceivedTotal)[0];
        const leastFed = [...grievancePool].sort((left, right) => left.foodReceivedTotal - right.foodReceivedTotal)[0];
        const whiskeyFavored = [...grievancePool].sort((left, right) => right.whiskeyReceivedTotal - left.whiskeyReceivedTotal)[0];
        const whiskeyDry = [...grievancePool].sort((left, right) => left.whiskeyReceivedTotal - right.whiskeyReceivedTotal)[0];
        const guardGap = mostWorked.guardDutyCount - leastWorked.guardDutyCount;
        const foodGap = mostFed.foodReceivedTotal - leastFed.foodReceivedTotal;
        const whiskeyGap = whiskeyFavored.whiskeyReceivedTotal - whiskeyDry.whiskeyReceivedTotal;

        return {
            breakingMemberName: breaking && (breaking.morale <= 18 || breaking.fear >= 85 || breaking.hunger >= 80) ? breaking.name : null,
            guardImbalanceName: guardGap >= 4 ? leastWorked.name : null,
            portionImbalanceName: foodGap >= 10 && summary.morale <= 42 && summary.fear >= 35 ? mostFed.name : null,
            whiskeyImbalance: whiskeyGap >= 4 && summary.morale <= 38 && summary.fear >= 38,
            noLeader: !living.some(member => member.isLeader),
            overCapacity: cattle > summary.handlingCapacity + 50,
            severeOverCapacity: summary.handlingCapacity > 0 ? cattle > Math.round(summary.handlingCapacity * 1.25) : cattle > 0,
        };
    }

    export function assessCrewConsequence(crew: CrewMember[], visibleMorale: number, visibleFear: number): CrewConsequence {
        const living = crew.filter(member => member.alive);
        if (living.length <= 1) {
            return null;
        }

        const leader = living.find(member => member.isLeader);
        const crewHands = living.filter(member => !member.isLeader);
        const grievancePool = crewHands.length >= 2 ? crewHands : living;
        const averageHunger = Math.round(living.reduce((sum, member) => sum + member.hunger, 0) / living.length);
        const averageLoyalty = Math.round(living.reduce((sum, member) => sum + member.loyalty, 0) / living.length);
        const mostOverworked = [...grievancePool].sort((left, right) => right.guardDutyCount - left.guardDutyCount || right.fear - left.fear)[0];
        const leastWorked = [...grievancePool].sort((left, right) => left.guardDutyCount - right.guardDutyCount || left.foodReceivedTotal - right.foodReceivedTotal)[0];
        const bestFed = [...grievancePool].sort((left, right) => right.foodReceivedTotal - left.foodReceivedTotal || left.hunger - right.hunger)[0];
        const leastFed = [...grievancePool].sort((left, right) => left.foodReceivedTotal - right.foodReceivedTotal || right.hunger - left.hunger)[0];
        const whiskeyFavored = [...grievancePool].sort((left, right) => right.whiskeyReceivedTotal - left.whiskeyReceivedTotal || left.fear - right.fear)[0];
        const whiskeyDry = [...grievancePool].sort((left, right) => left.whiskeyReceivedTotal - right.whiskeyReceivedTotal || right.fear - left.fear)[0];
        const brittle = [...living].sort((left, right) =>
            ((100 - right.health) + right.hunger + right.fear + (100 - right.morale)) -
            ((100 - left.health) + left.hunger + left.fear + (100 - left.morale))
        )[0];
        const guardGap = mostOverworked.guardDutyCount - leastWorked.guardDutyCount;
        const foodGap = bestFed.foodReceivedTotal - leastFed.foodReceivedTotal;
        const whiskeyGap = whiskeyFavored.whiskeyReceivedTotal - whiskeyDry.whiskeyReceivedTotal;

        if (leader && visibleMorale <= 24 && visibleFear >= 72 && averageLoyalty <= 42 && (guardGap >= 4 || foodGap >= 9)) {
            return { type: "mutiny", targetId: leader.id };
        }

        if (visibleFear >= 74 && visibleMorale <= 34) {
            if (foodGap >= 9) {
                return { type: "paranoia-purge", targetId: bestFed.id, fatal: visibleFear >= 82, cause: "food" };
            }
            if (whiskeyGap >= 4) {
                return { type: "paranoia-purge", targetId: whiskeyFavored.id, fatal: visibleFear >= 84, cause: "whiskey" };
            }
            if (guardGap >= 5) {
                return { type: "paranoia-purge", targetId: leastWorked.id, fatal: false, cause: "guard" };
            }
        }

        if (guardGap >= 4 && visibleMorale <= 34 && visibleFear >= 48) {
            return { type: "guard-exile", targetId: leastWorked.id };
        }

        if (foodGap >= 10 && averageHunger >= 62 && visibleMorale <= 36) {
            return { type: "food-exile", targetId: bestFed.id };
        }

        if (whiskeyGap >= 4 && visibleMorale <= 30 && visibleFear >= 44) {
            return { type: "whiskey-desertion", targetId: whiskeyFavored.id };
        }

        if (brittle && (brittle.health <= 6 || brittle.hunger >= 96 || brittle.morale <= 4 || brittle.fear >= 97)) {
            return { type: "collapse", targetId: brittle.id, fatal: brittle.health <= 6 };
        }

        return null;
    }

    export function updateCowCondition(cow: Cow): void {
        cow.health = clampStat(cow.health);
        cow.stress = clampStat(cow.stress);
        cow.fatigue = clampStat(cow.fatigue);
        cow.blight = clampStat(cow.blight);
        cow.trauma = clampStat(cow.trauma);
        cow.injured = cow.injured || cow.health < 45 || cow.fatigue >= 75;
        cow.infected = cow.infected || cow.blight >= 45;

        if (!cow.alive || cow.health <= 0) {
            cow.alive = false;
            if (cow.condition !== "lost") {
                cow.condition = "dead";
            }
            return;
        }

        if (cow.blight >= 60 || cow.infected) {
            cow.condition = "blighted";
            return;
        }

        if (cow.health < 30 || (cow.injured && cow.fatigue >= 65)) {
            cow.condition = "sick";
            return;
        }

        if (cow.injured || cow.health < 45 || cow.fatigue >= 75) {
            cow.condition = "maimed";
            return;
        }

        cow.condition = "healthy";
    }

    export function summarizeHerd(herd: Cow[]): HerdSummary {
        const active = herd.filter(cow => cow.alive);
        if (active.length === 0) {
            return {
                cattle: 0,
                herdHealth: 0,
                herdStress: 0,
                herdFatigue: 0,
                herdBlight: 0,
            };
        }

        const totals = active.reduce((sum, cow) => {
            sum.health += cow.health;
            sum.stress += cow.stress;
            sum.fatigue += cow.fatigue;
            sum.blight += cow.blight;
            return sum;
        }, { health: 0, stress: 0, fatigue: 0, blight: 0 });

        return {
            cattle: active.length,
            herdHealth: Math.round(totals.health / active.length),
            herdStress: Math.round(totals.stress / active.length),
            herdFatigue: Math.round(totals.fatigue / active.length),
            herdBlight: Math.round(totals.blight / active.length),
        };
    }

    export function cowRiskScore(cow: Cow): number {
        return (100 - cow.health) + cow.stress + cow.fatigue + cow.blight;
    }

    export function chooseRemovalCandidates(herd: Cow[], count: number, mode: RemovalMode = "weakest"): Cow[] {
        const active = herd.filter(cow => cow.alive);
        if (active.length === 0 || count <= 0) {
            return [];
        }

        const candidates = [...active].sort((left, right) => {
            const leftRisk =
                mode === "injured"
                    ? (left.injured ? 120 : 0) + (100 - left.health) + left.fatigue + left.stress / 2
                    : mode === "infected"
                        ? (left.infected ? 120 : 0) + left.blight + (100 - left.health) / 2
                        : mode === "mixed"
                            ? cowRiskScore(left) + (left.injured ? 25 : 0) + (left.infected ? 25 : 0)
                            : cowRiskScore(left);
            const rightRisk =
                mode === "injured"
                    ? (right.injured ? 120 : 0) + (100 - right.health) + right.fatigue + right.stress / 2
                    : mode === "infected"
                        ? (right.infected ? 120 : 0) + right.blight + (100 - right.health) / 2
                        : mode === "mixed"
                            ? cowRiskScore(right) + (right.injured ? 25 : 0) + (right.infected ? 25 : 0)
                            : cowRiskScore(right);
            return rightRisk - leftRisk;
        });

        return candidates.slice(0, Math.min(count, candidates.length));
    }

    export function huntShotChance(miles: number, occultHuntBonus: boolean, nightHuntPenalty: boolean): number {
        let chanceValue = 70;

        if (miles >= 520) {
            chanceValue -= 15;
        } else if (miles >= 310) {
            chanceValue -= 10;
        } else if (miles >= 120) {
            chanceValue -= 5;
        }

        if (occultHuntBonus) {
            chanceValue += 5;
        }

        if (nightHuntPenalty) {
            chanceValue -= 5;
        }

        return clamp(chanceValue, 25, 90);
    }

    export function huntCleanChance(miles: number, occultHuntBonus: boolean, nightHuntPenalty: boolean): number {
        return huntShotChance(miles, occultHuntBonus, nightHuntPenalty);
    }

    function taggedCowCount(herd: Cow[], tag: "injured" | "infected" | "traumatized" | "blighted"): number {
        return herd.filter(cow => cow.alive).filter(cow =>
            tag === "injured" ? cow.injured :
            tag === "infected" ? cow.infected :
            tag === "traumatized" ? cow.trauma >= 55 :
            cow.condition === "blighted"
        ).length;
    }

    export function herdCompositionLine(herd: Cow[], context: HerdCompositionContext): string | null {
        const living = herd.filter(cow => cow.alive).length;
        if (living <= 0) {
            return null;
        }

        const infected = taggedCowCount(herd, "infected");
        const traumatized = taggedCowCount(herd, "traumatized");
        const injured = taggedCowCount(herd, "injured");
        const blighted = taggedCowCount(herd, "blighted");

        if (context === "later-trail") {
            if (infected >= Math.ceil(living * 0.18) || blighted >= Math.ceil(living * 0.14)) {
                return "A GLASSY-EYED THREAD RUNS THROUGH THE HERD NOW. TOO MANY OF THE STOCK LOOK LIKE THEY ARE LISTENING TO SOMETHING UNDER THE GROUND.";
            }
            if (traumatized >= Math.ceil(living * 0.2)) {
                return "TOO MANY OF THE CATTLE STARTLE AT EMPTY GROUND. THE HERD HAS LEARNED FEAR SO WELL IT NO LONGER NEEDS A CAUSE.";
            }
            if (injured >= Math.ceil(living * 0.18)) {
                return "THE DRIVE STILL MOVES, BUT TOO MUCH OF IT MOVES ON BAD LEGS. LIMPING STOCK KEEP FALLING TO THE REAR OF THE LINE.";
            }
            return "THE HERD IS THINNER AND STRANGER THAN IT WAS, BUT IT STILL MOVES LIKE A HERD WHEN THE LIGHT HOLDS.";
        }

        if (infected >= Math.ceil(living * 0.18) || blighted >= Math.ceil(living * 0.14)) {
            return "YOU SAVED THE HERD, BUT NOT ALL OF IT ARRIVED CLEAN. SOME OF THE STOCK STARE THROUGH THE GATE LIKE THEY RECOGNIZE SOMETHING PAST IT.";
        }
        if (traumatized >= Math.ceil(living * 0.2)) {
            return "THE HERD MAKES IT THROUGH, BUT TOO MANY OF THEM FLINCH AT DUST, SHADOW, AND OPEN SKY. THEY CROSSED THE WEST WITHOUT LEAVING IT BEHIND.";
        }
        if (injured >= Math.ceil(living * 0.18)) {
            return "THE HERD REACHES SANCTUARY ON BAD LEGS. TOO MANY OF THE SURVIVORS ARE LIMPING, SCARRED, AND ONE HARD WEEK FROM COLLAPSE.";
        }
        return "FOR ALL THE LOSSES, THE STOCK THAT SURVIVED STILL LOOK LIKE THEY BELONG TO THE LIVING WORLD.";
    }

    export function damnedTradeCost(tradeTime: TradeTime, item: DamnedTradeItem, tradesUsed: number): number {
        const tier = clamp(tradesUsed, 0, 2);
        const baseCost =
            tradeTime === "day"
                ? 1
                : item === "cache"
                    ? 1
                    : 2;
        return baseCost + tier;
    }

    export function westwardAmbientPressure(miles: number): AmbientPressure {
        if (miles >= 760) {
            return {
                fear: 3,
                sanctity: -4,
                herdBlight: 2,
                herdStress: 2,
                label: "salt-flats",
            };
        }

        if (miles >= 520) {
            return {
                fear: 2,
                sanctity: -3,
                herdBlight: 1,
                herdStress: 1,
                label: "staked-plains",
            };
        }

        if (miles >= 310) {
            return {
                fear: 1,
                sanctity: -2,
                herdBlight: 0,
                herdStress: 0,
                label: "western",
            };
        }

        return {
            fear: 0,
            sanctity: 0,
            herdBlight: 0,
            herdStress: 0,
            label: "none",
        };
    }
}

(globalThis as { DeadwoodModel?: typeof DeadwoodModel }).DeadwoodModel = DeadwoodModel;

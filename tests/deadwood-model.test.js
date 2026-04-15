const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/ts/deadwood-model.js');

const { DeadwoodModel } = globalThis;

function makeCow(id, overrides = {}) {
  return {
    id,
    alive: true,
    health: 70,
    stress: 20,
    fatigue: 20,
    blight: 0,
    condition: 'healthy',
    injured: false,
    infected: false,
    trauma: 0,
    ...overrides,
  };
}

function makeCrewMember(id, overrides = {}) {
  return {
    id,
    name: `HAND ${id}`,
    role: 'hand',
    alive: true,
    isLeader: false,
    fear: 20,
    morale: 65,
    hunger: 20,
    health: 80,
    cattleSkill: 100,
    loyalty: 70,
    guardDutyCount: 0,
    foodReceivedTotal: 0,
    whiskeyReceivedTotal: 0,
    ...overrides,
  };
}

test('updateCowCondition marks infected cattle as blighted', () => {
  const cow = makeCow(1, { blight: 50 });
  DeadwoodModel.updateCowCondition(cow);
  assert.equal(cow.infected, true);
  assert.equal(cow.condition, 'blighted');
});

test('updateCowCondition marks injured exhausted cattle as sick', () => {
  const cow = makeCow(2, { health: 42, fatigue: 70, injured: true });
  DeadwoodModel.updateCowCondition(cow);
  assert.equal(cow.condition, 'sick');
});

test('summarizeHerd averages only living cattle', () => {
  const herd = [
    makeCow(1, { health: 80, stress: 20, fatigue: 10, blight: 0 }),
    makeCow(2, { health: 60, stress: 40, fatigue: 30, blight: 10 }),
    makeCow(3, { alive: false, health: 0, condition: 'dead' }),
  ];

  const summary = DeadwoodModel.summarizeHerd(herd);
  assert.deepEqual(summary, {
    cattle: 2,
    herdHealth: 70,
    herdStress: 30,
    herdFatigue: 20,
    herdBlight: 5,
  });
});

test('chooseRemovalCandidates prefers injured cattle in injured mode', () => {
  const herd = [
    makeCow(1, { health: 60, fatigue: 50, injured: true }),
    makeCow(2, { health: 20, fatigue: 10, injured: false }),
    makeCow(3, { health: 75, fatigue: 20, injured: false }),
  ];

  const [selected] = DeadwoodModel.chooseRemovalCandidates(herd, 1, 'injured');
  assert.equal(selected.id, 1);
});

test('huntCleanChance reflects westward penalties and one-night modifiers', () => {
  assert.equal(DeadwoodModel.huntCleanChance(0, false, false), 70);
  assert.equal(DeadwoodModel.huntCleanChance(150, false, false), 65);
  assert.equal(DeadwoodModel.huntCleanChance(350, true, false), 65);
  assert.equal(DeadwoodModel.huntCleanChance(600, true, true), 55);
});

test('herdCompositionLine reports infected later-trail herd composition', () => {
  const herd = [
    ...Array.from({ length: 7 }, (_, index) => makeCow(index, { infected: true, blight: 50, condition: 'blighted' })),
    ...Array.from({ length: 23 }, (_, index) => makeCow(index + 10)),
  ];

  const line = DeadwoodModel.herdCompositionLine(herd, 'later-trail');
  assert.match(line, /GLASSY-EYED THREAD/);
});

test('herdCompositionLine reports traumatized arrival herd composition', () => {
  const herd = [
    ...Array.from({ length: 8 }, (_, index) => makeCow(index, { trauma: 70, stress: 75 })),
    ...Array.from({ length: 22 }, (_, index) => makeCow(index + 10)),
  ];

  const line = DeadwoodModel.herdCompositionLine(herd, 'arrival');
  assert.match(line, /FLINCH AT DUST, SHADOW, AND OPEN SKY/);
});

test('summarizeCrew applies a leader bonus and leader-loss penalty to handling capacity', () => {
  const withLeader = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, cattleSkill: 92 }),
    makeCrewMember(2),
    makeCrewMember(3),
  ];
  const withoutLeader = withLeader.map(member => ({
    ...member,
    isLeader: false,
  }));

  const led = DeadwoodModel.summarizeCrew(withLeader);
  const leaderless = DeadwoodModel.summarizeCrew(withoutLeader);

  assert.ok(led.handlingCapacity > leaderless.handlingCapacity);
  assert.ok(led.baseCattleSkill > 0);
  assert.ok(led.effectiveCattleSkill <= led.baseCattleSkill);
});

test('the recommended opening crew can manage the starting 500-head drive', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, fear: 12, morale: 78, hunger: 18, health: 88, cattleSkill: 92, loyalty: 92 }),
    makeCrewMember(2, { name: 'MARA QUILL', role: 'scout', fear: 18, morale: 66, hunger: 20, health: 79, cattleSkill: 68, loyalty: 72 }),
    makeCrewMember(3, { name: 'JONAH REED', role: 'drover', fear: 16, morale: 68, hunger: 19, health: 82, cattleSkill: 76, loyalty: 76 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', role: 'hunter', fear: 20, morale: 61, hunger: 21, health: 75, cattleSkill: 62, loyalty: 68 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', role: 'hand', fear: 17, morale: 64, hunger: 19, health: 80, cattleSkill: 60, loyalty: 70 }),
  ];

  const summary = DeadwoodModel.summarizeCrew(crew);
  assert.ok(summary.baseCattleSkill > summary.effectiveCattleSkill);
  assert.ok(summary.handlingCapacity >= 540);
});

test('crew skill modifiers reduce effective cattle skill when a hand is hungry and demoralized', () => {
  const steady = makeCrewMember(1, { cattleSkill: 70, fear: 18, morale: 68, hunger: 18, health: 82 });
  const struggling = makeCrewMember(2, { cattleSkill: 70, fear: 52, morale: 26, hunger: 72, health: 58 });

  assert.ok(DeadwoodModel.effectiveCrewCattleSkill(steady) > DeadwoodModel.effectiveCrewCattleSkill(struggling));
  assert.ok(DeadwoodModel.crewSkillModifier(steady) > DeadwoodModel.crewSkillModifier(struggling));
});

test('trail learning can make the same crew more capable over time', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, cattleSkill: 92 }),
    makeCrewMember(2, { name: 'MARA QUILL', role: 'scout', cattleSkill: 60 }),
    makeCrewMember(3, { name: 'JONAH REED', role: 'drover', cattleSkill: 70 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', role: 'hunter', cattleSkill: 58 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', role: 'hand', cattleSkill: 56 }),
  ];

  const before = DeadwoodModel.summarizeCrew(crew);
  crew[0].cattleSkill += 1;
  crew[1].cattleSkill += 1;
  crew[2].cattleSkill += 2;
  crew[3].cattleSkill += 1;
  crew[4].cattleSkill += 2;
  const after = DeadwoodModel.summarizeCrew(crew);

  assert.ok(after.baseCattleSkill > before.baseCattleSkill);
  assert.ok(after.handlingCapacity > before.handlingCapacity);
});

test('damned post trade costs worsen globally with each late trade', () => {
  assert.equal(DeadwoodModel.damnedTradeCost('day', 'oil', 0), 1);
  assert.equal(DeadwoodModel.damnedTradeCost('day', 'nails', 1), 2);
  assert.equal(DeadwoodModel.damnedTradeCost('night', 'vigil', 0), 2);
  assert.equal(DeadwoodModel.damnedTradeCost('night', 'cache', 1), 2);
  assert.equal(DeadwoodModel.damnedTradeCost('night', 'blessing', 2), 4);
});

test('westward ambient pressure escalates by region', () => {
  assert.deepEqual(DeadwoodModel.westwardAmbientPressure(200), {
    fear: 0,
    sanctity: 0,
    herdBlight: 0,
    herdStress: 0,
    label: 'none',
  });
  assert.deepEqual(DeadwoodModel.westwardAmbientPressure(350), {
    fear: 1,
    sanctity: -2,
    herdBlight: 0,
    herdStress: 0,
    label: 'western',
  });
  assert.deepEqual(DeadwoodModel.westwardAmbientPressure(600), {
    fear: 2,
    sanctity: -3,
    herdBlight: 1,
    herdStress: 1,
    label: 'staked-plains',
  });
  assert.deepEqual(DeadwoodModel.westwardAmbientPressure(800), {
    fear: 3,
    sanctity: -4,
    herdBlight: 2,
    herdStress: 2,
    label: 'salt-flats',
  });
});

test('crewWarningSignals flags a breaking member and unfair distributions', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, guardDutyCount: 1 }),
    makeCrewMember(2, { name: 'MARA QUILL', morale: 12, fear: 88, hunger: 84, guardDutyCount: 0 }),
    makeCrewMember(3, { name: 'JONAH REED', morale: 28, fear: 42, guardDutyCount: 5 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', morale: 26, fear: 44, foodReceivedTotal: 11 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', morale: 24, fear: 43, foodReceivedTotal: 1, whiskeyReceivedTotal: 0 }),
  ];
  crew[3].whiskeyReceivedTotal = 4;

  const signals = DeadwoodModel.crewWarningSignals(crew, 900);

  assert.equal(signals.breakingMemberName, 'MARA QUILL');
  assert.equal(signals.guardImbalanceName, 'MARA QUILL');
  assert.equal(signals.portionImbalanceName, 'ELIAS VOSS');
  assert.equal(signals.whiskeyImbalance, true);
  assert.equal(signals.overCapacity, true);
  assert.equal(signals.severeOverCapacity, true);
});

test('assessCrewConsequence selects mutiny against the leader under severe instability', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, loyalty: 35 }),
    makeCrewMember(2, { loyalty: 38, guardDutyCount: 5, fear: 70 }),
    makeCrewMember(3, { loyalty: 40, guardDutyCount: 4, fear: 65 }),
    makeCrewMember(4, { loyalty: 41, foodReceivedTotal: 10 }),
    makeCrewMember(5, { loyalty: 40, foodReceivedTotal: 0 }),
  ];

  const result = DeadwoodModel.assessCrewConsequence(crew, 22, 78);
  assert.deepEqual(result, { type: 'mutiny', targetId: 1 });
});

test('assessCrewConsequence exiles the best-fed hand before a general collapse when hunger resentment dominates', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, hunger: 65 }),
    makeCrewMember(2, { name: 'MARA QUILL', hunger: 72, foodReceivedTotal: 12 }),
    makeCrewMember(3, { name: 'JONAH REED', hunger: 70, foodReceivedTotal: 2 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', hunger: 68, foodReceivedTotal: 1 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', hunger: 69, foodReceivedTotal: 0 }),
  ];

  const result = DeadwoodModel.assessCrewConsequence(crew, 34, 44);
  assert.deepEqual(result, { type: 'food-exile', targetId: 2 });
});

test('assessCrewConsequence can purge a favored non-leader under paranoid high fear', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, foodReceivedTotal: 20 }),
    makeCrewMember(2, { name: 'MARA QUILL', foodReceivedTotal: 14, hunger: 54 }),
    makeCrewMember(3, { name: 'JONAH REED', foodReceivedTotal: 1, hunger: 70 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', foodReceivedTotal: 0, hunger: 68 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', foodReceivedTotal: 0, hunger: 66 }),
  ];

  const result = DeadwoodModel.assessCrewConsequence(crew, 32, 74);
  assert.deepEqual(result, { type: 'paranoia-purge', targetId: 2, fatal: false, cause: 'food' });
});

test('leader favoritism does not make the leader the target of a paranoia purge', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true, foodReceivedTotal: 20 }),
    makeCrewMember(2, { name: 'MARA QUILL', foodReceivedTotal: 9 }),
    makeCrewMember(3, { name: 'JONAH REED', foodReceivedTotal: 1 }),
    makeCrewMember(4, { name: 'ELIAS VOSS', foodReceivedTotal: 0 }),
    makeCrewMember(5, { name: 'RUTH CALDWELL', foodReceivedTotal: 0 }),
  ];

  const result = DeadwoodModel.assessCrewConsequence(crew, 32, 74);
  assert.notEqual(result?.targetId, 1);
});

test('assessCrewConsequence falls back to individual collapse when one hand is physically spent', () => {
  const crew = [
    makeCrewMember(1, { name: 'EZEKIEL VALE', role: 'leader', isLeader: true }),
    makeCrewMember(2, { name: 'MARA QUILL', health: 5, hunger: 90, morale: 18, fear: 80 }),
    makeCrewMember(3),
    makeCrewMember(4),
    makeCrewMember(5),
  ];

  const result = DeadwoodModel.assessCrewConsequence(crew, 48, 40);
  assert.deepEqual(result, { type: 'collapse', targetId: 2, fatal: true });
});

const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/ts/deadwood-model.js');
require('../js/ts/deadwood-game.js');

const { DeadwoodEngine } = globalThis;

function createGame(options = {}) {
  return DeadwoodEngine.createGame({
    random: options.random,
    hasDom: false,
    term: {
      clearScreen: () => undefined,
      prompt: () => undefined,
      hidePrompt: () => undefined,
      writelns: async () => undefined,
    },
  });
}

async function startDayPhase(game) {
  await game.start({ runMode: 'simulation' });
  await game.handleInput('start');
}

function sequenceRandom(values, fallback = 0) {
  let index = 0;
  return () => {
    if (index < values.length) {
      const value = values[index];
      index += 1;
      return value;
    }
    return fallback;
  };
}

test('day orders autocomplete repair from the active option list', async () => {
  const game = createGame();
  await startDayPhase(game);

  assert.ok(game.getAvailableCommands().includes('repair'));
  assert.equal(game.autocomplete('rep'), 'REPAIR');
});

test('repair menu autocompletes every selectable repair option', async () => {
  const game = createGame();
  await startDayPhase(game);
  await game.handleInput('repair');

  assert.deepEqual(
    game.getAvailableCommands(),
    ['patch', 'reinforce', 'iron', 'back', 'status', 'help', 'quit'],
  );

  assert.equal(game.autocomplete('p'), 'PATCH');
  assert.equal(game.autocomplete('r'), 'REINFORCE');
  assert.equal(game.autocomplete('i'), 'IRON');
  assert.equal(game.autocomplete('b'), 'BACK');
});

test('run start pre-rolls cursed chest markers into the state snapshot', async () => {
  const game = createGame({ random: () => 0 });

  await game.start({ runMode: 'simulation' });

  const state = game.getStateSnapshot();
  const report = game.getRunReport();
  assert.equal(state.cursedChests.length, 2);
  assert.equal(state.cursedChests[0].mile, 520);
  assert.ok(state.cursedChests[1].mile >= 760 && state.cursedChests[1].mile <= 850);
  assert.equal(state.pendingCursedChestIndex, null);
  assert.equal(report.schemaVersion, 2);
  assert.equal(report.cursedChestsPlanned.length, 2);
  assert.equal(report.cursedChestsResolved.length, 2);
  assert.equal(report.cursedChestsResolved[0].opened, null);
});

test('night robbery can steal camp supplies on non-guard nights', async () => {
  const game = createGame({ random: sequenceRandom([0.99, 0.99], 0) });
  await startDayPhase(game);

  await game.handleInput('travel');
  if (game.getStateSnapshot().phase === 'chest') {
    await game.handleInput('leave');
  }
  await game.handleInput('campfire');

  const state = game.getStateSnapshot();
  const report = game.getRunReport();
  const robberyEvent = report.events.find(event => event.key === 'night-robbery');

  assert.equal(state.phase, 'day');
  assert.ok(
    report.counters.events['night-robbery'] === 1 ||
    report.counters.events['night-robbery-empty'] === 1 ||
    Boolean(robberyEvent)
  );
});

test('victory scoring rewards cattle, crew survival, and thwarted robberies while failures get no score', () => {
  const strongWin = DeadwoodEngine.calculateVictoryScore({
    outcome: 'victory',
    cattleRemaining: 495,
    cashRemaining: 28,
    weekEnded: 21,
    morale: 63,
    wagonCondition: 38,
    wagonSanctity: 45,
    crew: [
      { alive: true, isLeader: true },
      { alive: true, isLeader: false },
      { alive: true, isLeader: false },
      { alive: true, isLeader: false },
      { alive: true, isLeader: false },
    ],
    thwartedRobberies: 2,
    perfectHunts: 1,
  });
  const slowerWin = DeadwoodEngine.calculateVictoryScore({
    outcome: 'victory',
    cattleRemaining: 492,
    cashRemaining: 3,
    weekEnded: 24,
    morale: 46,
    wagonCondition: 26,
    wagonSanctity: 0,
    crew: [
      { alive: true, isLeader: true },
      { alive: true, isLeader: false },
      { alive: false, isLeader: false },
      { alive: false, isLeader: false },
      { alive: false, isLeader: false },
    ],
    thwartedRobberies: 0,
    perfectHunts: 0,
  });
  const failedRun = DeadwoodEngine.calculateVictoryScore({
    outcome: 'failure',
    cattleRemaining: 500,
    cashRemaining: 90,
    weekEnded: 19,
    morale: 80,
    wagonCondition: 90,
    wagonSanctity: 90,
    crew: [
      { alive: true, isLeader: true },
      { alive: true, isLeader: false },
    ],
    thwartedRobberies: 3,
    perfectHunts: 2,
  });

  assert.equal(typeof strongWin, 'number');
  assert.equal(typeof slowerWin, 'number');
  assert.ok(strongWin > slowerWin);
  assert.equal(failedRun, null);
});

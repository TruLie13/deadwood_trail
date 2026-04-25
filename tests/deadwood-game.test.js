const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/ts/deadwood-model.js');
require('../js/ts/deadwood-game.js');

const { DeadwoodEngine } = globalThis;

function createGame() {
  return DeadwoodEngine.createGame({
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

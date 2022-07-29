/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */

import initTestGame from './initTestGame';

const gameCtrl = initTestGame();

gameCtrl.init();

gameCtrl.saveGame();

test('check game state after execute game save', () => {
  expect(localStorage.state).toBeTruthy();
});

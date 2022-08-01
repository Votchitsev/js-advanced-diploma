/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */

import GameState from '../GameState';
import GameStateService from '../GameStateService';
import GamePlay from '../GamePlay';
import GameController from '../GameController';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);

localStorage.clear();

gameCtrl.init();

gameCtrl.saveGame();

test('check game state after execute game save', () => {
  expect(localStorage.state).toBeTruthy();
});

gameCtrl.loadGame();

test('check game state after game load', () => {
  expect(GameState.characters).toBeTruthy();
});

/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */

import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';

export default function initTestGame() {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));

  const stateService = new GameStateService(localStorage);

  const gameCtrl = new GameController(gamePlay, stateService);

  localStorage.clear();

  return gameCtrl;
}

/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */

import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

describe('creating new game', () => {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);
  gameCtrl.init();
  gameCtrl.gamePlay.newGameEl.click();

  test('check characters info', () => {
    expect(document).toMatchSnapshot();
    const element = document.querySelectorAll('.cell')[63];
    gameCtrl.onCellEnter(63);
    const regexp = /\u{1F396}\d\u{2694}\d{1,2}\u{1F6E1}\d{1,2}\u{2764}\d{1,3}/u;
    expect(regexp.test(element.getAttribute('title'))).toBe(true);
  });
});

/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */

import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameState from '../GameState';
import PositionedCharacter from '../PositionedCharacter';

describe('creating new game', () => {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));
  const stateService = new GameStateService(localStorage);
  const gameCtrl = new GameController(gamePlay, stateService);
  gameCtrl.init();
  gameCtrl.gamePlay.newGameEl.click();

  const field = document.querySelectorAll('.cell');
  const board = document.querySelector('.board');

  test('check show characters info', () => {
    expect(document).toMatchSnapshot();
    const element = document.querySelectorAll('.cell')[63];
    gameCtrl.onCellEnter(63);
    const regexp = /\u{1F396}\d\u{2694}\d{1,2}\u{1F6E1}\d{1,2}\u{2764}\d{1,3}/u;
    expect(regexp.test(element.getAttribute('title'))).toBe(true);
  });

  test('choose another character', () => {
    const cellsHasCharacter = [];
    for (let i = 0; i < field.length; i += 1) {
      if (field[i].hasChildNodes()) {
        cellsHasCharacter.push(i);
      }
    }
    const currentCharacterCell = field[cellsHasCharacter[0]];
    const nextCharacterCell = field[cellsHasCharacter[1]];

    currentCharacterCell.click();
    expect(currentCharacterCell.classList).toContain('selected');

    nextCharacterCell.click();
    expect(currentCharacterCell.classList).not.toContain('selected');
    expect(nextCharacterCell.classList).toContain('selected');
  });

  test('move visual response', () => {
    gameCtrl.onCellEnter(58);
    expect(field[58].classList).toContain('selected', 'selected-green');
    expect(field[0].classList).not.toContain('selected');
    expect(board.style.cursor).toBe('pointer');
  });

  test('visual response from allowed attack', () => {
    gameCtrl.characterPositions = [
      new PositionedCharacter(gameCtrl.computerTeam.team[0], 48),
      new PositionedCharacter(gameCtrl.userTeam.team[0], 56),
    ];
    gameCtrl.gamePlay.redrawPositions(gameCtrl.characterPositions);
    field[56].click();
    gameCtrl.onCellEnter(48);
    expect(board.style.cursor).toBe('crosshair');
    expect(field[48].classList).toContain('selected', 'selected-red');
  });

  test('visual response with not allowed action', () => {
    gameCtrl.onCellEnter(0);
    expect(board.style.cursor).toBe('not-allowed');
    GamePlay.showError = jest.fn();
    gameCtrl.onCellClick(0);
    expect(GamePlay.showError).toHaveBeenCalled();
  });
});

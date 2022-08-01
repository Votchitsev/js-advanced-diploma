/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import GameController from '../GameController';
import GameState from '../GameState';

describe('creating new game', () => {
  const gamePlay = new GamePlay();
  gamePlay.bindToDOM(document.querySelector('#game-container'));

  const stateService = new GameStateService(localStorage);

  const gameCtrl = new GameController(gamePlay, stateService);

  localStorage.clear();

  gameCtrl.init();

  test('check start data', () => {
    expect(GameState.maxScore).toBe(0);
  });

  test('level up method', () => {
    const userTeam = gameCtrl.getCharactersFromTeam('user');
    userTeam[0].character.health = 50;
    userTeam[1].character.health = 10;
    expect(gameCtrl.characterPositions.length).toBe(4);
    gameCtrl.computerTeam = null;
    gameCtrl.levelUp();
    expect(GameState.level).toBe(2);
    expect(gameCtrl.characterPositions.length).toBe(6);
  });

  test('Count characters after levelUp', () => {
    expect(gameCtrl.userTeam.team.length).toBe(3);
  });

  test('Recovery health', () => {
    let totalTeamHealth = 0;
    for (const char of gameCtrl.userTeam.team) {
      totalTeamHealth += char.health;
    }
    expect(totalTeamHealth).toBe(290);
  });

  test('save maxScore after click on new game', () => {
    gameCtrl.gamePlay.newGameEl.click();
    expect(GameState.maxScore).toBe(60);
  });
});

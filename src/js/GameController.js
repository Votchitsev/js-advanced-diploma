import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import getSpace from './characters/moveOptions';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.addNewGameListener(() => {
      this.userTeam = new Team();
      this.computerTeam = new Team();
      this.characterPositions = [
        new PositionedCharacter(this.userTeam.team[0], 56),
        new PositionedCharacter(this.userTeam.team[1], 57),
        new PositionedCharacter(this.computerTeam.team[0], 62),
        new PositionedCharacter(this.computerTeam.team[1], 63),
      ];
      this.gamePlay.redrawPositions(this.characterPositions);
    });
    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
      this.visualResponse(index);
    });
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    const board = document.querySelectorAll('.cell');

    if (board[index].hasChildNodes()) {
      const characterPosition = this.characterPositions.find(
        char => char.position === index,
      );

      if (this.userTeam.team.includes(characterPosition.character)) {
        if (GameState.choosenCharacter) {
          this.gamePlay.deselectCell(GameState.choosenCharacter.position);
        }
        this.gamePlay.selectCell(index);
        GameState.choosenCharacter = characterPosition;
      } else {
        if (GameState.choosenCharacter) {
          GamePlay.showError('This action is not allowed!');
          return;
        }
        GamePlay.showError('This is not your character! Please chose another one.');
      }
    }
  }

  onCellEnter(index) {
    const board = document.querySelectorAll('.cell');

    if (board[index].hasChildNodes()) {
      const characterObject = this.characterPositions.find(
        char => char.position === index,
      ).character;
      this.gamePlay.showCellTooltip(
        `\u{1F396}${characterObject.level}\u{2694}${characterObject.attack}\u{1F6E1}${characterObject.defence}\u{2764}${characterObject.health}`,
        index,
      );
    }

    if (GameState.choosenCharacter && !board[index].hasChildNodes()) {
      const moveSpace = getSpace(
        GameState.choosenCharacter.position,
        GameState.choosenCharacter.character.moveDistance,
      );
      if (moveSpace.has(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
        this.gamePlay.deselectCell(index);
      }
    }

    if (GameState.choosenCharacter && board[index].hasChildNodes()) {
      const attackSpace = getSpace(
        GameState.choosenCharacter.position,
        GameState.choosenCharacter.character.attackDistance,
      );
      const characterPosition = this.characterPositions.find(
        char => char.position === index,
      );

      if (this.computerTeam.team.includes(characterPosition.character)) {
        if (attackSpace.has(index)) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    const board = document.querySelectorAll('.cell');

    if (board[index].classList.contains('selected-green', 'selected-red')) {
      this.gamePlay.deselectCell(index);
    }
  }

  visualResponse(index) {
    const board = document.querySelectorAll('.cell');
    if (board[index].hasChildNodes()) {
      const characterPosition = this.characterPositions.find(
        char => char.position === index,
      );
      if (this.userTeam.team.includes(characterPosition.character)) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
  }
}

import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import Team from './Team';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import getSpace from './characters/moveOptions';
import ComputerAction from './ComputerAction';

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
    this.board = document.querySelectorAll('.cell');
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    const characterPosition = this.getCharacterFromCell(index);

    if (GameState.turn === 'user') {
      if (this.board[index].hasChildNodes()) {
        if (this.userTeam.team.includes(characterPosition.character)) {
          if (GameState.choosenCharacter) {
            this.gamePlay.deselectCell(GameState.choosenCharacter.position);
          }
          this.gamePlay.selectCell(index);
          GameState.choosenCharacter = characterPosition;
        } else if (GameState.choosenCharacter
          && this.checkEnemyOnCell(index)
          && getSpace(
            GameState.choosenCharacter.position,
            GameState.choosenCharacter.character.attackDistance,
          ).has(index)) {
          this.attack(index);
        } else if (GameState.choosenCharacter) {
          GamePlay.showError('This action is not allowed!');
        } else {
          GamePlay.showError('This is not your character! Please chose another one.');
        }
      }
      if (!this.board[index].hasChildNodes()
      && GameState.choosenCharacter) {
        if (!getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.moveDistance,
        ).has(index)
        && !getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.attackDistance,
        ).has(index)) {
          GamePlay.showError('This action is not allowed!');
        }

        if (getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.moveDistance,
        ).has(index)) {
          this.move(index);
        }
      }
    }
  }

  onCellEnter(index) {
    if (this.board[index].hasChildNodes()) {
      const characterObject = this.getCharacterFromCell(index).character;

      this.gamePlay.showCellTooltip(
        `\u{1F396}${characterObject.level}\u{2694}${characterObject.attack}\u{1F6E1}${characterObject.defence}\u{2764}${characterObject.health}`,
        index,
      );
    }

    if (GameState.choosenCharacter && !this.board[index].hasChildNodes()) {
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

    if (GameState.choosenCharacter && this.board[index].hasChildNodes()) {
      const attackSpace = getSpace(
        GameState.choosenCharacter.position,
        GameState.choosenCharacter.character.attackDistance,
      );
      const characterPosition = this.getCharacterFromCell(index);

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

    if (this.board[index].classList.contains('selected-green')
    || this.board[index].classList.contains('selected-red')) {
      this.gamePlay.deselectCell(index);
    }

    this.gamePlay.setCursor(cursors.auto);
  }

  visualResponse(index) {
    const board = document.querySelectorAll('.cell');
    if (board[index].hasChildNodes()) {
      const characterPosition = this.getCharacterFromCell(index);
      if (this.userTeam.team.includes(characterPosition.character)) {
        this.gamePlay.setCursor(cursors.pointer);
      }
    }
  }

  move(moveIndex) {
    const previousPosition = GameState.choosenCharacter.position;
    GameState.choosenCharacter.position = moveIndex;
    this.gamePlay.redrawPositions(this.characterPositions);
    this.gamePlay.deselectCell(moveIndex);
    this.gamePlay.deselectCell(previousPosition);
    GameState.choosenCharacter = null;

    this.nextTurn();
  }

  attack(attackIndex) {
    const enemyCharacter = this.getCharacterFromCell(attackIndex);
    const damage = Math.max(
      GameState.choosenCharacter.character.attack - enemyCharacter.character.defence,
      GameState.choosenCharacter.character.attack * 0.1,
    );
    this.gamePlay.showDamage(attackIndex, `-${damage}`)
      .then(() => {
        enemyCharacter.character.health -= damage;
        this.gamePlay.deselectCell(attackIndex);
        this.gamePlay.deselectCell(GameState.choosenCharacter.position);
        GameState.choosenCharacter = null;
        this.gamePlay.redrawPositions(this.characterPositions);

        this.nextTurn();
      });
  }

  computerAction() {
    setTimeout(() => {
      const action = ComputerAction.run(
        this.getCharactersFromTeam('computer'),
        this.getCharactersFromTeam('user'),
      );

      if (action.action === 'attack') {
        this.attack(action.target);
      } else if (action.action === 'move') {
        this.move(action.target);
      }
    }, 3000);
  }

  checkEnemyOnCell(index) {
    const enemyPositions = [];
    this.characterPositions.forEach((element) => {
      if (this.computerTeam.team.includes(element.character)) {
        enemyPositions.push(element.position);
      }
    });
    return enemyPositions.includes(index);
  }

  getCharacterFromCell(index) {
    return this.characterPositions.find(
      character => character.position === index,
    );
  }

  nextTurn() {
    if (GameState.turn === 'user') {
      GameState.turn = 'computer';
      this.computerAction();
    } else {
      GameState.turn = 'user';
    }
  }

  getCharactersFromTeam(team) {
    const result = [];
    for (let i = 0; i < this.characterPositions.length; i += 1) {
      if (team === 'user') {
        if (this.userTeam.team.includes(this.characterPositions[i].character)) {
          result.push(this.characterPositions[i]);
        }
      } else if (team === 'computer') {
        if (this.computerTeam.team.includes(this.characterPositions[i].character)) {
          result.push(this.characterPositions[i]);
        }
      }
    }
    return result;
  }
}

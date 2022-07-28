import themes from './themes';
import Team from './Team';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import getSpace from './characters/moveOptions';
import ComputerAction from './ComputerAction';
import drawUp from './drawUp';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // load gameState
    const data = this.stateService.load();
    // draw Ui
    if (!data) {
      this.gamePlay.drawUi(themes.prairie);
      GameState.from(
        {
          choosenCharacter: null,
          turn: 'user',
          status: 'run',
          score: 0,
          maxScore: 0,
          level: 1,
        },
      );
    } else {
      const themesList = ['prairie', 'desert', 'arctic', 'mountain'];
      this.gamePlay.drawUi(themes[themesList[data.level - 1]]);
      GameState.state = {
        choosenCharacter: null,
        turn: 'user',
        score: data.score,
        maxScore: data.maxScore,
        level: data.level,
        userTeam: GameState.objectToClass(data.userTeam),
      };
    }

    // set event listeners
    // new game listener
    this.gamePlay.addNewGameListener(() => {
      localStorage.clear();
      this.resetListeners();
      this.init();
    });

    // add enter event listeners
    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
      this.visualResponse(index);
    });
    // add leave event listener
    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));
    // add click event listener
    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));
    // set property board
    this.startGame(GameState.state.level);
  }

  startGame(level) {
    if (GameState.state.userTeam) {
      this.userTeam = new Team(GameState.state.userTeam, level, level + 1);
    } else {
      this.userTeam = new Team();
    }
    this.computerTeam = new Team([], level, level + 1);
    this.characterPositions = drawUp(this.userTeam.team, 'user')
      .concat(drawUp(this.computerTeam.team, 'computer'));
    this.gamePlay.redrawPositions(this.characterPositions);
    GameState.state.status = 'run';
  }

  onCellClick(index) {
    const board = document.querySelectorAll('.cell');
    const characterPosition = this.getCharacterFromCell(index);
    if (GameState.state.turn === 'user') {
      if (board[index].hasChildNodes()) {
        if (this.userTeam.team.includes(characterPosition.character)) {
          if (GameState.state.choosenCharacter) {
            this.gamePlay.deselectCell(GameState.state.choosenCharacter.position);
          }
          this.gamePlay.selectCell(index);
          GameState.state.choosenCharacter = characterPosition;
        } else if (GameState.state.choosenCharacter
          && this.checkEnemyOnCell(index)
          && getSpace(
            GameState.state.choosenCharacter.position,
            GameState.state.choosenCharacter.character.attackDistance,
          ).has(index)) {
          this.attack(index);
        } else if (GameState.state.choosenCharacter) {
          GamePlay.showError('This action is not allowed!');
        } else {
          GamePlay.showError('This is not your character! Please chose another one.');
        }
      }
      if (!board[index].hasChildNodes()
      && GameState.state.choosenCharacter) {
        if (!getSpace(
          GameState.state.choosenCharacter.position,
          GameState.state.choosenCharacter.character.moveDistance,
        ).has(index)
        && !getSpace(
          GameState.state.choosenCharacter.position,
          GameState.state.choosenCharacter.character.attackDistance,
        ).has(index)) {
          GamePlay.showError('This action is not allowed!');
        }

        if (getSpace(
          GameState.state.choosenCharacter.position,
          GameState.state.choosenCharacter.character.moveDistance,
        ).has(index)) {
          this.move(index);
        }
      }
    }
  }

  onCellEnter(index) {
    const board = document.querySelectorAll('.cell');
    if (board[index].hasChildNodes()) {
      const characterObject = this.getCharacterFromCell(index).character;

      this.gamePlay.showCellTooltip(
        `\u{1F396}${characterObject.level}\u{2694}${characterObject.attack}\u{1F6E1}${characterObject.defence}\u{2764}${characterObject.health}`,
        index,
      );
    }

    if (GameState.state.choosenCharacter && !board[index].hasChildNodes()) {
      const moveSpace = getSpace(
        GameState.state.choosenCharacter.position,
        GameState.state.choosenCharacter.character.moveDistance,
      );
      if (moveSpace.has(index)) {
        this.gamePlay.setCursor(cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
        this.gamePlay.deselectCell(index);
      }
    }

    if (GameState.state.choosenCharacter && board[index].hasChildNodes()) {
      const attackSpace = getSpace(
        GameState.state.choosenCharacter.position,
        GameState.state.choosenCharacter.character.attackDistance,
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
    const board = document.querySelectorAll('.cell');
    this.gamePlay.hideCellTooltip(index);

    if (board[index].classList.contains('selected-green')
    || board[index].classList.contains('selected-red')) {
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
    const previousPosition = GameState.state.choosenCharacter.position;
    GameState.state.choosenCharacter.position = moveIndex;
    this.gamePlay.redrawPositions(this.characterPositions);
    this.gamePlay.deselectCell(moveIndex);
    this.gamePlay.deselectCell(previousPosition);
    GameState.state.choosenCharacter = null;

    this.nextTurn();
  }

  attack(attackIndex) {
    const enemyCharacter = this.getCharacterFromCell(attackIndex);
    const currentLevel = GameState.state.level;
    const damage = Math.max(
      GameState.state.choosenCharacter.character.attack - enemyCharacter.character.defence,
      GameState.state.choosenCharacter.character.attack * 0.1,
    );
    this.gamePlay.showDamage(attackIndex, `-${damage}`)
      .then(() => {
        enemyCharacter.character.health -= damage;
        this.gamePlay.deselectCell(attackIndex);
        this.gamePlay.deselectCell(GameState.state.choosenCharacter.position);
        GameState.state.choosenCharacter = null;
      })
      .then(() => {
        this.gameLoop();
        if (currentLevel === GameState.state.level) {
          return true;
        }
        return false;
      })
      .then((run) => {
        if (run) {
          this.gamePlay.redrawPositions(this.characterPositions);
          this.nextTurn();
        }
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
    if (GameState.state.turn === 'user') {
      GameState.state.turn = 'computer';
      if (this.computerTeam.team.length > 0) {
        this.computerAction();
      }
    } else {
      GameState.state.turn = 'user';
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

  gameLoop() {
    for (const character of this.characterPositions) {
      if (character.character.health <= 99) {
        this.characterPositions.splice(this.characterPositions.indexOf(character), 1);
        for (const team of [this.userTeam, this.computerTeam]) {
          if (team.team.includes(character.character)) {
            team.team.splice(team.team.indexOf(character.character), 1);
          }
        }
      }
    }
    if (this.computerTeam.team.length === 0) {
      GameState.state.status = 'stop';

      if (GameState.state.level <= 4) {
        this.levelUp();
      } else {
        this.gamePlay.cellClickListeners = [];
      }
    } else if (this.userTeam.team.length === 0) {
      this.gamePlay.cellClickListeners = [];
    }
  }

  levelUp() {
    const { maxScore } = GameState.state;
    const currentScore = this.userTeam.team.reduce((a, b) => a.health + b.health);

    if (currentScore > maxScore) {
      GameState.state.maxScore = currentScore;
    }

    GameState.state.level += 1;
    GameState.state.score += currentScore;

    for (const character of this.userTeam.team) {
      const healthBefore = character.health;
      character.level += 1;
      character.health += 80;
      if (character.health > 100) {
        character.health = 100;
      }
      // up attack
      const changedAttack = Math.max(
        character.attack,
        character.attack * (1.8 - (healthBefore / 100)),
      );
      character.attack = changedAttack;
      // up defence
      const changedDefence = Math.max(
        character.defence,
        character.defence * (1.8 - (healthBefore / 100)),
      );
      character.defence = changedDefence;
    }
    // save game
    GameState.state.userTeam = this.userTeam.team;
    this.stateService.save(GameState.state);
    GameState.state = null;
    this.resetListeners();
    this.init();
  }

  resetListeners() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }
}

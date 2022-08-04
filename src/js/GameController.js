import themes from './themes';
import Team from './Team';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';
import getSpace from './moveOptions';
import ComputerAction from './ComputerAction';
import drawUp from './drawUp';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    const data = this.stateService.load();

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
      GameState.from(data);
    }

    this.setListeners();

    if (this.characterPositions) {
      this.gamePlay.redrawPositions(this.characterPositions);
    } else {
      this.startGame(GameState.level, false);
    }
  }

  startGame(level, holdPositions) {
    this.setTheme(level);

    if (this.userTeam) {
      this.userTeam = new Team(this.userTeam.team, level, 'user');
    } else {
      this.userTeam = new Team();
    }

    if (!this.computerTeam || this.computerTeam.team.length === 0) {
      this.computerTeam = new Team([], level, 'computer', this.userTeam.team.length);
    }

    if (!holdPositions) {
      this.characterPositions = drawUp(this.userTeam.team, 'user')
        .concat(drawUp(this.computerTeam.team, 'computer'));
    }

    if (this.gamePlay.cellClickListeners.length === 0) {
      this.setListeners();
    }

    this.gamePlay.redrawPositions(this.characterPositions);

    GameState.status = 'run';
  }

  setListeners() {
    this.gamePlay.addNewGameListener(() => {
      GameState.level = 1;
      GameState.choosenCharacter = null;
      GameState.turn = 'user';
      this.characterPositions = null;
      this.userTeam = null;
      this.computerTeam = null;
      this.startGame(GameState.level);
    });

    this.gamePlay.addCellEnterListener((index) => {
      this.onCellEnter(index);
      this.visualResponse(index);
    });

    this.gamePlay.addCellLeaveListener((index) => this.onCellLeave(index));

    this.gamePlay.addCellClickListener((index) => this.onCellClick(index));

    this.gamePlay.addSaveGameListener(() => this.saveGame());

    this.gamePlay.addLoadGameListener(() => this.loadGame());
  }

  onCellClick(index) {
    const board = document.querySelectorAll('.cell');
    const characterPosition = this.getCharacterFromCell(index);
    if (GameState.turn === 'user') {
      if (board[index].hasChildNodes()) {
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
            'attack',
          ).has(index)) {
          this.attack(index);
        } else if (GameState.choosenCharacter) {
          GamePlay.showError('This action is not allowed!');
        } else {
          GamePlay.showError('This is not your character! Please chose another one.');
        }
      }
      if (!board[index].hasChildNodes()
      && GameState.choosenCharacter) {
        if (!getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.moveDistance,
          'move',
          this.getOccupiedCells(),
        ).has(index)
        && !getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.attackDistance,
          'attack',
        ).has(index)) {
          GamePlay.showError('This action is not allowed!');
        }

        if (getSpace(
          GameState.choosenCharacter.position,
          GameState.choosenCharacter.character.moveDistance,
          'move',
          this.getOccupiedCells(),
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

    if (GameState.choosenCharacter && !board[index].hasChildNodes()) {
      const moveSpace = getSpace(
        GameState.choosenCharacter.position,
        GameState.choosenCharacter.character.moveDistance,
        'move',
        this.getOccupiedCells(),
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
        'attack',
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
    const currentLevel = GameState.level;
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
      })
      .then(() => {
        this.gameLoop();
        if (currentLevel === GameState.level) {
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
        this.getOccupiedCells(),
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
      if (this.computerTeam.team.length > 0) {
        this.computerAction();
      }
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

  gameLoop() {
    for (const character of this.characterPositions) {
      if (character.character.health <= 0) {
        this.characterPositions.splice(this.characterPositions.indexOf(character), 1);
        for (const team of [this.userTeam, this.computerTeam]) {
          if (team.team.includes(character.character)) {
            team.team.splice(team.team.indexOf(character.character), 1);
          }
        }
      }
    }
    if (this.computerTeam.team.length === 0) {
      GameState.status = 'stop';

      if (GameState.level <= 4) {
        this.levelUp();
      } else {
        this.gamePlay.cellClickListeners = [];
      }
    } else if (this.userTeam.team.length === 0) {
      this.gamePlay.cellClickListeners = [];
    }
  }

  levelUp() {
    const { maxScore } = GameState;
    const currentScore = this.userTeam.team.reduce((a, b) => a.health + b.health);

    if (currentScore > maxScore) {
      GameState.maxScore = currentScore;
    }

    GameState.level += 1;
    GameState.score += currentScore;

    for (const character of this.userTeam.team) {
      const healthBefore = character.health;
      character.level += 1;
      character.health += 80;
      if (character.health > 100) {
        character.health = 100;
      }

      const changedAttack = Math.max(
        character.attack,
        character.attack * (1.8 - (healthBefore / 100)),
      );
      character.attack = changedAttack;

      const changedDefence = Math.max(
        character.defence,
        character.defence * (1.8 - (healthBefore / 100)),
      );
      character.defence = changedDefence;
    }
    this.startGame(GameState.level, false);
  }

  saveGame() {
    const characters = [];

    for (const char of this.characterPositions) {
      const character = {
        character: char.character,
        position: char.position,
      };

      if (this.userTeam.team.includes(char.character)) {
        character.team = 'user';
      } else if (this.computerTeam.team.includes(char.character)) {
        character.team = 'computer';
      }
      characters.push(character);
    }

    GameState.characters = characters;

    this.stateService.save(GameState.toObject());
  }

  loadGame() {
    GameState.from(this.stateService.load());
    const characterPositions = [];
    const userTeam = [];
    const computerTeam = [];

    for (const char of GameState.characters) {
      const characterPosition = new PositionedCharacter(char.character, char.position);
      characterPositions.push(characterPosition);
      if (char.team === 'user') {
        userTeam.push(char.character);
      } else if (char.team === 'computer') {
        computerTeam.push(char.character);
      }
    }
    this.characterPositions = characterPositions;
    this.userTeam.team = userTeam;
    this.userTeam.level = GameState.level;
    this.computerTeam.team = computerTeam;
    this.computerTeam.level = GameState.level;
    this.startGame(GameState.level, true);
  }

  resetListeners() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }

  setTheme(level) {
    const themesList = ['prairie', 'desert', 'arctic', 'mountain'];
    this.gamePlay.drawUi(themes[themesList[level - 1]]);
  }

  getOccupiedCells() {
    const positions = [];
    for (const charPos of this.characterPositions) {
      positions.push(charPos.position);
    }
    return positions;
  }
}

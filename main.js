/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/utils.js
function calcTileType(index, boardSize) {
  if (index === 0) {
    return 'top-left';
  }

  if (index < boardSize - 1) {
    return 'top';
  }

  if (index === boardSize - 1) {
    return 'top-right';
  }

  if (index === (boardSize ** 2) - boardSize) {
    return 'bottom-left';
  }

  if (index < boardSize ** 2 - 1 && index > boardSize ** 2 - boardSize) {
    return 'bottom';
  }

  if (index % boardSize === 0) {
    return 'left';
  }

  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  }

  if (index % boardSize === 7) {
    return 'right';
  }

  return 'center';
}

function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

;// CONCATENATED MODULE: ./src/js/GamePlay.js


class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellEnterListeners.forEach(o => o.call(null, index));
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    this.cellClickListeners.forEach(o => o.call(null, index));
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  static showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);
      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}

;// CONCATENATED MODULE: ./src/js/themes.js
const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
};

/* harmony default export */ const js_themes = (themes);

;// CONCATENATED MODULE: ./src/js/generators.js
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
function* characterGenerator(allowedTypes, maxLevel) {
  const character = new allowedTypes[Math.floor(Math.random() * allowedTypes.length)]();
  character.level = maxLevel;
  character.health = 100;
  yield character;
}

function generateTeam(allowedTypes, maxLevel, characterCount, aliveCharacters) {
  const team = [];
  for (let i = 0; i < characterCount - aliveCharacters.length; i += 1) {
    team.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return team.concat(aliveCharacters);
}

;// CONCATENATED MODULE: ./src/js/Character.js
class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    if (new.target.name === 'Character') {
      throw new Error("this class don't be created like that. You should create child class.");
    }
  }
}

;// CONCATENATED MODULE: ./src/js/characters/bowman.js


class Bowman extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.health = health;
    this.type = 'bowman';
    this.moveDistance = 2;
    this.attackDistance = 2;
  }
}

;// CONCATENATED MODULE: ./src/js/characters/daemon.js


class Daemon extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.health = health;
    this.type = 'daemon';
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}

;// CONCATENATED MODULE: ./src/js/characters/magician.js


class Magician extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.health = health;
    this.type = 'magician';
    this.moveDistance = 1;
    this.attackDistance = 4;
  }
}

;// CONCATENATED MODULE: ./src/js/characters/swordsman.js


class Swordsman extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = health;
    this.type = 'swordsman';
    this.moveDistance = 4;
    this.attackDistance = 1;
  }
}

;// CONCATENATED MODULE: ./src/js/characters/undead.js


class Undead extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = health;
    this.type = 'undead';
    this.moveDistance = 4;
    this.attackDistance = 1;
  }
}

;// CONCATENATED MODULE: ./src/js/characters/vampire.js


class Vampire extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.health = health;
    this.type = 'vampire';
    this.moveDistance = 2;
    this.attackDistance = 2;
  }
}

;// CONCATENATED MODULE: ./src/js/Team.js








class Team {
  constructor(aliveCharacters = [], level = 1, player = 'user', enemyCount = 2) {
    this.level = level;
    this.player = player;
    this.aliveCharacters = aliveCharacters;
    this.enemyCount = enemyCount;

    const newTeam = generateTeam(
      this.allowCharacterList(level, player),
      Math.floor(1 + Math.random() * level),
      this.count(),
      aliveCharacters,
    );
    this.team = newTeam;
  }

  allowCharacterList() {
    if (this.player === 'user') {
      if (this.level === 1) {
        return [Bowman, Swordsman];
      }
      return [Bowman, Swordsman, Magician];
    }
    return [Vampire, Undead, Daemon];
  }

  count() {
    if (this.player === 'user') {
      if (this.level === 2) {
        return this.aliveCharacters.length + 1;
      }

      if (this.level === 3 || this.level === 4) {
        return this.aliveCharacters.length + 2;
      }
    }

    if (this.player === 'computer') {
      return this.enemyCount;
    }

    return 2;
  }
}

;// CONCATENATED MODULE: ./src/js/PositionedCharacter.js


class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
  }
}

;// CONCATENATED MODULE: ./src/js/GameState.js








class GameState {
  static from(object) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (key === 'userTeam' || key === 'computerTeam') {
          this[key] = this.teamParse(object[key].team);
        } else if (key === 'characters') {
          this[key] = this.characterParse(object[key]);
        } else {
          this[key] = object[key];
        }
      }
    }

    return null;
  }

  static characterParse(objectsList) {
    const result = [];

    for (const object of objectsList) {
      result.push({
        character: this.teamParse(object.character)[0],
        position: object.position,
        team: object.team,
      });
    }

    return result;
  }

  static characterPositionParse(objectsList) {
    const objectsSerialized = [];

    for (let i = 0; i < objectsList.length; i += 1) {
      const positionedCharacterEl = new PositionedCharacter(
        this.teamParse(objectsList[i].character)[0],
        objectsList[i].position,
      );
      objectsSerialized.push(positionedCharacterEl);
    }
    return objectsSerialized;
  }

  static teamParse(objectsList) {
    const objectClasses = [];
    let objects = objectsList;

    if (!objectsList) {
      return null;
    }

    if (!Array.isArray(objectsList)) {
      objects = [];
      objects.push(objectsList);
    }

    for (const object of objects) {
      let character;
      switch (object.type) {
        case 'bowman':
          character = new Bowman(object.level, object.health);
          break;
        case 'daemon':
          character = new Daemon(object.level, object.health);
          break;
        case 'magician':
          character = new Magician(object.level, object.health);
          break;
        case 'swordsman':
          character = new Swordsman(object.level, object.health);
          break;
        case 'undead':
          character = new Undead(object.level, object.health);
          break;
        case 'vampire':
          character = new Vampire(object.level, object.health);
          break;
        default:
          break;
      }
      character.attack = object.attack;
      character.defence = object.defence;
      objectClasses.push(character);
    }

    return objectClasses;
  }

  static toObject() {
    const result = {};

    for (const key of Object.keys(this)) {
      result[key] = this[key];
    }
    return result;
  }
}

;// CONCATENATED MODULE: ./src/js/cursors.js
const cursors = {
  auto: 'auto',
  pointer: 'pointer',
  crosshair: 'crosshair',
  notallowed: 'not-allowed',
};

/* harmony default export */ const js_cursors = (cursors);

;// CONCATENATED MODULE: ./src/js/moveOptions.js
function getStaticSpace(distance, action) {
  let result;

  if (action === 'move') {
    result = {
      up: [],
      upRight: [],
      right: [],
      downRight: [],
      down: [],
      downLeft: [],
      left: [],
      upLeft: [],
    };

    for (let i = 0; i < distance; i += 1) {
      result.up.push(-8 * (i + 1));
      result.upRight.push(-7 * (i + 1));
      result.right.push(i + 1);
      result.downRight.push(9 * (i + 1));
      result.down.push(8 * (i + 1));
      result.downLeft.push(7 * (i + 1));
      result.left.push(-1 - i);
      result.upLeft.push(-9 * (i + 1));
    }
  }

  if (action === 'attack') {
    result = [];

    for (let i = -(distance * 9); i <= 9 * distance; i += 1) {
      result.push(i);
    }
  }

  return result;
}

function getSpace(index, distance, action, ocuppiedCells = []) {
  const staticSpace = getStaticSpace(distance, action);
  const result = [];
  if (action === 'move') {
    for (const direction in staticSpace) {
      if ({}.hasOwnProperty.call(staticSpace, direction)) {
        const moveDirection = staticSpace[direction].map((element) => element + index);
        for (let i = 0; i < moveDirection.length; i += 1) {
          const point = moveDirection[i];
          if (point >= 0 && point <= 63 && !ocuppiedCells.includes(point)) {
            if ((direction === 'upLeft' || direction === 'left' || direction === 'downLeft') && point % 8 === 0) {
              result.push(point);
              break;
            }
            if ((direction === 'upRight' || direction === 'right' || direction === 'downRight') && point % 8 === 0) {
              break;
            }
            if (index % 8 === 0) {
              if ((point + 1) % 8 === 0) {
                break;
              }
            }
            result.push(point);
          }
        }
      }
    }
  }

  if (action === 'attack') {
    for (let i = index - (distance * 8); i <= index + (distance * 8); i += 8) {
      if (i >= 0 && i <= 63) {
        for (let l = 1; l <= distance; l += 1) {
          const leftDir = i - l;
          if (leftDir >= 0 && leftDir <= 63) {
            if ((leftDir + 1) % 8 !== 0) {
              result.push(leftDir);
            } else {
              break;
            }
          }
        }
        for (let r = 1; r <= distance; r += 1) {
          const rightDir = i + r;
          if (rightDir >= 0 && rightDir <= 63) {
            if (rightDir % 8 !== 0) {
              result.push(rightDir);
            } else {
              break;
            }
          }
        }
        if (i !== index) {
          result.push(i);
        }
      }
    }
  }

  return new Set(result);
}

;// CONCATENATED MODULE: ./src/js/ComputerAction.js



class ComputerAction {
  static run(computer, user, ocuppiedCells) {
    this.computerTeam = computer;
    this.userTeam = user;
    this.ocuppiedCells = ocuppiedCells;
    if (this.attack()) {
      return {
        action: 'attack',
        target: this.attack(),
      };
    }

    return this.move();
  }

  static attack() {
    for (let i = 0; i < this.computerTeam.length; i += 1) {
      const computerAttackValid = getSpace(
        this.computerTeam[i].position,
        this.computerTeam[i].character.attackDistance,
        'attack',
      );
      for (let j = 0; j < this.userTeam.length; j += 1) {
        if (computerAttackValid.has(this.userTeam[j].position)) {
          GameState.choosenCharacter = this.computerTeam[i];
          return this.userTeam[j].position;
        }
      }
    }
    return false;
  }

  static move() {
    const moveOptions = this.getMoveOptions();
    const characterToMove = moveOptions[
      Math.floor(Math.random() * (moveOptions.length - 0) + 0)
    ];
    GameState.choosenCharacter = characterToMove.character;
    return {
      action: 'move',
      target: characterToMove.targets[0].target,
    };
  }

  static getMoveOptions() {
    const movePossibleOptions = [];
    for (let i = 0; i < this.computerTeam.length; i += 1) {
      const option = {
        character: this.computerTeam[i],
        targets: [],
      };
      const computerMoveValid = getSpace(
        this.computerTeam[i].position,
        this.computerTeam[i].character.moveDistance,
        'move',
        this.ocuppiedCells,
      );

      for (let j = 0; j < this.userTeam.length; j += 1) {
        for (const point of computerMoveValid) {
          if (this.checkBorder(point, this.userTeam[j].position)) {
            const k = (point - this.userTeam[j].position / 8);
            const target = {
              target: point,
              distance: Math.abs(k - Math.trunc(k)),
            };
            option.targets.push(target);
          }
        }
      }
      option.targets.sort((a, b) => (a.distance > b.distance ? 1 : -1));
      movePossibleOptions.push(option);
    }
    return movePossibleOptions;
  }

  static checkBorder(moveTarget, enemyPosition) {
    if ((moveTarget % 8 === 0 && (enemyPosition + 1) % 8 === 0)
    || (enemyPosition % 8 === 0 && (moveTarget + 1) % 8 === 0)) {
      return false;
    }
    return true;
  }
}

;// CONCATENATED MODULE: ./src/js/drawUp.js


function drawUp(characters, team) {
  const userStartPositions = [0, 8, 16, 24, 32, 40, 48, 56, 1, 9, 17, 25, 33, 41, 49, 57];
  const computerStartPositions = [7, 15, 23, 31, 39, 47, 55, 63, 6, 14, 22, 30, 38, 46, 54, 62];
  const characterPositions = [];
  let positionsList;

  for (let i = 0; i < characters.length; i += 1) {
    if (team === 'user') {
      positionsList = userStartPositions;
    }

    if (team === 'computer') {
      positionsList = computerStartPositions;
    }

    const position = positionsList[Math.floor(Math.random() * positionsList.length)];
    positionsList.splice(positionsList.indexOf(position), 1);
    const positionedCharacter = new PositionedCharacter(characters[i], position);
    characterPositions.push(positionedCharacter);
  }
  return characterPositions;
}

;// CONCATENATED MODULE: ./src/js/GameController.js










class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    const data = this.stateService.load();

    if (!data) {
      this.gamePlay.drawUi(js_themes.prairie);
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

    if (GameState.turn === 'computer') {
      this.computerAction();
    }
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
        this.gamePlay.setCursor(js_cursors.pointer);
        this.gamePlay.selectCell(index, 'green');
      } else {
        this.gamePlay.setCursor(js_cursors.notallowed);
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
          this.gamePlay.setCursor(js_cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
        } else {
          this.gamePlay.setCursor(js_cursors.notallowed);
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

    this.gamePlay.setCursor(js_cursors.auto);
  }

  visualResponse(index) {
    const board = document.querySelectorAll('.cell');
    if (board[index].hasChildNodes()) {
      const characterPosition = this.getCharacterFromCell(index);
      if (this.userTeam.team.includes(characterPosition.character)) {
        this.gamePlay.setCursor(js_cursors.pointer);
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
    const damage = Math.floor(Math.max(
      GameState.choosenCharacter.character.attack - enemyCharacter.character.defence,
      GameState.choosenCharacter.character.attack * 0.1,
    ));
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
    this.gamePlay.drawUi(js_themes[themesList[level - 1]]);
  }

  getOccupiedCells() {
    const positions = [];
    for (const charPos of this.characterPositions) {
      positions.push(charPos.position);
    }
    return positions;
  }
}

;// CONCATENATED MODULE: ./src/js/GameStateService.js
class GameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}

;// CONCATENATED MODULE: ./src/js/app.js
/**
 * Entry point of app: don't change this
 */




const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here

;// CONCATENATED MODULE: ./src/index.js



// entry point for webpack
// don't write your code here

/******/ })()
;
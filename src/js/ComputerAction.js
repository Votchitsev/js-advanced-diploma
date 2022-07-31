import getSpace from './characters/moveOptions';
import GameState from './GameState';

export default class ComputerAction {
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

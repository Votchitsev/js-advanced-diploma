import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  // static choosenCharacter = null;

  // static turn = 'user';

  // static score = null;

  // static status = 'run';

  // static state = {};

  static from(object) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (key === 'userTeam' || key === 'computerTeam') {
          this[key] = this.teamParse(object[key]);
        } else if (key === 'characterPositions') {
          this[key] = this.characterPositionParse(object[key]);
        } else {
          this[key] = object[key];
        }
      }
    }

    return null;
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

    // if (objectClasses.length === 1) {
    //   return objectClasses[0];
    // }
    return objectClasses;
  }
}

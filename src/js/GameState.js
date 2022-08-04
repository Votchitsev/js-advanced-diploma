import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
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

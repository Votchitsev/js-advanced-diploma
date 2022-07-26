import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';

export default class GameState {
  static choosenCharacter = null;

  static turn = 'user';

  static score = null;

  static status = 'run';

  static state = {};

  static from(object) {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        this.state[key] = object[key];
      }
    }
    return null;
  }

  static objectToClass(objects) {
    const objectClasses = [];

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
}

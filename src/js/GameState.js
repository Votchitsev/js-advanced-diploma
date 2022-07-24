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
}

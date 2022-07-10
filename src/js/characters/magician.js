import Character from '../Character';

export default class Magician extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.health = health;
    this.type = 'magician';
  }
}

import Character from '../Character';

export default class Bowman extends Character {
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

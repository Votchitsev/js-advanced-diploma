import Character from '../Character';

export default class Daemon extends Character {
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

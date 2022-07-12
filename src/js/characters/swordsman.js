import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = health;
    this.type = 'swordsman';
    this.attackPossibility = [-9, -8, -7, -1, 1, 7, 8, 9];
  }

  allowAttack(index) {
    const result = [];
    this.attackPossibility.forEach((element) => {
      const value = element + index;
      if (value >= 0 && value < 64) {
        result.push(value);
      }
    });

    if (index % 8 === 0) {
      const removingElements = result.filter((element) => (element + 1) % 8 === 0);
      for (let i = 0; i < removingElements.length; i += 1) {
        result.splice(result.indexOf(removingElements[i]), 1);
      }
      return result;
    }

    if ((index + 1) % 8 === 0) {
      const removingElements = result.filter((element) => element % 8 === 0);
      for (let i = 0; i < removingElements.length; i += 1) {
        result.splice(result.indexOf(removingElements[i]), 1);
      }
      return result;
    }
    return result;
  }
}

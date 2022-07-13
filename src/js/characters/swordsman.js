import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, health) {
    super();
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = health;
    this.type = 'swordsman';
    // this.attackPossibility = [-9, -8, -7, -1, 1, 7, 8, 9];
    this.attackPossibility = this.capabilitiesGenerate(1);
    // this.movePossibility = {
    //   up: [-8, -16, -24, -32],
    //   upRight: [-7, -14, -21, -28],
    //   right: [1, 2, 3, 4],
    //   downRight: [9, 18, 27, 36],
    //   down: [8, 16, 24, 32],
    //   downLeft: [7, 14, 21, 28],
    //   left: [-1, -2, -3, -4],
    //   upLeft: [-9, -18, -27, -36],
    // };
    this.movePossibility = this.capabilitiesGenerate(4);
    console.log(this.attackPossibility);
  }

  attackArea(index) {
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

  moveArea(index, capabilities) {
    const result = [];
    for (const key in capabilities) {
      if ({}.hasOwnProperty.call(capabilities, key)) {
        const moveDirection = capabilities[key].map((element) => element + index);
        for (let i = 0; i < moveDirection.length; i += 1) {
          const point = moveDirection[i];
          if (point > 0 && point < 64) {
            if ((key === 'upLeft' || key === 'left' || key === 'downLeft') && point % 8 === 0) {
              result.push(point);
              break;
            }
            if ((key === 'upRight' || key === 'right' || key === 'downRight') && point % 8 === 0) {
              break;
            }
            if (index % 8 === 0) {
              if (point % 7 === 0) {
                break;
              }
            }
            result.push(point);
          }
        }
      }
    }
    return new Set(result);
  }

  capabilitiesGenerate(distance) {
    const result = {
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
    return result;
  }
}

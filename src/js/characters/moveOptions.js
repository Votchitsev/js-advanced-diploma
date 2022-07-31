function getStaticSpace(distance, action) {
  let result;

  if (action === 'move') {
    result = {
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
  }

  if (action === 'attack') {
    result = [];

    for (let i = -(distance * 9); i <= 9 * distance; i += 1) {
      result.push(i);
    }
  }

  return result;
}

export default function getSpace(index, distance, action, ocuppiedCells = []) {
  const staticSpace = getStaticSpace(distance, action);
  const result = [];
  if (action === 'move') {
    for (const direction in staticSpace) {
      if ({}.hasOwnProperty.call(staticSpace, direction)) {
        const moveDirection = staticSpace[direction].map((element) => element + index);
        for (let i = 0; i < moveDirection.length; i += 1) {
          const point = moveDirection[i];
          if (point >= 0 && point <= 63 && !ocuppiedCells.includes(point)) {
            if ((direction === 'upLeft' || direction === 'left' || direction === 'downLeft') && point % 8 === 0) {
              result.push(point);
              break;
            }
            if ((direction === 'upRight' || direction === 'right' || direction === 'downRight') && point % 8 === 0) {
              break;
            }
            if (index % 8 === 0) {
              if ((point + 1) % 8 === 0) {
                break;
              }
            }
            result.push(point);
          }
        }
      }
    }
  }

  if (action === 'attack') {
    for (let i = index - (distance * 8); i <= index + (distance * 8); i += 8) {
      if (i >= 0 && i <= 63) {
        for (let l = 1; l <= distance; l += 1) {
          const leftDir = i - l;
          if (leftDir >= 0 && leftDir <= 63) {
            if ((leftDir + 1) % 8 !== 0) {
              result.push(leftDir);
            }
          }
        }
        for (let r = 1; r <= distance; r += 1) {
          const rightDir = i + r;
          if (rightDir >= 0 && rightDir <= 63) {
            if (rightDir % 8 !== 0) {
              result.push(rightDir);
            }
          }
        }
        if (i !== index) {
          result.push(i);
        }
      }
    }
  }

  return new Set(result);
}

function getStaticSpace(distance) {
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
};

export default function getSpace(index, distance) {
  const staticSpace = getStaticSpace(distance);
  const result = [];
  for (const direction in staticSpace) {
    if ({}.hasOwnProperty.call(staticSpace, direction)) {
      const moveDirection = staticSpace[direction].map((element) => element + index);
      for (let i = 0; i < moveDirection.length; i += 1) {
        const point = moveDirection[i];
        if (point > 0 && point < 64) {
          if ((direction === 'upLeft' || direction === 'left' || direction === 'downLeft') && point % 8 === 0) {
            result.push(point);
            break;
          }
          if ((direction === 'upRight' || direction === 'right' || direction === 'downRight') && point % 8 === 0) {
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

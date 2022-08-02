import Swordsman from '../characters/swordsman';
import Bowman from '../characters/bowman';
import getSpace from '../characters/moveOptions';

test('check attack space', () => {
  const swordsman = new Swordsman(1, 100);
  const bowman = new Bowman(1, 100);

  expect(getSpace(63, swordsman.attackDistance, 'attack')).toEqual(new Set([54, 55, 62]));
  expect(getSpace(56, swordsman.attackDistance, 'attack')).toEqual(new Set([48, 49, 57]));
  expect(getSpace(24, bowman.attackDistance, 'attack')).toEqual(new Set([16, 17, 25, 33, 32, 8, 9, 10, 18, 26, 34, 42, 41, 40]))
});

test('check move space', () => {
  const swordsman = new Swordsman(1, 100);
  const bowman = new Bowman(1, 100);

  expect(getSpace(0, swordsman.moveDistance, 'move')).toStrictEqual(
    new Set([1, 2, 3, 4, 9, 18, 27, 36, 8, 16, 24, 32]),
  );
  expect(getSpace(7, swordsman.moveDistance, 'move')).toStrictEqual(
    new Set([6, 5, 4, 3, 15, 23, 31, 39, 14, 21, 28, 35]),
  );
  expect(getSpace(20, swordsman.moveDistance, 'move')).toStrictEqual(
    new Set([21, 22, 23, 29, 38, 47, 28, 36, 44, 52, 27,
      34, 41, 48, 19, 18, 17, 16, 11, 2, 12, 4, 13, 6]),
  );
  expect(getSpace(56, swordsman.moveDistance, 'move')).toStrictEqual(
    new Set([48, 40, 32, 24, 49, 42, 35, 28, 57, 58, 59, 60]),
  );
  expect(getSpace(8, swordsman.moveDistance, 'move', [40])).toStrictEqual(
    new Set([0, 1, 9, 10, 11, 12, 17, 26, 35, 44, 16, 24, 32]),
  );

  expect(getSpace(24, bowman.moveDistance, 'move')).toStrictEqual(
    new Set([16, 8, 17, 10, 25, 26, 33, 42, 32, 40]),
  );

  expect(getSpace(25, bowman.moveDistance, 'move')).toStrictEqual(
    new Set([16, 17, 9, 18, 11, 26, 27, 34, 43, 33, 41, 32, 24]),
  );
});

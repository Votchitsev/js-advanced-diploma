import Swordsman from '../characters/swordsman';
import getSpace from '../characters/moveOptions';

test('check attack space', () => {
  const character = new Swordsman(1, 100);
  expect(getSpace(63, character.attackDistance, 'attack')).toEqual(new Set([54, 55, 62]));
  expect(getSpace(56, character.attackDistance, 'attack')).toEqual(new Set([48, 49, 57]));
});

test('check move space', () => {
  const character = new Swordsman(1, 100);
  expect(getSpace(0, character.moveDistance, 'move')).toStrictEqual(
    new Set([1, 2, 3, 4, 9, 18, 27, 36, 8, 16, 24, 32]),
  );
  expect(getSpace(7, character.moveDistance, 'move')).toStrictEqual(
    new Set([6, 5, 4, 3, 15, 23, 31, 39, 14, 21, 28, 35]),
  );
  expect(getSpace(20, character.moveDistance, 'move')).toStrictEqual(
    new Set([21, 22, 23, 29, 38, 47, 28, 36, 44, 52, 27,
      34, 41, 48, 19, 18, 17, 16, 11, 2, 12, 4, 13, 6]),
  );
  expect(getSpace(56, character.moveDistance, 'move')).toStrictEqual(
    new Set([48, 40, 32, 24, 49, 42, 35, 28, 57, 58, 59, 60]),
  );
  expect(getSpace(8, character.moveDistance, 'move', [40])).toStrictEqual(
    new Set([0, 1, 9, 10, 11, 12, 17, 26, 35, 44, 16, 24, 32]),
  );
});

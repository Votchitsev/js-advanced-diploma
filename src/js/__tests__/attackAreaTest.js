import Swordsman from '../characters/swordsman';

test('check attack field', () => {
  const character = new Swordsman(1, 100);
  expect(character.moveArea(63, character.attackPossibility)).toStrictEqual(new Set([54, 55, 62]));
});

test('check move field', () => {
  const character = new Swordsman(1, 100);
  expect(character.moveArea(0, character.movePossibility))
    .toStrictEqual(new Set([1, 2, 3, 4, 9, 18, 27, 36, 8, 16, 24, 32]));
  expect(character.moveArea(7, character.movePossibility)).toStrictEqual(
    new Set([6, 5, 4, 3, 15, 23, 31, 39, 14, 21, 28, 35]),
  );
  expect(character.moveArea(20, character.movePossibility)).toStrictEqual(
    new Set([21, 22, 23, 29, 38, 47, 28, 36, 44, 52, 27,
      34, 41, 48, 19, 18, 17, 16, 11, 2, 12, 4, 13, 6]),
  );
});

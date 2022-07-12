import Swordsman from '../characters/swordsman';

test('check attack field', () => {
  const character = new Swordsman(1, 100);
  expect(character.allowAttack(63)).toStrictEqual([54, 55, 62]);
});

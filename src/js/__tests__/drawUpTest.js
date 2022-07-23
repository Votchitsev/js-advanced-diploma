import Swordsman from '../characters/swordsman';
import drawUp from '../drawUp';
import PositionedCharacter from '../PositionedCharacter';

const team = [
  new Swordsman(1, 100),
  new Swordsman(1, 100),
  new Swordsman(1, 100),
];

test('drawUp function test', () => {
  const positionedUserTeam = drawUp(team, 'user');
  const positionedComputerTeam = drawUp(team, 'computer');
  expect(positionedUserTeam.length).toBe(3);
  expect(positionedComputerTeam.length).toBe(3);
  expect(positionedUserTeam[0]).toBeInstanceOf(PositionedCharacter);
});

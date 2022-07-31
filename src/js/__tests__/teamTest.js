import Swordsman from '../characters/swordsman';
import Team from '../Team';

// const team = new Team([], 4, 4);

// test('check count of characters', () => {
//   expect(team.team.length).toBe(4);
// });

// test('check characters level', () => {
//   team.team.forEach((char) => {
//     expect(char.level).toBeGreaterThan(0);
//     expect(char.level).toBeLessThan(4);
//   });
// });

describe('level one', () => {
  const team = new Team([], 1, 2);

  test('check count of characters', () => {
    expect(team.team.length).toBe(2);
  });
});

describe('level two', () => {
  const aliveCharacter = new Swordsman(1, 10);
  const team = new Team([aliveCharacter], 2, 3, 'user');
  const computerTeam = new Team([], 2, 'computer', team.team.length);

  test('check count of characters', () => {
    expect(team.team.length).toBe(2);
  });

  test('alive character is in new team', () => {
    expect(team.team.find(element => element.health === 10)).not.toBeUndefined();
  });

  test('count of computer team characters', () => {
    expect(computerTeam.team.length).toBe(team.team.length);
  });
});

describe('level three', () => {
  const aliveCharacter = new Swordsman(1, 20);
  const team = new Team([aliveCharacter], 3, 'user');

  test('check count of characters', () => {
    expect(team.team.length).toBe(3);
  });
});

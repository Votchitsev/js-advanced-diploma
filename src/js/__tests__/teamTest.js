import Team from '../Team';

const team = new Team([], 4, 4);

test('check count of characters', () => {
  expect(team.team.length).toBe(4);
});

test('check characters level', () => {
  team.team.forEach((char) => {
    expect(char.level).toBeGreaterThan(0);
    expect(char.level).toBeLessThan(4);
  });
});

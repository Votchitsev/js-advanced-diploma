import Swordsman from '../characters/swordsman';
import GameState from '../GameState';

const stateInfo = {
  key1: 'val1',
  key2: 'val2',
  characters: [{
    character: {
      level: 1,
      attack: 0,
      defence: 0,
      health: 100,
      type: 'swordsman',
    },
    position: 0,
    team: 'user',
  }],
};

GameState.from(stateInfo);

test('create state info', () => {
  expect(GameState.key1).toBe('val1');
});

test('check character is instance of class', () => {
  expect(GameState.characters[0].character).toBeInstanceOf(Swordsman);
});

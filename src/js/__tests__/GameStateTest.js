import Swordsman from '../characters/swordsman';
import GameState from '../GameState';
import PositionedCharacter from '../PositionedCharacter';

const stateInfo = {
  key1: 'val1',
  key2: 'val2',
  characterPositions: [
    {
      character: {
        level: 1,
        attack: 0,
        defence: 0,
        health: 100,
        type: 'swordsman',
      },
      position: 0,
    },
  ],
  userTeam: [
    {
      level: 1,
      attack: 0,
      defence: 0,
      health: 100,
      type: 'swordsman',
    },
  ],
};

GameState.from(stateInfo);

test('create state info', () => {
  expect(GameState.key1).toBe('val1');
});

test('check characterPosition is instance of class', () => {
  expect(GameState.characterPositions[0]).toBeInstanceOf(PositionedCharacter);
});

test('check character is instance of class', () => {
  expect(GameState.userTeam[0]).toBeInstanceOf(Swordsman);
});

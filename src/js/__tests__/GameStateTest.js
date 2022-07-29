import GameState from '../GameState';

const stateInfo = {
  key1: 'val1',
  key2: 'val2',
};

test('create state info', () => {
  GameState.from(stateInfo);
  expect(GameState.state.key1).toBe('val1');
});

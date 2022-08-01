/**
 * @jest-environment jsdom
 * @jest-environment-options {"html": "<div id='game-container'></div>"}
 */
import GameStateService from '../GameStateService';

const state = new GameStateService(localStorage);
state.save('test');

test('Positive response', () => {
  expect(state.load()).toBe('test');
});

test('getting data from storage', () => {
  Storage.prototype.getItem = jest.fn(() => {
    throw new Error();
  });
  expect(() => state.load()).toThrow();
});

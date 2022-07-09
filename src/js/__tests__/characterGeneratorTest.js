import Swordsman from '../characters/swordsman';
import Bowman from '../characters/bowman';
import Daemon from '../characters/daemon';
import { characterGenerator, generateTeam } from '../generators';
import Character from '../Character';

const swordsman = new Swordsman();
const bowman = new Bowman();
const daemon = new Daemon();
const characterList = [swordsman, bowman, daemon];

test('creating character', () => {
  const iterableObject = characterGenerator(characterList, 1);
  for (let i = 0; i < iterableObject.length; i += 1) {
    expect(i.level).toBe(1);
  }
});

test('creating team', () => {
  expect(generateTeam(characterList, 1, 2).length).toBe(2);
});

test('check unavailable creating character class', () => {
  expect(() => new Character()).toThrow();
});

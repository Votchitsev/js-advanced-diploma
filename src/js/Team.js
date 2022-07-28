import { generateTeam } from './generators';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';

export default class Team {
  constructor(aliveCharacters = [], level = 1, count = 2) {
    this.level = level;
    const newTeam = generateTeam([
      Bowman,
      Daemon,
      Magician,
      Swordsman,
      Undead,
      Vampire,
    ], Math.floor(1 + Math.random() * level), count, aliveCharacters);
    this.team = newTeam;
  }
}

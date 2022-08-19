import { generateTeam } from './generators';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';

export default class Team {
  constructor(aliveCharacters = [], level = 1, player = 'user', enemyCount = 2) {
    this.level = level;
    this.player = player;
    this.aliveCharacters = aliveCharacters;
    this.enemyCount = enemyCount;

    const newTeam = generateTeam(
      this.allowCharacterList(level, player),
      Math.floor(1 + Math.random() * level),
      this.count(),
      aliveCharacters,
    );
    this.team = newTeam;
  }

  allowCharacterList() {
    if (this.player === 'user') {
      if (this.level === 1) {
        return [Bowman, Swordsman];
      }
      return [Bowman, Swordsman, Magician];
    }
    return [Vampire, Undead, Daemon];
  }

  count() {
    if (this.player === 'user') {
      if (this.level === 2) {
        return this.aliveCharacters.length + 1;
      }

      if (this.level === 3 || this.level === 4) {
        return this.aliveCharacters.length + 2;
      }
    }

    if (this.player === 'computer') {
      return this.enemyCount;
    }

    return 2;
  }
}

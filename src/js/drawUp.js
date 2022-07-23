import PositionedCharacter from './PositionedCharacter';

export default function drawUp(characters, team) {
  const userPositions = [0, 8, 16, 24, 32, 40, 48, 56];
  const computerPositions = [7, 15, 23, 31, 39, 47, 55, 63]
  const characterPositions = [];

  for (let i = 0; i < characters.length; i += 1) {
    let positionsList = [];
    if (team === 'user') {
      positionsList = userPositions.map(position => position + i);
    } else {
      positionsList = computerPositions.map(position => position - i);
    }
    const position = positionsList[Math.floor(Math.random() * positionsList.length)];
    const positionedCharacter = new PositionedCharacter(characters[i], position);
    characterPositions.push(positionedCharacter);
  }
  return characterPositions;
}

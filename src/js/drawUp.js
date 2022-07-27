import PositionedCharacter from './PositionedCharacter';

export default function drawUp(characters, team) {
  const userStartPositions = [0, 8, 16, 24, 32, 40, 48, 56, 1, 9, 17, 25, 33, 41, 49, 57];
  const computerStartPositions = [7, 15, 23, 31, 39, 47, 55, 63, 6, 14, 22, 30, 38, 46, 54, 62];
  const characterPositions = [];
  let positionsList;

  for (let i = 0; i < characters.length; i += 1) {
    if (team === 'user') {
      positionsList = userStartPositions;
    }

    if (team === 'computer') {
      positionsList = computerStartPositions;
    }

    const position = positionsList[Math.floor(Math.random() * positionsList.length)];
    positionsList.splice(positionsList.indexOf(position), 1);
    const positionedCharacter = new PositionedCharacter(characters[i], position);
    characterPositions.push(positionedCharacter);
  }
  return characterPositions;
}

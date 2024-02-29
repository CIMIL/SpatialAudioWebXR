export function distributeSpeakers(radius) {
  const positions = [];
  const numberOfLayers = 8;
  let numberOfBoxesForLine = 0;

  for (let layer = 0; layer < numberOfLayers; layer++) {
    switch (layer) {
      case 0:
        numberOfBoxesForLine = 1;
        break;
      case 1:
        numberOfBoxesForLine = 7;
        break;
      case 2:
        numberOfBoxesForLine = 11;
        break;
      case 3:
        numberOfBoxesForLine = 13;
        break;
      case 4:
        numberOfBoxesForLine = 13;
        break;
      case 5:
        numberOfBoxesForLine = 11;
        break;
      case 6:
        numberOfBoxesForLine = 7;
        break;
      case 7:
        numberOfBoxesForLine = 1;
        break;
    }

    for (let j = 0; j < numberOfBoxesForLine; j++) {
      const position = {
        x:
          radius *
          Math.sin((2 * Math.PI * j) / numberOfBoxesForLine) *
          Math.sin((Math.PI * layer) / numberOfLayers),
        y: radius * Math.cos((Math.PI * layer) / numberOfLayers),
        z:
          radius *
          Math.cos((2 * Math.PI * j) / numberOfBoxesForLine) *
          Math.sin((Math.PI * layer) / numberOfLayers),
      };

      if (layer === 7) {
        position.z = 0;
      }

      positions.push(position);
    }
  }
  return positions;
}

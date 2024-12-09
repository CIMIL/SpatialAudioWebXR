/**
 * Distributes speakers in a spherical pattern.
 * @param {number} radius - The radius of the sphere.
 * @return {Array} An array of speaker positions.
 */
export function distributeSpeakers(radius) {
  const positions = [];
  const speakersPerLayer = [1, 4, 8, 16, 8, 4, 1]; // Ensures a total of 64 speakers
  const numberOfLayers = speakersPerLayer.length;

  for (let layer = 0; layer < numberOfLayers; layer++) {
    // Calculate the angle for this layer based on the number of layers
    // 1 and 5 -> 45 deg
    // 2 and 4 -> 22.5 deg

    const thetaAngles = [
      0,                     // Layer 0: 0° (North pole)
      (45 * Math.PI) / 180,// Layer 2: 22.5° from center layer
      (67.5 * Math.PI) / 180,  // Layer 1: 45° from center layer
      (90 * Math.PI) / 180,  // Layer 3: 90° (equatorial plane)
      (112.5 * Math.PI) / 180, // Layer 5: 45° below center
      (135 * Math.PI) / 180,// Layer 4: 22.5° below center
      Math.PI,               // Layer 6: 180° (South pole)
    ];

    // If you need equally spaced layers, you can use this formula
    // const theta = (Math.PI * layer) / (numberOfLayers - 1); 

    const theta = thetaAngles[layer];
    const y = radius * Math.cos(theta);
    const r = radius * Math.sin(theta);

    // Determine the number of points in this layer
    const numberOfPoints = speakersPerLayer[layer];

    for (let point = 0; point < numberOfPoints; point++) {
      const phi = (2 * Math.PI * point) / numberOfPoints;
      const x = r * Math.cos(phi);
      const z = r * Math.sin(phi);

      // Layer - ids from to
      // 0 - 40
      // 1 - 32 -> 35
      // 2 - 16 -> 23
      // 3 - 0 -> 15
      // 4 - 24 -> 31
      // 5 - 36 -> 39
      // 6 - 41
      let id = -1;
      switch (layer) {
        case 0:
          id = 40;
          break;
        case 1:
          id = point < 4 ? 32 + point : 35 - point;
          break;
        case 2:
          id = point < 8 ? 16 + point : 23 - point;
          break;
        case 3:
          id = point;
          break;
        case 4:
          id = point < 8 ? 24 + point : 31 - point;
          break;
        case 5:
          id = point < 4 ? 36 + point : 39 - point;
          break;
        case 6:
          id = 41;
          break;
      }

      positions.push({ id, x, y, z });
    }
  }


  // shift 90 desgrees to left to have 0 in front
  const angleToRotate = -Math.PI / 2;
  const cosAngle = Math.cos(angleToRotate);
  const sinAngle = Math.sin(angleToRotate);

  const rotatedPositions = positions.map((pos) => {
    const { id, x, y, z } = pos;
    return {
      id: id,
      x: x * cosAngle - z * sinAngle,
      y: y,
      z: x * sinAngle + z * cosAngle,
    };
  });

  return rotatedPositions;
}

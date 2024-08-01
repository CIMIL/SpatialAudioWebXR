/**
 * Distributes speakers in a spherical pattern.
 * @param {number} radius - The radius of the sphere.
 * @return {Array} An array of speaker positions.
 */
export function distributeSpeakers(radius) {
  const positions = [];
  const numberOfLayers = 8;
  const speakersPerLayer = [1, 7, 11, 13, 13, 11, 7, 1]; // Ensures a total of 64 speakers

  for (let layer = 0; layer < numberOfLayers; layer++) {
    // Calculate the angle for this layer
    const theta = (Math.PI * layer) / (numberOfLayers - 1);
    const y = radius * Math.cos(theta);
    const r = radius * Math.sin(theta);

    // Determine the number of points in this layer
    const numberOfPoints = speakersPerLayer[layer];

    for (let point = 0; point < numberOfPoints; point++) {
      const phi = (2 * Math.PI * point) / numberOfPoints;
      const x = r * Math.cos(phi);
      const z = r * Math.sin(phi);

      positions.push({ x, y, z });
    }
  }

  const angleToRotate = 0.13; // apply rotation to fix the front speakers
  const cosAngle = Math.cos(angleToRotate);
  const sinAngle = Math.sin(angleToRotate);

  const rotatedPositions = positions.map((pos) => {
    const { x, y, z } = pos;
    return {
      x: x * cosAngle - z * sinAngle,
      y: y,
      z: x * sinAngle + z * cosAngle,
    };
  });

  return rotatedPositions;
}

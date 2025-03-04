/**
 * Calculate the azimuth angle from x and z coordinates
 * @param {number} x - The x coordinate
 * @param {number} z - The z coordinate
 * @return {number} The azimuth angle in degrees
 */
export const getAzimuth = (x, z) => {
  // Calculate azimuth in degrees (0 degrees is forward/+z, positive is clockwise)
  let azimuth = Math.atan2(x, z) * (180 / Math.PI);
  
  // Normalize to [0, 360]
  if (azimuth < 0) azimuth += 360;
  
  return azimuth;
};

/**
 * Calculate the elevation angle from y coordinate and horizontal distance
 * @param {number} y - The y coordinate
 * @param {number} horizontalDist - The horizontal distance (sqrt(x² + z²))
 * @return {number} The elevation angle in degrees
 */
export const getElevation = (y, horizontalDist) => {
  // Calculate elevation angle in degrees
  return Math.atan2(y, horizontalDist) * (180 / Math.PI);
};

/**
 * Calculate angular errors between two positions
 * @param {number} sourceX - The source X position (azimuth component)
 * @param {number} sourceY - The source Y position (elevation component)
 * @param {number} clickedX - The clicked X position (azimuth component)
 * @param {number} clickedY - The clicked Y position (elevation component)
 * @return {Object} Object containing the azimuth and elevation errors in degrees
 */
export const calculateAngularErrors = (sourceX, sourceY, clickedX, clickedY) => {
  // Calculate azimuth error (shortest path on circle)
  let azimuthError = (clickedX - sourceX);
  if (azimuthError > 180) azimuthError -= 360;
  if (azimuthError < -180) azimuthError += 360;

  // Calculate elevation error (simple difference)
  const elevationError = clickedY - sourceY;

  return {
    azimuthError,
    elevationError
  };
};
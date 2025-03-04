import { readFileSync, writeFileSync } from "fs";

/**
 * Calculate the azimuth angle from x and z coordinates
 * @param {number} x - The x coordinate
 * @param {number} z - The z coordinate
 * @return {number} The azimuth angle in degrees
 */
const getAzimuth = (x, z) => {
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
const getElevation = (y, horizontalDist) => {
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
const calculateAngularErrors = (sourceX, sourceY, clickedX, clickedY) => {
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

/**
 * Calculate the Euclidean distance between two points in 3D space
 * @param {number} lon1 - The longitude of the first point
 * @param {number} lat1 - The latitude of the first point
 * @param {number} lon2 - The longitude of the second point
 * @param {number} lat2 - The latitude of the second point
 * @return {number} The distance between the two points in meters
 */
const distance = (lon1, lat1, lon2, lat2) => {
  // convert to radians
  const lon1Rad = lon1 * (Math.PI / 180);
  const lat1Rad = lat1 * (Math.PI / 180);
  const lon2Rad = lon2 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);

  // convert to cartesian coordinates
  const x1 = Math.cos(lat1Rad) * Math.cos(lon1Rad);
  const y1 = Math.cos(lat1Rad) * Math.sin(lon1Rad);
  const z1 = Math.sin(lat1Rad);

  const x2 = Math.cos(lat2Rad) * Math.cos(lon2Rad);
  const y2 = Math.cos(lat2Rad) * Math.sin(lon2Rad);
  const z2 = Math.sin(lat2Rad);

  // calculate the euclidean distance
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);

  return distance * 2; // multiply by the radius of the sphere to get the distance in meters
};

const inputPath = process.argv[2]; // Get the input file path from command line arguments

if (!inputPath) {
  console.error("Please provide input file paths");
  console.log("Usage: node jsonToCsv.js <input-file-path-json>");
  process.exit(1);
}

if (!inputPath.endsWith(".json")) {
  console.error("Please provide a valid json file path");
  console.log("Usage: node jsonToCsv.js <input-file-path-json>");
  process.exit(1);
}

/**
 * Convert JSON to CSV with additional angular error calculations
 * @param {string} inputPath - The path of the input json file
 */
const jsonToCsv = (inputPath) => {
  const data = JSON.parse(readFileSync(inputPath, "utf8"));
  const outputPath = inputPath.replace(".json", ".csv");
  
  // Define the CSV headers including angular errors
  const headers = "experience,headHeadingStartX,headHeadingStartY,currentPlayingSpeaker,currentPlayingSpeakerPositionX,currentPlayingSpeakerPositionY,headHeadingSoundX,headHeadingSoundY,hasClickedRight,speakerClicked,speakerClickedPositionX,speakerClickedPositionY,headHeadingClickX,headHeadingClickY,errorDistanceInMeters,azimuthErrorDegrees,elevationErrorDegrees,soundPlayedTime,clickTime,responseTime\n";
  
  const csv = data.reduce((acc, { experience, turns }) => {
    const turnsCsv = turns
      .map(
        ({
          headHeadingStart,
          currentPlayingSpeaker,
          currentPlayingSpeakerPosition,
          headHeadingSound,
          hasClickedRight,
          speakerClicked,
          speakerClickedPosition,
          headHeadingClick,
          soundPlayedTime,  
          clickTime,        
          responseTime,     
        }) => {
          // Parse the positions
          const sourcePositionX = parseFloat(currentPlayingSpeakerPosition.split(" ")[0]);
          const sourcePositionY = parseFloat(currentPlayingSpeakerPosition.split(" ")[1]);
          
          const clickedPositionX = parseFloat(speakerClickedPosition.split(" ")[0]);
          const clickedPositionY = parseFloat(speakerClickedPosition.split(" ")[1]);
          
          // Calculate angular errors
          const angularErrors = calculateAngularErrors(
            sourcePositionX,
            sourcePositionY,
            clickedPositionX,
            clickedPositionY
          );
          
          // Euclidean distance for reference
          const distanceError = distance(
            sourcePositionX,
            sourcePositionY,
            clickedPositionX,
            clickedPositionY
          );
          
          return `${experience},${headHeadingStart.split(" ")[0]},${headHeadingStart.split(" ")[1]},${currentPlayingSpeaker},${sourcePositionX},${sourcePositionY},${headHeadingSound.split(" ")[0]},${headHeadingSound.split(" ")[1]},${hasClickedRight},${speakerClicked},${clickedPositionX},${clickedPositionY},${headHeadingClick.split(" ")[0]},${headHeadingClick.split(" ")[1]},${distanceError},${angularErrors.azimuthError.toFixed(2)},${angularErrors.elevationError.toFixed(2)},${soundPlayedTime || ''},${clickTime || ''},${responseTime || ''}`;
        }
      )
      .join("\n");
    return `${acc}${turnsCsv}\n`;
  }, headers);

  try {
    writeFileSync(outputPath, csv);
    console.log("CSV file generated successfully with azimuth and elevation error metrics");
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

jsonToCsv(inputPath);
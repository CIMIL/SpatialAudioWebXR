import { readFileSync, writeFileSync } from "fs";

/**
 * Calculate the distance between two points on the sphere's surface
 * @param {number} lon1 - The longitude of the first point
 * @param {number} lat1 - The latitude of the first point
 * @param {number} lon2 - The longitude of the second point
 * @param {number} lat2 - The latitude of the second point
 * @return {number} The distance between the two points in meters
 *
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
 *
 * @param {string} inputPath - The path of the input json file
 */
const jsonToCsv = (inputPath) => {
  const data = JSON.parse(readFileSync(inputPath, "utf8"));
  const outputPath = inputPath.replace(".json", ".csv");
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
        }) =>
          `${experience},${headHeadingStart.split(" ")[0]},${headHeadingStart.split(" ")[1]},${currentPlayingSpeaker},${currentPlayingSpeakerPosition.split(" ")[0]},${currentPlayingSpeakerPosition.split(" ")[1]},${headHeadingSound.split(" ")[0]},${headHeadingSound.split(" ")[1]},${hasClickedRight},${speakerClicked},${speakerClickedPosition.split(" ")[0]},${speakerClickedPosition.split(" ")[1]},${headHeadingClick.split(" ")[0]},${headHeadingClick.split(" ")[1]},${distance(
            parseFloat(currentPlayingSpeakerPosition.split(" ")[0]),
            parseFloat(currentPlayingSpeakerPosition.split(" ")[1]),
            parseFloat(speakerClickedPosition.split(" ")[0]),
            parseFloat(speakerClickedPosition.split(" ")[1])
          )}`
      )
      .join("\n");
    return `${acc}${turnsCsv}\n`;
  }, "experience,headHeadingStartX, headHeadingStartY,currentPlayingSpeaker,currentPlayingSpeakerPositionX, currentPlayingSpeakerPositionY,headHeadingSoundX,headHeadingSoundY,hasClickedRight,speakerClicked,speakerClickedPositionX,speakerClickedPositionY,headHeadingClickX,headHeadingClickY,errorDistanceInMeters\n");

  try {
    writeFileSync(outputPath, csv);
    console.log("CSV file generated successfully");
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

jsonToCsv(inputPath);

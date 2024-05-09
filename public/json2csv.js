import { readFileSync, writeFileSync } from "fs";

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
          `${experience},${headHeadingStart.split(" ")[0]},${headHeadingStart.split(" ")[1]},${currentPlayingSpeaker},${currentPlayingSpeakerPosition.split(" ")[0]},${currentPlayingSpeakerPosition.split(" ")[1]},${headHeadingSound.split(" ")[0]},${headHeadingSound.split(" ")[1]},${hasClickedRight},${speakerClicked},${speakerClickedPosition.split(" ")[0]},${speakerClickedPosition.split(" ")[1]},${headHeadingClick.split(" ")[0]},${headHeadingClick.split(" ")[1]}`
      )
      .join("\n");
    return `${acc}${turnsCsv}\n`;
  }, "experience,headHeadingStartX, headHeadingStartY,currentPlayingSpeaker,currentPlayingSpeakerPositionX, currentPlayingSpeakerPositionY,headHeadingSoundX,headHeadingSoundY,hasClickedRight,speakerClicked,speakerClickedPositionX,speakerClickedPositionY,headHeadingClickX,headHeadingClickY\n");

  try {
    writeFileSync(outputPath, csv);
    console.log("CSV file generated successfully");
  } catch (error) {
    console.error("Error writing to file", error);
  }
};

jsonToCsv(inputPath);

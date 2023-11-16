let DEBUG = true;
const LEVELS = 10;
const SOUND_DISABLE = false;
const scene = document.querySelector("a-scene");
const camera = scene.querySelector("a-camera");
const speakerTemplate = document.getElementById("speaker");
const textTemplate = document.getElementById("overSpeakerText");
const messageBox = document.getElementById("messageBox");
const scoreBox = document.getElementById("scoreBox");
const speakerPositions = [];
let currentSpeaker = null;
let score = 0;
let currentLevel = 0;

AFRAME.registerComponent("gamelogic", {
  init: function () {
    playRandomSound();
  },
});

function distributeSpeakers(radius = 10) {
  let numberOfLayers = 8;
  let numberOfBoxesForLine = 0;
  let speakerIndex = 0;

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

      const speaker = speakerTemplate.cloneNode(true);
      const text = textTemplate.cloneNode(true);
      speaker.setAttribute("position", position);
      speaker.setAttribute("id", `speaker-${speakerIndex}`);
      speaker.setAttribute("material", "color: #3f3f3f");

      text.setAttribute("value", speakerIndex);

      speaker.appendChild(text);

      speakerPositions.push(position);
      scene.appendChild(speaker);
      speakerIndex++;
    }
  }
}
distributeSpeakers();

function playRandomSound() {
  // Get all speakers
  const speakers = document.querySelectorAll("a-box[id^=speaker-]");

  // Choose a random speaker and play its sound
  const randomIndex = Math.floor(Math.random() * speakers.length);
  currentSpeaker = speakers[randomIndex];

  if (DEBUG) currentSpeaker.setAttribute("material", "color: #0000ff");
  messageBox.setAttribute("value", "What speaker is playing?");
  currentSpeaker.components.sound.playSound();

  // Add click event listener to each speaker
  speakers.forEach((speaker) => {
    speaker.addEventListener("click", clickHandler);
  });
}

function clickHandler(event) {
  currentSpeaker.components.sound.stopSound();
  if (event.target.id === currentSpeaker.id) {
    console.log("correct");
    updateMessageBox("Correct!");
    score++;
    console.info(score);
  } else {
    updateMessageBox("Wrong, speaker was: " + currentSpeaker.id);
    console.log("wrong");
    console.log("correct answer was: ", currentSpeaker.id);
  }
  updateScoreBox();
  clear();
  currentLevel++;
  if (currentLevel < LEVELS) {
    setTimeout(playRandomSound, 2000);
  } else {
    endGame();
  }
}

function clear() {
  const speakers = document.querySelectorAll("a-box[id^=speaker-]");
  speakers.forEach((speaker) => {
    speaker.setAttribute("material", "color: #3f3f3f");
    speaker.removeEventListener("click", clickHandler);
  });
}

function endGame() {
  updateMessageBox("Game over");
  console.log("Game over");
  console.info(`Your score is ${score}`);
}

function updateScoreBox() {
  scoreBox.setAttribute("value", "Score: " + score);
}

function updateMessageBox(t) {
  messageBox.setAttribute("value", t);
}

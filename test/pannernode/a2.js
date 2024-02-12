const TIME_BETWEEN_LEVELS = 3000;
const LEVELS = 10;

const speakerPositions = distributeSpeakers(10);
function distributeSpeakers(radius) {
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

AFRAME.registerState({
  initialState: {
    audioSources: Array.from({ length: 64 }, (_, i) => ({
      id: `src-${i}`,
    })),
    speakers: Array.from({ length: 64 }, (_, i) => ({
      id: `speaker-${i}`,
      audioSrc: `#src-${i}`,
      position: `${speakerPositions[i].x} ${speakerPositions[i].y} ${speakerPositions[i].z}`,
    })),
    currentPlayingSpeaker: "",
    score: 0,
    messageBox: "What speaker is playing?",
    currentLevel: 0,
  },

  handlers: {
    playFromRandomSpeaker: function (state, action) {
      // random number from 0 to 63
      const rand = Math.floor(Math.random() * (63 + 1));
      console.log("rand", rand);
      // play audio from random speaker
      const playingSpeaker = document.querySelector(`#src-${rand}`);
      playingSpeaker.play();
      // update currentPlayingSpeaker
      state.currentPlayingSpeaker = `${rand}`;
      console.log("play random", state);
    },

    updateScore: function (state, action) {
      state.score += 1;
    },

    updateMessageBox: function (state, action) {
      state.messageBox = action.message;
    },

    speakerClicked: function (state, action) {
      console.log("clicked");
      // stop sound from current speaker
      var playingSpeaker = document.querySelector(
        `#src-${state.currentPlayingSpeaker}`
      );
      console.log(playingSpeaker);
      playingSpeaker.pause();
      console.log("stop");
      console.log(state);
      // check if clicked speaker is equal to current playing speaker
      if (
        `speaker-${action.speakerClicked}` ===
        `speaker-${state.currentPlayingSpeaker}`
      ) {
        // id yes increment score and write Correct in message box
        AFRAME.scenes[0].emit("updateScore");
        console.log("score++");
        console.log("correct");

        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Correct!",
        });
      } else {
        // if not write Wrong in message box
        console.log("wrong");
        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Wrong",
        });
      }
      //  wait for n seconds
      setTimeout(() => {
        // check if levels < 10
        if (state.currentLevel < LEVELS) {
          // if yes, emit new playFromRandomSpeaker
          AFRAME.scenes[0].emit("updateMessageBox", {
            message: "What Speaker is playing?",
          });
          AFRAME.scenes[0].emit("playFromRandomSpeaker");
        } else {
          // else set messagebox to "Game Over"
          AFRAME.scenes[0].emit("updateMessageBox", {
            message: "Game Over. Return to menu",
          });
        }
      }, TIME_BETWEEN_LEVELS);
    },
  },
});

AFRAME.registerComponent("wait-for-room", {
  dependencies: ["resonance-audio-room"],
  init: function () {
    AFRAME.scenes[0].emit("playFromRandomSpeaker");
  },
});

AFRAME.registerComponent("player", {
  dependencies: ["resonance-audio-src"],
  init: function () {
    this.el.addEventListener("audioroom-entered", () => {
      this.el.addEventListener("click", () => {
        AFRAME.scenes[0].emit("speakerClicked", {
          speakerClicked: this.el.getAttribute("id").split("-")[1],
        });
      });
    });
  },
});

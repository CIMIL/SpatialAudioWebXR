import {
  TIME_BETWEEN_LEVELS,
  LEVELS,
  PLAY_INTERVAL,
  SPEAKER_RADIUS,
} from "./constants.js";
import { distributeSpeakers } from "./utils/distribute-speakers.js";
import "./utils/back-button.js";

const speakerPositions = distributeSpeakers(SPEAKER_RADIUS);

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
    isPlaying: null,
    sphereRadius: SPEAKER_RADIUS,
  },

  handlers: {
    playLoop: function (state, action) {
      if (state.isPlaying === false) {
        playingSpeaker.pause();
      }
      const playingSpeaker = document.querySelector(`#src-${action.speaker}`);
      playingSpeaker.play();
      setInterval(() => {
        if (playingSpeaker.ended) {
          AFRAME.scenes[0].emit("playLoop", { speaker: action.speaker });
        }
      }, PLAY_INTERVAL);
    },
    playFromRandomSpeaker: function (state, action) {
      // random number from 0 to 63
      const rand = Math.floor(Math.random() * (63 + 1));
      console.log("Speaker playing =", rand);
      // play audio from random speaker
      state.isPLaying = true;
      AFRAME.scenes[0].emit("playLoop", { speaker: rand });

      // update currentPlayingSpeaker
      state.currentPlayingSpeaker = `${rand}`;
      console.log("State:", state);
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
      state.isPLaying = false;
      playingSpeaker.pause();
      console.log("stop");
      // check if clicked speaker is equal to current playing speaker
      console.log(`speaker-${action.speakerClicked}`);
      console.log(`speaker-${state.currentPlayingSpeaker}`);
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

      console.log("State:", state);
      // increment level
      state.currentLevel += 1;
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
          console.log("Game Over");
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
    this.el.addEventListener("click", () => {
      console.log(this.el.id);
      AFRAME.scenes[0].emit("speakerClicked", {
        speakerClicked: this.el.id.split("-")[1],
      });
    });
  },
});

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
    clickActive: false,
  },

  handlers: {
    playLoop: function (state, action) {
      console.log(state);
      if (state.currentPlayingSpeaker !== `${action.speaker}`) return;
      const playingSpeaker = document.querySelector(
        `#speaker-${action.speaker}`
      );
      playingSpeaker.components["sound"].playSound();

      setTimeout(() => {
        if (state.currentPlayingSpeaker === `${action.speaker}`)
          AFRAME.scenes[0].emit("playLoop", { speaker: action.speaker });
      }, PLAY_INTERVAL);
    },
    playFromRandomSpeaker: function (state, action) {
      // activate clicks
      state.clickActive = true;
      // random number from 0 to 63
      const rand = Math.floor(Math.random() * (63 + 1));
      // update currentPlayingSpeaker
      state.currentPlayingSpeaker = `${rand}`;
      // play audio from random speaker
      state.isPlaying = true;
      AFRAME.scenes[0].emit("playLoop", { speaker: rand });
    },

    updateScore: function (state, action) {
      state.score += 1;
      const score = document.querySelector("#score-box");
      score.setAttribute("text", { value: state.score });
    },

    updateMessageBox: function (state, action) {
      state.messageBox = action.message;
      const messageBox = document.querySelector("#message-box");
      messageBox.setAttribute("text", { value: state.messageBox });
    },

    speakerClicked: function (state, action) {
      // if clicks are not active, ignore
      if (!state.clickActive) return;

      // deactivate clicks
      state.clickActive = false;
      // stop sound from current speaker
      const playingSpeaker = document.querySelector(
        `#speaker-${state.currentPlayingSpeaker}`
      );
      state.isPlaying = false;
      state.currentPlayingSpeaker = "";
      playingSpeaker.components["sound"].stopSound();

      // check if clicked speaker is equal to current playing speaker
      if (
        `speaker-${action.speakerClicked}` ===
        `speaker-${state.currentPlayingSpeaker}`
      ) {
        // id yes increment score and write Correct in message box
        AFRAME.scenes[0].emit("updateScore");

        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Correct!",
        });
      } else {
        // if not write Wrong in message box
        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Wrong",
        });
      }

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
          state.currentPlayingSpeaker = "";
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

AFRAME.registerComponent("start-button", {
  init: function () {
    this.el.addEventListener("click", () => {
      AFRAME.scenes[0].emit("playFromRandomSpeaker");
    });
  },
});

AFRAME.registerComponent("player", {
  dependencies: ["resonance-audio-src"],
  init: function () {
    this.el.addEventListener("click", () => {
      AFRAME.scenes[0].emit("speakerClicked", {
        speakerClicked: this.el.id.split("-")[1],
      });
    });
  },
});

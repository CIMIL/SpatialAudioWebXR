import {
  TIME_BETWEEN_LEVELS,
  LEVELS,
  SPEAKER_RADIUS,
  DEBUG,
  DELAY_AFTER_START,
  BASELINE_WAIT_TIME,
} from "@utils/constants.js";
import { distributeSpeakers } from "@utils/distribute-speakers.js";
import "@utils/back-button.js";

const speakerPositions = distributeSpeakers(SPEAKER_RADIUS);

AFRAME.registerState({
  initialState: {
    audioSources: Array.from({ length: 64 }, (_, i) => ({
      id: `src-${i}`,
    })),
    speakers: Array.from({ length: 64 }, (_, i) => ({
      id: `speaker-${i}`,
      audioSrc: `#src-${i}`,
      // eslint-disable-next-line max-len
      position: `${speakerPositions[i].x} ${speakerPositions[i].y} ${speakerPositions[i].z}`,
    })),
    currentPlayingSpeaker: "",
    score: 0,
    messageBox: "Press Start to play",
    currentLevel: 0,
    sphereRadius: SPEAKER_RADIUS,
    clickActive: false,
    secondsElapsed: 0,
    isIntersected: false,
  },

  handlers: {
    playLoop: function (state, action) {
      if (state.currentPlayingSpeaker !== `${action.speaker}`) return;
      const playingSpeaker = document.querySelector(
        `#speaker-${action.speaker}`
      );
      playingSpeaker.components["sound"].playSound();

      if (DEBUG) {
        const speakerBox = document.querySelector(
          `#speaker-${action.speaker}-box`
        );
        speakerBox.setAttribute("material", { color: "red" });
      }
    },
    playFromRandomSpeaker: function (state, action) {
      // random number from 0 to 63
      const rand = Math.floor(Math.random() * (63 + 1));
      // update currentPlayingSpeaker
      state.currentPlayingSpeaker = `${rand}`;
      setTimeout(() => {
        // activate clicks
        state.clickActive = true;
        // play audio from random speaker
        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "What Speaker is playing?",
        });
        AFRAME.scenes[0].emit("playLoop", { speaker: rand });
      }, DELAY_AFTER_START);
    },

    toggleMenu: function (state, action) {
      const menu = document.querySelector("#menu");
      menu.object3D.visible = action.visible;
    },

    showBaseline: function (state, action) {
      const baselineSlide = document.querySelector("#baseline-slide");
      // disable menu
      AFRAME.scenes[0].emit("toggleMenu", { visible: false });
      baselineSlide.setAttribute("visible", true);
      baselineSlide.setAttribute("collider-check", {});
    },

    removeBaseline: function (state, action) {
      const baselineSlide = document.querySelector("#baseline-slide");
      baselineSlide.setAttribute("visible", false);
      baselineSlide.removeAttribute("collider-check");
      AFRAME.scenes[0].emit("playFromRandomSpeaker");
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

    setIsIntersected: function (state, action) {
      state.isIntersected = action.isIntersected;
    },

    setSecondsElapsed: function (state, action) {
      state.secondsElapsed = action.secondsElapsed;
    },

    checkIfIntersected: function (state, action) {
      if (state.isIntersected) {
        state.secondsElapsed += action.timeDelta;
        const baselineSlideText = document.querySelector(
          "#baseline-slide-text"
        );

        const secondsLeft =
          parseInt(BASELINE_WAIT_TIME / 1000) -
          parseInt(state.secondsElapsed / 1000);

        baselineSlideText.setAttribute(
          "value",
          `Look here for ${secondsLeft} seconds`
        );
        if (state.secondsElapsed > BASELINE_WAIT_TIME) {
          state.secondsElapsed = 0;
          state.isIntersected = false;
          // emit playRandomSound
          AFRAME.scenes[0].emit("removeBaseline");
        }
      } else {
        state.secondsElapsed = 0;
        const baselineSlideText = document.querySelector(
          "#baseline-slide-text"
        );

        // TODO change message box

        baselineSlideText.setAttribute(
          "value",
          `Look here for ${BASELINE_WAIT_TIME / 1000} seconds`
        );
      }
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

      // empty currentPlayingSpeaker
      state.currentPlayingSpeaker = "";
      // increment level
      state.currentLevel += 1;
      //  wait for n seconds
      setTimeout(() => {
        if (DEBUG) {
          const speakerBox = document.querySelector(
            `#speaker-${action.speakerClicked}-box`
          );
          speakerBox.setAttribute("material", { color: "white" });
        }

        // check if levels < 10
        if (state.currentLevel < LEVELS) {
          // if yes, emit new playFromRandomSpeaker
          AFRAME.scenes[0].emit("showBaseline");
        } else {
          // else set messagebox to "Game Over"
          state.currentPlayingSpeaker = "";
          AFRAME.scenes[0].emit("updateMessageBox", {
            message: "End of the Experience",
          });
          // show menu
          AFRAME.scenes[0].emit("toggleMenu", { visible: true });
        }
      }, TIME_BETWEEN_LEVELS);
    },
  },
});

AFRAME.registerComponent("start-button", {
  init: function () {
    this.el.addEventListener("click", () => {
      AFRAME.scenes[0].emit("showBaseline");
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

AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],

  init: function () {
    // check if raycaster intersection is held for 30 seconds
    this.el.addEventListener("raycaster-intersected", (e) => {
      this.el.setAttribute("color", "#bbed91");
      console.log("intersected");
      AFRAME.scenes[0].emit("setIsIntersected", { isIntersected: true });
    });

    this.el.addEventListener("raycaster-intersected-cleared", (e) => {
      this.el.setAttribute("color", "#fea3aa");
      AFRAME.scenes[0].emit("setIsIntersected", { isIntersected: false });
    });
  },

  remove: function () {
    this.el.removeEventListener("raycaster-intersected", this.onIntersected);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.onIntersectedCleared
    );
  },

  tick: function (_, timeDelta) {
    // check if raycaster intersection is held for 30 seconds
    AFRAME.scenes[0].emit("checkIfIntersected", { timeDelta: timeDelta });
  },
});

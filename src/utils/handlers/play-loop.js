import {
  DELAY_AFTER_START,
  TIME_BETWEEN_LEVELS,
  LEVELS,
  DEBUG,
} from "../constants.js";
import { setPropertyOnTurn } from "../logs.js";
import { getAngle } from "../rotation-header.js";

/**
 * Plays audio from a random speaker.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 */
export function playFromRandomSpeaker(state, action) {
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

    if (document.title === "Panner Node")
      document
        .querySelector(`#speaker-${rand}`)
        .components["sound"].playSound();
    else if (document.title === "Resonance Audio")
      document.querySelector(`#src-${rand}`).play();
    else console.error("Unknown audio context");

    if (DEBUG) {
      const speakerBox = document.querySelector(`#speaker-${rand}-box`);
      speakerBox.setAttribute("material", { color: "red" });
    }

    setPropertyOnTurn(
      "headHeadingSound",
      localStorage.getItem("cameraRotation")
    );
  }, DELAY_AFTER_START);

  setPropertyOnTurn("currentPlayingSpeaker", `speaker-${rand}`);
  // get rotation of the current speaker relative to the 0 0 0
  const speakerPosition = document
    .querySelector(`#speaker-${rand}`)
    .getAttribute("position");

  const degX = getAngle(-speakerPosition.x, -speakerPosition.z);
  const degY = getAngle(-speakerPosition.y, -speakerPosition.z);
  setPropertyOnTurn(
    "currentPlayingSpeakerPosition",
    `${degX.toFixed()} ${degY.toFixed()}`
  );
}

/**
 * Handles the click event on a speaker.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 */
export function speakerClicked(state, action) {
  // if clicks are not active, ignore
  if (!state.clickActive) return;

  // deactivate clicks
  state.clickActive = false;
  // stop sound from current speaker
  if (document.title === "Panner Node")
    document
      .querySelector(`#speaker-${state.currentPlayingSpeaker}`)
      .components["sound"].stopSound();
  else if (document.title === "Resonance Audio")
    document.querySelector(`#src-${state.currentPlayingSpeaker}`).pause();
  else console.error("Unknown audio context");

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
    setPropertyOnTurn("hasClickedRight", true);
  } else {
    // if not write Wrong in message box
    AFRAME.scenes[0].emit("updateMessageBox", {
      message: "Wrong",
    });
    setPropertyOnTurn("hasClickedRight", false);
  }

  setPropertyOnTurn("speakerClicked", `speaker-${action.speakerClicked}`);
  setPropertyOnTurn(
    "speakerClickedPosition",
    document
      .querySelector(`#speaker-${action.speakerClicked}`)
      .getAttribute("position")
      .x.toFixed(2) +
      " " +
      document
        .querySelector(`#speaker-${action.speakerClicked}`)
        .getAttribute("position")
        .z.toFixed(2)
  );
  setPropertyOnTurn("headHeadingClick", localStorage.getItem("cameraRotation"));

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
}

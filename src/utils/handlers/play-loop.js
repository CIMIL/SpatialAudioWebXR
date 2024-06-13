import { TIME_BETWEEN_TURNS, TURNS, DEBUG } from "../constants.js";
import { pushTurn, setPropertyOnTurn } from "../logs.js";
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

  // activate clicks
  state.clickActive = true;
  // play audio from random speaker
  AFRAME.scenes[0].emit("updateMessageBox", {
    message: "What speaker has played?",
  });

  if (document.title === "Panner Node")
    document.querySelector(`#speaker-${rand}`).components["sound"].playSound();
  else if (document.title === "Resonance Audio")
    document.querySelector(`#src-${rand}`).play();
  else console.error("Unknown audio context");

  if (DEBUG) {
    const speakerBox = document.querySelector(`#speaker-${rand}-ring`);
    speakerBox.setAttribute("material", { color: "blue", opacity: "1" });
  }

  setPropertyOnTurn("headHeadingSound", localStorage.getItem("cameraRotation"));

  setPropertyOnTurn("currentPlayingSpeaker", `speaker-${rand}`);
  // get rotation of the current speaker relative to the 0 0 0
  const currentPlayingSPeakerPosition = document
    .querySelector(`#speaker-${rand}`)
    .getAttribute("position");

  const degX = getAngle(
    -currentPlayingSPeakerPosition.x,
    -currentPlayingSPeakerPosition.z
  );
  const degY = getAngle(
    -currentPlayingSPeakerPosition.y,
    -currentPlayingSPeakerPosition.z
  );
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
    const speakerClicked = document.querySelector(
      `#speaker-${action.speakerClicked}-ring`
    );
    speakerClicked.setAttribute("material", { color: "green", opacity: "1" });

    // id yes increment score and write Correct in message box
    AFRAME.scenes[0].emit("updateScore");

    AFRAME.scenes[0].emit("updateMessageBox", {
      message: "Correct!",
    });
    setPropertyOnTurn("hasClickedRight", true);
  } else {
    const speakerClicked = document.querySelector(
      `#speaker-${action.speakerClicked}-ring`
    );
    speakerClicked.setAttribute("material", { color: "red", opacity: "1" });

    const currentPlayingSpeaker = document.querySelector(
      `#speaker-${state.currentPlayingSpeaker}-ring`
    );
    currentPlayingSpeaker.setAttribute("material", {
      color: "green",
      opacity: "1",
    });

    // if not write Wrong in message box
    AFRAME.scenes[0].emit("updateMessageBox", {
      message: "Sorry, wrong speaker!",
    });
    setPropertyOnTurn("hasClickedRight", false);
  }

  setPropertyOnTurn("speakerClicked", `speaker-${action.speakerClicked}`);
  const speakerClickedPosition = document
    .querySelector(`#speaker-${action.speakerClicked}`)
    .getAttribute("position");

  const degX = getAngle(-speakerClickedPosition.x, -speakerClickedPosition.z);
  const degY = getAngle(-speakerClickedPosition.y, -speakerClickedPosition.z);

  setPropertyOnTurn(
    "speakerClickedPosition",
    `${degX.toFixed()} ${degY.toFixed()}`
  );
  setPropertyOnTurn("headHeadingClick", localStorage.getItem("cameraRotation"));

  // increment level
  state.currentLevel += 1;

  pushTurn();
  //  wait for n seconds
  setTimeout(() => {
    if (DEBUG) {
      const speakerClicked = document.querySelector(
        `#speaker-${action.speakerClicked}-ring`
      );
      const currentPlayingSpeaker = document.querySelector(
        `#speaker-${state.currentPlayingSpeaker}-ring`
      );

      speakerClicked.setAttribute("material", { opacity: "0" });
      currentPlayingSpeaker.setAttribute("material", { opacity: "0" });
    }

    // empty currentPlayingSpeaker
    state.currentPlayingSpeaker = "";

    // check if TURNS < 10
    if (state.currentLevel < TURNS) {
      // if yes, emit new playFromRandomSpeaker
      AFRAME.scenes[0].emit("showBaseline");
    } else {
      // else set messagebox to "Game Over"
      state.currentPlayingSpeaker = "";
      AFRAME.scenes[0].emit("updateMessageBox", {
        message: "End of the experience. Wait for instructions.",
      });
      // show menu
      const buttons = document.getElementById("buttons");
      buttons.emit("showButtons", null, false);
    }
  }, TIME_BETWEEN_TURNS);
}

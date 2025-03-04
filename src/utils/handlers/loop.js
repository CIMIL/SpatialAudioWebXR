import { TIME_BETWEEN_TURNS, TURNS, DEBUG, SPEAKERS_COUNT } from "../constants.js";
import { pushTurn, setPropertyOnTurn } from "../logs.js";
import { getAngle } from "../rotation-header.js";

/**
 * Plays audio from a random speaker.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 */
export function playFromRandomSpeaker(state, action) {
  // random number from 0 to SPEAKERS_COUNT
  const rand = Math.floor(Math.random() * (SPEAKERS_COUNT + 1));
  // update currentPlayingSpeaker
  state.currentPlayingSpeaker = `${rand}`;

  // activate clicks
  state.clickActive = true;
  // play audio from random speaker
  AFRAME.scenes[0].emit("updateMessageBox", {
    message: "What speaker played?",
  });

  // Record the sound start time and save it to localStorage for persistence
  const soundPlayedTime = Date.now();
  localStorage.setItem("soundPlayedTime", soundPlayedTime);
  
  // Save to the current turn
  setPropertyOnTurn("soundPlayedTime", soundPlayedTime);

  if (document.title === "Resonance Audio")
    document.querySelector(`#src-${rand}`).play();
  else if (
    document.title === "Howler JS - HRTF" ||
    document.title === "Howler JS - equalpower"
  )
    document.querySelector(`#speaker-${rand}`).emit("play-sound");
  else console.error("Unknown audio context");

  if (DEBUG) {
    const speakerBox = document.querySelector(`#speaker-${rand}-ring`);
    speakerBox.setAttribute("material", { color: "blue", opacity: "1" });
  }

  const speakerBox = document.querySelector(`#speaker-${rand}-ring`);
  console.log(speakerBox);

  setPropertyOnTurn("headHeadingSound", localStorage.getItem("cameraRotation"));

  setPropertyOnTurn("currentPlayingSpeaker", `speaker-${rand}`);
  // get rotation of the current speaker relative to the 0 0 0
  const currentPlayingSPeakerPosition = document
    .querySelector(`#speaker-${rand}`)
    .getAttribute("position");

  const degX = getAngle(
    -currentPlayingSPeakerPosition.x,
    -currentPlayingSPeakerPosition.z,
  );
  const degY = getAngle(
    -currentPlayingSPeakerPosition.y,
    -currentPlayingSPeakerPosition.z,
  );
  setPropertyOnTurn(
    "currentPlayingSpeakerPosition",
    `${degX.toFixed()} ${degY.toFixed()}`,
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

  // Record the click time
  const clickTime = Date.now();
  
  // Get the sound played time from localStorage
  const soundPlayedTime = parseInt(localStorage.getItem("soundPlayedTime") || 0);
  
  // Calculate the response time in milliseconds
  const responseTime = clickTime - soundPlayedTime;
  
  // Log for debugging
  console.log(`Response time: ${responseTime} ms`);
  
  // Save to the current turn - do this BEFORE pushTurn() is called
  setPropertyOnTurn("clickTime", clickTime);
  setPropertyOnTurn("responseTime", responseTime);
  
  // deactivate clicks
  state.clickActive = false;
  // stop sound from current speaker
  if (document.title === "Resonance Audio")
    document.querySelector(`#src-${state.currentPlayingSpeaker}`).pause();
  else if (
    document.title === "Howler JS - HRTF" ||
    document.title === "Howler JS - equalpower"
  )
    document
      .querySelector(`#speaker-${state.currentPlayingSpeaker}`)
      .emit("pause-sound");
  else console.error("Unknown audio context");

  // highlight clicked speaker
  const speakerClicked = document.querySelector(
    `#speaker-${action.speakerClicked}-ring`,
  );

  speakerClicked.setAttribute("material", {
    color: "blue",
    opacity: "1",
  });

  setTimeout(() => {
    speakerClicked.setAttribute("material", { opacity: "0" });
  }, 3000);

  // check if clicked speaker is equal to current playing speaker
  if (
    `speaker-${action.speakerClicked}` ===
    `speaker-${state.currentPlayingSpeaker}`
  ) {
    const speakerClicked = document.querySelector(
      `#speaker-${action.speakerClicked}-ring`,
    );

    if (DEBUG)
      speakerClicked.setAttribute("material", { color: "green", opacity: "1" });

    // id yes increment score and write Correct in message box
    AFRAME.scenes[0].emit("updateScore");

    if (DEBUG)
      AFRAME.scenes[0].emit("updateMessageBox", {
        message: "Correct!",
      });
    setPropertyOnTurn("hasClickedRight", true);
  } else {
    const speakerClicked = document.querySelector(
      `#speaker-${action.speakerClicked}-ring`,
    );

    if (DEBUG)
      speakerClicked.setAttribute("material", { color: "red", opacity: "1" });

    const currentPlayingSpeaker = document.querySelector(
      `#speaker-${state.currentPlayingSpeaker}-ring`,
    );

    if (DEBUG)
      currentPlayingSpeaker.setAttribute("material", {
        color: "green",
        opacity: "1",
      });

    // if not write Wrong in message box
    if (DEBUG)
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
    `${degX.toFixed()} ${degY.toFixed()}`,
  );
  setPropertyOnTurn("headHeadingClick", localStorage.getItem("cameraRotation"));

  // Increment level AFTER all properties are set
  state.currentLevel += 1;

  // Now we can safely push the turn with all collected data
  pushTurn();
  
  // Wait for TIME_BETWEEN_TURNS
  setTimeout(() => {
    if (DEBUG) {
      const speakerClicked = document.querySelector(
        `#speaker-${action.speakerClicked}-ring`,
      );
      const currentPlayingSpeaker = document.querySelector(
        `#speaker-${state.currentPlayingSpeaker}-ring`,
      );

      speakerClicked.setAttribute("material", { opacity: "0" });
      currentPlayingSpeaker.setAttribute("material", { opacity: "0" });
    }

    // empty currentPlayingSpeaker
    state.currentPlayingSpeaker = "";

    console.log(state.currentLevel);

    // check if TURNS < 10
    if (state.currentLevel < TURNS) {
      // if yes, emit new playFromRandomSpeaker
      const buttons = document.getElementById("buttons");
      buttons.emit("showButtons", null, false);

      //AFRAME.scenes[0].emit("showBaseline");

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
import { TIME_BETWEEN_TURNS, TURNS, DEBUG, SPEAKERS_COUNT } from "../constants.js";
import { pushTurn, setPropertyOnTurn } from "../logs.js";
import { getAngle } from "../rotation-header.js";


/**
 * Plays audio from speakers in a random order without repeating until all speakers have been used.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 */
export function playFromRandomSpeaker(state, action) {
  try {
    // Initialize or reset the available speakers array if needed
    if (!state.availableSpeakers || state.availableSpeakers.length === 0) {
      // Create an array with all speaker indices [0, 1, 2, ..., SPEAKERS_COUNT]
      state.availableSpeakers = Array.from({ length: SPEAKERS_COUNT }, (_, i) => i);
      // Shuffle the array using Fisher-Yates algorithm
      for (let i = state.availableSpeakers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.availableSpeakers[i], state.availableSpeakers[j]] = 
          [state.availableSpeakers[j], state.availableSpeakers[i]];
      }
    }
    
    // Take the next speaker from the shuffled array
    const rand = state.availableSpeakers.pop();
    
    // Double-check that we have a valid speaker index
    if (rand === undefined || rand === null) {
      console.error("No valid speaker index found. Resetting and trying again.");
      state.availableSpeakers = [];
      return playFromRandomSpeaker(state, action);
    }
    
    // update currentPlayingSpeaker
    state.currentPlayingSpeaker = `${rand}`;
    console.log(`Playing from speaker: ${rand}`);

    // activate clicks
    state.clickActive = true;
    console.log("Click interaction activated");
    
    // play audio from random speaker
    AFRAME.scenes[0].emit("updateMessageBox", {
      message: "What speaker played?",
    });

    // Record the sound start time and save it to localStorage for persistence
    const soundPlayedTime = Date.now();
    localStorage.setItem("soundPlayedTime", soundPlayedTime);
    
    // Save to the current turn
    setPropertyOnTurn("soundPlayedTime", soundPlayedTime);

    // Check which audio system we're using and play the sound
    const docTitle = document.title;
    if (docTitle === "Resonance Audio") {
      const audioElement = document.querySelector(`#src-${rand}`);
      if (!audioElement) {
        console.error(`Audio element #src-${rand} not found`);
        return;
      }
      audioElement.play().catch(err => {
        console.error("Error playing audio:", err);
        // If audio fails to play, still allow user to click
      });
    } else if (
      docTitle === "Howler JS - HRTF" ||
      docTitle === "Howler JS - equalpower"
    ) {
      const speakerElement = document.querySelector(`#speaker-${rand}`);
      if (!speakerElement) {
        console.error(`Speaker element #speaker-${rand} not found`);
        return;
      }
      speakerElement.emit("play-sound");
    } else {
      console.error(`Unknown audio context: ${docTitle}`);
    }

    // Get the speaker ring element
    const speakerBox = document.querySelector(`#speaker-${rand}-ring`);
    if (!speakerBox) {
      console.error(`Speaker ring #speaker-${rand}-ring not found`);
    } else if (DEBUG) {
      speakerBox.setAttribute("material", { color: "blue", opacity: "1" });
    }

    // Store head rotation at the time of sound playing
    setPropertyOnTurn("headHeadingSound", localStorage.getItem("cameraRotation"));
    setPropertyOnTurn("currentPlayingSpeaker", `speaker-${rand}`);
    
    // Get rotation of the current speaker relative to the origin
    const speakerElement = document.querySelector(`#speaker-${rand}`);
    if (!speakerElement) {
      console.error(`Speaker element #speaker-${rand} not found for position calculation`);
      return;
    }
    
    const currentPlayingSpeakerPosition = speakerElement.getAttribute("position");
    if (!currentPlayingSpeakerPosition) {
      console.error("Failed to get speaker position");
      return;
    }

    const degX = getAngle(
      -currentPlayingSpeakerPosition.x,
      -currentPlayingSpeakerPosition.z,
    );
    const degY = getAngle(
      -currentPlayingSpeakerPosition.y,
      -currentPlayingSpeakerPosition.z,
    );
    setPropertyOnTurn(
      "currentPlayingSpeakerPosition",
      `${degX.toFixed()} ${degY.toFixed()}`,
    );
  } catch (err) {
    console.error("Error in playFromRandomSpeaker:", err);
    // Reset state and ensure clicks are enabled
    state.clickActive = true;
  }
}

/**
 * Handles the click event on a speaker.
 * @param {Object} state - The current state.
 * @param {Object} action - The action object.
 */
export function speakerClicked(state, action) {
  try {
    // Log the click attempt for debugging
    console.log(`Speaker clicked: ${action.speakerClicked}, Click active: ${state.clickActive}`);
    
    // if clicks are not active, ignore but log for debugging
    if (!state.clickActive) {
      console.log("Click ignored - clicks not active");
      return;
    }

    // Record the click time
    const clickTime = Date.now();
    
    // Get the sound played time from localStorage
    const soundPlayedTimeStr = localStorage.getItem("soundPlayedTime");
    if (!soundPlayedTimeStr) {
      console.error("No soundPlayedTime found in localStorage");
      // Use a fallback value to prevent further errors
      localStorage.setItem("soundPlayedTime", (Date.now() - 1000).toString());
    }
    
    const soundPlayedTime = parseInt(soundPlayedTimeStr || "0");
    
    // Calculate the response time in milliseconds
    const responseTime = clickTime - soundPlayedTime;
    
    // Log for debugging
    console.log(`Response time: ${responseTime} ms`);
    
    // Save to the current turn - do this BEFORE pushTurn() is called
    setPropertyOnTurn("clickTime", clickTime);
    setPropertyOnTurn("responseTime", responseTime);
    
    // deactivate clicks
    state.clickActive = false;
    
    // Stop sound from current speaker
    const docTitle = document.title;
    if (docTitle === "Resonance Audio") {
      const audioElement = document.querySelector(`#src-${state.currentPlayingSpeaker}`);
      if (audioElement) {
        audioElement.pause();
      } else {
        console.error(`Audio element #src-${state.currentPlayingSpeaker} not found for pausing`);
      }
    } else if (
      docTitle === "Howler JS - HRTF" ||
      docTitle === "Howler JS - equalpower"
    ) {
      const speakerElement = document.querySelector(`#speaker-${state.currentPlayingSpeaker}`);
      if (speakerElement) {
        speakerElement.emit("pause-sound");
      } else {
        console.error(`Speaker element #speaker-${state.currentPlayingSpeaker} not found for pausing`);
      }
    } else {
      console.error(`Unknown audio context: ${docTitle}`);
    }

    // highlight clicked speaker
    const speakerClicked = document.querySelector(
      `#speaker-${action.speakerClicked}-ring`,
    );

    if (!speakerClicked) {
      console.error(`Clicked speaker ring #speaker-${action.speakerClicked}-ring not found`);
    } else {
      speakerClicked.setAttribute("material", {
        color: "red",
        opacity: "1",
      });

      setTimeout(() => {
        speakerClicked.setAttribute("material", { opacity: "0" });
      }, 3000);
    }

    // check if clicked speaker is equal to current playing speaker
    const isCorrect = `speaker-${action.speakerClicked}` === `speaker-${state.currentPlayingSpeaker}`;
    
    if (isCorrect) {
      // Correct answer
      AFRAME.scenes[0].emit("updateScore");

      if (DEBUG)
        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Correct!",
        });
      setPropertyOnTurn("hasClickedRight", true);
      
      if (DEBUG && speakerClicked) {
        speakerClicked.setAttribute("material", { color: "green", opacity: "1" });
      }
    } else {
      // Wrong answer
      if (DEBUG)
        AFRAME.scenes[0].emit("updateMessageBox", {
          message: "Sorry, wrong speaker!",
        });
      setPropertyOnTurn("hasClickedRight", false);
      
      if (DEBUG) {
        if (speakerClicked) {
          speakerClicked.setAttribute("material", { color: "red", opacity: "1" });
        }
        
        const currentPlayingSpeaker = document.querySelector(
          `#speaker-${state.currentPlayingSpeaker}-ring`,
        );
        
        if (currentPlayingSpeaker) {
          currentPlayingSpeaker.setAttribute("material", {
            color: "green",
            opacity: "1",
          });
        } else {
          console.error(`Current playing speaker ring #speaker-${state.currentPlayingSpeaker}-ring not found`);
        }
      }
    }

    setPropertyOnTurn("speakerClicked", `speaker-${action.speakerClicked}`);
    
    const speakerElement = document.querySelector(`#speaker-${action.speakerClicked}`);
    if (!speakerElement) {
      console.error(`Speaker element #speaker-${action.speakerClicked} not found for position calculation`);
    } else {
      const speakerClickedPosition = speakerElement.getAttribute("position");
      
      if (speakerClickedPosition) {
        const degX = getAngle(-speakerClickedPosition.x, -speakerClickedPosition.z);
        const degY = getAngle(-speakerClickedPosition.y, -speakerClickedPosition.z);

        setPropertyOnTurn(
          "speakerClickedPosition",
          `${degX.toFixed()} ${degY.toFixed()}`,
        );
      }
    }
    
    setPropertyOnTurn("headHeadingClick", localStorage.getItem("cameraRotation"));

    // Increment level AFTER all properties are set
    state.currentLevel = (state.currentLevel || 0) + 1;

    // Now we can safely push the turn with all collected data
    pushTurn();
    
    // Wait for TIME_BETWEEN_TURNS
    setTimeout(() => {
      try {
        if (DEBUG) {
          if (speakerClicked) {
            speakerClicked.setAttribute("material", { opacity: "0" });
          }
          
          const currentPlayingSpeaker = document.querySelector(
            `#speaker-${state.currentPlayingSpeaker}-ring`,
          );
          
          if (currentPlayingSpeaker) {
            currentPlayingSpeaker.setAttribute("material", { opacity: "0" });
          }
        }

        // empty currentPlayingSpeaker
        state.currentPlayingSpeaker = "";

        console.log(`Current level: ${state.currentLevel}`);

        // check if TURNS < 10
        if (state.currentLevel < TURNS) {
          // if yes, emit new playFromRandomSpeaker
          const buttons = document.getElementById("buttons");
          if (buttons) {
            buttons.emit("showButtons", null, false);
          } else {
            console.error("Buttons element not found");
            // Proceed anyway to prevent stuck state
            setTimeout(() => {
              playFromRandomSpeaker(state, {});
            }, 500);
          }
        } else {
          // else set messagebox to "Game Over"
          state.currentPlayingSpeaker = "";
          AFRAME.scenes[0].emit("updateMessageBox", {
            message: "End of the experience. Wait for instructions.",
          });
          // show menu
          const buttons = document.getElementById("buttons");
          if (buttons) {
            buttons.emit("showButtons", null, false);
          } else {
            console.error("Buttons element not found for end state");
          }
        }
      } catch (err) {
        console.error("Error in setTimeout callback:", err);
        // Ensure the game doesn't get stuck
        state.clickActive = false;
        state.currentPlayingSpeaker = "";
      }
    }, TIME_BETWEEN_TURNS);
  } catch (err) {
    console.error("Error in speakerClicked:", err);
    // Reset state to prevent getting stuck
    state.clickActive = false;
    state.currentPlayingSpeaker = "";
  }
}
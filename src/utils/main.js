import { SPEAKER_RADIUS } from "./constants.js";
import "./back-button.js";
import "./start-button.js";
import "./collider-check.js";
import {
  showBaseline,
  removeBaseline,
  checkIfIntersected,
  setIsIntersected,
  setSecondsElapsed,
} from "./handlers/baseline.js";

import { playFromRandomSpeaker, speakerClicked } from "./handlers/loop.js";

AFRAME.registerState({
  initialState: {
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
    showBaseline,
    removeBaseline,
    checkIfIntersected,
    setIsIntersected,
    setSecondsElapsed,
    playFromRandomSpeaker,
    speakerClicked,
    updateMessageBox: function (state, action) {
      const messageBox = document.querySelector("#message-box");
      state.messageBox = action.message;
      messageBox.setAttribute("value", state.messageBox);
    },
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

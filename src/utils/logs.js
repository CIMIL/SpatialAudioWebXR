/**
  structure sample of the data object
  {
    data: [
      {
        experience: "A-Frame Spatial Audio",
        turns: [
          {
            currentPlayingSpeaker: "speaker-1", // in loop.js
            currentPlayingSpeakerPosition: "x y", // in loop.js
            speakerClicked: "speaker-1", // in loop.js
            speakerClickedPosition: "x y", // in loop.js
            headHeadingStart: "x y", // in baseline.js
            headHeadingSound: "x y", // in baseline.js
            headHeadingClick: "x y", // in loop.js
            hasClickedRight: true, // in loop.js
          },
        ],
      },
    ];
  }
  */

AFRAME.registerComponent("logs", {
  init: function () {
    // generate a unique log id
    // check if a log id already exists in local storage
    localStorage.getItem("sessionId") ||
      localStorage.setItem("sessionId", this.randomId());

    if (document.title === "Spatial Audio AFRAME")
      document
        .getElementById("id-text")
        .setAttribute("value", "Your ID: " + localStorage.getItem("sessionId"));
  },
  randomId: function () {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    length = 6;
    let id = "";
    // 3 random letters and 3 random numbers
    for (let i = 0; i < length / 2; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    id += "-";
    for (let i = 0; i < length / 2; i++) {
      id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return id;
  },
});

// build a function to push a single experience object to the data array
/**
 *
 * @param {*} experience
 */
export function pushExperience(experience) {
  localStorage.getItem("data") ||
    localStorage.setItem("data", JSON.stringify([]));
  const data = JSON.parse(localStorage.getItem("data"));
  data.push(experience);
  localStorage.setItem("data", JSON.stringify(data));
}

// build a function to push a single turn object to the turns array
/**
 *
 * @param {*} turn
 */
export function pushTurn() {
  const data = JSON.parse(localStorage.getItem("data"));
  const currentExperience = data[data.length - 1];
  const turn = JSON.parse(localStorage.getItem("turn"));
  currentExperience.turns.push(turn);
  localStorage.removeItem("turn");
  localStorage.setItem("data", JSON.stringify(data));
}

// build a function to set a property on the turn object
/**
 *
 * @param {*} property
 * @param {*} value
 */
export function setPropertyOnTurn(property, value) {
  localStorage.getItem("turn") ||
    localStorage.setItem("turn", JSON.stringify({}));
  const data = JSON.parse(localStorage.getItem("turn"));
  data[property] = value;
  localStorage.setItem("turn", JSON.stringify(data));
}

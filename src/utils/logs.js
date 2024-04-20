import { v4 as uuidv4 } from "uuid";

// structure sample of the data object
// {
//   data: [
//     {
//       experience: "Panner Node",
//       turns: [
//         {
//           currentPlayingSpeaker: "speaker-1", // in play-loop.js
//           currentPlayingSpeakerPosition: "x y", // in play-loop.js
//           speakerClicked: "speaker-1", // in play-loop.js
//           speakerClickedPosition: "x y", // in play-loop.js
//           headHeadingStart: "x y", // in baseline.js
//           headHeadingSound: "x y", // in baseline.js
//           headHeadingClick: "x y", // in play-loop.js
//           hasClickedRight: true, // in play-loop.js
//         },
//       ],
//     },
//   ];
// }

AFRAME.registerComponent("logs", {
  init: function () {
    // generate a unique log id
    // check if a log id already exists in local storage
    localStorage.getItem("sessionId") ||
      localStorage.setItem("sessionId", uuidv4());

    // log the start of the session
    console.log("Session started");

    document
      .getElementById("sessioIdBox")
      .setAttribute(
        "value",
        "Session ID: " + localStorage.getItem("sessionId")
      );
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

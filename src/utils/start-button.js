import { pushExperience } from "./logs";

AFRAME.registerComponent("start-button", {
  init: function () {
    this.el.addEventListener("click", () => {
      var audioContext = new AudioContext();
      console.log("audioContext", audioContext);
      // push a new experience object to the data array
      // get the current experience name from location title
      const experience = document.title;
      pushExperience({ experience: experience, turns: [] });

      AFRAME.scenes[0].emit("showBaseline");
    });
  },
});

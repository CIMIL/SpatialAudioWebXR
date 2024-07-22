import { Howl } from "howler";
import { VOLUME } from "./constants";

AFRAME.registerComponent("howler-source", {
  schema: {
    src: { type: "string" },
  },

  init: function () {
    const src = this.data.src;
    // get world position of the entity
    const coords = this.el.object3D.position;
    const soundPath = document.querySelector(src).getAttribute("src");

    const sound = new Howl({
      src: [soundPath],
      volume: VOLUME,
    });

    sound.pannerAttr({
      panningModel: "HRTF",
    });

    sound.pos(coords.x, coords.y, coords.z);

    this.el.addEventListener("play-sound", () => {
      sound.play();
    });

    this.el.addEventListener("pause-sound", () => {
      sound.pause();
    });
  },
});

AFRAME.registerComponent("howler-listener", {
  tick: function (time, timeDelta) {
    const cameraPositon = this.el.object3D.position;
    Howler.pos(cameraPositon.x, cameraPositon.y, cameraPositon.z);
  },
});

// AFRAME.registerComponent("sound-trigger", {
//   init: function () {
//     setTimeout(() => {
//       console.log("play sound");
//       // emit the play-sound event inside the howler-source component
//       const elements = ["#soundSource1", "#soundSource2", "#soundSource3"];
//       const soundEl = document.querySelector(
//         elements[Math.floor(Math.random() * elements.length)]
//       );
//       soundEl.emit("play-sound");
//     }, 2000);
//   },
// });

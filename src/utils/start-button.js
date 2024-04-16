AFRAME.registerComponent("start-button", {
  init: function () {
    this.el.addEventListener("click", () => {
      AFRAME.scenes[0].emit("showBaseline");
    });
  },
});

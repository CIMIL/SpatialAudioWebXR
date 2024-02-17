AFRAME.registerComponent("back-button", {
  init: function () {
    this.el.addEventListener("click", () => {
      window.location.href = "/";
    });
  },
});

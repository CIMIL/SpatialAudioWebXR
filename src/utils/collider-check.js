AFRAME.registerComponent("collider-check", {
  dependencies: ["raycaster"],

  init: function () {
    // check if raycaster intersection is held for 30 seconds
    this.el.addEventListener("raycaster-intersected", (e) => {
      if (!this.el.hasAttribute("data-watchable")) return;
      this.el.setAttribute("color", "#bbed91");
      console.trace("intersected");
      AFRAME.scenes[0].emit("setIsIntersected", { isIntersected: true });
    });

    this.el.addEventListener("raycaster-intersected-cleared", (e) => {
      if (!this.el.hasAttribute("data-watchable")) return;
      this.el.setAttribute("color", "#fea3aa");
      AFRAME.scenes[0].emit("setIsIntersected", { isIntersected: false });
    });

    // this fix intersection bug in the beginning
    AFRAME.scenes[0].emit("setIsIntersected", { isIntersected: false });
  },

  remove: function () {
    this.el.removeEventListener("raycaster-intersected", this.onIntersected);
    this.el.removeEventListener(
      "raycaster-intersected-cleared",
      this.onIntersectedCleared,
    );
  },

  tick: function (_, timeDelta) {
    // check if raycaster intersection is held for 30 seconds
    AFRAME.scenes[0].emit("checkIfIntersected", { timeDelta: timeDelta });
  },
});

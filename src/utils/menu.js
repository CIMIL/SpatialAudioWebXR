AFRAME.registerComponent("show-menu", {
  init: function () {
    const isDesktop = !AFRAME.utils.device.checkHeadsetConnected();
    if (isDesktop) {
      this.el.setAttribute("visible", false);
    } else {
      this.el.setAttribute("visible", true);
    }
  },
});

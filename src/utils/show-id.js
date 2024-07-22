AFRAME.registerComponent("show-id", {
  init: function () {
    const sessionId = localStorage.getItem("sessionId");
    const debugText = document.getElementById("id-text");
    debugText.setAttribute("value", `Session ID: ${sessionId}`);
  },
});

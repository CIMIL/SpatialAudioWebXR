AFRAME.registerComponent("show-id", {
  init: function () {
    const sessionId = localStorage.getItem("sessionId");
    const idText = document.getElementById("id-text");
    idText.setAttribute("value", `Session ID: ${sessionId}`);
  },
});

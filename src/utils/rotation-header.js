AFRAME.registerComponent("rotation-header", {
  // Log the rotation of the camera in degrees
  tick: function (t) {
    const cam = document.querySelector("#camera").object3D;
    const camDir = new THREE.Vector3();
    const e = cam.matrixWorld.elements;
    camDir.set(e[8], e[9], e[10]).normalize();
    const camDirX = camDir.x;
    const camDirY = camDir.y;
    const camDirZ = camDir.z;
    const camDirDegX = (Math.atan2(camDirX, camDirZ) * 180) / Math.PI;
    const camDirDegY = (Math.atan2(camDirY, camDirZ) * 180) / Math.PI;
    // console.log(camDirDegX.toFixed(), camDirDegY.toFixed());
    // save the rotation to localStorage
    const camDirDeg = { x: camDirDegX.toFixed(), y: camDirDegY.toFixed() };
    localStorage.setItem("camera-rotation", JSON.stringify(camDirDeg));
  },
});

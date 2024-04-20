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
    const camDirDegX = getAngle(camDirX, camDirZ);
    const camDirDegY = getAngle(camDirY, camDirZ);
    // console.log(camDirDegX.toFixed(), camDirDegY.toFixed());
    // save the rotation to localStorage
    const camDirDeg = "" + camDirDegX.toFixed() + " " + camDirDegY.toFixed();
    localStorage.setItem("cameraRotation", camDirDeg);
  },
});

/**
 * Get the rotation angle in degrees based on cartesian coordinates.
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 * @return {number} The angle in degrees.
 */
export function getAngle(x, y) {
  return (Math.atan2(x, y) * 180) / Math.PI;
}

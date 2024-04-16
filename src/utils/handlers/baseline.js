import { BASELINE_WAIT_TIME } from "../constants";

/**
 * Shows the baseline.
 * @param {Object} state - The state object.
 * @param {Object} action - The action object.
 */
export function showBaseline(state, action) {
  const baselineSlide = document.querySelector("#baseline-slide");
  // disable menu
  AFRAME.scenes[0].emit("toggleMenu", { visible: false });
  baselineSlide.setAttribute("visible", true);
  baselineSlide.setAttribute("collider-check", {});
}

/**
 * Removes the baseline.
 * @param {Object} state - The state object.
 * @param {Object} action - The action object.
 */
export function removeBaseline(state, action) {
  const baselineSlide = document.querySelector("#baseline-slide");
  baselineSlide.setAttribute("visible", false);
  baselineSlide.removeAttribute("collider-check");

  AFRAME.scenes[0].emit("playFromRandomSpeaker");
}

/**
 * Checks if the object is intersected.
 * @param {Object} state - The state object.
 * @param {Object} action - The action object.
 */
export function checkIfIntersected(state, action) {
  if (state.isIntersected) {
    state.secondsElapsed += action.timeDelta;
    const baselineSlideText = document.querySelector("#baseline-slide-text");

    const secondsLeft =
      parseInt(BASELINE_WAIT_TIME / 1000) -
      parseInt(state.secondsElapsed / 1000);

    baselineSlideText.setAttribute(
      "value",
      `Look here for ${secondsLeft} seconds`
    );
    if (state.secondsElapsed > BASELINE_WAIT_TIME) {
      state.secondsElapsed = 0;
      state.isIntersected = false;
      // emit playRandomSound
      AFRAME.scenes[0].emit("removeBaseline");
    }
  } else {
    state.secondsElapsed = 0;
    const baselineSlideText = document.querySelector("#baseline-slide-text");

    // TODO change message box

    baselineSlideText.setAttribute(
      "value",
      `Look here for ${BASELINE_WAIT_TIME / 1000} seconds`
    );
  }
}

/**
 * Set the state of the baseline intersection
 * @param {Object} state - The state object.
 * @param {Object} action - The action object.
 */
export function setIsIntersected(state, action) {
  state.isIntersected = action.isIntersected;
}

/**
 * Sets the seconds elapsed while intersected
 *  @param {Object} state - The state object.
 * @param {Object} action - The action object.
 */
export function setSecondsElapsed(state, action) {
  state.secondsElapsed = action.secondsElapsed;
}

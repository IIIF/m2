import ActionTypes from './action-types';
import {
  getNextCanvasGrouping,
  getPreviousCanvasGrouping,
  getCanvasGrouping,
  getConfig,
} from '../selectors';

/**
 * setCanvas - action creator
 *
 * @param  {String} windowId
 * @param  {String} canvasId
 * @memberof ActionCreators
 */
export function setCanvas(windowId, canvasId, newGroup = undefined, options = {}) {
  return ((dispatch, getState) => {
    const state = getState();
    const { preserveViewport } = getConfig(state).osdConfig;
    let visibleCanvases = newGroup;

    if (!visibleCanvases) {
      const group = getCanvasGrouping(state, { canvasId, windowId });
      visibleCanvases = (group || []).map(c => c.id);
    }

    dispatch({
      ...options,
      canvasId,
      preserveViewport,
      type: ActionTypes.SET_CANVAS,
      visibleCanvases,
      windowId,
    });
  });
}

/** Set the window's canvas to the next canvas grouping */
export function setNextCanvas(windowId) {
  return ((dispatch, getState) => {
    const state = getState();
    const newGroup = getNextCanvasGrouping(state, { windowId });
    const ids = (newGroup || []).map(c => c.id);
    newGroup && dispatch(setCanvas(windowId, ids[0], ids));
  });
}

/** Set the window's canvas to the previous canvas grouping */
export function setPreviousCanvas(windowId) {
  return ((dispatch, getState) => {
    const state = getState();

    const newGroup = getPreviousCanvasGrouping(state, { windowId });
    const ids = (newGroup || []).map(c => c.id);
    newGroup && dispatch(setCanvas(windowId, ids[0], ids));
  });
}

/**
 *
 * @param windowId
 * @param payload
 * @returns {{payload: *, type: string, windowId: *}}
 */
export function updateViewport(windowId, payload) {
  return {
    payload,
    type: ActionTypes.UPDATE_VIEWPORT,
    windowId,
  };
}

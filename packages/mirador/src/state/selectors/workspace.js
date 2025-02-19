import { createSelector } from 'reselect';
import { getWorkspace } from './getters';
import { miradorSlice } from './utils';

/**
 * Returns the elastic layout from the state.
 * @param {object} state
 * @returns {Object}
 */
export function getElasticLayout(state) {
  return miradorSlice(state).elasticLayout;
}

/**
 * Returns if fullscreen is enabled.
 * @param {object} state
 * @returns {boolean}
 */
export const getFullScreenEnabled = createSelector(
  [getWorkspace],
  workspace => workspace.isFullscreenEnabled,
);

/**
 * Returns the latest error from the state.
 * @param {object} state
 * @returns {object|undefined}
 */
export function getLatestError(state) {
  const [errorId] = miradorSlice(state).errors.items;

  return miradorSlice(state).errors[errorId];
}

/**
 * Returns the type of the workspace.
 * @param {Object} state
 * @returns {string} 'mosaic' | 'elastic'
 */
export const getWorkspaceType = createSelector(
  [getWorkspace],
  ({ type }) => type,
);

/**
 * Returns the ID of the focused window.
 * @param {object} state
 * @returns {string|undefined}
 */
export const getFocusedWindowId = createSelector(
  [getWorkspace],
  ({ focusedWindowId }) => focusedWindowId,
);

/**
 * Returns if a given window is focused.
 * @param {object} state
 * @param {string} windowId
 * @returns {boolean}
 */
export const isFocused = (state, { windowId }) => (
  getFocusedWindowId(state) === windowId
);

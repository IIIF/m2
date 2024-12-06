import { createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import { miradorSlice } from './utils';
import { getWindow, getWindows } from './getters';

const defaultConfig = Object.freeze({});

/**
 * Returns companion windows.
 * @param {object} state
 * @returns {object}
 */
export function getCompanionWindows(state) {
  return miradorSlice(state).companionWindows || defaultConfig;
}

/**
 * Returns the companion window.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @returns {object|undefined}
 */
export const getCompanionWindow = createSelector(
  [
    getCompanionWindows,
    (state, { companionWindowId }) => companionWindowId,
  ],
  (companionWindows, companionWindowId) => companionWindowId && companionWindows[companionWindowId],
);

/**
 * Returns the companion window locale.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @returns {string|undefined}
 */
export const getCompanionWindowLocale = createSelector(
  [getCompanionWindow],
  companionWindow => companionWindow && companionWindow.locale,
);

/**
 * Return position of thumbnail navigation in a certain window.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {string|undefined}
 */
export const getThumbnailNavigationPosition = createSelector(
  [
    getWindow,
    getCompanionWindows,
  ],
  (window, companionWindows) => window
    && companionWindows[window.thumbnailNavigationId]
    && companionWindows[window.thumbnailNavigationId].position,
);

/**
 * Return companion window ids from a window.
 * @param {string} windowId
 * @returns {Array}
 */
const getCompanionWindowIndexByWindowAndPosition = createSelector(
  [getWindows, getCompanionWindows],
  (windows, companionWindows) => (
    (Object.keys(windows) || []).reduce((obj, id) => (
      {
        ...obj,
        [id]: groupBy(
          windows[id].companionWindowIds,
          cwid => companionWindows[cwid] && companionWindows[cwid].position,
        ),
      }), {})
  ),
);

/**
 * Return companion window ids from a window.
 * @param {string} windowId
 * @returns {Array}
 */
const getCompanionWindowsByWindowAndPosition = createSelector(
  [getWindows, getCompanionWindows],
  (windows, companionWindows) => (
    (Object.keys(windows) || []).reduce((obj, id) => ({
      ...obj,
      [id]: groupBy(
        windows[id].companionWindowIds.map(cwid => companionWindows[cwid]),
        cw => cw.position,
      ),
    }), {})
  ),
);

/**
 * Return companion windows of a window.
 * @param {object} state
 * @param {string} windowId
 * @returns {Array}
 */
const getCompanionWindowsOfWindow = createSelector(
  [(state, { windowId }) => windowId, getCompanionWindowsByWindowAndPosition],
  (windowId, companionWindows) => companionWindows[windowId] || {},
);

/**
 * Return companion windows ids of a window.
 * @param {object} state
 * @param {string} windowId
 * @returns {Array}
 */
const getCompanionWindowIdsOfWindow = createSelector(
  [(state, { windowId }) => windowId, getCompanionWindowIndexByWindowAndPosition],
  (windowId, companionWindowIds) => companionWindowIds[windowId] || {},
);

/**
 * Return the companion window string from state in a given windowId and position.
 * @param {object} state
 * @param {string} windowId
 * @param {string} position
 * @returns {string}
 */
export const getCompanionWindowsForPosition = createSelector(
  [
    getCompanionWindowsOfWindow,
    (state, { position }) => (position),
  ],
  (companionWindows, position) => companionWindows[position] || EMPTY_ARRAY,
);

/**
 * Return the companion window string from state in a given windowId and content type.
 * @param {object} state
 * @param {string} windowId
 * @param {string} position
 * @returns {string}
 */
export const getCompanionWindowsForContent = createSelector(
  [
    getCompanionWindowsOfWindow,
    (state, { content }) => (content),
  ],
  (companionWindows, content) => (
    [].concat(...Object.values(companionWindows)).filter(w => w.content === content)
  ),
);

const EMPTY_ARRAY = [];

/**
 * Returns companion window ids for position.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @param {string} props.position
 * @returns {Array}
 */
export const getCompanionWindowIdsForPosition = createSelector(
  [
    getCompanionWindowIdsOfWindow,
    (state, { position }) => (position),
  ],
  (companionWindowIds, position) => companionWindowIds[position] || EMPTY_ARRAY,
);

/**
 * Returns the visibility of the companion area.
 * @param {object} state
 * @param {string} position
 * @returns {boolean}
 */
export const getCompanionAreaVisibility = createSelector(
  [
    (state, { position }) => position,
    getWindow,
  ],
  (position, window) => {
    if (!window) return false;
    const { companionAreaOpen, sideBarOpen } = window;
    if (position !== 'left') return true;
    return !!(companionAreaOpen && sideBarOpen);
  },
);

/**
 * Returns the dimensions.
 * @param {object} state
 * @param {string} companionWindowId
 * @returns {object} containing height and width
 */
export const selectCompanionWindowDimensions = createSelector(
  [getCompanionWindowsOfWindow],
  (companionWindows) => {
    let width = 0;
    let height = 0;
    [].concat(...Object.values(companionWindows)).forEach((cw) => {
      if (cw.position.match(/right/)) {
        width += 235;
      }

      if (cw.position.match(/bottom/)) {
        height += 201;
      }
    });

    return { height, width };
  },
);

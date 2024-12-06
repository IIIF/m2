import { createSelector } from 'reselect';
import {
  getManifestTitle,
} from './manifests';
import { getConfig } from './config';
import { getWindows, getWindow, getWindowIds } from './getters';
import { getWorkspaceType } from './workspace';
import { getSequenceViewingHint, getSequenceBehaviors } from './sequences';

/**
 * Returns the window configuration based.
 * @param {object} state
 * @param {string} windowId
 * @returns {object}
 */
export const getWindowConfig = createSelector(
  [getConfig, getWindow],
  ({ window: defaultConfig }, windowConfig = {}) => ({ ...defaultConfig, ...windowConfig }),
);

/**
 * Returns the manifest titles for all open windows.
 * @param {object} state
 * @returns {object}
 */
export function getWindowTitles(state) {
  const result = {};

  Object.keys(getWindows(state)).forEach((windowId) => {
    result[windowId] = getManifestTitle(state, { windowId });
  });

  return result;
}

/**
 * Returns an array containing the maximized windowIds.
 * @param {object} state
 * @return {Array}
 */
export const getMaximizedWindowsIds = createSelector(
  [getWindows],
  windows => Object.values(windows)
    .filter(window => window.maximized === true)
    .map(window => window.id),
);

/**
 * Returns type of view in a certain window.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @param {string}
 */
export const getWindowViewType = createSelector(
  [
    getWindow,
    getWindowConfig,
    getSequenceViewingHint,
    getSequenceBehaviors,
  ],
  (window, { views = [], defaultView }, manifestViewingHint, manifestBehaviors) => {
    if (window && window.view) return window.view;

    const config = (views || []).find(view => (
      view.behaviors
      && view.behaviors.some(b => manifestViewingHint === b || manifestBehaviors.includes(b))
    ));

    return (config && config.key) || defaultView;
  },
);

/**
 * Returns the window view type for a given window.
 * @param {object} state
 * @param {string} windowId
 * @returns {string} 'single' | 'book' | 'scroll' | 'gallery'
 */
export const getAllowedWindowViewTypes = createSelector(
  [
    getSequenceViewingHint,
    getSequenceBehaviors,
    getWindowConfig,
  ],
  (manifestViewingHint, manifestBehaviors, { views = [], defaultView }) => (
    (views || []).reduce((allowedViews, view) => {
      if (
        view.key === defaultView
        || !view.behaviors
        || view.behaviors.some(b => (
          manifestViewingHint === b || manifestBehaviors.includes(b)
        ))) allowedViews.push(view.key);
      return allowedViews;
    }, [])
  ),
);

/**
 * Return the draggability of a window.
 * @param {object} state
 * @param {object} props
 * @returns {boolean}
 */
export const getWindowDraggability = createSelector(
  [
    getWorkspaceType,
    getWindow,
    state => getWindowIds(state).length > 1,
  ],
  (workspaceType, window, manyWindows) => {
    if (workspaceType === 'elastic') return true;
    return manyWindows && window && window.maximized === false;
  },
);

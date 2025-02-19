import { v4 as uuid } from 'uuid';
import ActionTypes from './action-types';
import { miradorSlice } from '../selectors/utils';

/**
 * focusWindow - action creator
 *
 * @param  {String} windowId
 * @memberof ActionCreators
 */
export function focusWindow(windowId, pan = false) {
  return {
    pan,
    type: ActionTypes.FOCUS_WINDOW,
    windowId,
  };
}

/**
 * addWindow - action creator
 *
 * @param  {Object} options
 * @memberof ActionCreators
 */
export function addWindow({ companionWindows, manifest, ...options }) {
  return (dispatch, getState) => {
    const { config, workspace: { windowIds = [] } } = miradorSlice(getState());
    const numWindows = windowIds.length;

    const windowId = options.id || `window-${uuid()}`;
    const cwThumbs = `cw-${uuid()}`;

    const defaultCompanionWindows = [
      {
        content: 'thumbnailNavigation',
        default: true,
        id: cwThumbs,
        position: options.thumbnailNavigationPosition
          || config.thumbnailNavigation.defaultPosition,
        windowId,
      },
      ...(
        (companionWindows || []).map((cw, i) => ({ ...cw, id: `cw-${uuid()}` }))
      ),
    ];

    if (options.sideBarPanel || config.window.defaultSideBarPanel || config.window.sideBarPanel) {
      defaultCompanionWindows.unshift(
        {
          content: options.sideBarPanel
            || (options.defaultSearchQuery && 'search')
            || config.window.defaultSideBarPanel
            || config.window.sideBarPanel,

          default: true,
          id: `cw-${uuid()}`,
          position: 'left',
          windowId,
        },
      );
    }

    const defaultOptions = {
      canvasId: undefined,
      collectionIndex: 0,
      companionAreaOpen: true,
      companionWindowIds: defaultCompanionWindows.map(cw => cw.id),
      draggingEnabled: true,
      highlightAllAnnotations: config.window.highlightAllAnnotations || false,
      id: windowId,
      manifestId: null,
      maximized: false,
      rangeId: null,
      rotation: null,
      selectedAnnotations: {},
      sideBarOpen: config.window.sideBarOpenByDefault !== undefined
        ? config.window.sideBarOpenByDefault || !!options.defaultSearchQuery
        : config.window.sideBarOpen || !!options.defaultSearchQuery,
      sideBarPanel: options.sideBarPanel
        || config.window.defaultSideBarPanel
        || config.window.sideBarPanel,
      thumbnailNavigationId: cwThumbs,
    };

    const elasticLayout = {
      ...(config.window.elastic || { height: 400, width: 480 }),
      x: 200 + (Math.floor(numWindows / 10) * 50 + (numWindows * 30) % 300),
      y: 200 + ((numWindows * 50) % 300),
    };

    dispatch({
      companionWindows: defaultCompanionWindows,
      elasticLayout,
      manifest,
      type: ActionTypes.ADD_WINDOW,
      window: { ...defaultOptions, ...options },
    });
  };
}

/** */
export function updateWindow(id, payload) {
  return {
    id,
    payload,
    type: ActionTypes.UPDATE_WINDOW,
  };
}

/**
 * maximizeWindow
 * @param  {String} windowId
 * @memberof ActionCreators
 */
export function maximizeWindow(windowId) {
  return { type: ActionTypes.MAXIMIZE_WINDOW, windowId };
}

/**
 * minimizeWindow
 * @param  {String} windowId
 * @memberof ActionCreators
 */
export function minimizeWindow(windowId) {
  return { type: ActionTypes.MINIMIZE_WINDOW, windowId };
}

/** */
export function setCompanionAreaOpen(id, companionAreaOpen) {
  return {
    id,
    payload: { companionAreaOpen },
    type: ActionTypes.UPDATE_WINDOW,
  };
}

/**
 * removeWindow - action creator
 *
 * @param  {String} windowId
 * @memberof ActionCreators
 */
export function removeWindow(windowId) {
  return {
    type: ActionTypes.REMOVE_WINDOW,
    windowId,
  };
}

/**
 * toggleWindowSideBar - action creator
 *
 * @param  {String} windowId
 * @memberof ActionCreators
 */
export function toggleWindowSideBar(windowId) {
  return { type: ActionTypes.TOGGLE_WINDOW_SIDE_BAR, windowId };
}

/**
 * setWindowThumbnailPosition - action creator
 *
 * @param  {String} windowId
 * @param  {String} position
 * @memberof ActionCreators
 */
export function setWindowThumbnailPosition(windowId, position) {
  return (dispatch, getState) => {
    const { windows } = getState();
    const { thumbnailNavigationId } = windows[windowId];

    dispatch({
      id: thumbnailNavigationId,
      payload: { position },
      type: ActionTypes.UPDATE_COMPANION_WINDOW,
    });
  };
}

/**
 * setWindowViewType - action creator
 *
 * @param  {String} windowId
 * @param  {String} viewType
 * @memberof ActionCreators
 */
export function setWindowViewType(windowId, viewType) {
  return {
    type: ActionTypes.SET_WINDOW_VIEW_TYPE,
    viewType,
    windowId,
  };
}

/** */
export function showCollectionDialog(manifestId, collectionPath = [], windowId) {
  return {
    collectionPath,
    manifestId,
    type: ActionTypes.SHOW_COLLECTION_DIALOG,
    windowId,
  };
}

/** */
export function hideCollectionDialog(windowId) {
  return {
    type: ActionTypes.HIDE_COLLECTION_DIALOG,
    windowId,
  };
}

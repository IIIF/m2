import settings from '../../config/settings';
import ActionTypes from '../actions/action-types';

/** Check if the viewport dimensions are fully specified */
function hasViewportPosition(viewportPosition) {
  return viewportPosition.x !== undefined
    && viewportPosition.y !== undefined
    && viewportPosition.width !== undefined
    && viewportPosition.height !== undefined;
}

/** Check if the containee is fully within the bounds on the container */
function contains(container, containee) {
  return containee.x - containee.width / 2 > container.x - container.width / 2
    && containee.y - containee.height / 2 > container.y - container.height / 2
    && containee.x + containee.width / 2 < container.x + container.width / 2
    && containee.y + containee.height / 2 < container.y + container.height / 2;
}

/**
 * workspaceReducer
 */
export const workspaceReducer = (
  state = { ...settings.workspace, windowIds: [] },
  action,
) => {
  let newWorkspaceDimensions;
  let viewportPosition;
  let newWindowIds;
  switch (action.type) {
    case ActionTypes.UPDATE_WORKSPACE:
      return {
        ...state,
        ...action.config,
      };
    case ActionTypes.FOCUS_WINDOW:
      return {
        ...state,
        focusedWindowId: action.windowId,
        viewportPosition: {
          ...state.viewportPosition,
          ...action.position,
        },
      };
    case ActionTypes.ADD_WINDOW:
      return {
        ...state,
        focusedWindowId: action.window.id,
        windowIds: [...(state.windowIds || []), action.window.id],
      };
    case ActionTypes.REMOVE_WINDOW:
      newWindowIds = (state.windowIds || []).filter(v => v !== action.windowId);

      return {
        ...state,
        focusedWindowId: action.windowId === state.focusedWindowId
          ? newWindowIds[newWindowIds.length - 1]
          : state.focusedWindowId,
        windowIds: newWindowIds,
      };
    case ActionTypes.SET_WORKSPACE_FULLSCREEN:
      return { ...state, isFullscreenEnabled: action.isFullscreenEnabled };
    case ActionTypes.TOGGLE_ZOOM_CONTROLS:
      return { ...state, showZoomControls: action.showZoomControls };
    case ActionTypes.UPDATE_WORKSPACE_MOSAIC_LAYOUT:
      return { ...state, layout: action.layout };
    case ActionTypes.SET_WORKSPACE_ADD_VISIBILITY:
      return { ...state, isWorkspaceAddVisible: action.isWorkspaceAddVisible };
    case ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION:
      newWorkspaceDimensions = {};

      viewportPosition = {
        ...state.viewportPosition,
        ...action.payload.position,
      };

      if (
        hasViewportPosition(viewportPosition)
        && !contains({
          height: state.height, width: state.width, x: 0, y: 0,
        }, viewportPosition)
      ) {
        newWorkspaceDimensions = {
          height: state.height * 2,
          width: state.width * 2,
        };
      }

      return {
        ...state,
        ...newWorkspaceDimensions,
        viewportPosition,
      };
    case ActionTypes.SET_CONFIG:
    case ActionTypes.IMPORT_CONFIG:
    case ActionTypes.UPDATE_CONFIG:
      return { ...state, ...action.config.workspace };
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.workspace || {};
    case ActionTypes.TOGGLE_DRAGGING:
      return { ...state, draggingEnabled: !state.draggingEnabled };
    default:
      return state;
  }
};

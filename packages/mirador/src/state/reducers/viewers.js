import set from 'lodash/fp/set';
import omit from 'lodash/omit';
import ActionTypes from '../actions/action-types';

/**
 * viewersReducer
 */
export const viewersReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.UPDATE_VIEWPORT:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          ...action.payload,
        },
      };
    case ActionTypes.ADD_WINDOW:
      if (!action.window.initialViewerConfig) return state;

      return {
        ...state,
        [action.window.id]: {
          ...state[action.window.id],
          ...action.window.initialViewerConfig,
        },
      };
    case ActionTypes.REMOVE_WINDOW:
      return omit(state, action.windowId);
    case ActionTypes.SET_WINDOW_VIEW_TYPE:
      return set([action.windowId], null, state);
    case ActionTypes.SET_CANVAS:
      if (!action.preserveViewport) {
        return set([action.windowId], null, state);
      }
      return state;
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.viewers || {};
    default:
      return state;
  }
};

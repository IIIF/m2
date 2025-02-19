import omit from 'lodash/omit';
import set from 'lodash/fp/set';
import update from 'lodash/fp/update';
import ActionTypes from '../actions/action-types';

/** */
export function companionWindowsReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.ADD_COMPANION_WINDOW:
      return set([action.id], action.payload, state);

    case ActionTypes.ADD_WINDOW:
      return {
        ...state,
        ...((action.companionWindows || []).reduce((newState, cw) => {
          newState[cw.id] = { // eslint-disable-line no-param-reassign
            ...state[cw.id],
            ...cw,
            windowId: action.id,
          };
          return newState;
        }, {})),
      };

    case ActionTypes.REMOVE_WINDOW:
      return Object.keys(state).reduce((object, key) => {
        if (state[key].windowId !== action.windowId) {
          object[key] = state[key]; // eslint-disable-line no-param-reassign
        }
        return object;
      }, {});
    case ActionTypes.UPDATE_COMPANION_WINDOW:
      return update([action.id], orig => ({ ...(orig || {}), ...action.payload }), state);

    case ActionTypes.REMOVE_COMPANION_WINDOW:
      return omit(state, action.id);
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.companionWindows || [];
    case ActionTypes.TOGGLE_TOC_NODE:
      return update([action.id, 'tocNodes'], orig => ({ ...(orig || {}), ...action.payload }), state);
    default:
      return state;
  }
}

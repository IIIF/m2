import without from 'lodash/without';
import ActionTypes from '../actions/action-types';

const defaultState = { items: [] };

/**
 * errorsReducer
 */
export const errorsReducer = (state = defaultState, action) => {
  let ret;
  switch (action.type) {
    case ActionTypes.ADD_ERROR:
      return { ...state, [action.id]: { id: action.id, message: action.message }, items: [...state.items, action.id] }; // eslint-disable-line max-len
    case ActionTypes.RECEIVE_INFO_RESPONSE_FAILURE:
      return {
        ...state,
        [action.infoId]: {
          id: action.infoId,
          message: action.error,
        },
        items: [...state.items, action.infoId],
      };
    case ActionTypes.RECEIVE_SEARCH_FAILURE:
      return {
        ...state,
        [action.searchId]: {
          id: action.searchId,
          message: action.error,
        },
        items: [...state.items, action.searchId],
      };
    case ActionTypes.REMOVE_ERROR:
      ret = Object.keys(state).reduce((object, key) => {
        if (key !== action.id) {
          object[key] = state[key]; // eslint-disable-line no-param-reassign
        }
        return object;
      }, {});
      ret.items = without(ret.items, action.id);
      return ret;
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return defaultState;
    default:
      return state;
  }
};

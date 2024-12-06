import ActionTypes from '../actions/action-types';

/**
 * infoResponsesReducer
 */
export const infoResponsesReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_INFO_RESPONSE:
      return {
        ...state,
        [action.infoId]: {
          id: action.infoId,
          isFetching: true,
        },
      };
    case ActionTypes.RECEIVE_INFO_RESPONSE:
      return {
        ...state,
        [action.infoId]: {
          degraded: false,
          id: action.infoId,
          isFetching: false,
          json: action.infoJson,
          tokenServiceId: action.tokenServiceId,
        },
      };
    case ActionTypes.RECEIVE_DEGRADED_INFO_RESPONSE:
      return {
        ...state,
        [action.infoId]: {
          degraded: true,
          id: action.infoId,
          isFetching: false,
          json: action.infoJson,
          tokenServiceId: action.tokenServiceId,
        },
      };
    case ActionTypes.RECEIVE_INFO_RESPONSE_FAILURE:
      return {
        ...state,
        [action.infoId]: {
          error: action.error,
          id: action.infoId,
          isFetching: false,
          tokenServiceId: action.tokenServiceId,
        },
      };
    case ActionTypes.REMOVE_INFO_RESPONSE:
      return Object.keys(state).reduce((object, key) => {
        if (key !== action.infoId) {
          object[key] = state[key]; // eslint-disable-line no-param-reassign
        }
        return object;
      }, {});
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return {};
    default: return state;
  }
};

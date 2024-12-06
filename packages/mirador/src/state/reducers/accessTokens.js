import omit from 'lodash/omit';
import ActionTypes from '../actions/action-types';

/** */
export function accessTokensReducer(state = {}, action) {
  switch (action.type) {
    case ActionTypes.RESOLVE_AUTHENTICATION_REQUEST:
      return {
        ...state,
        [action.tokenServiceId]: {
          authId: action.id,
          id: action.tokenServiceId,
          isFetching: true,
        },
      };
    case ActionTypes.REQUEST_ACCESS_TOKEN:
      return {
        ...state,
        [action.serviceId]: {
          authId: action.authId,
          id: action.serviceId,
          isFetching: true,
        },
      };
    case ActionTypes.RECEIVE_ACCESS_TOKEN:
      return {
        ...state,
        [action.serviceId]: {
          ...state[action.serviceId],
          isFetching: false,
          json: action.json,
        },
      };
    case ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE:
      return {
        ...state,
        [action.serviceId]: {
          ...state[action.serviceId],
          error: action.error,
          isFetching: false,
        },
      };
    case ActionTypes.RESET_AUTHENTICATION_STATE:
      return omit(state, action.tokenServiceId);
    case ActionTypes.RECEIVE_INFO_RESPONSE:
      if (!action.tokenServiceId) return state;
      if (state[action.tokenServiceId].success) return state;

      return {
        ...state,
        [action.tokenServiceId]: {
          ...state[action.tokenServiceId],
          success: true,
        },
      };
    default:
      return state;
  }
}

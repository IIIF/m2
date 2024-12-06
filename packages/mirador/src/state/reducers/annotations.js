import ActionTypes from '../actions/action-types';

/**
 * annotationReducer
 */
export const annotationsReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_ANNOTATION:
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          [action.annotationId]: {
            id: action.annotationId,
            isFetching: true,
          },
        },
      };
    case ActionTypes.RECEIVE_ANNOTATION:
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          [action.annotationId]: {
            id: action.annotationId,
            isFetching: false,
            json: action.annotationJson,
          },
        },
      };
    case ActionTypes.RECEIVE_ANNOTATION_FAILURE:
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          [action.annotationId]: {
            error: action.error,
            id: action.annotationId,
            isFetching: false,
          },
        },
      };
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return {};
    default: return state;
  }
};

import ActionTypes from '../actions/action-types';

/**
 * catalogReducer
 */
export const catalogReducer = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_RESOURCE:
      if (state.some(m => m.manifestId === action.manifestId)) return state;

      return [
        { manifestId: action.manifestId, ...action.payload },
        ...state,
      ];
    case ActionTypes.ADD_WINDOW:
      if (state.some(m => m.manifestId === action.window.manifestId)) return state;

      return [
        { manifestId: action.window.manifestId },
        ...state,
      ];
    case ActionTypes.UPDATE_WINDOW:
      if (!action.payload.manifestId) return state;
      if (state.some(m => m.manifestId === action.payload.manifestId)) return state;

      return [
        { manifestId: action.payload.manifestId },
        ...state,
      ];
    case ActionTypes.REMOVE_RESOURCE:
      return state.filter(r => r.manifestId !== action.manifestId);
    case ActionTypes.IMPORT_CONFIG:
      return action.config.catalog || [];
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.catalog || [];
    default:
      return state;
  }
};

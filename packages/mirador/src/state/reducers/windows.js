import update from 'lodash/fp/update';
import omit from 'lodash/omit';
import ActionTypes from '../actions/action-types';

/**
 * windowsReducer
 */
export const windowsReducer = (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_WINDOW:
      return { ...state, [action.window.id]: action.window };

    case ActionTypes.MAXIMIZE_WINDOW:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          maximized: true,
        },
      };
    case ActionTypes.MINIMIZE_WINDOW:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          maximized: false,
        },
      };

    case ActionTypes.UPDATE_WINDOW:
      return update([action.id], orig => ({ ...(orig || {}), ...action.payload }), state);

    case ActionTypes.REMOVE_WINDOW:
      return omit(state, [action.windowId]);
    case ActionTypes.TOGGLE_WINDOW_SIDE_BAR:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          sideBarOpen: !state[action.windowId].sideBarOpen,
        },
      };
    case ActionTypes.SET_WINDOW_VIEW_TYPE:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          view: action.viewType,
        },
      };
    case ActionTypes.UPDATE_WINDOW_POSITION:
      return {
        ...state,
        [action.payload.windowId]: {
          ...state[action.payload.windowId],
          x: action.payload.position.x,
          y: action.payload.position.y,
        },
      };
    case ActionTypes.SET_WINDOW_SIZE:
      return {
        ...state,
        [action.payload.windowId]: {
          ...state[action.payload.windowId],
          height: action.payload.size.height,
          width: action.payload.size.width,
          x: action.payload.size.x,
          y: action.payload.size.y,
        },
      };
    case ActionTypes.SET_CANVAS:
      if (!state[action.windowId]) return state;

      return update([action.windowId], orig => (
        {
          ...(orig || {}),
          canvasId: action.canvasId,
          visibleCanvases: action.visibleCanvases || [],
        }), state);
    case ActionTypes.ADD_COMPANION_WINDOW:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          companionWindowIds: state[action.windowId].companionWindowIds.concat([action.id]),
          ...(action.payload.position === 'left'
            ? { companionAreaOpen: true, sideBarPanel: action.payload.content }
            : {}),
        },
      };
    case ActionTypes.UPDATE_COMPANION_WINDOW:
      if (action.payload.position !== 'left') return state;

      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          companionAreaOpen: true,
        },
      };
    case ActionTypes.REMOVE_COMPANION_WINDOW:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          companionWindowIds: state[action.windowId]
            .companionWindowIds.filter(id => id !== action.id),
        },
      };
    case ActionTypes.SELECT_ANNOTATION:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          selectedAnnotationId: action.annotationId,
        },
      };
    case ActionTypes.DESELECT_ANNOTATION: {
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          selectedAnnotationId: undefined,
        },
      };
    }
    case ActionTypes.HOVER_ANNOTATION:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          hoveredAnnotationIds: action.annotationIds,
        },
      };
    case ActionTypes.TOGGLE_ANNOTATION_DISPLAY:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          highlightAllAnnotations: !state[action.windowId].highlightAllAnnotations,
        },
      };
    case ActionTypes.IMPORT_MIRADOR_STATE:
      return action.state.windows || [];
    case ActionTypes.REQUEST_SEARCH:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          suggestedSearches: undefined,
        },
      };
    case ActionTypes.SHOW_COLLECTION_DIALOG:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          collectionDialogOn: true,
          collectionManifestId: action.manifestId,
          collectionPath: action.collectionPath,
        },
      };
    case ActionTypes.HIDE_COLLECTION_DIALOG:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          collectionDialogOn: false,
        },
      };
    default:
      return state;
  }
};

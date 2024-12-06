import { v4 as uuid } from 'uuid';
import ActionTypes from './action-types';

/**
 * importConfig - action creator
 *
 * @param  {Object} config
 * @memberof ActionCreators
 */
export function importConfig(config) {
  return { config, type: ActionTypes.IMPORT_CONFIG };
}

/**
 * setConfig - action creator
 *
 * @param  {Object} config
 * @memberof ActionCreators
 */
export function setConfig(config) {
  return { config, type: ActionTypes.SET_CONFIG };
}

/**
 * updateConfig - action creator
 *
 * @param  {Object} config
 * @memberof ActionCreators
 */
export function updateConfig(config) {
  return { config, type: ActionTypes.UPDATE_CONFIG };
}

/**
 * importMiradorState - action creator
 *
 * @param  {Object} config
 * @memberof ActionCreators
 */
export function importMiradorState(state) {
  const newState = {
    ...state,
    workspace: {
      ...state.workspace,
      id: uuid(),
    },
  };
  return { state: newState, type: ActionTypes.IMPORT_MIRADOR_STATE };
}

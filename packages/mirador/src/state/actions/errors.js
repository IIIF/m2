import { v4 as uuid } from 'uuid';
import ActionTypes from './action-types';

/**
 * addError - action creator
 * @param {string} error
 */
export function addError(error) {
  return {
    id: `error-${uuid()}`,
    message: error,
    type: ActionTypes.ADD_ERROR,
  };
}

/**
 * removeError - action creator
 * @param {string} id
 */
export function removeError(id) {
  return { id, type: ActionTypes.REMOVE_ERROR };
}

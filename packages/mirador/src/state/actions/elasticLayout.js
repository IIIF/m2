import ActionTypes from './action-types';

/** */
export function updateElasticWindowLayout(windowId, payload) {
  return {
    payload,
    type: ActionTypes.UPDATE_ELASTIC_WINDOW_LAYOUT,
    windowId,
  };
}

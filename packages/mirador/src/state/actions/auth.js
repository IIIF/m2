import ActionTypes from './action-types';

/**
 * addAuthenticationRequest - action creator
 *
 * @param  {String} windowId
 * @param  {String} id
 * @memberof ActionCreators
 */
export function addAuthenticationRequest(windowId, id, profile = undefined) {
  return {
    id,
    profile,
    type: ActionTypes.ADD_AUTHENTICATION_REQUEST,
    windowId,
  };
}

/**
 * resolveAuthenticationRequest - action creator
 * Triggered when we might have an IIIF auth cookie available (but we
 *   can't be really sure until try the access token)
 *
 * @param {String} id
 * @memberof ActionCreators
 */
export function resolveAuthenticationRequest(id, tokenServiceId, props) {
  return {
    id,
    tokenServiceId,
    type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
    ...props,
  };
}

/**
 * requestAccessToken - action creator
 * @private
 *
 * @param  {String} serviceId
 * @param  {String} authId
 * @memberof ActionCreators
 */
export function requestAccessToken(serviceId, authId) {
  return {
    authId,
    serviceId,
    type: ActionTypes.REQUEST_ACCESS_TOKEN,
  };
}

/**
 * receiveAccessToken - action creator
 * @private
 *
 * @param  {String} serviceId
 * @param  {Object} json
 * @memberof ActionCreators
 */
export function receiveAccessToken(authId, serviceId, json) {
  return {
    authId,
    json,
    serviceId,
    type: ActionTypes.RECEIVE_ACCESS_TOKEN,
  };
}

/**
 * receiveAccessTokenFailure - action creator
 * @private
 *
 * @param  {String} serviceId
 * @param  {Object} error
 * @memberof ActionCreators
 */
export function receiveAccessTokenFailure(authId, serviceId, error) {
  return {
    authId,
    error,
    serviceId,
    type: ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE,
  };
}

/**
 * resolveAccessTokenRequest - action creator
 *
 * @param {String} authServiceId
 * @param {String} tokenServiceId
 * @param {Object} json
 * @memberof ActionCreators
 */
export function resolveAccessTokenRequest(authServiceId, tokenServiceId, json) {
  if (!json.accessToken) return receiveAccessTokenFailure(authServiceId, tokenServiceId, json);

  return receiveAccessToken(authServiceId, tokenServiceId, json);
}

/**
 * Resets authentication state for a token service
 */
export function resetAuthenticationState({ authServiceId, tokenServiceId }) {
  return {
    id: authServiceId,
    tokenServiceId,
    type: ActionTypes.RESET_AUTHENTICATION_STATE,
  };
}

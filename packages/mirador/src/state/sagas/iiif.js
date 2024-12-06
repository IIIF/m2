import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';
import { Utils } from 'manifesto.js';
import normalizeUrl from 'normalize-url';
import ActionTypes from '../actions/action-types';
import {
  receiveManifest, receiveManifestFailure, receiveInfoResponse,
  receiveInfoResponseFailure, receiveDegradedInfoResponse,
  receiveSearch, receiveSearchFailure,
  receiveAnnotation, receiveAnnotationFailure,
} from '../actions';
import {
  getManifests,
  getRequestsConfig,
  getAccessTokens,
  selectInfoResponse,
} from '../selectors';

/** */
function fetchWrapper(url, options, { success, degraded, failure }) {
  return fetch(url, options)
    .then(response => response.json().then((json) => {
      if (response.status === 401) return (degraded || success)({ json, response });
      if (response.ok) return success({ json, response });
      return failure({ error: response.statusText, json, response });
    }).catch(error => failure({ error, response })))
    .catch(error => failure({ error }));
}

/** */
function* fetchIiifResource(url, options, { success, degraded, failure }) {
  const { preprocessors = [], postprocessors = [] } = yield select(getRequestsConfig);

  try {
    const reqOptions = preprocessors.reduce((acc, f) => f(url, acc) || acc, options);

    let action = yield call(fetchWrapper, url, reqOptions, { degraded, failure, success });
    action = postprocessors.reduce((acc, f) => f(url, acc) || acc, action);
    return action;
  } catch (error) { return failure({ error }); }
}

/** */
function* fetchIiifResourceWithAuth(url, iiifResource, options, { degraded, failure, success }) {
  const urlOptions = { ...options };
  let tokenServiceId;

  // If we have a requested IIIF resource (say, the image description from the manifest)
  // we can optimistically try an appropriate access token.
  //
  // TODO: there might be multiple applicable access token services
  if (iiifResource) {
    const tokenService = yield call(getAccessTokenService, iiifResource);
    tokenServiceId = tokenService && tokenService.id;

    if (tokenService && tokenService.json) {
      urlOptions.headers = {
        Authorization: `Bearer ${tokenService.json.accessToken}`,
        ...options.headers,
      };
    }
  }

  const { error, json, response } = yield call(
    fetchIiifResource,
    url,
    urlOptions,
    { failure: arg => arg, success: arg => arg },
  );

  // Hard error either requesting the resource or deserializing the JSON.
  if (error) {
    yield put(failure({
      error, json, response, tokenServiceId,
    }));
    return;
  }

  const id = json['@id'] || json.id;
  if (response.ok) {
    if (normalizeUrl(id, { stripAuthentication: false })
      === normalizeUrl(url.replace(/info\.json$/, ''), { stripAuthentication: false })) {
      yield put(success({ json, response, tokenServiceId }));
      return;
    }
  } else if (response.status !== 401) {
    yield put(failure({
      error, json, response, tokenServiceId,
    }));

    return;
  }

  // Start attempting some IIIF Auth;
  // First, the IIIF resource we were given may not be authoritative; check if
  // it suggests a different access token service and re-enter the auth workflow
  const authoritativeTokenService = yield call(getAccessTokenService, json);
  if (authoritativeTokenService && authoritativeTokenService.id !== tokenServiceId) {
    yield call(fetchIiifResourceWithAuth, url, json, options, { degraded, failure, success });
    return;
  }

  // Record the response (potentially kicking off other auth flows)
  yield put((degraded || success)({ json, response, tokenServiceId }));
}

/** */
export function* fetchManifest({ manifestId }) {
  const callbacks = {
    failure: ({ error, json, response }) => receiveManifestFailure(manifestId, typeof error === 'object' ? String(error) : error),
    success: ({ json, response }) => receiveManifest(manifestId, json),
  };
  const dispatch = yield call(fetchIiifResource, manifestId, {}, callbacks);
  yield put(dispatch);
}

/** @private */
function* getAccessTokenService(resource) {
  const manifestoCompatibleResource = resource && resource.__jsonld
    ? resource
    : { ...resource, options: {} };
  const services = Utils.getServices(manifestoCompatibleResource).filter(s => s.getProfile().match(/http:\/\/iiif.io\/api\/auth\//));
  if (services.length === 0) return undefined;

  const accessTokens = yield select(getAccessTokens);
  if (!accessTokens) return undefined;

  for (let i = 0; i < services.length; i += 1) {
    const authService = services[i];
    const accessTokenService = Utils.getService(authService, 'http://iiif.io/api/auth/1/token')
      || Utils.getService(authService, 'http://iiif.io/api/auth/0/token');
    const token = accessTokenService && accessTokens[accessTokenService.id];
    if (token && token.json) return token;
  }

  return undefined;
}

/** @private */
export function* fetchInfoResponse({ imageResource, infoId, windowId }) {
  let iiifResource = imageResource;
  if (!iiifResource) {
    iiifResource = yield select(selectInfoResponse, { infoId });
  }

  const callbacks = {
    degraded: ({
      json, response, tokenServiceId,
    }) => receiveDegradedInfoResponse(infoId, json, response.ok, tokenServiceId, windowId),
    failure: ({
      error, json, response, tokenServiceId,
    }) => (
      receiveInfoResponseFailure(infoId, error, tokenServiceId)
    ),
    success: ({
      json, response, tokenServiceId,
    }) => receiveInfoResponse(infoId, json, response.ok, tokenServiceId),
  };

  yield call(fetchIiifResourceWithAuth, `${infoId.replace(/\/$/, '')}/info.json`, iiifResource, {}, callbacks);
}

/** @private */
export function* fetchSearchResponse({
  windowId, companionWindowId, query, searchId,
}) {
  const callbacks = {
    failure: ({ error, json, response }) => (
      receiveSearchFailure(windowId, companionWindowId, searchId, error)
    ),
    success: ({ json, response }) => receiveSearch(windowId, companionWindowId, searchId, json),
  };
  const dispatch = yield call(fetchIiifResource, searchId, {}, callbacks);
  yield put(dispatch);
}

/** @private */
export function* fetchAnnotation({ targetId, annotationId }) {
  const callbacks = {
    failure: ({ error, json, response }) => (
      receiveAnnotationFailure(targetId, annotationId, error)
    ),
    success: ({ json, response }) => receiveAnnotation(targetId, annotationId, json),
  };
  const dispatch = yield call(fetchIiifResource, annotationId, {}, callbacks);
  yield put(dispatch);
}

/** */
export function* fetchResourceManifest({ manifestId, manifestJson }) {
  if (manifestJson) {
    yield put(receiveManifest(manifestId, manifestJson));
    return;
  }

  if (!manifestId) return;

  const manifests = yield select(getManifests) || {};
  if (!manifests[manifestId]) yield* fetchManifest({ manifestId });
}

/** */
export function* fetchManifests(...manifestIds) {
  const manifests = yield select(getManifests);

  for (let i = 0; i < manifestIds.length; i += 1) {
    const manifestId = manifestIds[i];
    if (!manifests[manifestId]) yield call(fetchManifest, { manifestId });
  }
}

/** */
export default function* iiifSaga() {
  yield all([
    takeEvery(ActionTypes.REQUEST_MANIFEST, fetchManifest),
    takeEvery(ActionTypes.REQUEST_INFO_RESPONSE, fetchInfoResponse),
    takeEvery(ActionTypes.REQUEST_SEARCH, fetchSearchResponse),
    takeEvery(ActionTypes.REQUEST_ANNOTATION, fetchAnnotation),
    takeEvery(ActionTypes.ADD_RESOURCE, fetchResourceManifest),
  ]);
}

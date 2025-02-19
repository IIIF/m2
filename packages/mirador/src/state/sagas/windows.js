import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';
import ActionTypes from '../actions/action-types';
import MiradorManifest from '../../lib/MiradorManifest';
import MiradorCanvas from '../../lib/MiradorCanvas';
import {
  setContentSearchCurrentAnnotation,
  selectAnnotation,
  setWorkspaceViewportPosition,
  updateWindow,
  setCanvas,
  fetchSearch,
  receiveManifest,
  fetchInfoResponse,
  showCollectionDialog,
} from '../actions';
import {
  getSearchForWindow, getSearchAnnotationsForCompanionWindow,
  getCanvasGrouping, getWindow, getManifestoInstance,
  getCompanionWindowIdsForPosition, getManifestSearchService,
  getCanvasForAnnotation,
  getSelectedContentSearchAnnotationIds,
  getSortedSearchAnnotationsForCompanionWindow,
  getVisibleCanvasIds,
  getWorkspace,
  getElasticLayout,
  getCanvases,
  selectInfoResponses,
  getWindowConfig,
} from '../selectors';
import { fetchManifests } from './iiif';

/** */
export function* fetchWindowManifest(action) {
  const {
    collectionPath, id, manifestId,
  } = action.payload || action.window;

  if (!manifestId) return;

  if (action.manifest) {
    yield put(receiveManifest(manifestId, action.manifest));
  } else {
    yield call(fetchManifests, manifestId, ...(collectionPath || []));
  }

  yield call(setWindowStartingCanvas, action);
  yield call(setWindowDefaultSearchQuery, action);
  if (!collectionPath) {
    yield call(setCollectionPath, { manifestId, windowId: action.id || action.window.id });
  }
  yield call(determineAndShowCollectionDialog, manifestId, id);
}

/** */
export function* setCanvasOnNewSequence(action) {
  const windowId = action.id;
  if (!action || !action.payload || !action.payload.sequenceId) return;

  const canvases = yield select(getCanvases, { windowId });
  if (!canvases || !canvases[0] || !canvases[0].id) return;

  const thunk = yield call(setCanvas, windowId, canvases[0].id);
  yield put(thunk);
}

/** */
export function* setCollectionPath({ manifestId, windowId }) {
  const manifestoInstance = yield select(getManifestoInstance, { manifestId });

  if (manifestoInstance) {
    const partOfs = manifestoInstance.getProperty('partOf');
    const partOf = Array.isArray(partOfs) ? partOfs[0] : partOfs;

    if (partOf && partOf.id) {
      yield put(updateWindow(windowId, { collectionPath: [partOf.id] }));
    }
  }
}

/** */
export function* fetchCollectionManifests(action) {
  const { collectionPath } = action.payload;
  if (!collectionPath) return;

  yield call(fetchManifests, ...collectionPath);
}

/** @private */
export function* setWindowStartingCanvas(action) {
  const { canvasId, canvasIndex, manifestId } = action.payload || action.window;

  const windowId = action.id || action.window.id;

  if (canvasId) {
    const thunk = yield call(setCanvas, windowId, canvasId, null, { preserveViewport: !!action.payload });
    yield put(thunk);
  } else {
    const manifestoInstance = yield select(getManifestoInstance, { manifestId });
    if (manifestoInstance) {
      // set the startCanvas
      const miradorManifest = new MiradorManifest(manifestoInstance);
      const startCanvas = miradorManifest.startCanvas
        || miradorManifest.canvasAt(canvasIndex || 0)
        || miradorManifest.canvasAt(0);
      if (startCanvas) {
        const thunk = yield call(setCanvas, windowId, startCanvas.id);
        yield put(thunk);
      }
    }
  }
}

/** @private */
export function* setWindowDefaultSearchQuery(action) {
  // only for a brand new window
  if (!action.window || !action.window.defaultSearchQuery) return;

  const { id: windowId, defaultSearchQuery } = action.window;
  const searchService = yield select(getManifestSearchService, { windowId });
  const companionWindowIds = yield select(getCompanionWindowIdsForPosition, { position: 'left', windowId });
  const companionWindowId = companionWindowIds[0];

  if (searchService && companionWindowId) {
    const searchId = searchService && `${searchService.id}?q=${defaultSearchQuery}`;
    yield put(fetchSearch(windowId, companionWindowId, searchId, defaultSearchQuery));
  }
}

/** @private */
export function getAnnotationsBySearch(state, { canvasIds, companionWindowIds, windowId }) {
  const annotationBySearch = companionWindowIds.reduce((accumulator, companionWindowId) => {
    const annotations = getSearchAnnotationsForCompanionWindow(state, {
      companionWindowId, windowId,
    });

    const resourceAnnotations = annotations.resources;
    const hitAnnotation = resourceAnnotations.find(r => canvasIds.includes(r.targetId));

    if (hitAnnotation) accumulator[companionWindowId] = [hitAnnotation.id];

    return accumulator;
  }, {});

  return annotationBySearch;
}

/** @private */
export function* setCurrentAnnotationsOnCurrentCanvas({
  annotationId, windowId, visibleCanvases,
}) {
  const searches = yield select(getSearchForWindow, { windowId });
  const companionWindowIds = Object.keys(searches || {});
  if (companionWindowIds.length === 0) return;

  const annotationBySearch = yield select(
    getAnnotationsBySearch,
    {
      canvasIds: visibleCanvases,
      companionWindowIds,
      windowId,
    },
  );

  yield all(
    Object.keys(annotationBySearch)
      .map(companionWindowId => (
        put(setContentSearchCurrentAnnotation(
          windowId,
          companionWindowId,
          annotationBySearch[companionWindowId],
        )))),
  );

  if (Object.values(annotationBySearch).length > 0) {
    // if the currently selected annotation isn't on this canvas, do a thing.
    yield put(selectAnnotation(windowId, Object.values(annotationBySearch)[0][0]));
  }
}

/** @private */
export function* panToFocusedWindow({ pan, windowId }) {
  if (!pan) return;
  const elasticLayout = yield select(getElasticLayout);
  const {
    x, y, width, height,
  } = elasticLayout[windowId] || {};

  const {
    viewportPosition: { width: viewWidth, height: viewHeight },
  } = yield select(getWorkspace);

  yield put(setWorkspaceViewportPosition({
    x: (x + width / 2) - viewWidth / 2,
    y: (y + height / 2) - viewHeight / 2,
  }));
}

/** @private */
export function* updateVisibleCanvases({ windowId }) {
  const { canvasId } = yield select(getWindow, { windowId });
  const visibleCanvases = yield select(getCanvasGrouping, { canvasId, windowId });
  yield put(updateWindow(windowId, { visibleCanvases: (visibleCanvases || []).map(c => c.id) }));
}

/** @private */
export function* setCanvasOfFirstSearchResult({ companionWindowId, windowId }) {
  const { switchCanvasOnSearch } = yield select(getWindowConfig, { windowId });
  if (!switchCanvasOnSearch) {
    return;
  }
  const selectedIds = yield select(getSelectedContentSearchAnnotationIds, {
    companionWindowId, windowId,
  });

  if (selectedIds.length !== 0) return;

  const annotations = yield select(getSortedSearchAnnotationsForCompanionWindow, { companionWindowId, windowId });
  if (!annotations || annotations.length === 0) return;

  yield put(selectAnnotation(windowId, annotations[0].id));
}

/** @private */
export function* setCanvasforSelectedAnnotation({ annotationId, windowId }) {
  const canvasIds = yield select(getVisibleCanvasIds, { windowId });
  const canvas = yield select(getCanvasForAnnotation, {
    annotationId, windowId,
  });

  if (!canvas || canvasIds.includes(canvas.id)) return;

  const thunk = yield call(setCanvas, windowId, canvas.id);
  yield put(thunk);
}

/** Fetch info responses for the visible canvases */
export function* fetchInfoResponses({ visibleCanvases: visibleCanvasIds, windowId }) {
  const canvases = yield select(getCanvases, { windowId });
  const infoResponses = yield select(selectInfoResponses);
  const visibleCanvases = (canvases || []).filter(c => visibleCanvasIds.includes(c.id));

  yield all(visibleCanvases.map((canvas) => {
    const miradorCanvas = new MiradorCanvas(canvas);
    return all(miradorCanvas.iiifImageResources.map(imageResource => (
      !infoResponses[imageResource.getServices()[0].id]
        && put(fetchInfoResponse({ imageResource, windowId }))
    )).filter(Boolean));
  }));
}

/** */
export function* determineAndShowCollectionDialog(manifestId, windowId) {
  const manifestoInstance = yield select(getManifestoInstance, { manifestId });
  if (manifestoInstance && manifestoInstance.isCollection()) {
    yield put(showCollectionDialog(manifestId, [], windowId));
  }
}

/** */
export default function* windowsSaga() {
  yield all([
    takeEvery(ActionTypes.ADD_WINDOW, fetchWindowManifest),
    takeEvery(ActionTypes.UPDATE_WINDOW, fetchWindowManifest),
    takeEvery(ActionTypes.UPDATE_WINDOW, setCanvasOnNewSequence),
    takeEvery(ActionTypes.SET_CANVAS, setCurrentAnnotationsOnCurrentCanvas),
    takeEvery(ActionTypes.SET_CANVAS, fetchInfoResponses),
    takeEvery(ActionTypes.UPDATE_COMPANION_WINDOW, fetchCollectionManifests),
    takeEvery(ActionTypes.SET_WINDOW_VIEW_TYPE, updateVisibleCanvases),
    takeEvery(ActionTypes.RECEIVE_SEARCH, setCanvasOfFirstSearchResult),
    takeEvery(ActionTypes.SELECT_ANNOTATION, setCanvasforSelectedAnnotation),
    takeEvery(ActionTypes.FOCUS_WINDOW, panToFocusedWindow),
  ]);
}

import {
  all, put, select, takeEvery,
} from 'redux-saga/effects';
import { requestCanvasAnnotations, receiveAnnotation, requestAnnotation } from '../actions';
import { getAnnotations, getCanvas } from '../selectors';
import ActionTypes from '../actions/action-types';
import MiradorCanvas from '../../lib/MiradorCanvas';

/** Fetch annotations for a given canvas */
export function* fetchCanvasAnnotations({ canvasId, windowId }) {
  const canvas = yield select(getCanvas, { canvasId, windowId });
  const annotations = yield select(getAnnotations);
  const miradorCanvas = new MiradorCanvas(canvas);

  return yield all([
    // IIIF v2
    ...miradorCanvas.annotationListUris
      .filter(uri => !(annotations[canvas.id] && annotations[canvas.id][uri]))
      .map(uri => put(requestAnnotation(canvas.id, uri))),
    // IIIF v3
    ...miradorCanvas.canvasAnnotationPages
      .filter(annotation => !(annotations[canvas.id] && annotations[canvas.id][annotation.id]))
      .map((annotation) => {
        // If there are no items, try to retrieve the referenced resource.
        // otherwise the resource should be embedded and just add to the store.
        if (!annotation.items) {
          return put(requestAnnotation(canvas.id, annotation.id));
        }

        return put(receiveAnnotation(canvas.id, annotation.id, annotation));
      }),
  ]);
}

/**
 * Fetch annotations for the visible canvases.
 */
export function* fetchAnnotations({ visibleCanvases = [], windowId }) {
  // this little indirection allows plugins to also handle the request
  return yield all(visibleCanvases.map(canvasId => (
    put(requestCanvasAnnotations(windowId, canvasId))
  )));
}

/** */
export default function* appSaga() {
  yield all([
    takeEvery(ActionTypes.REQUEST_CANVAS_ANNOTATIONS, fetchCanvasAnnotations),
    takeEvery(ActionTypes.SET_CANVAS, fetchAnnotations),
  ]);
}

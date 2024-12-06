import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { fetchCanvasAnnotations, fetchAnnotations } from '../../../src/state/sagas/annotations';
import { getAnnotations, getCanvas } from '../../../src/state/selectors';

describe('annotation sagas', () => {
  describe('fetchCanvasAnnotations', () => {
    it('requests IIIF v2-style annotations', () => {
      const action = {
        canvasId: 'a',
        windowId: 'foo',
      };

      return expectSaga(fetchCanvasAnnotations, action)
        .provide([
          [select(getCanvas, { canvasId: 'a', windowId: 'foo' }),
            { __jsonld: { otherContent: 'annoId' }, id: 'a' },
          ],
          [select(getAnnotations), { a: {} }],
        ])
        .put({
          annotationId: 'annoId',
          targetId: 'a',
          type: 'mirador/REQUEST_ANNOTATION',
        })
        .run();
    });
    it('does not refetch annotations', () => {
      const action = {
        canvasId: 'a',
        windowId: 'foo',
      };

      return expectSaga(fetchCanvasAnnotations, action)
        .provide([
          [select(getCanvas, { canvasId: 'a', windowId: 'foo' }),
            { __jsonld: { otherContent: ['annoId'] }, id: 'a' },
          ],
          [select(getAnnotations), { a: { annoId: {} } }],
        ])
        .run();
    });
    it('requests IIIF v3-style annotations', () => {
      const action = {
        canvasId: 'a',
        windowId: 'foo',
      };

      return expectSaga(fetchCanvasAnnotations, action)
        .provide([
          [select(getCanvas, { canvasId: 'a', windowId: 'foo' }),
            { __jsonld: { annotations: { id: 'annoId', type: 'AnnotationPage' } }, id: 'a' },
          ],
          [select(getAnnotations), { a: {} }],
        ])
        .put({
          annotationId: 'annoId',
          targetId: 'a',
          type: 'mirador/REQUEST_ANNOTATION',
        })
        .run();
    });
    it('handles embedded IIIF v3-style annotations', () => {
      const action = {
        canvasId: 'a',
        windowId: 'foo',
      };

      const annotations = { id: 'annoId', items: [], type: 'AnnotationPage' };

      return expectSaga(fetchCanvasAnnotations, action)
        .provide([
          [select(getCanvas, { canvasId: 'a', windowId: 'foo' }),
            { __jsonld: { annotations }, id: 'a' },
          ],
          [select(getAnnotations), { a: {} }],
        ])
        .put({
          annotationId: 'annoId',
          annotationJson: annotations,
          targetId: 'a',
          type: 'mirador/RECEIVE_ANNOTATION',
        })
        .run();
    });
  });
  describe('fetchAnnotations', () => {
    it('requests annotations for each visible canvas', () => {
      const action = {
        visibleCanvases: ['a', 'b'],
        windowId: 'foo',
      };

      return expectSaga(fetchAnnotations, action)
        .put({
          canvasId: 'a',
          type: 'mirador/REQUEST_CANVAS_ANNOTATIONS',
          windowId: 'foo',
        })
        .put({
          canvasId: 'b',
          type: 'mirador/REQUEST_CANVAS_ANNOTATIONS',
          windowId: 'foo',
        })
        .run();
    });
  });
});

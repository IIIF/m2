import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { Utils } from 'manifesto.js';

import ActionTypes from '../../../src/state/actions/action-types';
import { setCanvas } from '../../../src/state/actions';
import {
  getManifests, getManifestoInstance,
  getManifestSearchService, getCompanionWindowIdsForPosition,
  getSearchForWindow,
  getWorkspace, getElasticLayout,
  getWindow, getCanvasGrouping,
  getSelectedContentSearchAnnotationIds,
  getSortedSearchAnnotationsForCompanionWindow,
  getVisibleCanvasIds, getCanvasForAnnotation,
  getCanvases, selectInfoResponses,
  getWindowConfig,
} from '../../../src/state/selectors';
import { fetchManifests } from '../../../src/state/sagas/iiif';
import {
  determineAndShowCollectionDialog,
  fetchWindowManifest,
  setWindowDefaultSearchQuery,
  setWindowStartingCanvas,
  getAnnotationsBySearch,
  updateVisibleCanvases,
  setCanvasOfFirstSearchResult,
  setCanvasforSelectedAnnotation,
  panToFocusedWindow,
  setCurrentAnnotationsOnCurrentCanvas,
  fetchInfoResponses,
  setCanvasOnNewSequence,
  setCollectionPath,
} from '../../../src/state/sagas/windows';
import fixture from '../../fixtures/version-2/019.json';
import collectionFixture from '../../fixtures/version-2/collection.json';

describe('window-level sagas', () => {
  describe('fetchWindowManifest', () => {
    it('calls into fetchManifests for each window', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };
      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), {}],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(fetchManifests, 'manifest.json'), {}],
          [call(setWindowStartingCanvas, action)],
          [call(setWindowDefaultSearchQuery, action)],
          [call(setCollectionPath, { manifestId: 'manifest.json', windowId: 'x' })],
        ])
        .call(fetchManifests, 'manifest.json')
        .run();
    });
    it('calls additional methods after ensuring we have a manifest', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setWindowStartingCanvas, action)],
          [call(setWindowDefaultSearchQuery, action)],
          [call(setCollectionPath, { manifestId: 'manifest.json', windowId: 'x' })],
          [call(determineAndShowCollectionDialog, 'manifest.json', 'x')],
        ])
        .call(setWindowStartingCanvas, action)
        .call(setWindowDefaultSearchQuery, action)
        .call(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .run();
    });
  });

  describe('setCanvasOnNewSequence', () => {
    it('when a sequenceId is provided, set the canvasId', () => {
      const action = {
        id: 'x',
        payload: {
          sequenceId: 'foo',
        },
      };

      return expectSaga(setCanvasOnNewSequence, action)
        .provide([
          [select(getCanvases, { windowId: 'x' }), [{ id: 'a' }, { id: 'b' }]],
          [call(setCanvas, 'x', 'a'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });
    it('when a sequenceId is not provided, return', () => {
      const action = {
        id: 'x',
      };

      return expectSaga(setCanvasOnNewSequence, action)
        .provide([
        ])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('setWindowStartingCanvas', () => {
    it('calls setCanvas if the canvas id was provided', () => {
      const action = {
        window: {
          canvasId: '1',
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowStartingCanvas, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setCanvas, 'x', '1', null, { preserveViewport: false }), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('calls setCanvas if the canvas id was provided via the payload and preserves viewport', () => {
      const action = {
        id: 'x',
        payload: {
          canvasId: '1',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowStartingCanvas, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [call(setCanvas, 'x', '1', null, { preserveViewport: true }), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });

    it('calculates the starting canvas and calls setCanvas', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      const manifest = Utils.parseManifest({ ...fixture, start: { id: 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1' } });

      return expectSaga(fetchWindowManifest, action)
        .provide([
          [select(getManifests), { 'manifest.json': {} }],
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
          [call(setCanvas, 'x', 'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1'), { type: 'setCanvasThunk' }],
        ])
        .put({ type: 'setCanvasThunk' })
        .run();
    });
  });

  describe('setWindowDefaultSearchQuery', () => {
    it('does nothing if there was no default query', () => {
      const action = {
        window: {
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowDefaultSearchQuery, action)
        .run().then(({ allEffects }) => allEffects.length === 0);
    });

    it('initiates a search', () => {
      const action = {
        window: {
          defaultSearchQuery: 'xyz',
          id: 'x',
          manifestId: 'manifest.json',
        },
      };

      return expectSaga(setWindowDefaultSearchQuery, action)
        .provide([
          [select(getManifestSearchService, { windowId: 'x' }), { id: 'http://search/' }],
          [select(getCompanionWindowIdsForPosition, { position: 'left', windowId: 'x' }), ['left']],
        ])
        .put({
          companionWindowId: 'left',
          query: 'xyz',
          searchId: 'http://search/?q=xyz',
          type: ActionTypes.REQUEST_SEARCH,
          windowId: 'x',
        })
        .run()
        .then(({ allEffects }) => allEffects.length === 1);
    });
  });

  describe('setCurrentAnnotationsOnCurrentCanvas', () => {
    it('short circuits if there is no active search', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a'],
        windowId: 'abc123',
      };

      return expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
        .provide([
          [select(
            getSearchForWindow,
            { windowId: 'abc123' },
          ), {}],
        ])
        .run()
        .then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing when there are no annotations targeting the current canvas', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a', 'b'],
        windowId: 'abc123',
      };

      return expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
        .provide([
          [select(
            getSearchForWindow,
            { windowId: 'abc123' },
          ), { cwid: { } }],
          [select(getAnnotationsBySearch, { canvasIds: ['a', 'b'], companionWindowIds: ['cwid'], windowId: 'abc123' }),
            { }],
        ])
        .run()
        // Assert that nothing did happen, see https://github.com/jfairbank/redux-saga-test-plan/issues/137
        .then(({ effects }) => {
          expect(effects.select.length).toEqual(2);
          expect(effects.put).toBeUndefined();
        });
    });

    it('selects content search annotations for the current searches', () => {
      const action = {
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a', 'b'],
        windowId: 'abc123',
      };

      return expectSaga(setCurrentAnnotationsOnCurrentCanvas, action)
        .provide([
          [select(
            getSearchForWindow,
            { windowId: 'abc123' },
          ), { cwid: { } }],
          [select(getAnnotationsBySearch, { canvasIds: ['a', 'b'], companionWindowIds: ['cwid'], windowId: 'abc123' }),
            { cwid: ['annoId'] }],
        ])
        .put({
          annotationIds: ['annoId'], companionWindowId: 'cwid', type: ActionTypes.SET_CONTENT_SEARCH_CURRENT_ANNOTATIONS, windowId: 'abc123',
        })
        .put({
          annotationId: 'annoId', type: ActionTypes.SELECT_ANNOTATION, windowId: 'abc123',
        })
        .run();
    });
  });

  describe('panToFocusedWindow', () => {
    it('does nothing if pan was disabled', () => {
      const action = {
        pan: false,
        windowId: 'x',
      };

      return expectSaga(panToFocusedWindow, action)
        .run().then(({ allEffects }) => allEffects.length === 0);
    });

    it('sets the viewport position to the newly focused window', () => {
      const action = {
        pan: true,
        windowId: 'x',
      };
      return expectSaga(panToFocusedWindow, action)
        .provide([
          [select(getWorkspace), {
            viewportPosition: { height: 100, width: 100 },
          }],
          [select(getElasticLayout), {
            x: {
              height: 50, width: 50, x: 50, y: 12,
            },
          }],
        ])
        .put({
          payload: {
            position: {
              x: 25,
              y: -13,
            },
          },
          type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
        })
        .run();
    });
  });

  describe('updateVisibleCanvases', () => {
    it('recalculates the visible canvases', () => {
      const windowId = 'x';
      const action = {
        windowId,
      };

      return expectSaga(updateVisibleCanvases, action)
        .provide([
          [select(getWindow, { windowId }), { canvasId: 'y' }],
          [select(getCanvasGrouping, { canvasId: 'y', windowId }), [{ id: 'y' }, { id: 'z' }]],
        ])
        .put({
          id: windowId,
          payload: { visibleCanvases: ['y', 'z'] },
          type: ActionTypes.UPDATE_WINDOW,
        })
        .run();
    });
  });

  describe('setCanvasOfFirstSearchResult', () => {
    it('updates the current canvas', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([
          [select(getWindowConfig, { windowId }), { switchCanvasOnSearch: true }],
          [select(getSelectedContentSearchAnnotationIds, { companionWindowId, windowId }), []],
          [select(getSortedSearchAnnotationsForCompanionWindow, { companionWindowId, windowId }), [{ id: 'a' }, { id: 'b' }]],
        ])
        .put({
          annotationId: 'a',
          type: 'mirador/SELECT_ANNOTATION',
          windowId: 'y',
        })
        .run();
    });

    it('does nothing if a search annotation is already selected', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([
          [select(getWindowConfig, { windowId }), { switchCanvasOnSearch: true }],
          [select(getSelectedContentSearchAnnotationIds, { companionWindowId, windowId }), ['y']],
        ])
        .run().then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing if canvas switching for searches is disabled', () => {
      const companionWindowId = 'x';
      const windowId = 'y';
      const action = {
        companionWindowId,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };

      return expectSaga(setCanvasOfFirstSearchResult, action)
        .provide([
          [select(getWindowConfig, { windowId }), { switchCanvasOnSearch: false }],
        ])
        .run().then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('setCanvasforSelectedAnnotation', () => {
    it('changes the canvas to that of the selected annotation', () => {
      const annotationId = ['a'];
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['q']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), { id: 'z' }],
          [call(setCanvas, windowId, 'z'), { type: 'expectedThunk' }],
        ])
        .put({ type: 'expectedThunk' })
        .run();
    });

    it('does nothing if the canvas is already visible', () => {
      const annotationId = 'a';
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['z']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), { id: 'z' }],
        ])
        .run().then(({ allEffects }) => allEffects.length === 0);
    });

    it('does nothing if the annotation is not on one of our canvases', () => {
      const annotationId = 'a';
      const windowId = 'y';
      const action = {
        annotationId,
        type: ActionTypes.SELECT_ANNOTATION,
        windowId,
      };

      return expectSaga(setCanvasforSelectedAnnotation, action)
        .provide([
          [select(getVisibleCanvasIds, { windowId }), ['z']],
          [select(getCanvasForAnnotation, { annotationId, windowId }), null],
        ])
        .run().then(({ allEffects }) => allEffects.length === 0);
    });
  });

  describe('fetchInfoResponses', () => {
    it('requests info responses for each visible canvas', () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };

      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchInfoResponses, action)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [select(selectInfoResponses), {}],
        ])
        .put.like({
          action: {
            infoId: 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44',
            type: 'mirador/REQUEST_INFO_RESPONSE',
          },
        })
        .run();
    });

    it('requests nothing if the response is  already in the store', () => {
      const action = {
        visibleCanvases: ['http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json'],
        windowId: 'foo',
      };

      const manifest = Utils.parseManifest(fixture);

      return expectSaga(fetchInfoResponses, action)
        .provide([
          [select(getCanvases, { windowId: 'foo' }), manifest.getSequences()[0].getCanvases()],
          [select(selectInfoResponses), { 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44': {} }],
        ])
        .not.put.like({
          action: {
            infoId: 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44',
            type: 'mirador/REQUEST_INFO_RESPONSE',
          },
        })
        .run();
    });
  });

  describe('determineAndShowCollectionDialog', () => {
    it('shows the collection dialog if it is a collection', () => {
      const manifest = Utils.parseManifest(collectionFixture);

      return expectSaga(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .provide([
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
        ])
        .put.like({
          action: {
            collectionPath: [],
            manifestId: 'manifest.json',
            type: 'mirador/SHOW_COLLECTION_DIALOG',
            windowId: 'x',
          },
        })
        .run();
    });

    it('does nothing if not a collection', () => {
      const manifest = Utils.parseManifest(fixture);

      return expectSaga(determineAndShowCollectionDialog, 'manifest.json', 'x')
        .provide([
          [select(getManifestoInstance, { manifestId: 'manifest.json' }), manifest],
        ])
        .not.put.like({
          action: {
            collectionPath: [],
            manifestId: 'manifest.json',
            type: 'mirador/SHOW_COLLECTION_DIALOG',
            windowId: 'x',
          },
        })
        .run();
    });
  });
});

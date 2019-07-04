import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock('../../../src/state/selectors', () => ({
  getCanvas: (state, { canvasId, canvasIndex }) => ({ id: canvasId || `canvasIndex-${canvasIndex}` }),
  getCanvasGrouping: (state, { canvasId }) => [{ id: canvasId }],
  getSearchAnnotationsForCompanionWindow: () => ({
    resources: [
      { id: 'annoId', targetId: 'a' },
    ],
  }),
  getSearchForWindow: () => ({ cwid: { } }),
  getVisibleCanvases: () => [{ id: 'a' }],
}));

describe('canvas actions', () => {
  describe('setCanvas', () => {
    let store = null;
    beforeEach(() => {
      store = mockStore({});
    });

    it('sets to a defined canvas', () => {
      const id = 'abc123';
      const expectedAction = {
        canvasId: 'a',
        searches: {
          cwid: ['annoId'],
        },
        selectedContentSearchAnnotation: ['annoId'],
        type: ActionTypes.SET_CANVAS,
        windowId: id,
      };
      store.dispatch(actions.setCanvas(id, 'a'));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
  describe('setCanvasByIndex', () => {
    let store = null;
    beforeEach(() => {
      store = mockStore({});
    });

    it('sets to a defined canvas', () => {
      const id = 'abc123';
      const expectedAction = {
        canvasId: 'canvasIndex-1',
        searches: {},
        type: ActionTypes.SET_CANVAS,
        windowId: id,
      };
      store.dispatch(actions.setCanvasByIndex(id, 1));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
  describe('updateViewport', () => {
    it('sets viewer state', () => {
      const id = 'abc123';
      const expectedAction = {
        payload: {
          x: 1,
          y: 0,
          zoom: 0.5,
        },
        type: ActionTypes.UPDATE_VIEWPORT,
        windowId: id,
      };
      expect(actions.updateViewport(id, { x: 1, y: 0, zoom: 0.5 })).toEqual(expectedAction);
    });
  });
});

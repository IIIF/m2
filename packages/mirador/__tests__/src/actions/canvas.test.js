import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock('../../../src/state/selectors', () => ({
  getCanvasGrouping: (state, { canvasId }) => [{ id: canvasId }],
  getConfig: vi.fn((state) => {
    const osdConfig = { osdConfig: { preserveViewport: true } };
    return osdConfig;
  }),
  getNextCanvasGrouping: () => [{ id: 'canvasIndex-2' }],
  getPreviousCanvasGrouping: () => [{ id: 'canvasIndex-0' }],
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
        preserveViewport: true,
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['a'],
        windowId: id,
      };
      store.dispatch(actions.setCanvas(id, 'a'));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
  describe('setPreviousCanvas', () => {
    let store = null;
    beforeEach(() => {
      store = mockStore({});
    });

    it('sets to a defined canvas', () => {
      const id = 'abc123';
      const expectedAction = {
        canvasId: 'canvasIndex-0',
        preserveViewport: true,
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['canvasIndex-0'],
        windowId: id,
      };
      store.dispatch(actions.setPreviousCanvas(id));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });
  describe('setNextCanvas', () => {
    let store = null;
    beforeEach(() => {
      store = mockStore({});
    });

    it('sets to a defined canvas', () => {
      const id = 'abc123';
      const expectedAction = {
        canvasId: 'canvasIndex-2',
        preserveViewport: true,
        type: ActionTypes.SET_CANVAS,
        visibleCanvases: ['canvasIndex-2'],
        windowId: id,
      };
      store.dispatch(actions.setNextCanvas(id));
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

import { viewersReducer } from '../../../src/state/reducers/viewers';
import ActionTypes from '../../../src/state/actions/action-types';

describe('viewers reducer', () => {
  it('should handle UPDATE_VIEWPORT', () => {
    expect(viewersReducer({
      abc123: {
        whatever: true,
        x: 1,
      },
      def456: {
        y: 1,
      },
    }, {
      payload: { x: 0, y: 1, zoom: 0.5 },
      type: ActionTypes.UPDATE_VIEWPORT,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        whatever: true,
        x: 0,
        y: 1,
        zoom: 0.5,
      },
      def456: {
        y: 1,
      },
    });
  });
  it('should handle REMOVE_WINDOW', () => {
    expect(viewersReducer({
      abc123: {
        foo: 'bar',
      },
      def456: {
        foo: 'bar',
      },
    }, {
      type: ActionTypes.REMOVE_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      def456: {
        foo: 'bar',
      },
    });
  });
  it('should handle SET_WINDOW_VIEW_TYPE', () => {
    expect(viewersReducer({
      abc123: {
        foo: 'bar',
      },
      def456: {
        foo: 'bar',
      },
    }, {
      type: ActionTypes.SET_WINDOW_VIEW_TYPE,
      windowId: 'abc123',
    })).toEqual({
      abc123: null,
      def456: {
        foo: 'bar',
      },
    });
  });
  it('should handle SET_CANVAS and throwaway if !preserveViewport', () => {
    expect(viewersReducer({
      abc123: {
        foo: 'bar',
      },
      def456: {
        foo: 'bar',
      },
    }, {
      type: ActionTypes.SET_CANVAS,
      windowId: 'abc123',
    })).toEqual({
      abc123: null,
      def456: {
        foo: 'bar',
      },
    });
  });
  it('should handle SET_CANVAS and not throwaway viewports if preserveViewport', () => {
    expect(viewersReducer({
      abc123: {
        foo: 'bar',
      },
      def456: {
        foo: 'bar',
      },
    }, {
      preserveViewport: true,
      type: ActionTypes.SET_CANVAS,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        foo: 'bar',
      },
      def456: {
        foo: 'bar',
      },
    });
  });
  it('should handle IMPORT_MIRADOR_STATE', () => {
    expect(viewersReducer({}, {
      state: { viewers: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });
  it('should handle ADD_WINDOW', () => {
    expect(viewersReducer({}, {
      type: ActionTypes.ADD_WINDOW,
      window: { id: 'abc123', initialViewerConfig: { x: 5, y: 15 } },
    })).toEqual({
      abc123: {
        x: 5,
        y: 15,
      },
    });
  });
});

import { elasticLayoutReducer } from '../../../src/state/reducers/elasticLayout';
import ActionTypes from '../../../src/state/actions/action-types';

describe('elastic layout reducer', () => {
  it('should handle ADD_WINDOW', () => {
    expect(elasticLayoutReducer({}, {
      elasticLayout: { x: 1, y: 2 },
      type: ActionTypes.ADD_WINDOW,
      window: { id: 'abc123' },
    })).toEqual({
      abc123: {
        windowId: 'abc123',
        x: 1,
        y: 2,
      },
    });
  });
  it('should handle REMOVE_WINDOW', () => {
    expect(elasticLayoutReducer({
      abc123: {
        windowId: 'abc123',
      },
      def456: {
        windowId: 'def456',
      },
    }, {
      type: ActionTypes.REMOVE_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      def456: {
        windowId: 'def456',
      },
    });
  });
  it('should handle UPDATE_ELASTIC_WINDOW_LAYOUT', () => {
    expect(elasticLayoutReducer({
      abc123: {
        windowId: 'abc123',
      },
    }, {
      payload: {
        x: 1,
        y: 2,
      },
      type: ActionTypes.UPDATE_ELASTIC_WINDOW_LAYOUT,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        windowId: 'abc123',
        x: 1,
        y: 2,
      },
    });
  });

  it('should handle IMPORT_MIRADOR_STATE', () => {
    expect(elasticLayoutReducer({}, {
      state: { elasticLayout: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });
});

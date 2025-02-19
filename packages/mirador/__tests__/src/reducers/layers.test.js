import { layersReducer } from '../../../src/state/reducers/layers';
import ActionTypes from '../../../src/state/actions/action-types';

describe('layers reducer', () => {
  const windowId = 'foo';
  const canvasId = 'bar';
  describe('UPDATE_LAYERS', () => {
    it('should handle UPDATE_LAYERS', () => {
      expect(layersReducer({}, {
        canvasId,
        payload: { some: 'data' },
        type: ActionTypes.UPDATE_LAYERS,
        windowId,
      })).toEqual({
        foo: {
          bar: {
            some: 'data',
          },
        },
      });
    });
    it('does a deep merge', () => {
      const originalState = {
        baz: {
          whatever: {},
        },
        foo: {
          bar: { existing: 'props' },
          oof: {},
        },
      };

      expect(layersReducer(originalState, {
        canvasId,
        payload: { some: 'data' },
        type: ActionTypes.UPDATE_LAYERS,
        windowId,
      })).toEqual({
        baz: {
          whatever: {},
        },
        foo: {
          bar: { existing: 'props', some: 'data' },
          oof: {},
        },
      });
    });
  });
});

import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('layers actions', () => {
  describe('updateLayers', () => {
    it('sets the layers state', () => {
      const windowId = 'foo';
      const canvasId = 'bar';
      const expectedAction = {
        canvasId,
        payload: { some: 'data' },
        type: ActionTypes.UPDATE_LAYERS,
        windowId,
      };
      expect(actions.updateLayers(windowId, canvasId, { some: 'data' })).toEqual(expectedAction);
    });
  });
});

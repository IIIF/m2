import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('updateElasticWindowLayout', () => {
  it('returns the appropriate action type', () => {
    const id = 'abc123';
    const expectedAction = {
      payload: {
        x: 20,
        y: 20,
      },
      type: ActionTypes.UPDATE_ELASTIC_WINDOW_LAYOUT,
      windowId: id,
    };
    expect(actions.updateElasticWindowLayout(id, {
      x: 20,
      y: 20,
    })).toEqual(expectedAction);
  });
});

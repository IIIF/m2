import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('manifest actions', () => {
  describe('requestManifest', () => {
    it('requests a manifest given a url', () => {
      const id = 'abc123';
      const expectedAction = {
        manifestId: id,
        type: ActionTypes.REQUEST_MANIFEST,
      };
      expect(actions.requestManifest(id)).toEqual(expectedAction);
    });
  });
  describe('receiveManifest', () => {
    it('receives a manifest', () => {
      const id = 'abc123';
      const json = {
        content: 'lots of metadata, canvases, and other IIIFy things',
        id,
      };
      const expectedAction = {
        manifestId: id,
        manifestJson: json,
        type: ActionTypes.RECEIVE_MANIFEST,
      };
      expect(actions.receiveManifest(id, json)).toEqual(expectedAction);
    });
  });
  describe('fetchManifest', () => {
    it('requests a manifest given a url', () => {
      const id = 'abc123';
      const expectedAction = {
        manifestId: id,
        properties: { isFetching: true },
        type: ActionTypes.REQUEST_MANIFEST,
      };
      expect(actions.fetchManifest(id)).toEqual(expectedAction);
    });
  });
  describe('removeManifest', () => {
    it('removes an existing manifest', () => {
      const expectedAction = {
        manifestId: 'foo',
        type: ActionTypes.REMOVE_MANIFEST,
      };
      expect(actions.removeManifest('foo')).toEqual(expectedAction);
    });
  });
});

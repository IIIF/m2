import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('infoResponse actions', () => {
  describe('requestInfoResponse', () => {
    it('requests an infoResponse from given a url', () => {
      const id = 'abc123';
      const expectedAction = {
        infoId: id,
        type: ActionTypes.REQUEST_INFO_RESPONSE,
      };
      expect(actions.requestInfoResponse(id)).toEqual(expectedAction);
    });
  });
  describe('receiveInfoResponse', () => {
    it('recieves an infoResponse', () => {
      const id = 'abc123';
      const json = {
        content: 'image information request',
        id,
      };
      const expectedAction = {
        infoId: id,
        infoJson: json,
        type: ActionTypes.RECEIVE_INFO_RESPONSE,
      };
      expect(actions.receiveInfoResponse(id, json)).toEqual(expectedAction);
    });
  });
  describe('fetchInfoResponse', () => {
    describe('success response', () => {
      it('dispatches the REQUEST_INFO_RESPONSE action', () => {
        const imageResource = { getServices: () => ['service'] };
        expect(actions.fetchInfoResponse({ imageId: 'someUrl', imageResource })).toEqual({
          imageResource: 'service',
          infoId: 'someUrl',
          type: 'mirador/REQUEST_INFO_RESPONSE',
        });
      });
    });
  });
  describe('removeInfoResponse', () => {
    it('removes an existing infoResponse', () => {
      const expectedAction = {
        infoId: 'foo',
        type: ActionTypes.REMOVE_INFO_RESPONSE,
      };
      expect(actions.removeInfoResponse('foo')).toEqual(expectedAction);
    });
  });
});

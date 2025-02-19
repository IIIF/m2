import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('auth actions', () => {
  describe('addAuthenticationRequest', () => {
    it('requests an authentication attempt from given a url', () => {
      const id = 'abc123';
      const windowId = 'windowId';

      const expectedAction = {
        id,
        type: ActionTypes.ADD_AUTHENTICATION_REQUEST,
        windowId,
      };
      expect(actions.addAuthenticationRequest(windowId, id)).toEqual(expectedAction);
    });
  });
  describe('resolveAuthenticationRequest', () => {
    it('markes the auth request as resolved (pending fetching access tokens to mark it a success)', () => {
      const authId = 'abc123';
      const tokenServiceId = 'xyz';

      const expectedAction = {
        id: authId,
        tokenServiceId,
        type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
      };

      expect(actions.resolveAuthenticationRequest(authId, tokenServiceId)).toEqual(expectedAction);
    });
    it('can be marked as failed', () => {
      const authId = 'abc123';
      const tokenServiceId = 'xyz';

      const expectedAction = {
        id: authId,
        ok: false,
        tokenServiceId,
        type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
      };

      expect(
        actions.resolveAuthenticationRequest(authId, tokenServiceId, { ok: false }),
      ).toEqual(expectedAction);
    });
  });

  describe('requestAccessToken', () => {
    it('requests an infoResponse from given a url', () => {
      const authId = 'abc123';
      const serviceId = 'xyz';

      const expectedAction = {
        authId,
        serviceId,
        type: ActionTypes.REQUEST_ACCESS_TOKEN,
      };
      expect(actions.requestAccessToken(serviceId, authId)).toEqual(expectedAction);
    });
  });

  describe('receiveAccessToken', () => {
    it('recieves an access token', () => {
      const authId = 'auth';
      const serviceId = 'abc123';
      const json = {
        content: 'image information request',
        serviceId,
      };

      const expectedAction = {
        authId,
        json,
        serviceId,
        type: ActionTypes.RECEIVE_ACCESS_TOKEN,
      };
      expect(actions.receiveAccessToken(authId, serviceId, json)).toEqual(expectedAction);
    });
  });

  describe('receiveAccessTokenFailure', () => {
    it('fails to receive an access token', () => {
      const authId = 'auth';
      const serviceId = 'abc123';
      const error = 'some error';

      const expectedAction = {
        authId,
        error,
        serviceId,
        type: ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE,
      };
      expect(actions.receiveAccessTokenFailure(authId, serviceId, error)).toEqual(expectedAction);
    });
  });

  describe('resolveAccessTokenRequest', () => {
    it('resolves the auth request, receives the access token, and re-dispatches fetching info responses', () => {
      const authId = 'auth';
      const serviceId = 'abc123';
      const json = { accessToken: 1 };

      expect(actions.resolveAccessTokenRequest(authId, serviceId, json)).toEqual(
        {
          authId, json, serviceId, type: ActionTypes.RECEIVE_ACCESS_TOKEN,
        },
      );
    });

    it('without an access token, resolves the auth request unsuccessfully', () => {
      const authId = 'auth';
      const serviceId = 'abc123';
      const json = { error: 'xyz' };

      expect(actions.resolveAccessTokenRequest(authId, serviceId, json)).toEqual(
        {
          authId, error: json, serviceId, type: ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE,
        },
      );
    });
  });
});

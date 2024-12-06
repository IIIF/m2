import { accessTokensReducer } from '../../../src/state/reducers/accessTokens';
import ActionTypes from '../../../src/state/actions/action-types';

describe('access tokens response reducer', () => {
  it('should handle REQUEST_ACCESS_TOKEN', () => {
    expect(accessTokensReducer({}, {
      authId: 'auth123',
      serviceId: 'abc123',
      type: ActionTypes.REQUEST_ACCESS_TOKEN,
    })).toEqual({
      abc123: {
        authId: 'auth123',
        id: 'abc123',
        isFetching: true,
      },
    });
  });
  it('should handle RECEIVE_ACCESS_TOKEN', () => {
    expect(accessTokensReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        json: { data: true },
        serviceId: 'abc123',
        type: ActionTypes.RECEIVE_ACCESS_TOKEN,
      },
    )).toMatchObject({
      abc123: {
        id: 'abc123',
        isFetching: false,
        json: { data: true },
      },
    });
  });
  it('should handle RECEIVE_INFO_RESPONSE_FAILURE', () => {
    expect(accessTokensReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        error: "This institution didn't enable CORS.",
        serviceId: 'abc123',
        type: ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE,
      },
    )).toMatchObject({
      abc123: {
        error: "This institution didn't enable CORS.",
        id: 'abc123',
        isFetching: false,
      },
    });
  });
  describe('should handle RESET_AUTHENTICATION_STATE', () => {
    it('does nothing if tokenServiceId is not present', () => {
      expect(accessTokensReducer({}, {
        tokenServiceId: 'foo',
        type: ActionTypes.RESET_AUTHENTICATION_STATE,
      })).toEqual({});
    });
    it('removes tokenServiceId', () => {
      expect(accessTokensReducer({
        foo: 'otherStuff',
      }, {
        tokenServiceId: 'foo',
        type: ActionTypes.RESET_AUTHENTICATION_STATE,
      })).toEqual({});
    });
  });
});

import { authReducer } from '../../../src/state/reducers/auth';
import ActionTypes from '../../../src/state/actions/action-types';

describe('auth response reducer', () => {
  it('should handle ADD_AUTHENTICATION_REQUEST', () => {
    expect(authReducer({}, {
      id: 'abc123',
      profile: 'iiif/login',
      type: ActionTypes.ADD_AUTHENTICATION_REQUEST,
      windowId: 'main',
    })).toEqual({
      abc123: {
        id: 'abc123',
        isFetching: true,
        profile: 'iiif/login',
        windowId: 'main',
      },
    });
  });
  it('should handle RESOLVE_AUTHENTICATION_REQUEST', () => {
    expect(authReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        id: 'abc123',
        ok: true,
        type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
      },
    )).toMatchObject({
      abc123: {
        id: 'abc123',
        isFetching: false,
        ok: true,
      },
    });
  });
  describe('should handle RECEIVE_ACCESS_TOKEN', () => {
    it('does nothing if id is not present', () => {
      expect(authReducer({ foo: {} }, {
        authId: 'foo',
        type: ActionTypes.RECEIVE_ACCESS_TOKEN,
      })).toMatchObject({ foo: { ok: true } });
    });
  });
  describe('should handle RESET_AUTHENTICATION_STATE', () => {
    it('does nothing if id is not present', () => {
      expect(authReducer({}, {
        id: 'foo',
        type: ActionTypes.RESET_AUTHENTICATION_STATE,
      })).toEqual({});
    });
    it('removes id', () => {
      expect(authReducer({
        foo: 'otherStuff',
      }, {
        id: 'foo',
        type: ActionTypes.RESET_AUTHENTICATION_STATE,
      })).toEqual({});
    });
  });
});

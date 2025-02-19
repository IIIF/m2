import { infoResponsesReducer } from '../../../src/state/reducers/infoResponses';
import ActionTypes from '../../../src/state/actions/action-types';

describe('info response reducer', () => {
  it('should handle REQUEST_INFO_RESPONSE', () => {
    expect(infoResponsesReducer({}, {
      infoId: 'abc123',
      type: ActionTypes.REQUEST_INFO_RESPONSE,
    })).toEqual({
      abc123: {
        id: 'abc123',
        isFetching: true,
      },
    });
  });
  it('should handle RECEIVE_INFO_RESPONSE', () => {
    expect(infoResponsesReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        infoId: 'abc123',
        infoJson: {
          '@type': 'sc:Manifest',
          content: 'lots of canvases and metadata and such',
          id: 'abc123',
        },
        tokenServiceId: 'efg456',
        type: ActionTypes.RECEIVE_INFO_RESPONSE,
      },
    )).toMatchObject({
      abc123: {
        id: 'abc123',
        isFetching: false,
        json: {},
        tokenServiceId: 'efg456',
      },
    });
  });
  it('should handle RECEIVE_INFO_RESPONSE_FAILURE', () => {
    expect(infoResponsesReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        error: "This institution didn't enable CORS.",
        infoId: 'abc123',
        tokenServiceId: 'efg456',
        type: ActionTypes.RECEIVE_INFO_RESPONSE_FAILURE,
      },
    )).toEqual({
      abc123: {
        error: "This institution didn't enable CORS.",
        id: 'abc123',
        isFetching: false,
        tokenServiceId: 'efg456',
      },
    });
  });
  it('should handle REMOVE_INFO_RESPONSE', () => {
    expect(infoResponsesReducer(
      {
        abc123: {
          id: 'abc123',
          stuff: 'foo',
        },
        def456: {
          id: 'def456',
          stuff: 'foo',
        },
      },
      {
        infoId: 'abc123',
        type: ActionTypes.REMOVE_INFO_RESPONSE,
      },
    )).toEqual({
      def456: {
        id: 'def456',
        stuff: 'foo',
      },
    });
  });
  it('should handle IMPORT_MIRADOR_STATE setting to clean state', () => {
    expect(infoResponsesReducer({}, {
      state: { infoResponses: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({});
  });
});

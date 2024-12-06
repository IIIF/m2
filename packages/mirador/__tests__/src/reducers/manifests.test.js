import { manifestsReducer } from '../../../src/state/reducers/manifests';
import ActionTypes from '../../../src/state/actions/action-types';

describe('manifests reducer', () => {
  it('should handle REQUEST_MANIFEST', () => {
    expect(manifestsReducer({}, {
      manifestId: 'abc123',
      type: ActionTypes.REQUEST_MANIFEST,
    })).toEqual({
      abc123: {
        id: 'abc123',
      },
    });
  });
  it('should handle RECEIVE_MANIFEST', () => {
    expect(manifestsReducer(
      {
        abc123: {
          error: 'Error fetching manifest',
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        manifestId: 'abc123',
        manifestJson: {
          '@type': 'sc:Manifest',
          content: 'lots of canvases and metadata and such',
          id: 'abc123',
        },
        type: ActionTypes.RECEIVE_MANIFEST,
      },
    )).toMatchObject({
      abc123: {
        error: null,
        id: 'abc123',
        isFetching: false,
        json: {
          '@type': 'sc:Manifest',
          content: 'lots of canvases and metadata and such',
          id: 'abc123',
        },
      },
    });
  });

  it('should handle RECEIVE_MANIFEST_FAILURE', () => {
    expect(manifestsReducer(
      {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
      {
        error: "This institution didn't enable CORS.",
        manifestId: 'abc123',
        type: ActionTypes.RECEIVE_MANIFEST_FAILURE,
      },
    )).toEqual({
      abc123: {
        error: "This institution didn't enable CORS.",
        id: 'abc123',
        isFetching: false,
      },
    });
  });
  it('should handle REMOVE_MANIFEST', () => {
    expect(manifestsReducer(
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
        manifestId: 'abc123',
        type: ActionTypes.REMOVE_MANIFEST,
      },
    )).toEqual({
      def456: {
        id: 'def456',
        stuff: 'foo',
      },
    });
  });
  it('should handle IMPORT_MIRADOR_STATE setting to clean state', () => {
    expect(manifestsReducer({ old: 'stuff' }, {
      state: { manifests: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });
});

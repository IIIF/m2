import { searchesReducer } from '../../../src/state/reducers/search';
import ActionTypes from '../../../src/state/actions/action-types';

describe('search reducer', () => {
  it('should handle REQUEST_SEARCH', () => {
    expect(searchesReducer({}, {
      companionWindowId: 'abc123',
      query: 'search terms',
      searchId: 'search?page=1',
      type: ActionTypes.REQUEST_SEARCH,
      windowId: 'foo',
    })).toEqual({
      foo: {
        abc123: {
          data: {
            'search?page=1': {
              isFetching: true,
            },
          },
          query: 'search terms',
          selectedContentSearchAnnotation: [],
        },
      },
    });
  });
  it('should removes previous search requests with REQUEST_SEARCH', () => {
    expect(searchesReducer({
      foo: {
        abc123: {
          data: {
            'search?page=xyz': {
              json: { },
            },
          },
          query: 'initial search terms',
        },
      },
    }, {
      companionWindowId: 'abc123',
      query: 'search terms',
      searchId: 'search?page=1',
      type: ActionTypes.REQUEST_SEARCH,
      windowId: 'foo',
    })).toEqual({
      foo: {
        abc123: {
          data: {
            'search?page=1': {
              isFetching: true,
            },
          },
          query: 'search terms',
          selectedContentSearchAnnotation: [],
        },
      },
    });
  });
  it('should handle RECEIVE_SEARCH', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            data: {
              'search?page=1': {
                isFetching: true,
              },
            },
            query: 'search terms',
          },
        },
      },
      {
        companionWindowId: 'abc123',
        searchId: 'search?page=1',
        searchJson: {
          content: 'anno stuff',
        },
        type: ActionTypes.RECEIVE_SEARCH,
        windowId: 'foo',
      },
    )).toMatchObject({
      foo: {
        abc123: {
          data: {
            'search?page=1': {
              isFetching: false,
              json: {},
            },
          },
          query: 'search terms',
        },
      },
    });
  });
  it('should handle RECEIVE_SEARCH_FAILURE', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            data: {
              'search?page=1': {
                isFetching: true,
              },
            },
            query: 'search terms',
          },
        },
      },
      {
        companionWindowId: 'abc123',
        error: "This institution didn't enable CORS.",
        searchId: 'search?page=1',
        type: ActionTypes.RECEIVE_SEARCH_FAILURE,
        windowId: 'foo',
      },
    )).toEqual({
      foo: {
        abc123: {
          data: {
            'search?page=1': {
              error: "This institution didn't enable CORS.",
              isFetching: false,
            },
          },
          query: 'search terms',
        },
      },
    });
  });

  it('should handle REMOVE_SEARCH', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            isFetching: false,
            json: {},
          },
          xyz321: {
            isFetching: false,
            json: {},
          },
        },
      },
      {
        companionWindowId: 'abc123',
        type: ActionTypes.REMOVE_SEARCH,
        windowId: 'foo',
      },
    )).toEqual({
      foo: {
        xyz321: {
          isFetching: false,
          json: {},
        },
      },
    });
  });

  it('should handle IMPORT_MIRADOR_STATE setting to clean state', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            isFetching: true,
          },
        },
      },
      {
        state: { whatever: true },
        type: ActionTypes.IMPORT_MIRADOR_STATE,
      },
    )).toEqual({});
  });
  it('should handle REMOVE_WINDOW setting to clean state', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            isFetching: true,
          },
        },
      },
      {
        type: ActionTypes.REMOVE_WINDOW,
        windowId: 'foo',
      },
    )).toEqual({});
  });
  it('should handle REMOVE_COMPANION_WINDOW setting to clean state', () => {
    expect(searchesReducer(
      {
        foo: {
          abc123: {
            isFetching: true,
          },
        },
      },
      {
        id: 'abc123',
        type: ActionTypes.REMOVE_COMPANION_WINDOW,
        windowId: 'foo',
      },
    )).toEqual({ foo: {} });
  });
  it('handles SELECT_ANNOTATION using selectedContentSearchAnnotationIds for relevant searches', () => {
    const irrelevantSearch = {
      data: {
        blah: { json: { resources: [{ '@id': 'not the id' }] } },
      },
      selectedContentSearchAnnotationIds: ['not the id'],
    };

    expect(searchesReducer({
      foo: {
        abc123: {
          data: {
            'search?page=xyz': {
              json: {
                resources: [{ '@id': 'someAnnotationId' }],
              },
            },
          },
          selectedContentSearchAnnotationIds: ['whatever'],
        },
        irrelevantSearch,
      },
    }, {
      annotationId: 'someAnnotationId',
      type: ActionTypes.SELECT_ANNOTATION,
      windowId: 'foo',
    })).toEqual({
      foo: {
        abc123: {
          data: {
            'search?page=xyz': {
              json: {
                resources: [{ '@id': 'someAnnotationId' }],
              },
            },
          },
          selectedContentSearchAnnotationIds: ['someAnnotationId'],
        },
        irrelevantSearch,
      },
    });
  });
});

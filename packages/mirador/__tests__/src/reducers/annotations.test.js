import { annotationsReducer } from '../../../src/state/reducers/annotations';
import ActionTypes from '../../../src/state/actions/action-types';

describe('annotation reducer', () => {
  it('should handle REQUEST_ANNOTATION', () => {
    expect(annotationsReducer({}, {
      annotationId: 'abc123',
      targetId: 'foo',
      type: ActionTypes.REQUEST_ANNOTATION,
    })).toEqual({
      foo: {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
      },
    });
  });
  it('should handle RECEIVE_ANNOTATION', () => {
    expect(annotationsReducer(
      {
        foo: {
          abc123: {
            id: 'abc123',
            isFetching: true,
          },
        },
      },
      {
        annotationId: 'abc123',
        annotationJson: {
          '@type': 'sc:AnnotationList',
          content: 'anno stuff',
          id: 'abc123',
        },
        targetId: 'foo',
        type: ActionTypes.RECEIVE_ANNOTATION,
      },
    )).toMatchObject({
      foo: {
        abc123: {
          id: 'abc123',
          isFetching: false,
          json: {},
        },
      },
    });
  });
  it('should be able to RECEIVE_ANNOTATION from multiple sources and merge state', () => {
    const firstReduction = annotationsReducer(
      {
        foo: {
          abc123: {
            id: 'abc123',
            isFetching: true,
          },
        },
      },
      {
        annotationId: 'efg456',
        annotationJson: {
          '@type': 'sc:AnnotationList',
          content: 'anno stuff',
          id: 'efg456',
        },
        targetId: 'foo',
        type: ActionTypes.RECEIVE_ANNOTATION,
      },
    );
    expect(firstReduction).toMatchObject({
      foo: {
        abc123: {
          id: 'abc123',
          isFetching: true,
        },
        efg456: {
          isFetching: false,
          json: {
            '@type': 'sc:AnnotationList',
            content: 'anno stuff',
            id: 'efg456',
          },
        },
      },
    });
    const secondReduction = annotationsReducer(
      firstReduction,
      {
        annotationId: 'abc123',
        annotationJson: {
          '@type': 'sc:AnnotationList',
          content: 'anno stuff',
          id: 'abc123',
        },
        targetId: 'foo',
        type: ActionTypes.RECEIVE_ANNOTATION,
      },
    );
    expect(secondReduction).toMatchObject({
      foo: {
        abc123: {
          id: 'abc123',
          isFetching: false,
          json: {
            '@type': 'sc:AnnotationList',
            content: 'anno stuff',
            id: 'abc123',
          },
        },
        efg456: {
          isFetching: false,
          json: {
            '@type': 'sc:AnnotationList',
            content: 'anno stuff',
            id: 'efg456',
          },
        },
      },
    });
  });
  it('should handle RECEIVE_ANNOTATION_FAILURE', () => {
    expect(annotationsReducer(
      {
        foo: {
          abc123: {
            id: 'abc123',
            isFetching: true,
          },
        },
      },
      {
        annotationId: 'abc123',
        error: "This institution didn't enable CORS.",
        targetId: 'foo',
        type: ActionTypes.RECEIVE_ANNOTATION_FAILURE,
      },
    )).toEqual({
      foo: {
        abc123: {
          error: "This institution didn't enable CORS.",
          id: 'abc123',
          isFetching: false,
        },
      },
    });
  });
  it('should handle IMPORT_MIRADOR_STATE setting to clean state', () => {
    expect(annotationsReducer({}, {
      state: { annotations: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({});
  });
});

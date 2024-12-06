import { windowsReducer } from '../../../src/state/reducers/windows';
import ActionTypes from '../../../src/state/actions/action-types';

describe('windows reducer', () => {
  it('should handle ADD_WINDOW', () => {
    expect(windowsReducer({}, {
      type: ActionTypes.ADD_WINDOW,
      window: { id: 'abc123' },
    })).toEqual({
      abc123: {
        id: 'abc123',
      },
    });
  });
  it('should handle REMOVE_WINDOW', () => {
    expect(windowsReducer({
      abc123: {
        id: 'abc123',
      },
      def456: {
        id: 'def456',
      },
    }, {
      type: ActionTypes.REMOVE_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      def456: {
        id: 'def456',
      },
    });
  });
  it('should handle MAXIMIZE_WINDOW', () => {
    const action = {
      type: ActionTypes.MAXIMIZE_WINDOW,
      windowId: 'abc123',
    };
    const before = {
      abc123: { maximized: false },
      abc321: { maximized: false },
    };
    const after = {
      abc123: { maximized: true },
      abc321: { maximized: false },
    };

    expect(windowsReducer(before, action)).toEqual(after);
  });
  it('should handle MINIMIZE_WINDOW', () => {
    const action = {
      type: ActionTypes.MINIMIZE_WINDOW,
      windowId: 'abc123',
    };
    const before = {
      abc123: { maximized: true },
      abc321: { maximized: false },
    };
    const after = {
      abc123: { maximized: false },
      abc321: { maximized: false },
    };

    expect(windowsReducer(before, action)).toEqual(after);
  });
  it('should handle TOGGLE_WINDOW_SIDE_BAR by toggling the sideBarOpen attribute', () => {
    const action = {
      type: ActionTypes.TOGGLE_WINDOW_SIDE_BAR,
      windowId: 'abc123',
    };
    const before = {
      abc123: { sideBarOpen: true },
      abc321: { sideBarOpen: false },
    };
    const after = {
      abc123: { sideBarOpen: false },
      abc321: { sideBarOpen: false },
    };

    expect(windowsReducer(before, action)).toEqual(after);
  });

  it('should handle SET_WINDOW_VIEW_TYPE by changing the view attribute', () => {
    const action = {
      type: ActionTypes.SET_WINDOW_VIEW_TYPE,
      viewType: 'book',
      windowId: 'abc123',
    };
    const before = {
      abc123: { view: 'single' },
      abc321: { view: 'book' },
    };
    const after = {
      abc123: { view: 'book' },
      abc321: { view: 'book' },
    };

    expect(windowsReducer(before, action)).toEqual(after);
  });

  it('should handle SET_CANVAS', () => {
    expect(windowsReducer({
      abc123: {
        canvasId: 'http://example.com/canvas/1',
        id: 'abc123',
        visibleCanvases: ['http://example.com/canvas/1'],
      },
      def456: {
        canvasId: 'http://example.com/canvas/1',
        id: 'def456',
      },
    }, {
      canvasId: 'http://example.com/canvas/5',
      type: ActionTypes.SET_CANVAS,
      visibleCanvases: ['http://example.com/canvas/5'],
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        canvasId: 'http://example.com/canvas/5',
        id: 'abc123',
        visibleCanvases: ['http://example.com/canvas/5'],
      },
      def456: {
        canvasId: 'http://example.com/canvas/1',
        id: 'def456',
      },
    });
  });

  describe('UPDATE_WINDOW', () => {
    it('updates an existing window', () => {
      const action = {
        id: 'abc123',
        payload: {
          baz: 33,
          foo: 11,
        },
        type: ActionTypes.UPDATE_WINDOW,
      };
      const beforeState = {
        abc123: {
          bar: 2,
          foo: 1,
        },
      };
      const expectedState = {
        abc123: {
          bar: 2,
          baz: 33,
          foo: 11,
        },
      };
      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  it('should handle SET_WINDOW_SIZE', () => {
    expect(windowsReducer({
      abc123: {
        id: 'abc123',
      },
      def456: {
        id: 'def456',
      },
    }, {
      payload: {
        size: {
          height: 200,
          width: 200,
          x: 20,
          y: 20,
        },
        windowId: 'abc123',
      },
      type: ActionTypes.SET_WINDOW_SIZE,
    })).toEqual({
      abc123: {
        height: 200,
        id: 'abc123',
        width: 200,
        x: 20,
        y: 20,
      },
      def456: {
        id: 'def456',
      },
    });
  });

  it('should handle UPDATE_WINDOW_POSITION', () => {
    expect(windowsReducer({
      abc123: {
        id: 'abc123',
      },
      def456: {
        id: 'def456',
      },
    }, {
      payload: {
        position: {
          x: 20,
          y: 20,
        },
        windowId: 'abc123',
      },
      type: ActionTypes.UPDATE_WINDOW_POSITION,
    })).toEqual({
      abc123: {
        id: 'abc123',
        x: 20,
        y: 20,
      },
      def456: {
        id: 'def456',
      },
    });
  });

  it('should handle ADD_COMPANION_WINDOW', () => {
    // on the right, just tacks the new id on
    expect(windowsReducer({
      abc123: {
        companionWindowIds: ['123'],
        id: 'abc123',
      },
    }, {
      id: 'xyz',
      payload: {
        position: 'right',
      },
      type: ActionTypes.ADD_COMPANION_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        companionWindowIds: ['123', 'xyz'],
        id: 'abc123',
      },
    });

    // on the left, sets some additional properties
    expect(windowsReducer({
      abc123: {
        companionWindowIds: [],
        id: 'abc123',
      },
    }, {
      id: 'xyz',
      payload: {
        content: 'content',
        position: 'left',
      },
      type: ActionTypes.ADD_COMPANION_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        companionAreaOpen: true,
        companionWindowIds: ['xyz'],
        id: 'abc123',
        sideBarPanel: 'content',
      },
    });
  });

  it('should handle UPDATE_COMPANION_WINDOW', () => {
    // opens the companion area to if the companion window was on the left
    expect(windowsReducer({
      abc123: {
        companionAreaOpen: false,
      },
    }, {
      id: 'xyz',
      payload: {
        position: 'left',
      },
      type: ActionTypes.UPDATE_COMPANION_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        companionAreaOpen: true,
      },
    });

    // does nothing if the companion window wasn't on the left
    expect(windowsReducer({
      abc123: {
        companionAreaOpen: false,
      },
    }, {
      id: 'xyz',
      payload: {
        position: 'right',
      },
      type: ActionTypes.UPDATE_COMPANION_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        companionAreaOpen: false,
      },
    });
  });

  it('should handle REMOVE_COMPANION_WINDOW', () => {
    // on the right, just tacks the new id on
    expect(windowsReducer({
      abc123: {
        companionWindowIds: ['123', 'xyz'],
        id: 'abc123',
      },
    }, {
      id: 'xyz',
      type: ActionTypes.REMOVE_COMPANION_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      abc123: {
        companionWindowIds: ['123'],
        id: 'abc123',
      },
    });
  });

  describe('SELECT_ANNOTATION', () => {
    it('sets the selectedAnnotationId', () => {
      const beforeState = { abc123: { selectedAnnotationId: 'bId' } };
      const action = {
        annotationId: 'aId',
        type: ActionTypes.SELECT_ANNOTATION,
        windowId: 'abc123',
      };
      const expectedState = {
        abc123: { selectedAnnotationId: 'aId' },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('DESELECT_ANNOTATION', () => {
    it('removes the given annotation Id', () => {
      const beforeState = { abc123: { selectedAnnotationId: 'asdf' } };
      const action = {
        type: ActionTypes.DESELECT_ANNOTATION,
        windowId: 'abc123',
      };
      const expectedState = {
        abc123: { selectedAnnotationId: undefined },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('TOGGLE_ANNOTATION_DISPLAY', () => {
    it('handles TOGGLE_ANNOTATION_DISPLAY by toggling the given window\'s displayAllAnnotation value', () => {
      const beforeState = { abc123: { highlightAllAnnotations: false } };
      const action = {
        type: ActionTypes.TOGGLE_ANNOTATION_DISPLAY, windowId: 'abc123',
      };
      const expectedState = {
        abc123: { highlightAllAnnotations: true },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('HOVER_ANNOTATION', () => {
    it('sets the highlightedAnnotation attribute on the given window', () => {
      const beforeState = { abc123: {} };
      const action = {
        annotationIds: ['aaa123'], type: ActionTypes.HOVER_ANNOTATION, windowId: 'abc123',
      };
      const expectedState = {
        abc123: { hoveredAnnotationIds: ['aaa123'] },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  it('should handle IMPORT_MIRADOR_STATE', () => {
    expect(windowsReducer({}, {
      state: { windows: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });

  describe('SHOW_COLLECTION_DIALOG', () => {
    it('handles SHOW_COLLECTION_DIALOG by toggling the given window\'s collection dialog', () => {
      const beforeState = { abc123: { collectionDialogOn: false } };
      const action = {
        collectionPath: [], manifestId: 'def456', type: ActionTypes.SHOW_COLLECTION_DIALOG, windowId: 'abc123',
      };
      const expectedState = {
        abc123: { collectionDialogOn: true, collectionManifestId: 'def456', collectionPath: [] },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('HIDE_COLLECTION_DIALOG', () => {
    it('handles HIDE_COLLECTION_DIALOG by toggling the given window\'s collection dialog', () => {
      const beforeState = {
        abc123: {
          collectionDialogOn: true, collectionManifestId: 'def456', collectionPath: [],
        },
      };
      const action = {
        type: ActionTypes.HIDE_COLLECTION_DIALOG,
        windowId: 'abc123',
      };

      const expectedState = {
        abc123: { collectionDialogOn: false, collectionManifestId: 'def456', collectionPath: [] },
      };

      expect(windowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });
});

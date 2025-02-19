import { workspaceReducer } from '../../../src/state/reducers/workspace';
import ActionTypes from '../../../src/state/actions/action-types';

describe('workspace reducer', () => {
  it('should handle UPDATE_WORKSPACE', () => {
    expect(workspaceReducer({}, {
      config: { type: 'mosaic' },
      type: ActionTypes.UPDATE_WORKSPACE,
    })).toEqual({
      type: 'mosaic',
    });
  });
  it('should handle FOCUS_WINDOW without position coordinates', () => {
    expect(workspaceReducer([], {
      type: ActionTypes.FOCUS_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      focusedWindowId: 'abc123',
      viewportPosition: {},
    });
  });
  it('should handle FOCUS_WINDOW', () => {
    expect(workspaceReducer([], {
      position: { x: 10, y: 50 },
      type: ActionTypes.FOCUS_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      focusedWindowId: 'abc123',
      viewportPosition: { x: 10, y: 50 },
    });
  });
  it('should handle ADD_WINDOW', () => {
    expect(workspaceReducer({ windowIds: ['asdf'] }, {
      type: ActionTypes.ADD_WINDOW,
      window: { id: 'abc123' },
    })).toEqual({
      focusedWindowId: 'abc123',
      windowIds: ['asdf', 'abc123'],
    });
  });
  it('should handle REMOVE_WINDOW (by doing nothing if multiple windows remain)', () => {
    expect(workspaceReducer({ focusedWindowId: 'asdf', windowIds: ['abc123', 'asdf'] }, {
      type: ActionTypes.REMOVE_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      focusedWindowId: 'asdf',
      windowIds: ['asdf'],
    });
  });
  it('should handle REMOVE_WINDOW (by focusing the window if it is the last one remaining)', () => {
    expect(workspaceReducer({ focusedWindowId: 'abc123', windowIds: ['abc123', 'def123'] }, {
      type: ActionTypes.REMOVE_WINDOW,
      windowId: 'abc123',
    })).toEqual({
      focusedWindowId: 'def123',
      windowIds: ['def123'],
    });
  });
  it('should handle SET_WORKSPACE_FULLSCREEN', () => {
    expect(workspaceReducer([], {
      isFullscreenEnabled: true,
      type: ActionTypes.SET_WORKSPACE_FULLSCREEN,
    })).toEqual({
      isFullscreenEnabled: true,
    });
  });
  it('should handle TOGGLE_ZOOM_CONTROLS', () => {
    expect(workspaceReducer([], {
      showZoomControls: true,
      type: ActionTypes.TOGGLE_ZOOM_CONTROLS,
    })).toEqual({
      showZoomControls: true,
    });
  });
  it('should handle UPDATE_WORKSPACE_MOSAIC_LAYOUT', () => {
    expect(workspaceReducer([], {
      layout: { foo: 'bar' },
      type: ActionTypes.UPDATE_WORKSPACE_MOSAIC_LAYOUT,
    })).toEqual({
      layout: { foo: 'bar' },
    });
  });
  it('should handle SET_WORKSPACE_ADD_VISIBILITY', () => {
    expect(workspaceReducer([], {
      isWorkspaceAddVisible: true,
      type: ActionTypes.SET_WORKSPACE_ADD_VISIBILITY,
    })).toEqual({
      isWorkspaceAddVisible: true,
    });
  });
  it('should handle SET_WORKSPACE_VIEWPORT_POSITION', () => {
    expect(workspaceReducer({ height: 5000, width: 5000 }, {
      payload: {
        position: {
          height: 50,
          width: 50,
          x: 50,
          y: 50,
        },
      },
      type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
    })).toEqual({
      height: 5000,
      viewportPosition: {
        height: 50,
        width: 50,
        x: 50,
        y: 50,
      },
      width: 5000,
    });
  });
  it('resizes the workspace if the SET_WORKSPACE_VIEWPORT_POSITION are beyond outside the workspace', () => {
    expect(workspaceReducer({ height: 500, width: 500 }, {
      payload: {
        position: {
          height: 50,
          width: 50,
          x: -255,
          y: 0,
        },
      },
      type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
    })).toEqual({
      height: 1000,
      viewportPosition: {
        height: 50,
        width: 50,
        x: -255,
        y: 0,
      },
      width: 1000,
    });
  });
  it('should handle SET_CONFIG', () => {
    expect(workspaceReducer({}, {
      config: { workspace: { new: 'stuff' } },
      type: ActionTypes.SET_CONFIG,
    })).toEqual({ new: 'stuff' });
  });
  it('should handle IMPORT_MIRADOR_STATE', () => {
    expect(workspaceReducer({}, {
      state: { workspace: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });
  it('should handle ActionTypes.TOGGLE_DRAGGING', () => {
    expect(workspaceReducer({ draggingEnabled: true }, {
      type: ActionTypes.TOGGLE_DRAGGING,
    })).toEqual({ draggingEnabled: false });
  });
});

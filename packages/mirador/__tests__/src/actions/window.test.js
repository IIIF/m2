import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('window actions', () => {
  describe('focusWindow', () => {
    it('should return correct action object', () => {
      const expectedAction = {
        pan: false,
        type: ActionTypes.FOCUS_WINDOW,
        windowId: 'window',
      };

      expect(actions.focusWindow('window')).toEqual(expectedAction);
    });
    it('should return the action object with panning', () => {
      const expectedAction = {
        pan: true,
        type: ActionTypes.FOCUS_WINDOW,
        windowId: 'window',
      };

      expect(actions.focusWindow('window', true)).toEqual(expectedAction);
    });
  });

  describe('addWindow', () => {
    it('should create a new window with merged defaults', () => {
      const options = {
        canvasIndex: 1,
        id: 'helloworld',
      };

      const expectedAction = {
        companionWindows: [
          {
            content: 'info',
            position: 'left',
            windowId: 'helloworld',
          },
          {
            content: 'thumbnailNavigation',
            position: 'off',
            windowId: 'helloworld',
          },
        ],
        elasticLayout: {
          height: 400,
          width: 480,
          x: 260,
          y: 300,
        },
        type: ActionTypes.ADD_WINDOW,
        window: {
          canvasIndex: 1,
          collectionIndex: 0,
          id: 'helloworld',
          manifestId: null,
          maximized: false,
          rangeId: null,
          rotation: null,
          sideBarPanel: 'info',
        },
      };

      const mockState = {
        config: {
          thumbnailNavigation: {
            defaultPosition: 'off',
          },
          window: {
            defaultSideBarPanel: 'info',
            sideBarOpenByDefault: false,
          },
        },
        workspace: { windowIds: ['a', 'b'] },
      };

      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.addWindow(options);

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];

      expect(action).toMatchObject(expectedAction);
      expect(action.window.companionWindowIds.length).toEqual(2);
      expect(action.window.companionWindowIds[0]).toEqual(action.companionWindows[0].id);
      expect(action.window.companionWindowIds[1]).toEqual(action.window.thumbnailNavigationId);
      expect(action.window.companionWindowIds[1]).toEqual(action.companionWindows[1].id);
    });
    it('creates a new window with additional companion windows', () => {
      const options = {
        canvasIndex: 1,
        companionWindows: [{
          content: 'attribution',
          position: 'right',
        }],
        id: 'helloworld',
      };

      const mockState = {
        companionWindows: {},
        config: {
          thumbnailNavigation: {},
          window: {
            defaultSideBarPanel: 'info',
          },
        },
        workspace: {},
      };

      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.addWindow(options);

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];

      expect(action.window.companionWindowIds.length).toEqual(3);
      expect(action.window.companionWindowIds[2]).toEqual(action.companionWindows[2].id);
      expect(action.companionWindows[2]).toMatchObject({ content: 'attribution', position: 'right' });
    });
    it('creates a new window without a default sidebar', () => {
      const options = {
        canvasIndex: 1,
        companionWindows: [],
        id: 'helloworld',
      };

      const mockState = {
        companionWindows: {},
        config: {
          thumbnailNavigation: {},
          window: {
            defaultSideBarPanel: null,
          },
        },
        workspace: {},
      };

      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.addWindow(options);

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];

      expect(action.window.companionWindowIds.length).toEqual(1);
      expect(action.companionWindows[0]).toMatchObject({ content: 'thumbnailNavigation' });
    });

    it('enables a window to override the panel being displayed', () => {
      const options = {
        id: 'helloworld',
        sideBarPanel: 'canvas',
      };
      const mockState = {
        companionWindows: {},
        config: {
          thumbnailNavigation: {},
          window: {
            defaultSideBarPanel: 'info',
          },
        },
        workspace: {},
      };
      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.addWindow(options);

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];
      expect(action.window.sideBarPanel).toEqual('canvas');
    });

    it('pulls a provided manifest out', () => {
      const options = {
        canvasIndex: 1,
        companionWindows: [],
        id: 'helloworld',
        manifest: { data: '123' },
      };

      const mockState = {
        config: {
          thumbnailNavigation: {},
          window: {
            defaultSideBarPanel: null,
          },
        },
        workspace: {},
      };

      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.addWindow(options);

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];

      expect(action.manifest).toEqual({ data: '123' });
    });
  });

  describe('updateWindow', () => {
    it('should return correct action object', () => {
      const payload = {
        bar: 2,
        foo: 1,
      };
      const action = actions.updateWindow('window-123', payload);
      expect(action.type).toBe(ActionTypes.UPDATE_WINDOW);
      expect(action.id).toBe('window-123');
      expect(action.payload).toEqual(payload);
    });
  });

  describe('removeWindow', () => {
    it('should return correct action object', () => {
      const action = actions.removeWindow('window-123');
      expect(action.type).toBe(ActionTypes.REMOVE_WINDOW);
      expect(action.windowId).toBe('window-123');
    });
  });

  describe('maximizeWindow', () => {
    it('maximizes the window', () => {
      const maxWindowId = 'abc123';
      const maximizeWindowAction = {
        type: ActionTypes.MAXIMIZE_WINDOW,
        windowId: maxWindowId,
      };
      expect(actions.maximizeWindow(maxWindowId)).toEqual(maximizeWindowAction);
    });
  });

  describe('minimizeWindow', () => {
    it('minimizes the window and renders current layout', () => {
      const minWindowId = 'abc123';
      const minimizeWindowAction = {
        type: ActionTypes.MINIMIZE_WINDOW,
        windowId: minWindowId,
      };
      expect(actions.minimizeWindow(minWindowId)).toEqual(minimizeWindowAction);
    });
  });

  describe('toggleWindowSideBar', () => {
    it('returns the appropriate action type', () => {
      const id = 'abc123';
      const expectedAction = {
        type: ActionTypes.TOGGLE_WINDOW_SIDE_BAR,
        windowId: id,
      };
      expect(actions.toggleWindowSideBar(id)).toEqual(expectedAction);
    });
  });

  describe('setCompanionAreaOpen', () => {
    it('returns the appropriate action type', () => {
      const id = 'abc123';
      const expectedAction = {
        id,
        payload: { companionAreaOpen: true },
        type: ActionTypes.UPDATE_WINDOW,
      };
      expect(actions.setCompanionAreaOpen(id, true)).toEqual(expectedAction);
    });
  });

  describe('setWindowThumbnailPosition', () => {
    it('returns the appropriate action type', () => {
      const id = 'abc123';

      const expectedAction = {
        id,
        payload: { position: 'right' },
        type: ActionTypes.UPDATE_COMPANION_WINDOW,
      };

      const mockState = {
        windows: {
          somewindow: { thumbnailNavigationId: id },
        },
      };

      const mockDispatch = vi.fn(() => ({}));
      const mockGetState = vi.fn(() => mockState);
      const thunk = actions.setWindowThumbnailPosition('somewindow', 'right');

      thunk(mockDispatch, mockGetState);

      const action = mockDispatch.mock.calls[0][0];
      expect(action).toEqual(expectedAction);
    });
  });

  describe('setWindowViewType', () => {
    it('returns the appropriate action type', () => {
      const id = 'abc123';
      const expectedAction = {
        type: ActionTypes.SET_WINDOW_VIEW_TYPE,
        viewType: 'book',
        windowId: id,
      };
      expect(actions.setWindowViewType(id, 'book')).toEqual(expectedAction);
    });
  });
});

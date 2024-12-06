import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('workspace actions', () => {
  describe('updateWorkspace', () => {
    it('updates the workspace settings', () => {
      const options = { foo: 'bar' };

      const expectedAction = {
        config: { foo: 'bar' },
        type: ActionTypes.UPDATE_WORKSPACE,
      };
      expect(actions.updateWorkspace(options)).toEqual(expectedAction);
    });
  });
  describe('updateWorkspaceMosaicLayout', () => {
    it('should updates mosaic layout', () => {
      const options = { foo: 'bar' };

      const expectedAction = {
        layout: { foo: 'bar' },
        type: ActionTypes.UPDATE_WORKSPACE_MOSAIC_LAYOUT,
      };
      expect(actions.updateWorkspaceMosaicLayout(options)).toEqual(expectedAction);
    });
  });
  describe('toggleZoomControls', () => {
    it('should set the zoom control visibility', () => {
      const expectedAction = {
        showZoomControls: true,
        type: ActionTypes.TOGGLE_ZOOM_CONTROLS,
      };
      expect(actions.toggleZoomControls(true)).toEqual(expectedAction);
    });
  });
  describe('setWorkspaceAddVisibility', () => {
    it('should set the workspace add visibility', () => {
      const expectedAction = {
        isWorkspaceAddVisible: true,
        type: ActionTypes.SET_WORKSPACE_ADD_VISIBILITY,
      };
      expect(actions.setWorkspaceAddVisibility(true)).toEqual(expectedAction);
    });
  });
  describe('setWorkspaceViewportDimensions', () => {
    it('should set the workspace add visibility', () => {
      const expectedAction = {
        payload: {
          position: {
            height: 25,
            width: 20,
          },
        },
        type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
      };
      expect(actions.setWorkspaceViewportDimensions({
        height: 25,
        width: 20,
      })).toEqual(expectedAction);
    });
  });
  describe('setWorkspaceViewportPosition', () => {
    it('should set the workspace add visibility', () => {
      const expectedAction = {
        payload: {
          position: {
            x: 20,
            y: 20,
          },
        },
        type: ActionTypes.SET_WORKSPACE_VIEWPORT_POSITION,
      };
      expect(actions.setWorkspaceViewportPosition({
        x: 20,
        y: 20,
      })).toEqual(expectedAction);
    });
  });
  describe('toggleDraggingEnabled', () => {
    it('should set the draggingEnabled to false', () => {
      const expectedAction = {
        type: ActionTypes.TOGGLE_DRAGGING,
      };
      expect(actions.toggleDraggingEnabled()).toEqual(expectedAction);
    });
  });
});

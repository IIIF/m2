import {
  render, screen, fireEvent, waitFor,
} from '@tests/utils/test-utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Workspace } from '../../../src/components/Workspace';

/**
 * Utility function to create a Worksapce
 * component with all required props set
*/
function createWrapper(props) {
  return render(
    <DndProvider backend={HTML5Backend}>
      <Workspace
        classes={{}}
        isWorkspaceControlPanelVisible
        windowIds={['1', '2']}
        workspaceId="foo"
        workspaceType="mosaic"
        {...props}
      />
    </DndProvider>,
    {
      preloadedState: {
        windows: { 1: {}, 2: {} },
        workspace: {
          viewportPosition: {
            height: 10, width: 10, x: 0, y: 0,
          },
        },
      },
    },
  );
}

/* eslint-disable testing-library/no-container, testing-library/no-node-access */
describe('Workspace', () => {
  describe('if workspace type is elastic', () => {
    it('should render <WorkspaceElastic/> properly', () => {
      const { container } = createWrapper({ workspaceType: 'elastic' });

      expect(screen.getByRole('heading', { name: 'Mirador viewer' })).toBeInTheDocument();

      expect(container.querySelector('.mirador-workspace.react-draggable')).toBeInTheDocument();
    });
  });
  describe('if workspace type is mosaic', () => {
    it('should render <WorkspaceMosaic/> properly', () => {
      const { container } = createWrapper();

      expect(screen.getByRole('heading', { name: 'Mirador viewer' })).toBeInTheDocument();

      expect(container.querySelector('.mirador-mosaic')).toBeInTheDocument();
      expect(container.querySelector('.drop-target-container')).toBeInTheDocument();
    });
  });
  describe('if workspace type is unknown', () => {
    it('should render <Window/> components as list', () => {
      createWrapper({ workspaceType: 'bubu' });

      expect(screen.getByRole('heading', { name: 'Mirador viewer' })).toBeInTheDocument();
      expect(screen.getAllByLabelText('Window:')).toHaveLength(2);
    });
  });
  describe('if any windows are maximized', () => {
    it('should render only maximized <Window/> components', () => {
      createWrapper({ maximizedWindowIds: ['1'] });

      expect(screen.getByRole('heading', { name: 'Mirador viewer' })).toBeInTheDocument();
      expect(screen.getByLabelText('Window:')).toHaveAttribute('id', '1');
    });
  });

  describe('if there are no windows', () => {
    it('should render placeholder content', () => {
      createWrapper({ windowIds: [] });

      expect(screen.getByRole('heading', { name: 'Mirador viewer' })).toBeInTheDocument();
      expect(screen.getByText('Welcome to Mirador')).toHaveClass('MuiTypography-h1');
    });
  });

  describe('drag and drop', () => {
    it('adds a new catalog entry from a manifest', async () => {
      const manifestJson = '{ "data": "123" }';

      const addWindow = vi.fn();

      const { container } = createWrapper({ addWindow });
      const dropTarget = container.querySelector('.mirador-workspace-viewport');

      const file = new File([manifestJson], 'manifest.json', { type: 'application/json' });
      const dataTransfer = {
        files: [file],
        types: ['Files'],
      };

      fireEvent.dragStart(dropTarget, { dataTransfer });
      fireEvent.dragEnter(dropTarget, { dataTransfer });
      fireEvent.dragOver(dropTarget, { dataTransfer });
      fireEvent.drop(dropTarget, { dataTransfer });

      await waitFor(() => expect(addWindow).toHaveBeenCalledWith({ manifest: manifestJson, manifestId: expect.stringMatching(/^[0-9a-f-]+$/) }));
    });

    it('adds a new catalog entry from a IIIF drag and drop icon', () => {
      const manifestJson = '{ "data": "123" }';

      const addWindow = vi.fn();

      const { container } = createWrapper({ addWindow, allowNewWindows: false });

      const dropTarget = container.querySelector('.mirador-workspace-viewport');

      const file = new File([manifestJson], 'manifest.json', { type: 'application/json' });
      const dataTransfer = {
        files: [file],
        types: ['Files'],
      };

      fireEvent.dragStart(dropTarget, { dataTransfer });
      fireEvent.dragEnter(dropTarget, { dataTransfer });
      fireEvent.dragOver(dropTarget, { dataTransfer });
      fireEvent.drop(dropTarget, { dataTransfer });

      expect(addWindow).not.toHaveBeenCalled();
    });
  });
});

import { render, screen, within } from '@tests/utils/test-utils';
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';

import { WorkspaceArea } from '../../../src/components/WorkspaceArea';

/** */
function createWrapper(props) {
  return render(
    <DndProvider backend={TestBackend}>
      <WorkspaceArea
        isWorkspaceControlPanelVisible
        classes={{}}
        lang="en"
        {...props}
      />
    </DndProvider>,
  );
}

describe('WorkspaceArea', () => {
  it('should render outer element correctly', () => {
    createWrapper();

    expect(screen.getByRole('main')).toHaveClass('mirador-viewer');
    expect(screen.getByRole('main')).toHaveAttribute('lang', 'en');
  });

  it('should render all needed elements', () => {
    const { container } = createWrapper();

    expect(screen.getByRole('button', { name: 'Jump to window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace options' })).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Mirador viewer');
    expect(screen.getByRole('main')).toHaveTextContent('Welcome to Mirador');

    expect(container.querySelector('.mirador-background-plugin-area')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });

  it('should not render WorkspaceControlPanel when isWorkspaceControlPanelVisible is false', () => {
    createWrapper({ isWorkspaceControlPanelVisible: false });

    expect(screen.queryByRole('button', { name: 'Jump to window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Workspace settings' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Workspace options' })).not.toBeInTheDocument();
  });

  describe('with isWorkspaceAddVisible', () => {
    it('should render WorkspaceAdd when isWorkspaceAddVisible is true', () => {
      createWrapper({ isWorkspaceAddVisible: true });

      expect(screen.queryByRole('heading', { level: 1, name: 'Mirador viewer' })).not.toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveTextContent('Your resource list is empty');
      expect(within(screen.getByRole('main')).getByRole('button', { name: 'Add resource' })).toBeInTheDocument();
    });
  });
});

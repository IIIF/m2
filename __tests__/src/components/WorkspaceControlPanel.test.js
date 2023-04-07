import { render, screen } from 'test-utils';

import { WorkspaceControlPanel } from '../../../src/components/WorkspaceControlPanel';

describe('WorkspaceControlPanel', () => {
  beforeEach(() => {
    render(
      <WorkspaceControlPanel
        t={key => key}
      />,
    );
  });

  it('renders without an error', () => {
    expect(screen.getByRole('navigation', { name: 'workspaceNavigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'addResource' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'listAllOpenWindows' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'workspaceMenu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'workspaceOptions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'aboutMirador' })).toHaveAttribute('href', 'https://projectmirador.org');
  });
});

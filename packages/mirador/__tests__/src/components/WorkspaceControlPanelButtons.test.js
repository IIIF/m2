import { render, screen } from '@tests/utils/test-utils';

import { WorkspaceControlPanelButtons } from '../../../src/components/WorkspaceControlPanelButtons';

describe('WorkspaceControlPanelButtons', () => {
  beforeEach(() => {
    render(<WorkspaceControlPanelButtons />);
  });

  it('render all needed elements', () => {
    expect(screen.getByRole('button', { name: 'Jump to window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Workspace options' })).toBeInTheDocument();
  });
});

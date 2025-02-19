import { screen, render } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceExport } from '../../../src/components/WorkspaceExport';

describe('WorkspaceExport', () => {
  let user;
  let handleClose = vi.fn();
  let mockState;

  beforeEach(() => {
    user = userEvent.setup();
    handleClose = vi.fn();
    mockState = {
      companionWindows: {},
      config: {},
      elasticLayout: {},
      viewers: {},
      windows: {},
      workspace: {},
    };

    render(
      <WorkspaceExport
        open
        handleClose={handleClose}
        exportableState={mockState}
      />,
    );
  });

  it('renders without an error', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders sizing props', () => {
    expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthSm');
  });

  it('is closable by clicking the cancel button', async () => {
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('reveals a snackbar on copy', async () => {
    // jsdom doesn't support the clipboard API or prompt (used as a fallback)
    // so we mock the prompt at least to avoid a warning in the test output
    vi.spyOn(window, 'prompt').mockImplementation(() => true);

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('alert')).toHaveTextContent('The workspace configuration was copied to your clipboard');

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders an exportable version of state', async () => {
    await user.click(screen.getByRole('button', { name: 'View workspace configuration' }));
    expect(screen.getByRole('region').querySelector('pre')).toHaveTextContent( // eslint-disable-line testing-library/no-node-access
      '{ "companionWindows": {}, "config": {}, "elasticLayout": {}, "viewers": {}, "windows": {}, "workspace": {} }',
    );
  });
});

import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceMenu } from '../../../src/components/WorkspaceMenu';

/** */
function createShallow(props) {
  render(<div data-testid="container" />);

  return render(
    <WorkspaceMenu
      anchorEl={screen.getByTestId('container')}
      open
      showThemePicker
      {...props}
    />,
  );
}

describe('Workspace settings', () => {
  let handleClose;
  const showZoomControls = false;
  let toggleZoomControls;

  beforeEach(() => {
    handleClose = vi.fn();
    toggleZoomControls = vi.fn();
  });

  it('renders without an error', () => {
    createShallow({ handleClose, showZoomControls, toggleZoomControls });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes the current menu when opening a submenu', async () => {
    const user = userEvent.setup();
    createShallow({ handleClose, showZoomControls, toggleZoomControls });

    await user.click(screen.getByRole('menuitem', { name: 'Show zoom controls' }));
    expect(handleClose).toBeCalled();
  });

  it('disables zoom controls if the workspaceAdd UI is visible', () => {
    createShallow({
      handleClose, isWorkspaceAddVisible: true, showZoomControls, toggleZoomControls,
    });

    expect(screen.getByRole('menuitem', { name: 'Show zoom controls' })).toHaveAttribute('aria-disabled', 'true');
  });

  describe('handleZoomToggleClick', () => {
    it('resets the anchor state', async () => {
      const user = userEvent.setup();

      createShallow({ handleClose, showZoomControls, toggleZoomControls });

      await user.click(screen.getByRole('menuitem', { name: 'Show zoom controls' }));

      expect(toggleZoomControls).toBeCalledWith(true);
    });
  });
});

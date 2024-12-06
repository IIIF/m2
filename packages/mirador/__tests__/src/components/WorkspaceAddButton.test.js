import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceAddButton } from '../../../src/components/WorkspaceAddButton';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WorkspaceAddButton
      classes={{}}
      setWorkspaceAddVisibility={() => {}}
      useExtendedFab
      {...props}
    />,
  );
}

vi.mock('@mui/material/useMediaQuery', () => ({ default: vi.fn().mockReturnValue(true) }));

describe('WorkspaceAddButton', () => {
  it('renders a button to open the load window area', async () => {
    const user = userEvent.setup();
    const setWorkspaceAddVisibility = vi.fn();
    createWrapper({ isWorkspaceAddVisible: false, setWorkspaceAddVisibility });

    await user.click(screen.getByRole('button', { name: 'Start Here' }));

    expect(setWorkspaceAddVisibility).toHaveBeenCalledWith(true);
  });

  it('renders a button to close the load window area', async () => {
    const user = userEvent.setup();
    const setWorkspaceAddVisibility = vi.fn();
    createWrapper({ isWorkspaceAddVisible: true, setWorkspaceAddVisibility });

    await user.click(screen.getByRole('button', { name: 'Close resource list' }));
    expect(setWorkspaceAddVisibility).toHaveBeenCalledWith(false);
  });

  describe('when the useExtendedFab prop is set', () => {
    it('is styled using the extended variant', () => {
      createWrapper({ useExtendedFab: true });

      expect(screen.getByRole('button', { name: 'Start Here' })).toHaveClass('MuiFab-extended');
    });
  });
});

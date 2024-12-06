import {
  render, screen, waitFor,
} from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceSelectionDialog } from '../../../src/components/WorkspaceSelectionDialog';

describe('WorkspaceSelectionDialog', () => {
  let handleClose;
  let updateWorkspace;

  /**
   * create wrapper
   * @param {*} props additional properties
   */
  function createWrapper(props) {
    handleClose = vi.fn();
    updateWorkspace = vi.fn();

    return render(
      <WorkspaceSelectionDialog
        classes={{ list: 'list' }}
        open
        handleClose={handleClose}
        updateWorkspace={updateWorkspace}
        workspaceType="elastic"
        {...props}
      />,
    );
  }

  it('renders without an error', () => {
    createWrapper();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Elastic/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Mosaic/ })).toBeInTheDocument();
  });

  it('sends the updateConfig and handleClose props on workspace selection', async () => {
    const user = userEvent.setup();
    createWrapper();

    user.click(screen.getByRole('menuitem', { name: /Elastic/ }));
    await waitFor(() => expect(updateWorkspace).toHaveBeenLastCalledWith({ type: 'elastic' }));

    user.click(screen.getByRole('menuitem', { name: /Mosaic/ }));
    await waitFor(() => expect(updateWorkspace).toHaveBeenLastCalledWith({ type: 'mosaic' }));
    await waitFor(() => expect(handleClose).toHaveBeenCalledTimes(2));
  });

  describe('inital focus', () => {
    it('sets an onEntered prop on the Dialog that focuses the selected item', () => {
      createWrapper();

      const menuItem = screen.getByRole('menuitem', { name: /Elastic/ });
      expect(menuItem).toHaveFocus();
    });
  });
});

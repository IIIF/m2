import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceOptionsMenu } from '../../../src/components/WorkspaceOptionsMenu';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <div>
      <WorkspaceOptionsMenu
        handleClose={() => {}}
        {...props}
      />
      ,
      ,
    </div>
  );
}

/** create anchor element */
function createAnchor() {
  return render(
    <button type="button" data-testid="menu-trigger-button">Button</button>,
  );
}

describe('WorkspaceOptionsMenu', () => {
  let user;
  beforeEach(() => {
    createAnchor();
    user = userEvent.setup();
  });

  it('renders all needed elements when open', () => {
    render(<Subject anchorEl={screen.getByTestId('menu-trigger-button')} open />);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('Export workspace');
    expect(menuItems[1]).toHaveTextContent('Import workspace');
  });

  it('does not display unless open', () => {
    render(<Subject open={false} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders the export dialog when export option is clicked', async () => {
    render(<Subject anchorEl={screen.getByTestId('menu-trigger-button')} open />);
    expect(screen.queryByRole('heading', { name: 'Export workspace' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Export workspace' }));
    expect(screen.getByRole('heading', { name: 'Export workspace' })).toBeInTheDocument();
  });

  it('renders the import dialog when import option is clicked', async () => {
    render(<Subject anchorEl={screen.getByTestId('menu-trigger-button')} open />);
    expect(screen.queryByRole('heading', { name: 'Import workspace' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Import workspace' }));
    expect(screen.getByRole('heading', { name: 'Import workspace' })).toBeInTheDocument();
  });

  it('fires the correct callbacks on menu close', async () => {
    const handleClose = vi.fn();
    render(<Subject anchorEl={screen.getByTestId('menu-trigger-button')} handleClose={handleClose} open />);

    // click a menu item should close the menu
    const menuItems = screen.getAllByRole('menuitem');
    await user.click(menuItems[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

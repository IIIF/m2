import { render, screen, within } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowTopMenu } from '../../../src/components/WindowTopMenu';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <div>
      <WindowTopMenu
        windowId="xyz"
        handleClose={() => {}}
        toggleDraggingEnabled={() => {}}
        {...props}
      />
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

describe('WindowTopMenu', () => {
  it('renders all needed elements when open', () => {
    createAnchor();
    render(<Subject anchorEl={screen.getByTestId('menu-trigger-button')} open />);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    const menuSections = within(screen.getByRole('menu')).getAllByRole('presentation');
    expect(menuSections).toHaveLength(2);

    expect(menuSections[0]).toHaveTextContent('View');
    const menus = within(screen.getByRole('menu')).getAllByRole('menubar');

    const viewItems = within(menus[0]).getAllByRole('menuitemradio');
    expect(viewItems).toHaveLength(2);
    expect(viewItems[0]).toHaveTextContent('Single');
    expect(viewItems[1]).toHaveTextContent('Gallery');

    expect(menuSections[1]).toHaveTextContent('Thumbnails');
    const thumbnailItems = within(menus[1]).getAllByRole('menuitemradio');
    expect(thumbnailItems).toHaveLength(3);
    expect(thumbnailItems[0]).toHaveTextContent('Off');
    expect(thumbnailItems[1]).toHaveTextContent('Bottom');
    expect(thumbnailItems[2]).toHaveTextContent('Right');
  });

  it('does not display unless open', () => {
    createAnchor();
    render(<Subject open={false} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('fires the correct callbacks on menu close', async () => {
    const user = userEvent.setup();
    createAnchor();
    const handleClose = vi.fn();
    const toggleDraggingEnabled = vi.fn();
    const anchorEl = screen.getByTestId('menu-trigger-button');

    render(<Subject
      anchorEl={anchorEl}
      handleClose={handleClose}
      open
      toggleDraggingEnabled={toggleDraggingEnabled}
    />);

    // click a menu item should close the menu
    const menuItems = screen.getAllByRole('menuitemradio');
    await user.click(menuItems[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(toggleDraggingEnabled).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowTopMenuButton } from '../../../src/components/WindowTopMenuButton';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <WindowTopMenuButton
      windowId="xyz"
      data-testid="test"
      classes={{ ctrlBtnSelected: 'ctrlBtnSelected' }}
      {...props}
    />
  );
}

describe('WindowTopMenuButton', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the button element', () => {
    render(<Subject />);
    expect(screen.getByLabelText('Window views & thumbnail display')).toBeInTheDocument();
  });

  it('toggles open/close of <WindowTopMenu/> when clicked', async () => {
    render(<Subject />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Window views & thumbnail display'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // click something else to close the menu (the windowMenu button is hidden at this point)
    await user.click(screen.getAllByRole('menuitemradio')[0]);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('the open attribute of the button is null without being clicked', async () => {
    render(<Subject />);
    // without a click, the button is not open and therefore doesn't have aria-owns attr
    expect(screen.getByLabelText('Window views & thumbnail display')).not.toHaveAttribute('aria-owns'); // eslint-disable-line testing-library/no-node-access
  });

  it('the open attribute of the button is applied once it is clicked', async () => {
    render(<Subject />);
    await user.click(screen.getByLabelText('Window views & thumbnail display'));
    // when 'open' is true, aria-owns is set to the id of the window
    expect(screen.getByLabelText('Window views & thumbnail display')).toHaveAttribute('aria-owns'); // eslint-disable-line testing-library/no-node-access
  });
});

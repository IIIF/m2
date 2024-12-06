import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WorkspaceOptionsButton } from '../../../src/components/WorkspaceOptionsButton';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <div>
      <WorkspaceOptionsButton
        classes={{}}
        {...props}
      />
      ,
      ,
    </div>
  );
}

describe('WorkspaceOptionsButton', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the button', () => {
    render(<Subject />);
    expect(screen.getByLabelText('Workspace options')).toBeInTheDocument();
  });

  it('toggles open/close of <WorkspaceOptionsMenu /> when clicked', async () => {
    render(<Subject />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Workspace options'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    // click something else to close the menu (the windowMenu button is hidden at this point)
    await user.click(screen.getAllByRole('menuitem')[0]);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

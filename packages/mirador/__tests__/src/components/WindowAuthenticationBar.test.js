import { render, screen, within } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { config } from 'react-transition-group'; // eslint-disable-line import/no-extraneous-dependencies
import { WindowAuthenticationBar } from '../../../src/components/WindowAuthenticationBar';

/**
 * Helper function to create a shallow wrapper around AuthenticationLogout
 */
function createWrapper(props) {
  return render(
    <WindowAuthenticationBar
      classes={{}}
      hasLogoutService
      confirmButton="Login"
      label="Log in to see more"
      onConfirm={() => {}}
      status="ok"
      windowId="w"
      {...props}
    />,
  );
}

/* eslint-disable testing-library/no-node-access */
describe('AuthenticationControl', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });
  it('renders nothing if the user is logged in and there is no logout service', () => {
    createWrapper({ hasLogoutService: false });
    // no logout service renders a single empty div
    expect(document.querySelectorAll('div')).toHaveLength(1);
  });

  it('renders a non-collapsing version if there is no description', () => {
    createWrapper({ description: undefined, header: undefined });
    expect(screen.getByText('Log in to see more', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Login');
  });

  it('renders a collapsable version if there is a description', async () => {
    createWrapper({ description: 'long description', header: 'Login to Example Institution' });
    const continueBtn = document.querySelectorAll('.MuiButtonBase-root')[0];
    const collapseEl = document.querySelector('.MuiCollapse-hidden');

    // disable transition animations for easier testing of the Mui Collapse open/close state
    config.disabled = true;
    // initial collapsed state: Presence of continue button text. Hidden cancelBtn, loginBtn, and description
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    expect(within(collapseEl).getByText('long description')).not.toBeVisible();
    // click to expand
    await user.click(continueBtn);
    // expanded state: Removal of continue button text from DOM. Visible cancelBtn, loginBtn, and description
    expect(screen.queryByText('Continue')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Login' })).toBeVisible();
    expect(within(collapseEl).getByText('long description')).toBeVisible();
    expect(collapseEl).toHaveClass('MuiCollapse-entered');

    // click the cancel button to collapse
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    // collapsed state: Presence of continue button text. Hidden cancelBtn, loginBtn, and description
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();
    expect(within(collapseEl).getByText('long description')).not.toBeVisible();
    // re-enable transition animation
    config.disabled = false;
  });

  it('triggers an action when the confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    createWrapper({ onConfirm });
    await user.click(screen.getByRole('button', { name: 'Login' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('allows plugins to opt out of HTML sanitization (say, for absolutely trusted sources)', async () => {
    const description = <em>long html description</em>;
    createWrapper({ description, header: 'header', ruleSet: false });
    await screen.findByText('long html description', { selector: 'em' });
  });
});

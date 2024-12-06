import { render, screen, within } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';

import { WindowListButton } from '../../../src/components/WindowListButton';

/**
 * Helper function to create a shallow wrapper around WindowListButton
 */
function createWrapper(props) {
  return render(
    <WindowListButton
      windowCount={3}
      {...props}
    />,
    { preloadedState: { workspace: { windowIds: ['abc123'] } } },
  );
}

describe('WindowListButton', () => {
  it('shows the window count as a badge on the button', () => {
    createWrapper();

    expect(within(screen.getByRole('button')).getByText('3', { container: '.MuiBadge-badge' })).toBeInTheDocument();
  });

  it('disabled the MiradorMenuButton if the disabled prop is true', () => {
    createWrapper({ disabled: true });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('toggles the WindowList comonent when clicking on the MiradorMenuButton', async () => {
    const user = userEvent.setup();
    createWrapper();
    await user.click(screen.getByRole('button'));

    expect(screen.getByText('Current open windows', { container: '.MuiListSubheader-root' })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: '[Untitled]' }));

    expect(screen.queryByText('Current open windows', { container: '.MuiListSubheader-root' })).not.toBeInTheDocument();
  });
});

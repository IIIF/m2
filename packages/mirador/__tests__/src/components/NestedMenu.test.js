import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { NestedMenu } from '../../../src/components/NestedMenu';

/**
 * Helper function to wrap creating a NestedMenu component
*/
function createWrapper(props) {
  return render(
    <NestedMenu
      icon="GivenIcon"
      label="GivenLabel"
      {...props}
    >
      GivenChildren
    </NestedMenu>,
  );
}

describe('NestedMenu', () => {
  it('renders the given icon wrapped in a MUI ListItemIcon', () => {
    createWrapper();

    expect(screen.getByText('GivenIcon')).toHaveClass('MuiListItemIcon-root');
  });

  it('does not render a ListItemIcon if no icon prop is passed', () => {
    createWrapper({ icon: null });

    expect(screen.queryByText('GivenIcon')).not.toBeInTheDocument();
  });

  it('renders the given label wrapped in a MUI Typography', () => {
    createWrapper();

    expect(screen.getByText('GivenLabel')).toHaveClass('MuiTypography-body1');
  });

  it('toggles the local open state when clicking the MenuItem', async () => {
    const user = userEvent.setup();
    createWrapper();

    expect(screen.queryByText('GivenChildren')).not.toBeInTheDocument();

    await user.click(screen.getByRole('menuitem'));
    expect(screen.getByText('GivenChildren')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem'));
    expect(screen.queryByText('GivenChildren')).not.toBeInTheDocument();
  });

  it('spreads options to the MenuItem', () => {
    createWrapper({ 'data-testid': 'subject' });

    expect(screen.getByTestId('subject')).toBeInTheDocument();
  });
});

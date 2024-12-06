import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MiradorMenuButton } from '../../../src/components/MiradorMenuButton';

/**
 * Helper function to wrap creating a MiradorMenuButton component
*/
function createWrapper(props) {
  return render(
    <MiradorMenuButton aria-label="The Label" {...props}>
      icon
    </MiradorMenuButton>,
  );
}

describe('MiradorMenuButton', () => {
  it('renders the given a Tooltip -> IconLabel -> Icon', async () => {
    const user = userEvent.setup();

    createWrapper();

    expect(screen.getByRole('button')).toHaveAccessibleName('The Label');
    expect(screen.getByRole('button')).toHaveTextContent('icon');

    await user.hover(screen.getByRole('button'));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('The Label');
  });

  it('does not render the Tooltip if the button is disabled', () => {
    createWrapper({ disabled: true });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('spreads TooltipProps to the Tooltip component', async () => {
    const user = userEvent.setup();
    createWrapper({ TooltipProps: { placement: 'left-start' } });

    await user.hover(screen.getByRole('button'));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('The Label');

    expect(screen.getByText('The Label')).toHaveClass('MuiTooltip-tooltipPlacementLeft');
  });

  it('spreads any other props to IconButton', () => {
    createWrapper({ color: 'inherit' });

    expect(screen.getByRole('button')).toHaveClass('MuiIconButton-colorInherit');
  });

  it('wraps the child component in a badge if the badge prop is set to true (and passes BadgeProps)', () => {
    createWrapper({ badge: true, BadgeProps: { badgeContent: 3 } });

    expect(screen.getByRole('button')).toHaveTextContent('icon3');
    expect(screen.getByText('3')).toHaveClass('MuiBadge-badge');
  });
});

import { render, screen } from '@tests/utils/test-utils';
import { ScrollIndicatedDialogContent } from '../../../src/components/ScrollIndicatedDialogContent';

/** Utility function to wrap  */
function createWrapper(props) {
  return render(
    <ScrollIndicatedDialogContent
      data-testid="subject"
      {...props}
    />,
  );
}

describe('ScrollIndicatedDialogContent', () => {
  it('renders a DialogContnet component passing props', () => {
    createWrapper({ randomprop: 'randomPropValue' });

    expect(screen.getByTestId('subject')).toHaveAttribute('randomprop', 'randomPropValue');
  });

  it('joins an incoming className prop with our className', () => {
    createWrapper({ className: 'upstreamClassName' });
    expect(screen.getByTestId('subject')).toHaveClass('upstreamClassName');
  });
});

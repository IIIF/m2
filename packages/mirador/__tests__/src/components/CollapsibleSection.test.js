import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { CollapsibleSection } from '../../../src/components/CollapsibleSection';

/**
 * Helper function to create a shallow wrapper around CollapsibleSection
 */
function createWrapper(props) {
  return render(
    <CollapsibleSection
      classes={{}}
      id="abc123"
      label="The Section Label"
      {...props}
    >
      <span data-testid="child">Child content</span>
    </CollapsibleSection>,
  );
}

describe('CollapsibleSection', () => {
  beforeEach(() => {
    createWrapper();
  });

  it('renders the passed in label is a Typography', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('The Section Label');
  });

  it('renders the appropriate i18n label based on open state', async () => {
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Collapse "The Section Label" section');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Expand "The Section Label" section');
  });

  it('displays children based on the open state', async () => {
    expect(screen.getByTestId('child')).toBeVisible();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('child')).not.toBeVisible();
  });
});

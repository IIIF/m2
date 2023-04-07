import { render, screen } from 'test-utils';
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
      t={k => k}
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
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'collapseSection');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'expandSection');
  });

  it('renders children based on the open state', async () => {
    expect(screen.getByTestId('child')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
  });
});

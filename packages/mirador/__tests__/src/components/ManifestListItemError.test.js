import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ManifestListItemError } from '../../../src/components/ManifestListItemError';

/**
 * Helper function to wrap creating a ManifestListItemError component
*/
function createWrapper(props) {
  return render(
    <ManifestListItemError
      classes={{}}
      manifestId="http://example.com"
      onDismissClick={() => {}}
      onTryAgainClick={() => {}}
      {...props}
    />,
  );
}

describe('ManifestListItemError', () => {
  let mockFn;

  it('renders the failed manifest url and error key', () => {
    createWrapper();

    expect(screen.getByText('The resource cannot be added:')).toBeInTheDocument();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });

  it('has a dismiss button that fires the onDismissClick prop', async () => {
    const user = userEvent.setup();
    mockFn = vi.fn();
    createWrapper({ onDismissClick: mockFn });

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(mockFn).toHaveBeenCalledWith('http://example.com');
  });

  it('has a try again button that fires the onTryAgainClick prop', async () => {
    const user = userEvent.setup();
    mockFn = vi.fn();
    createWrapper({ onTryAgainClick: mockFn });

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mockFn).toHaveBeenCalledWith('http://example.com');
  });
});

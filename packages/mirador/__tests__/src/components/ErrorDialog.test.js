import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ErrorDialog } from '../../../src/components/ErrorDialog';

/**
 * Helper function to create a shallow wrapper around ErrorDialog
 */
function createWrapper(props) {
  return render(
    <ErrorDialog
      {...props}
    />,
  );
}

describe('ErrorDialog', () => {
  it('renders properly', () => {
    const error = { id: 'testid123', message: '' };

    createWrapper({ error });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('An error occurred');
  });

  it('shows up error message correctly', () => {
    const errorMessage = 'error testMessage 123';
    const error = { id: 'testid123', message: errorMessage };

    createWrapper({ error });
    expect(screen.getByRole('dialog')).toHaveTextContent(errorMessage);
  });

  it('triggers the handleClick prop when clicking the ok button', async () => {
    const error = { id: 'testid123', message: '' };
    const mockHandleClick = vi.fn();
    const user = userEvent.setup();

    createWrapper({ error, removeError: mockHandleClick });

    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});

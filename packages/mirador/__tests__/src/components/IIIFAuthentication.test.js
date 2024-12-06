import { screen, render, waitFor } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { IIIFAuthentication } from '../../../src/components/IIIFAuthentication';

/**
 * Helper function to create IIIFAuthentication
 */
function createWrapper(props) {
  return render(
    <IIIFAuthentication
      accessTokenServiceId="http://example.com/token"
      authServiceId="http://example.com/auth"
      failureDescription="... and this is why."
      failureHeader="Login failed"
      handleAuthInteraction={() => {}}
      isInteractive
      logoutServiceId="http://example.com/logout"
      resetAuthenticationState={() => {}}
      resolveAccessTokenRequest={() => {}}
      resolveAuthenticationRequest={() => {}}
      windowId="w"
      {...props}
    />,
  );
}

describe('IIIFAuthentication', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });
  describe('without an auth service', () => {
    it('renders nothing', () => {
      createWrapper({ authServiceId: null });
      expect(screen.queryByRole('button', { name: 'Log in' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
  describe('with an available auth service', () => {
    it('renders a login bar', async () => {
      const handleAuthInteraction = vi.fn();
      createWrapper({ handleAuthInteraction });
      await user.click(screen.getByRole('button', { name: 'Log in' }));
      expect(handleAuthInteraction).toHaveBeenCalledWith('w', 'http://example.com/auth');
    });
    it('renders nothing for a non-interactive login', () => {
      createWrapper({ isInteractive: false });
      expect(screen.queryByText('Log in')).not.toBeInTheDocument();
    });
  });
  describe('with a failed authentication', () => {
    it('renders with an error message', async () => {
      const handleAuthInteraction = vi.fn();
      createWrapper({ handleAuthInteraction, status: 'failed' });
      await user.click(screen.getByRole('button', { name: 'Continue' }));
      const confirmBtn = screen.getByRole('button', { name: /Retry/ });
      expect(screen.getByText('Login failed')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('... and this is why.')).toBeInTheDocument();
      await user.click(confirmBtn);
      expect(handleAuthInteraction).toHaveBeenCalledWith('w', 'http://example.com/auth');
    });
  });
  describe('in the middle of authenticating', () => {
    it('does the IIIF access cookie behavior', async () => {
      const mockWindow = { close: vi.fn(), closed: false };
      const mockWindowOpen = vi.fn(() => (mockWindow));
      window.open = mockWindowOpen;
      const resolveCookieMock = vi.fn();
      createWrapper({ resolveAuthenticationRequest: resolveCookieMock, status: 'cookie' });
      expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
      expect(mockWindowOpen).toHaveBeenCalledWith(`http://example.com/auth?origin=${window.origin}`, 'IiifLoginSender', 'centerscreen');
      mockWindow.closed = true;
      await waitFor(() => expect(resolveCookieMock).toHaveBeenCalledTimes(1));
    });
    it('does the IIIF access token behavior', async () => {
      const resolveTokenMock = vi.fn();
      createWrapper({ resolveAccessTokenRequest: resolveTokenMock, status: 'token' });
      expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
      window.dispatchEvent(new MessageEvent('message', {
        data: { messageId: 'http://example.com/token' },
      }));
      await waitFor(() => expect(resolveTokenMock).toHaveBeenCalledWith('http://example.com/auth', 'http://example.com/token', { messageId: 'http://example.com/token' }));
    });
  });
  describe('when logged in', () => {
    it('renders a logout button', async () => {
      const mockWindow = { open: vi.fn() };
      const mockWindowOpen = vi.fn(() => (mockWindow));
      window.open = mockWindowOpen;
      const resetAuthenticationState = vi.fn();
      createWrapper({
        logoutConfirm: 'exit',
        openWindow: mockWindowOpen,
        resetAuthenticationState,
        status: 'ok',
      });
      const confirmBtn = await screen.findByRole('button', { name: 'exit' });
      await user.click(confirmBtn);
      await waitFor(() => expect(resetAuthenticationState).toHaveBeenCalledWith({
        authServiceId: 'http://example.com/auth', tokenServiceId: 'http://example.com/token',
      }));
    });
  });
});

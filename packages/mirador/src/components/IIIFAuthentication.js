import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { AccessTokenSender } from './AccessTokenSender';
import { NewBrowserWindow } from './NewBrowserWindow';
import WindowAuthenticationBar from '../containers/WindowAuthenticationBar';

/**
 * Opens a new window for click
 */
export function IIIFAuthentication({
  accessTokenServiceId = undefined, authServiceId = undefined, confirm = undefined, description = undefined,
  failureDescription = undefined, failureHeader = undefined, features = 'centerscreen',
  handleAuthInteraction, header = undefined, isInteractive = true, label = undefined,
  logoutConfirm = undefined, logoutServiceId = undefined, openWindow = window.open,
  resetAuthenticationState, resolveAccessTokenRequest, resolveAuthenticationRequest,
  status = null, windowId,
}) {
  const { t } = useTranslation();

  if (!accessTokenServiceId || !authServiceId) return null;

  /** */
  const onReceiveAccessTokenMessage = (payload) => {
    resolveAccessTokenRequest(authServiceId, accessTokenServiceId, payload);
  };

  /** */
  const defaultAuthBarProps = () => ({
    authServiceId,
    hasLogoutService: !!logoutServiceId,
    status,
    windowId,
  });

  /** handle the IIIF logout workflow */
  const performLogout = () => {
    openWindow(logoutServiceId, undefined, features);

    resetAuthenticationState({ authServiceId, tokenServiceId: accessTokenServiceId });
  };

  /** Render the auth bar for logged in users */
  const renderLoggedIn = () => {
    if (!isInteractive) return null;

    return (
      <WindowAuthenticationBar
        confirmButton={logoutConfirm || t('logout')}
        onConfirm={performLogout}
        {...defaultAuthBarProps()}
      />
    );
  };

  /** Render whatever shows up after the interactive login attempt fails */
  const renderFailure = () => (
    <WindowAuthenticationBar
      header={failureHeader}
      description={failureDescription}
      confirmButton={t('retry')}
      onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
      {...defaultAuthBarProps()}
    />
  );

  /** Render the login bar after we're logging in */
  const renderLoggingInCookie = () => (
    <>
      {renderLogin()}
      <NewBrowserWindow name="IiifLoginSender" url={`${authServiceId}?origin=${window.origin}`} features={features} onClose={() => resolveAuthenticationRequest(authServiceId, accessTokenServiceId)} />
    </>
  );

  /** Render the login bar after we're logging in */
  const renderLoggingInToken = () => (
    <>
      {renderLogin()}
      <AccessTokenSender
        handleAccessTokenMessage={onReceiveAccessTokenMessage}
        url={accessTokenServiceId}
      />
    </>
  );

  /** Render a login bar */
  const renderLogin = () => {
    if (!isInteractive) return null;

    return (
      <WindowAuthenticationBar
        header={header}
        description={description}
        label={label}
        confirmButton={confirm}
        onConfirm={() => handleAuthInteraction(windowId, authServiceId)}
        {...defaultAuthBarProps()}
      />
    );
  };

  if (status === null) return renderLogin();
  if (status === 'cookie') return renderLoggingInCookie();
  if (status === 'token') return renderLoggingInToken();
  if (status === 'failed') return renderFailure();
  if (status === 'ok') return renderLoggedIn();

  return null;
}

IIIFAuthentication.propTypes = {
  accessTokenServiceId: PropTypes.string,
  authServiceId: PropTypes.string,
  confirm: PropTypes.string,
  description: PropTypes.string,
  failureDescription: PropTypes.string,
  failureHeader: PropTypes.string,
  features: PropTypes.string,
  handleAuthInteraction: PropTypes.func.isRequired,
  header: PropTypes.string,
  isInteractive: PropTypes.bool,
  label: PropTypes.string,
  logoutConfirm: PropTypes.string,
  logoutServiceId: PropTypes.string,
  openWindow: PropTypes.func,
  resetAuthenticationState: PropTypes.func.isRequired,
  resolveAccessTokenRequest: PropTypes.func.isRequired,
  resolveAuthenticationRequest: PropTypes.func.isRequired,
  status: PropTypes.oneOf(['logout', 'ok', 'token', 'cookie', 'failed', null]),
  windowId: PropTypes.string.isRequired,
};

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { IIIFIFrameCommunication } from './IIIFIFrameCommunication';

/**
 * Opens a new window for click
 */
export function AccessTokenSender({ handleAccessTokenMessage, url = undefined }) {
  const onReceiveAccessTokenMessage = useCallback((e) => {
    if (e.data && e.data.messageId && e.data.messageId === url) handleAccessTokenMessage(e.data);
  }, [handleAccessTokenMessage, url]);

  if (!url) return null;

  const src = new URL(url);
  src.searchParams.append('origin', window.origin);
  src.searchParams.append('messageId', url);

  /**
  login, clickthrough/kiosk open @id, wait for close
  external, no-op
  */
  return (
    <IIIFIFrameCommunication
      src={src.toString()}
      title="AccessTokenSender"
      handleReceiveMessage={onReceiveAccessTokenMessage}
    />
  );
}

AccessTokenSender.propTypes = {
  handleAccessTokenMessage: PropTypes.func.isRequired,
  url: PropTypes.string,
};

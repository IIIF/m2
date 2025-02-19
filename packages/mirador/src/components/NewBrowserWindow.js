import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/** */
export function NewBrowserWindow({
  depWindow = undefined, features = undefined, name = undefined, onClose, url,
}) {
  const released = useRef(false);

  useEffect(() => {
    const newWindow = (depWindow || window).open(url, name, features);

    const checkIfWindowClosed = setInterval(() => {
      if (!released.current && (!newWindow || newWindow.closed)) {
        released.current = true;
        clearInterval(checkIfWindowClosed);
        onClose(url);
      }
    }, 250);

    return () => {
      clearInterval(checkIfWindowClosed);
      newWindow.close();
    };
  });

  return null;
}

NewBrowserWindow.propTypes = {
  depWindow: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  features: PropTypes.string,
  name: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

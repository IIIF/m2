import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CompanionWindow from '../containers/CompanionWindow';

/**
 * a custom panel that can be used for anything
 */
export function CustomPanel({
  id, children = null, title, windowId,
}) {
  const { t } = useTranslation();
  return (
    <CompanionWindow
      title={t(title)}
      id={id}
      windowId={windowId}
    >
      {children}
    </CompanionWindow>
  );
}

CustomPanel.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};

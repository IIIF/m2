import { useContext } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import Popover from '@mui/material/Popover';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import WindowThumbnailSettings from '../containers/WindowThumbnailSettings';
import WindowViewSettings from '../containers/WindowViewSettings';
import { PluginHook } from './PluginHook';
import WorkspaceContext from '../contexts/WorkspaceContext';
import { usePlugins } from '../extend/usePlugins';

/** Renders plugins */
function PluginHookWithHeader({ targetName, ...props }) {
  const PluginComponents = usePlugins(targetName);
  const { t } = useTranslation();
  return PluginComponents?.length > 0 ? (
    <>
      <ListSubheader role="presentation" disableSticky tabIndex={-1}>{t('windowPluginButtons')}</ListSubheader>
      <PluginHook targetName={targetName} {...props} />
    </>
  ) : null;
}

PluginHookWithHeader.propTypes = {
  targetName: PropTypes.string.isRequired,
};

/**
 */
export function WindowTopMenu({
  handleClose, showThumbnailNavigationSettings = true,
  toggleDraggingEnabled, windowId, anchorEl = null, open = false,
}) {
  const container = useContext(WorkspaceContext);
  const pluginProps = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <Popover
      container={container?.current}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      onClose={handleClose}
      TransitionProps={{
        onEntering: toggleDraggingEnabled,
        onExit: toggleDraggingEnabled,
      }}
      orientation="horizontal"
      anchorEl={anchorEl}
      open={open}
      role="menu"
    >
      <WindowViewSettings windowId={windowId} handleClose={handleClose} />
      {showThumbnailNavigationSettings
        && <WindowThumbnailSettings windowId={windowId} handleClose={handleClose} />}
      <PluginHookWithHeader targetName="WindowTopMenu" {...pluginProps} />
    </Popover>
  );
}

WindowTopMenu.propTypes = {
  anchorEl: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  showThumbnailNavigationSettings: PropTypes.bool,
  toggleDraggingEnabled: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

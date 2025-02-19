import { useContext } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import WorkspaceContext from '../contexts/WorkspaceContext';

/**
 */
export function WindowList({
  handleClose, windowIds, focusWindow, focusedWindowId = null,
  titles = {}, tReady = false, ...menuProps
}) {
  const { t } = useTranslation();
  const container = useContext(WorkspaceContext);
  return (
    <Menu
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      transformOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      id="window-list-menu"
      container={container?.current}
      onClose={handleClose}
      {...menuProps}
    >
      <ListSubheader role="presentation" selected={false} disabled tabIndex="-1">
        {t('openWindows')}
      </ListSubheader>
      {
        windowIds.map((windowId, i) => (
          <MenuItem
            key={windowId}
            selected={windowId === focusedWindowId}
            onClick={(e) => { focusWindow(windowId, true); handleClose(e); }}
          >
            <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
              {
                titles[windowId] || t('untitled')
              }
            </ListItemText>
          </MenuItem>
        ))
      }
    </Menu>
  );
}

WindowList.propTypes = {
  container: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  focusedWindowId: PropTypes.string,
  focusWindow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  titles: PropTypes.objectOf(PropTypes.string),
  tReady: PropTypes.bool,
  windowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

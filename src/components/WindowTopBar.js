import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/MenuSharp';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import WindowTopBarMenu from '../containers/WindowTopBarMenu';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import ns from '../config/css-ns';

const Root = styled(AppBar, { name: 'WindowTopBar', slot: 'root' })(() => ({
  zIndex: 1100,
}));

const StyledToolbar = styled(Toolbar, { name: 'WindowTopBar', slot: 'toolbar' })(({ ownerState, theme }) => ({
  backgroundColor: theme.palette.shades?.main,
  borderTop: '2px solid',
  borderTopColor: ownerState?.focused ? theme.palette.primary.main : 'transparent',
  minHeight: 32,
  paddingLeft: theme.spacing(0.5),
  paddingRight: theme.spacing(0.5),
  ...(ownerState?.windowDraggable && {
    cursor: 'move',
  }),
}));

/**
 * WindowTopBar
 */
export function WindowTopBar({
  windowId, toggleWindowSideBar, focusWindow = () => {}, allowWindowSideBar = true, component = 'nav',
}) {
  const { t } = useTranslation();
  const ownerState = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <Root component={component} aria-label={t('windowNavigation')} position="relative" color="default" enableColorOnDark>
      <StyledToolbar
        disableGutters
        onMouseDown={focusWindow}
        ownerState={ownerState}
        className={classNames(ns('window-top-bar'))}
        variant="dense"
      >
        {allowWindowSideBar && (
        <MiradorMenuButton
          aria-label={t('toggleWindowSideBar')}
          onClick={toggleWindowSideBar}
          className={ns('window-menu-btn')}
        >
          <MenuIcon />
        </MiradorMenuButton>
        )}
        <WindowTopBarMenu
          windowId={windowId}
          ownerState={ownerState}
        />
      </StyledToolbar>
    </Root>
  );
}

WindowTopBar.propTypes = {
  allowWindowSideBar: PropTypes.bool,
  component: PropTypes.elementType,
  focused: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  focusWindow: PropTypes.func,
  toggleWindowSideBar: PropTypes.func.isRequired,
  windowDraggable: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  windowId: PropTypes.string.isRequired,
};

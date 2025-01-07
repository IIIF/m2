import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/CloseSharp';
import classNames from 'classnames';
import ResizeObserver from 'react-resize-observer';
import { Portal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import WindowTopMenuButton from '../containers/WindowTopMenuButton';
import WindowTopBarPluginArea from '../containers/WindowTopBarPluginArea';
import WindowTopBarPluginMenu from '../containers/WindowTopBarPluginMenu';
import WindowTopBarTitle from '../containers/WindowTopBarTitle';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import FullScreenButton from '../containers/FullScreenButton';
import WindowMaxIcon from './icons/WindowMaxIcon';
import WindowMinIcon from './icons/WindowMinIcon';
import ns from '../config/css-ns';
import PluginContext from '../extend/PluginContext';

const IconButtonsWrapper = styled('div')({
  display: 'flex',
});

const InvisibleIconButtonsWrapper = styled(IconButtonsWrapper)(() => ({
  visibility: 'hidden',
}));

/**
 * removeAttributes
 */
const removeAttributes = (attributeList = [], node) => {
  /* remove the named attributes */
  if (node.removeAttribute) {
    attributeList.map(attr => node.removeAttribute(attr));
  }
  /* call this function for each child node recursively */
  if (node.childNodes) node.childNodes.forEach(child => removeAttributes(attributeList, child));
};

/**
 * WindowTopBarMenu
 */
export function WindowTopBarMenu({
  removeWindow, windowId,
  maximizeWindow = () => {}, maximized = false, minimizeWindow = () => {}, allowClose = true, allowMaximize = true,
  allowFullscreen = false, allowTopMenuButton = true
  ,
}) {
  const { t } = useTranslation();

  const [outerW, setOuterW] = React.useState();
  const [visibleButtonsNum, setVisibleButtonsNum] = React.useState(0);
  const iconButtonsWrapperRef = React.useRef();
  const pluginMap = React.useContext(PluginContext);
  const portalRef = React.useRef();

  const buttons = [];
  if (pluginMap?.WindowTopBarPluginArea?.add?.length > 0
    || pluginMap?.WindowTopBarPluginArea?.wrap?.length > 0) {
    buttons.push(
      <WindowTopBarPluginArea key={`WindowTopBarPluginArea-${windowId}`} windowId={windowId} />,
    );
  }

  allowTopMenuButton && buttons.push(
    <WindowTopMenuButton
      key={`WindowTopMenuButton-${windowId}`}
      windowId={windowId}
      className={ns('window-menu-btn')}
    />,
  );

  allowMaximize && buttons.push(
    <MiradorMenuButton
      key={`allowMaximizeMiradorMenuButton-${windowId}`}
      aria-label={(maximized ? t('minimizeWindow') : t('maximizeWindow'))}
      className={classNames(ns('window-maximize'), ns('window-menu-btn'))}
      onClick={(maximized ? minimizeWindow : maximizeWindow)}
    >
      {(maximized ? <WindowMinIcon /> : <WindowMaxIcon />)}
    </MiradorMenuButton>,
  );
  allowFullscreen && buttons.push(
    <FullScreenButton
      key={`FullScreenButton-${windowId}`}
      className={ns('window-menu-btn')}
    />,
  );

  const visibleButtons = buttons.slice(0, visibleButtonsNum);
  const moreButtons = buttons.slice(visibleButtonsNum);
  const moreButtonAlwaysShowing = pluginMap?.WindowTopBarPluginMenu?.add?.length > 0
  || pluginMap?.WindowTopBarPluginMenu?.wrap?.length > 0;
  React.useEffect(() => {
    if (outerW === undefined || !portalRef?.current) {
      return;
    }
    removeAttributes(['data-testid'], portalRef.current);
    const children = Array.from(portalRef.current.childNodes ?? []);
    let accWidth = 0;
    // sum widths of top bar elements until wider than half of the available space
    let newVisibleButtonsNum = children.reduce((acc, child) => {
      const width = child?.offsetWidth;
      accWidth += width;
      if (accWidth <= (0.5 * outerW)) {
        return acc + 1;
      }
      return acc;
    }, 0);
    if (!moreButtonAlwaysShowing && children.length - newVisibleButtonsNum === 1) {
      // when the WindowTopBarPluginMenu button is not always visible (== there are no WindowTopBarPluginMenu plugins)
      // and only the first button would be hidden away on the next render
      // (not changing the width, as the more button takes it's place), hide the first two buttons
      newVisibleButtonsNum = Math.max(children.length - 2, 0);
    }
    setVisibleButtonsNum(newVisibleButtonsNum);
  }, [outerW, moreButtonAlwaysShowing]);

  const showMoreButtons = moreButtonAlwaysShowing || moreButtons.length > 0;

  return (
    <>
      <Portal>
        <InvisibleIconButtonsWrapper ref={portalRef}>
          {buttons}
        </InvisibleIconButtonsWrapper>
      </Portal>
      <ResizeObserver
        onResize={(rect) => {
          // 96 to compensate for the burger menu button on the left and the close window button on the right
          setOuterW(Math.max(rect.width - 96, 0));
        }}
      />
      <WindowTopBarTitle
        windowId={windowId}
      />
      <IconButtonsWrapper ref={iconButtonsWrapperRef}>
        {visibleButtons}
        {showMoreButtons && (
        <WindowTopBarPluginMenu windowId={windowId} moreButtons={moreButtons} />
        )}
        {allowClose && (
        <MiradorMenuButton
          aria-label={t('closeWindow')}
          className={classNames(ns('window-close'), ns('window-menu-btn'))}
          onClick={removeWindow}
        >
          <CloseIcon />
        </MiradorMenuButton>
        )}
      </IconButtonsWrapper>
    </>
  );
}

WindowTopBarMenu.propTypes = {
  allowClose: PropTypes.bool,
  allowFullscreen: PropTypes.bool,
  allowMaximize: PropTypes.bool,
  allowTopMenuButton: PropTypes.bool,
  container: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  maximized: PropTypes.bool,
  maximizeWindow: PropTypes.func,
  minimizeWindow: PropTypes.func,
  removeWindow: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired,
};

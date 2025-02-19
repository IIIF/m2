import { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { MosaicWindowContext } from 'react-mosaic-component2';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import ns from '../config/css-ns';
import WindowTopBar from '../containers/WindowTopBar';
import PrimaryWindow from '../containers/PrimaryWindow';
import CompanionArea from '../containers/CompanionArea';
import MinimalWindow from '../containers/MinimalWindow';
import ErrorContent from '../containers/ErrorContent';
import IIIFAuthentication from '../containers/IIIFAuthentication';
import { PluginHook } from './PluginHook';

const rowMixin = {
  display: 'flex',
  flex: '1',
  flexDirection: 'row',
  minHeight: 0,
};

const columnMixin = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  minHeight: 0,
};

const Root = styled(Paper, { name: 'Window', slot: 'root' })(({ ownerState, theme }) => ({
  ...columnMixin,
  backgroundColor: theme.palette.shades?.dark,
  borderRadius: 0,
  height: '100%',
  overflow: 'hidden',
  width: '100%',
  ...(ownerState?.maximized && {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: theme.zIndex.modal - 1,
  }),
}));

const ContentRow = styled('div', { name: 'Window', slot: 'row' })(() => ({
  ...rowMixin,
}));

const ContentColumn = styled('div', { name: 'Window', slot: 'column' })(() => ({
  ...columnMixin,
}));

const StyledPrimaryWindow = styled(PrimaryWindow, { name: 'Window', slot: 'primary' })(() => ({
  ...rowMixin,
  height: '300px',
  position: 'relative',
}));

const StyledCompanionAreaBottom = styled(CompanionArea, { name: 'Window', slot: 'bottom' })(() => ({
  ...rowMixin,
  flex: '0',
  flexBasis: 'auto',
}));

const StyledCompanionAreaRight = styled('div', { name: 'Window', slot: 'right' })(() => ({
  ...rowMixin,
  flex: '0 1 auto',
}));

/** Window title bar wrapper for drag controls in the mosaic view */
const DraggableNavBar = ({ children, ...props }) => {
  const { mosaicWindowActions } = useContext(MosaicWindowContext);
  return mosaicWindowActions.connectDragSource(
    <nav {...props}>{children}</nav>,
  );
};

/**
 * Represents a Window in the mirador workspace
 * @param {object} window
 */
export function Window({
  focusWindow = () => {}, label = null, isFetching = false, sideBarOpen = false,
  view = undefined, windowDraggable = null, windowId, workspaceType = null,
  manifestError = null,
}) {
  const { t } = useTranslation();
  const ownerState = arguments[0]; // eslint-disable-line prefer-rest-params
  const ErrorWindow = useCallback(({ error }) => (
    <MinimalWindow windowId={windowId}>
      <ErrorContent error={error} windowId={windowId} />
    </MinimalWindow>
  ), [windowId]);

  return (
    <ErrorBoundary FallbackComponent={ErrorWindow}>
      <Root
        onFocus={focusWindow}
        ownerState={ownerState}
        component="section"
        elevation={1}
        id={windowId}
        className={ns('window')}
        aria-label={t('window', { label })}
      >
        <WindowTopBar
          component={workspaceType === 'mosaic' && windowDraggable ? DraggableNavBar : undefined}
          windowId={windowId}
          windowDraggable={windowDraggable}
        />
        <IIIFAuthentication windowId={windowId} />
        { manifestError && <ErrorContent error={{ stack: manifestError }} windowId={windowId} /> }
        <ContentRow>
          <ContentColumn>
            <StyledPrimaryWindow
              view={view}
              windowId={windowId}
              isFetching={isFetching}
              sideBarOpen={sideBarOpen}
            />
            <StyledCompanionAreaBottom windowId={windowId} position="bottom" />
          </ContentColumn>
          <StyledCompanionAreaRight>
            <CompanionArea windowId={windowId} position="right" />
            <CompanionArea windowId={windowId} position="far-right" />
          </StyledCompanionAreaRight>
        </ContentRow>
        <CompanionArea windowId={windowId} position="far-bottom" />
        <PluginHook {...ownerState} />
      </Root>
    </ErrorBoundary>
  );
}

Window.propTypes = {
  focusWindow: PropTypes.func,
  isFetching: PropTypes.bool,
  label: PropTypes.string,
  manifestError: PropTypes.string,
  maximized: PropTypes.bool,
  sideBarOpen: PropTypes.bool,
  view: PropTypes.string,
  windowDraggable: PropTypes.bool,
  windowId: PropTypes.string.isRequired,
  workspaceType: PropTypes.string,
};

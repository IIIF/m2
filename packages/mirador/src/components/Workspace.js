import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import Window from '../containers/Window';
import WorkspaceMosaic from '../containers/WorkspaceMosaic';
import WorkspaceElastic from '../containers/WorkspaceElastic';
import ns from '../config/css-ns';
import { IIIFDropTarget } from './IIIFDropTarget';

const Root = styled('div', { name: 'Workspace', slot: 'root' })(() => ({
  height: '100%',
  position: 'relative',
  width: '100%',
}));

/** */
const ZeroWindows = () => {
  const { t } = useTranslation();

  return (
    <Root>
      <Grid
        alignItems="center"
        container
        style={{
          height: '100%',
        }}
      >
        <Grid
          xs={12}
          item
        >
          <Typography
            variant="h1"
            component="div"
            align="center"
          >
            {t('welcome')}
          </Typography>
        </Grid>
      </Grid>
    </Root>
  );
};

ZeroWindows.propTypes = {
};

/**
 * Represents a work area that contains any number of windows
 * @memberof Workspace
 * @private
 */
export function Workspace({
  addWindow = () => {}, allowNewWindows = true, maximizedWindowIds = [], windowIds = [], workspaceId, workspaceType,
}) {
  const { t } = useTranslation();
  /** */
  const handleDrop = ({ canvasId, manifestId, manifestJson }, _props, _monitor) => {
    if (!allowNewWindows) return;

    addWindow({ canvasId, manifest: manifestJson, manifestId });
  };

  /**
   * Determine which workspace to render by configured type
   */
  const workspaceByType = () => {
    if (maximizedWindowIds.length > 0) {
      if (maximizedWindowIds.length > 0) {
        return maximizedWindowIds.map(windowId => (
          <Window
            key={`${windowId}-${workspaceId}`}
            windowId={windowId}
            className={classNames(ns('workspace-maximized-window'))}
          />
        ));
      }
    }

    if (windowIds.length === 0) return <ZeroWindows />;

    switch (workspaceType) {
      case 'elastic':
        return <WorkspaceElastic />;
      case 'mosaic':
        return <WorkspaceMosaic />;
      default:
        return windowIds.map(windowId => (
          <Window
            key={`${windowId}-${workspaceId}`}
            windowId={windowId}
          />
        ));
    }
  };

  const ownerState = {
    allowNewWindows, maximizedWindowIds, windowIds, workspaceId, workspaceType,
  };

  return (
    <IIIFDropTarget onDrop={handleDrop}>
      <Root
        ownerState={ownerState}
        className={
          classNames(
            ns('workspace-viewport'),
          )
        }
      >
        <Typography style={visuallyHidden} component="h1">{t('miradorViewer')}</Typography>
        {workspaceByType()}
      </Root>
    </IIIFDropTarget>
  );
}

Workspace.propTypes = {
  addWindow: PropTypes.func,
  allowNewWindows: PropTypes.bool,
  maximizedWindowIds: PropTypes.arrayOf(PropTypes.string),
  windowIds: PropTypes.arrayOf(PropTypes.string),
  workspaceId: PropTypes.string.isRequired,
  workspaceType: PropTypes.string.isRequired,
};

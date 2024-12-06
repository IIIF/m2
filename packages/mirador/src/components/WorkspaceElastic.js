import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Rnd } from 'react-rnd';
import ResizeObserver from 'react-resize-observer';
import WorkspaceElasticWindow from '../containers/WorkspaceElasticWindow';
import ns from '../config/css-ns';

const Root = styled('div', { name: 'WorkspaceElastic', slot: 'root' })({
  height: '100%',
  position: 'relative',
  width: '100%',
});

const StyledRnd = styled(Rnd)({
  boxSizing: 'border-box',
  margin: 0,
  position: 'absolute',
  transitionDuration: '.7s',
  // order matters
  // eslint-disable-next-line sort-keys
  '&.react-draggable-dragging': {
    transitionDuration: 'unset',
  },
});

/**
 * Represents a work area that contains any number of windows
 * @memberof Workspace
 * @private
 */
function WorkspaceElastic({
  workspace,
  elasticLayout,
  setWorkspaceViewportDimensions,
  setWorkspaceViewportPosition,
}) {
  const { viewportPosition } = workspace;
  const offsetX = workspace.width / 2;
  const offsetY = workspace.height / 2;

  return (
    <Root>
      <ResizeObserver
        onReflow={() => {}}
        onResize={(rect) => { setWorkspaceViewportDimensions(rect); }}
      />

      <StyledRnd
        size={{
          height: workspace.height,
          width: workspace.width,
        }}
        position={{
          x: -1 * viewportPosition.x - offsetX, y: -1 * viewportPosition.y - offsetY,
        }}
        enableResizing={{
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
          left: false,
          right: false,
          top: false,
          topLeft: false,
          topRight: false,
        }}
        onDragStop={(e, d) => {
          setWorkspaceViewportPosition({ x: -1 * d.x - offsetX, y: -1 * d.y - offsetY });
        }}
        cancel={`.${ns('window')}`}
        className={ns('workspace')}
        disableDragging={!workspace.draggingEnabled}
      >
        {
          Object.keys(elasticLayout).map(windowId => (
            <WorkspaceElasticWindow
              key={windowId}
              windowId={windowId}
            />
          ))
        }
      </StyledRnd>
    </Root>
  );
}

WorkspaceElastic.propTypes = {
  elasticLayout: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  setWorkspaceViewportDimensions: PropTypes.func.isRequired,
  setWorkspaceViewportPosition: PropTypes.func.isRequired,
  workspace: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default WorkspaceElastic;

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getDestructuredMetadata,
  getCanvas,
  getCanvasLabel,
  getCanvasDescription,
} from '../state/selectors';
import { CanvasInfo } from '../components/CanvasInfo';

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowSideBarInfoPanel
 * @private
 */
const mapStateToProps = (state, { canvasId, companionWindowId, windowId }) => ({
  canvasDescription: getCanvasDescription(state, { canvasId, companionWindowId, windowId }),
  canvasLabel: getCanvasLabel(state, { canvasId, companionWindowId, windowId }),
  canvasMetadata: getDestructuredMetadata(
    getCanvas(state, { canvasId, companionWindowId, windowId }),
  ),
});

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('CanvasInfo'),
);

export default enhance(CanvasInfo);

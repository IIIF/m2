import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { LayersPanel } from '../components/LayersPanel';
import {
  getVisibleCanvasIds,
} from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => ({
  canvasIds: getVisibleCanvasIds(state, { windowId }),
});

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('LayersPanel'),
);

export default enhance(LayersPanel);

import { connect } from 'react-redux';
import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { getShowZoomControlsConfig, getWorkspace } from '../state/selectors';
import { WindowCanvasNavigationControls } from '../components/WindowCanvasNavigationControls';

/** */
const mapStateToProps = (state, { windowId }) => ({
  showZoomControls: getShowZoomControlsConfig(state),
  visible: getWorkspace(state).focusedWindowId === windowId,
});

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('WindowCanvasNavigationControls'),
);

export default enhance(WindowCanvasNavigationControls);

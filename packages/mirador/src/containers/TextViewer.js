import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { getConfig, getVisibleCanvasTextResources } from '../state/selectors';
import { TextViewer } from '../components/TextViewer';

/** */
const mapStateToProps = (state, { windowId }) => (
  {
    textOptions: getConfig(state).textOptions,
    textResources: getVisibleCanvasTextResources(state, { windowId }) || [],
  }
);

const enhance = compose(
  connect(mapStateToProps, null),
  withPlugins('TextViewer'),
  // further HOC go here
);

export default enhance(TextViewer);

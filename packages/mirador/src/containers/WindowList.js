import { connect } from 'react-redux';
import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getFocusedWindowId, getWindowIds, getWindowTitles } from '../state/selectors';
import { WindowList } from '../components/WindowList';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = {
  focusWindow: actions.focusWindow,
};

/**
 * mapStateToProps - to hook up connect
 * @memberof WorkspaceControlPanel
 * @private
 */
const mapStateToProps = state => (
  {
    focusedWindowId: getFocusedWindowId(state),
    titles: getWindowTitles(state),
    windowIds: getWindowIds(state),
  }
);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowList'),
);

export default enhance(WindowList);

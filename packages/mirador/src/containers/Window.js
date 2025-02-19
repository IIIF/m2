import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { Window } from '../components/Window';
import {
  getManifestStatus, getManifestTitle, getThumbnailNavigationPosition, getWindow,
  getWorkspaceType, getWindowDraggability, getWindowViewType, getManifestError,
} from '../state/selectors';

/**
 * mapStateToProps - used to hook up connect to action creators
 * @memberof Window
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  isFetching: getManifestStatus(state, { windowId }).isFetching,
  label: getManifestTitle(state, { windowId }),
  manifestError: getManifestError(state, { windowId }),
  maximized: (getWindow(state, { windowId }) || {}).maximized,
  sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
  thumbnailNavigationPosition: getThumbnailNavigationPosition(state, { windowId }),
  view: getWindowViewType(state, { windowId }),
  windowDraggable: getWindowDraggability(state, { windowId }),
  workspaceType: getWorkspaceType(state),
});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  focusWindow: () => dispatch(actions.focusWindow(windowId)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('Window'),
);

export default enhance(Window);

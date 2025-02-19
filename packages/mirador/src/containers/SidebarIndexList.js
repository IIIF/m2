import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getCanvases,
  getVisibleCanvasIds,
} from '../state/selectors';
import { SidebarIndexList } from '../components/SidebarIndexList';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => ({
  canvases: getCanvases(state, { windowId }),
  selectedCanvasIds: getVisibleCanvasIds(state, { windowId }),
  variant: getCompanionWindow(state, { companionWindowId: id, windowId }).variant,
});

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SidebarIndexList
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SidebarIndexList'),
);

export default enhance(SidebarIndexList);

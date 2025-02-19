import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { SidebarIndexTableOfContents } from '../components/SidebarIndexTableOfContents';
import {
  getSequenceTreeStructure,
  getVisibleNodeIds,
  getExpandedNodeIds,
  getNodeIdToScrollTo,
} from '../state/selectors';
import * as actions from '../state/actions';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => ({
  expandedNodeIds: getExpandedNodeIds(state, { companionWindowId: id, windowId }),
  nodeIdToScrollTo: getNodeIdToScrollTo(state, { companionWindowId: id, windowId }),
  treeStructure: getSequenceTreeStructure(state, { windowId }),
  visibleNodeIds: getVisibleNodeIds(state, { companionWindowId: id, windowId }),
});

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SidebarIndexTableOfContents
 * @private
 */
const mapDispatchToProps = (dispatch, { id, windowId }) => ({
  expandNodes: nodeIds => dispatch(actions.expandNodes(windowId, id, nodeIds)),
  setCanvas: (...args) => dispatch(actions.setCanvas(...args)),
  toggleNode: nodeId => dispatch(actions.toggleNode(windowId, id, nodeId)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SidebarIndexTableOfContents'),
);

export default enhance(SidebarIndexTableOfContents);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TreeItem from '@material-ui/lab/TreeItem';
import { ScrollTo } from './ScrollTo';

/** */
export class SidebarIndexTableOfContents extends Component {
  /** */
  selectTreeItem(node) {
    const { setCanvas, toggleNode, windowId } = this.props;
    if (node.nodes.length > 0) {
      toggleNode(node.id);
    }
    // Do not select if there are no canvases listed
    if (!node.data.getCanvasIds() || node.data.getCanvasIds().length === 0) {
      return;
    }
    const target = node.data.getCanvasIds()[0];
    const canvasId = target.indexOf('#') === -1 ? target : target.substr(0, target.indexOf('#'));
    setCanvas(windowId, canvasId);
  }

  /** */
  handleKeyPressed(event, node) {
    const { expandedNodeIds } = this.props;
    if (event.key === 'Enter'
      || event.key === ' '
      || event.key === 'Spacebar'
      || (event.key === 'ArrowLeft' && expandedNodeIds.indexOf(node.id) !== -1)
      || (event.key === 'ArrowRight' && expandedNodeIds.indexOf(node.id) === -1)) {
      this.selectTreeItem(node);
    }
  }

  /** */
  buildTreeItems(nodes, visibleNodeIds, containerRef, nodeIdToScrollTo) {
    if (!nodes) {
      return null;
    }
    return (
      nodes.map(node => (
        <TreeItem
          key={node.id}
          nodeId={node.id}
          label={(
            <ScrollTo
              containerRef={containerRef}
              key={`${node.id}-scroll`}
              offsetTop={96} // offset for the height of the form above
              scrollTo={nodeIdToScrollTo === node.id}
            >
              <>
                {visibleNodeIds.indexOf(node.id) !== -1 && <VisibilityIcon fontSize="small" color="secondary" />}
                {node.label}
              </>
            </ScrollTo>
          )}
          onClick={() => this.selectTreeItem(node)}
          onKeyDown={e => this.handleKeyPressed(e, node)}
        >
          {node.nodes && node.nodes.length > 0 ? this.buildTreeItems(
            node.nodes,
            visibleNodeIds,
            containerRef,
            nodeIdToScrollTo,
          ) : null}
        </TreeItem>
      ))
    );
  }

  /** */
  render() {
    const {
      classes, treeStructure, visibleNodeIds, expandedNodeIds, containerRef, nodeIdToScrollTo,
    } = this.props;

    if (!treeStructure) {
      return <></>;
    }

    return (
      <>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultEndIcon={<></>}
          expanded={expandedNodeIds}
        >
          {this.buildTreeItems(treeStructure.nodes, visibleNodeIds, containerRef, nodeIdToScrollTo)}
        </TreeView>
      </>
    );
  }
}

SidebarIndexTableOfContents.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  expandedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  nodeIdToScrollTo: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  toggleNode: PropTypes.func.isRequired,
  treeStructure: PropTypes.objectOf().isRequired,
  visibleNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  windowId: PropTypes.string.isRequired,
};

import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { ScrollTo } from './ScrollTo';

const StyledVisibleNode = styled('div')(() => ({

}));
/** */
function getStartCanvasId(node) {
  const jsonld = node.data.__jsonld; // eslint-disable-line no-underscore-dangle
  if (jsonld.startCanvas && typeof jsonld.startCanvas === 'string') {
    return jsonld.startCanvas;
  }
  if (jsonld.start) {
    if (jsonld.start.type === 'Canvas' && typeof jsonld.start.id === 'string') {
      return jsonld.start.id;
    }
    if (jsonld.start.type === 'SpecificResource' && typeof jsonld.start.source === 'string') {
      return jsonld.start.source;
    }
  }
  return node.data.getCanvasIds()[0];
}

/** Traverse through the manifesto tree to find a node with a given id */
function deepFind(treeNode, id) {
  if (treeNode.id === id) {
    return treeNode;
  }

  let result = null;

  if (treeNode.nodes) {
    for (let i = 0; result == null && i < treeNode.nodes.length; i += 1) {
      result = deepFind(treeNode.nodes[i], id);
    }
  }

  return result;
}

/** Wrap <ScrollTo> to remove the nodeId prop required for MUI's TreeView */
const ScrollToForTreeItem = ({ children, nodeId, ...props }) => (
  <ScrollTo
    {...props}
  >
    { children }
  </ScrollTo>
);

ScrollToForTreeItem.propTypes = {
  children: PropTypes.node.isRequired,
  nodeId: PropTypes.string.isRequired,
};

/** */
export function SidebarIndexTableOfContents({
  toggleNode, expandNodes, setCanvas, windowId,
  treeStructure, visibleNodeIds, expandedNodeIds, containerRef, nodeIdToScrollTo,
}) {
  /** */
  const handleNodeSelect = (event, nodeId) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      toggleNode(nodeId);
    }

    selectTreeItem(nodeId);
  };

  /** */
  const handleNodeToggle = (_event, nodeIds) => {
    expandNodes(nodeIds);
  };

  /** */
  const selectTreeItem = (nodeId) => {
    const node = deepFind(treeStructure, nodeId);

    // Do not select if there are no canvases listed or it has children
    if (!node.data.getCanvasIds()
        || node.data.getCanvasIds().length === 0
        || node.nodes.length > 0) {
      return;
    }
    const target = getStartCanvasId(node);
    const canvasId = target.indexOf('#') === -1 ? target : target.substr(0, target.indexOf('#'));
    setCanvas(windowId, canvasId);
  };

  if (!treeStructure) {
    return null;
  }

  /** Render the tree structure recursively */
  const renderTree = (node) => (
    <ScrollToForTreeItem
      containerRef={containerRef}
      key={node.id}
      nodeId={node.id}
      offsetTop={96} // offset for the height of the form above
      scrollTo={nodeIdToScrollTo === node.id}
    >
      <TreeItem
        nodeId={node.id}
        sx={{
          '& .MuiTreeItem-content': {
            alignItems: 'flex-start',
            borderLeft: '1px solid transparent',
            padding: '8px 16px 8px 0',
            width: 'auto',
          },
          '& .MuiTreeItem-group': {
            borderLeft: '1px solid',
            borderLeftColor: 'grey.300',
          },
          '& .MuiTreeItem-iconContainer': {
            paddingBlockStart: 0.5,
          },
          '& .MuiTreeItem-label': {
            paddingLeft: 0,
          },
          '& .MuiTreeItem-root': {
            '&:focus > .MuiTreeItem-content': {
              backgroundColor: 'action.selected',
            },
            '&:hover > .MuiTreeItem-content': {
              backgroundColor: 'action.hover',
            },
            '&:hover > .MuiTreeItem-content .MuiTreeItem-label, &:focus > .MuiTreeItem-content .MuiTreeItem-label, &.MuiTreeItem-selected > .MuiTreeItem-content .MuiTreeItem-label, &.MuiTreeItem-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, &.MuiTreeItem-selected:focus > .MuiTreeItem-content .MuiTreeItem-label': {
              backgroundColor: 'transparent',
            },
          },
        }}
        label={(
          <StyledVisibleNode
            sx={theme => ({
              backgroundColor: visibleNodeIds.indexOf(node.id) !== -1
              && alpha(theme.palette.highlights?.primary || theme.palette.action.selected, 0.35),
              display: visibleNodeIds.indexOf(node.id) !== -1 && 'inline',
            })}
          >
            {node.label}
          </StyledVisibleNode>
      )}
      >
        {Array.isArray(node.nodes) ? node.nodes.map((n) => renderTree(n)) : null}
      </TreeItem>
    </ScrollToForTreeItem>
  );

  return (
    <TreeView
      sx={{ flexGrow: 1 }}
      defaultCollapseIcon={<ExpandMoreIcon color="action" />}
      defaultExpandIcon={<ChevronRightIcon color="action" />}
      defaultEndIcon={null}
      onNodeSelect={handleNodeSelect}
      onNodeToggle={handleNodeToggle}
      expanded={expandedNodeIds}
    >
      { Array.isArray(treeStructure.nodes) ? treeStructure.nodes.map(n => renderTree(n)) : null }
    </TreeView>
  );
}

SidebarIndexTableOfContents.propTypes = {
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  expandedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expandNodes: PropTypes.func.isRequired,
  nodeIdToScrollTo: PropTypes.func.isRequired,
  setCanvas: PropTypes.func.isRequired,
  toggleNode: PropTypes.func.isRequired,
  treeStructure: PropTypes.objectOf().isRequired,
  visibleNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  windowId: PropTypes.string.isRequired,
};

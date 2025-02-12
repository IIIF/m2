import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

/** */
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

/** */
const ScrollToForTreeItem = ({ children, itemId, ...props }) => (
  <ScrollTo {...props}>
    {children}
  </ScrollTo>
);

ScrollToForTreeItem.propTypes = {
  children: PropTypes.node.isRequired,
  itemId: PropTypes.string.isRequired,
};

/** */
const CollapseIcon = (props) => <ExpandMoreIcon {...props} color="action" />;
/** */
const ExpandIcon = (props) => <ChevronRightIcon {...props} color="action" />;
/** */
export function SidebarIndexTableOfContents({
  toggleNode, expandNodes, setCanvas, windowId,
  treeStructure, visibleNodeIds, expandedNodeIds, containerRef, nodeIdToScrollTo,
}) {
  /** */
  const handleNodeSelect = (event, itemId) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      toggleNode(itemId);
    }

    selectTreeItem(itemId);
  };

  /** */
  const handleNodeToggle = (_event, itemIds) => {
    expandNodes(itemIds);
  };

  /** */
  const selectTreeItem = (itemId) => {
    const node = deepFind(treeStructure, itemId);

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

  /** */
  const renderTree = (node) => (
    <ScrollToForTreeItem
      containerRef={containerRef}
      key={node.id}
      itemId={node.id}
      offsetTop={96}
      scrollTo={nodeIdToScrollTo === node.id}
    >
      <TreeItem
        itemId={node.id}
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
        {node.nodes && node.nodes.length > 0 ? node.nodes.map(renderTree) : null}
      </TreeItem>
    </ScrollToForTreeItem>
  );

  return (
    <SimpleTreeView
      sx={{ flexGrow: 1 }}
      slots={{
        collapseIcon: CollapseIcon,
        endIcon: null,
        expandIcon: ExpandIcon,
      }}
      onSelectedItemsChange={handleNodeSelect}
      onExpandedItemsChange={handleNodeToggle}
      expandedItems={expandedNodeIds}
    >
      {Array.isArray(treeStructure.nodes) && treeStructure.nodes.length > 0
        ? treeStructure.nodes.map(n => renderTree(n))
        : <p>No items found</p>}
    </SimpleTreeView>
  );
}

SidebarIndexTableOfContents.propTypes = {
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  expandedNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  expandNodes: PropTypes.func.isRequired,
  nodeIdToScrollTo: PropTypes.string.isRequired,
  setCanvas: PropTypes.func.isRequired,
  toggleNode: PropTypes.func.isRequired,
  treeStructure: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      nodes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    })),
  }).isRequired,
  visibleNodeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  windowId: PropTypes.string.isRequired,
};

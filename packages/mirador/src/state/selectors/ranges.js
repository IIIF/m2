import { createSelector } from 'reselect';
import union from 'lodash/union';
import without from 'lodash/without';
import { Utils } from 'manifesto.js';
import { getVisibleCanvasIds } from './canvases';
import { getCompanionWindow } from './companionWindows';
import { getSequenceTreeStructure } from './sequences';

/** */
function rangeContainsCanvasId(range, canvasId) {
  const canvasIds = range.getCanvasIds();
  for (let i = 0; i < canvasIds.length; i += 1) {
    if (Utils.normalisedUrlsMatch(canvasIds[i], canvasId)) {
      return true;
    }
  }
  return false;
}

/** */
function getAllParentIds(node) {
  if (node.parentNode === undefined) {
    return [];
  }
  if (node.parentNode.parentNode === undefined) {
    return [node.parentNode.id];
  }
  return [...getAllParentIds(node.parentNode), node.parentNode.id];
}

/** */
function getVisibleNodeIdsInSubTree(nodes, canvasIds) {
  return nodes.reduce((nodeIdAcc, node) => {
    const result = [];
    result.push(...nodeIdAcc);
    const nodeContainsVisibleCanvas = canvasIds.reduce(
      (acc, canvasId) => acc || rangeContainsCanvasId(node.data, canvasId),
      false,
    );
    const subTreeVisibleNodeIds = node.nodes.length > 0
      ? getVisibleNodeIdsInSubTree(node.nodes, canvasIds)
      : [];
    result.push(...subTreeVisibleNodeIds);
    if (nodeContainsVisibleCanvas || subTreeVisibleNodeIds.length > 0) {
      result.push({
        containsVisibleCanvas: nodeContainsVisibleCanvas,
        descendantsContainVisibleCanvas: subTreeVisibleNodeIds.length > 0,
        id: node.id,
        leaf: node.nodes.length === 0,
        parentIds: getAllParentIds(node),
      });
    }
    return result;
  }, []);
}

/** */
const getVisibleLeafAndBranchNodeIds = createSelector(
  [
    getSequenceTreeStructure,
    getVisibleCanvasIds,
  ],
  (tree, canvasIds) => {
    if (canvasIds.length === 0 || !tree) return [];
    return getVisibleNodeIdsInSubTree(tree.nodes, canvasIds);
  },
);

/**
 * Returns visible node ids.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getVisibleNodeIds = createSelector(
  [
    getVisibleLeafAndBranchNodeIds,
  ],
  visibleLeafAndBranchNodeIds => visibleLeafAndBranchNodeIds.map(item => item.id),
);

const getVisibleBranchNodeIds = createSelector(
  [
    getVisibleLeafAndBranchNodeIds,
  ],
  visibleLeafAndBranchNodeIds => visibleLeafAndBranchNodeIds.reduce(
    (acc, item) => (item.leaf || !item.descendantsContainVisibleCanvas ? acc : [...acc, item.id]),
    [],
  ),
);

const getCanvasContainingNodeIds = createSelector(
  [
    getVisibleLeafAndBranchNodeIds,
  ],
  visibleLeafAndBranchNodeIds => visibleLeafAndBranchNodeIds.reduce(
    (acc, item) => (item.containsVisibleCanvas ? [...acc, item] : acc),
    [],
  ),
);

/**
 * Returns ids of manually exanded nodes.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @param expanded
 * @returns {Array}
 */
export function getManuallyExpandedNodeIds(state, { companionWindowId }, expanded) {
  const companionWindow = getCompanionWindow(state, { companionWindowId });
  return companionWindow.tocNodes ? Object.keys(companionWindow.tocNodes).reduce(
    (acc, nodeId) => (companionWindow.tocNodes[nodeId].expanded === expanded
      ? [...acc, nodeId]
      : acc),
    [],
  ) : [];
}

/**
 * Returns ids of exanded nodes.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @param {string} props.windowId
 * @returns {Array}
 */
export function getExpandedNodeIds(state, { companionWindowId, windowId }) {
  const visibleBranchNodeIds = getVisibleBranchNodeIds(state, { companionWindowId, windowId });
  const manuallyExpandedNodeIds = getManuallyExpandedNodeIds(state, { companionWindowId }, true);
  const manuallyClosedNodeIds = getManuallyExpandedNodeIds(state, { companionWindowId }, false);
  return without(union(manuallyExpandedNodeIds, visibleBranchNodeIds), ...manuallyClosedNodeIds);
}

/**
 * Returns id of node to scroll to.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @param {string} props.windowId
 * @param {string} props.manifestid
 * @returns {string}
 */
export function getNodeIdToScrollTo(state, { ...args }) {
  const canvasContainingNodeIds = getCanvasContainingNodeIds(state, { ...args });
  const collapsedNodeIds = getManuallyExpandedNodeIds(state, args, false);
  if (canvasContainingNodeIds && canvasContainingNodeIds.length > 0) {
    for (let i = 0; i < canvasContainingNodeIds[0].parentIds.length; i += 1) {
      if (collapsedNodeIds.indexOf(canvasContainingNodeIds[0].parentIds[i]) !== -1) {
        return canvasContainingNodeIds[0].parentIds[i];
      }
    }
    return canvasContainingNodeIds[0].id;
  }
  return null;
}

/**
 * Returns the default sidebar variant depending on whether or not ranges exist.
 * @param {object} state
 * @param {string}
 * @returns {string}
 */
export const getDefaultSidebarVariant = createSelector(
  [
    getSequenceTreeStructure,
  ],
  tree => (
    tree && tree.nodes && tree.nodes.length > 0 ? 'tableOfContents' : 'item'
  ),
);

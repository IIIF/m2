import { v4 as uuid } from 'uuid';
import ActionTypes from './action-types';
import { getCompanionWindowIdsForPosition, getManuallyExpandedNodeIds, getVisibleNodeIds } from '../selectors';

const defaultProps = {
  content: null,
  position: null,
};

/** */
export function addCompanionWindow(windowId, payload, defaults = defaultProps) {
  const id = `cw-${uuid()}`;

  return {
    id,
    payload: {
      ...defaults, ...payload, id, windowId,
    },
    type: ActionTypes.ADD_COMPANION_WINDOW,
    windowId,
  };
}

/** */
export function addOrUpdateCompanionWindow(windowId, payload, defaults = defaultProps) {
  return (dispatch, getState) => {
    const state = getState();
    const { position } = payload;

    const updatableWindowId = position === 'left' && getCompanionWindowIdsForPosition(state, { position, windowId })[0];

    if (updatableWindowId) {
      dispatch(updateCompanionWindow(windowId, updatableWindowId, payload));
    } else {
      dispatch(addCompanionWindow(windowId, payload, defaults));
    }
  };
}

/** */
export function updateCompanionWindow(windowId, id, payload) {
  return {
    id,
    payload,
    type: ActionTypes.UPDATE_COMPANION_WINDOW,
    windowId,
  };
}

/** */
export function removeCompanionWindow(windowId, id) {
  return {
    id,
    type: ActionTypes.REMOVE_COMPANION_WINDOW,
    windowId,
  };
}

/** */
export function toggleNode(windowId, id, nodeId) {
  return (dispatch, getState) => {
    const state = getState();
    const collapsedNodeIds = getManuallyExpandedNodeIds(state, { companionWindowId: id }, false);
    const expandedNodeIds = getManuallyExpandedNodeIds(state, { companionWindowId: id }, true);
    const visibleNodeIds = getVisibleNodeIds(state, { id, windowId });
    const expand = collapsedNodeIds.indexOf(nodeId) !== -1
      || (expandedNodeIds.indexOf(nodeId) === -1 && visibleNodeIds.indexOf(nodeId) === -1);
    return dispatch({
      id,
      payload: {
        [nodeId]: {
          expanded: expand,
        },
      },
      type: ActionTypes.TOGGLE_TOC_NODE,
      windowId,
    });
  };
}

/** Update the expanded nodes state */
export function expandNodes(windowId, id, nodeIds) {
  return (dispatch, getState) => {
    const state = getState();
    const expandedNodeIds = getManuallyExpandedNodeIds(state, { companionWindowId: id }, true);
    const payload = {};

    expandedNodeIds.forEach(nodeId => {
      payload[nodeId] = { expanded: false };
    });

    nodeIds.forEach(nodeId => {
      payload[nodeId] = { expanded: true };
    });

    return dispatch({
      id,
      payload,
      type: ActionTypes.TOGGLE_TOC_NODE,
      windowId,
    });
  };
}

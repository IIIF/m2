import set from 'lodash/fp/set';

import noRangesJson from '../../fixtures/version-2/001.json';
import manifestJson from '../../fixtures/version-2/structures.json';
import presentation3Json from '../../fixtures/version-3/structures.json';
import {
  getVisibleNodeIds,
  getManuallyExpandedNodeIds,
  getExpandedNodeIds,
  getNodeIdToScrollTo,
  getDefaultSidebarVariant,
} from '../../../src/state/selectors';

const state = {
  companionWindows: {
    cw123: {},
    cw456: {},
  },
  manifests: {
    mID: {
      id: 'mID',
      json: manifestJson,
    },
  },
  windows: {
    w1: {
      companionWindowIds: ['cw123', 'cw456'],
      id: 'w1',
      manifestId: 'mID',
      visibleCanvases: ['http://foo.test/1/canvas/c6'],
    },
  },
};

const expandedNodesState = set(['companionWindows', 'cw123', 'tocNodes'], {
  '0-0': {
    expanded: false,
  },
  '0-1': {
    expanded: true,
  },
  '0-1-1': {
    expanded: true,
  },
  '0-1-2': {
    expanded: false,
  },
}, state);

describe('getVisibleNodeIds', () => {
  const prezi3BookState = set(['manifests', 'mID', 'json'], presentation3Json, state);
  const prezi3State = set(['windows', 'w1', 'view'], 'single', prezi3BookState);

  it('contains node ids for all ranges which contain currently visible canvases, and for their parents', () => {
    const visibleNodeIds = getVisibleNodeIds(state, { windowId: 'w1' });
    expect(visibleNodeIds).toEqual(expect.arrayContaining([
      '0-1',
      '0-1-1',
      '0-1-1-0',
      '0-1-1-1',
    ]));
    expect(visibleNodeIds.length).toBe(4);

    const prezi3StateForCanvas2 = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c2'], prezi3State);
    const prezi3visibleNodeIds = getVisibleNodeIds(prezi3StateForCanvas2, { windowId: 'w1' });
    expect(prezi3visibleNodeIds).toEqual(expect.arrayContaining([
      '0-0',
      '0-0-0',
    ]));
    expect(prezi3visibleNodeIds.length).toBe(2);
  });

  it('contains node ids for ranges with currently visible canvas fragments', () => {
    const prezi2XYWHFragmentBookState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c3'], state);
    const prezi2XYWHFragmentState = set(['windows', 'w1', 'view'], 'single', prezi2XYWHFragmentBookState);
    const visibleNodeIdsForPrezi2 = getVisibleNodeIds(prezi2XYWHFragmentState, { windowId: 'w1' });
    expect(visibleNodeIdsForPrezi2).toEqual(expect.arrayContaining([
      '0-0',
      '0-0-1',
    ]));
    expect(visibleNodeIdsForPrezi2.length).toBe(2);

    const prezi3XYWHFragmentState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c3'], prezi3State);
    const visibleNodeIdsForXYWHFragment = getVisibleNodeIds(prezi3XYWHFragmentState, { windowId: 'w1' });
    expect(visibleNodeIdsForXYWHFragment).toEqual(expect.arrayContaining([
      '0-0',
      '0-0-0',
    ]));
    expect(visibleNodeIdsForXYWHFragment.length).toBe(2);

    const prezi3TemporalFragmentState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c4'], prezi3State);
    const visibleNodeIdsForTemporalFragment = getVisibleNodeIds(prezi3TemporalFragmentState, { windowId: 'w1' });
    expect(visibleNodeIdsForTemporalFragment).toEqual(expect.arrayContaining([
      '0-0',
      '0-0-0',
    ]));
    expect(visibleNodeIdsForTemporalFragment.length).toBe(2);
  });

  // This test fails as there is no support for SpecificResource in manifesto yet
  it.skip('contains node ids for ranges that contain a SpecificResource based on a current canvas', () => {
    const specificResourceState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c5'], prezi3State);
    const visibleNodeIds = getVisibleNodeIds(specificResourceState, { windowId: 'w1' });
    expect(visibleNodeIds).toEqual(expect.arrayContaining([
      '0-0',
      '0-0-0',
    ]));
    expect(visibleNodeIds.length).toBe(2);
  });
});

describe('getManuallyExpandedNodeIds', () => {
  it('returns empty array if there are no manually opened or closed nodes', () => {
    expect(getManuallyExpandedNodeIds(state, { companionWindowId: 'cw123', windowId: 'w1' }, true)).toEqual([]);
    expect(getManuallyExpandedNodeIds(state, { companionWindowId: 'cw123', windowId: 'w1' }, false)).toEqual([]);
  });

  it('returns manually opened and closed node ids correctly', () => {
    expect(getManuallyExpandedNodeIds(expandedNodesState, { companionWindowId: 'cw123' }, true)).toEqual(['0-1', '0-1-1']);
    expect(getManuallyExpandedNodeIds(expandedNodesState, { companionWindowId: 'cw123' }, false)).toEqual(['0-0', '0-1-2']);
  });
});

describe('getExpandedNodeIds', () => {
  it('returns manually expanded node ids and visible, non collapsed branch node ids', () => {
    const canvas8BookViewState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c8', 'http://foo.test/1/canvas/c9'], expandedNodesState);
    const canvas8BookViewVisibleNodeIds = getExpandedNodeIds(canvas8BookViewState, { companionWindowId: 'cw123', windowId: 'w1' });
    expect(canvas8BookViewVisibleNodeIds).toEqual(expect.arrayContaining([
      '0-1',
      '0-1-1',
      '0-2',
      '0-2-1',
      '0-2-2',
    ]));
    expect(canvas8BookViewVisibleNodeIds.length).toBe(5);

    const canvas8SingleViewState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c8'], canvas8BookViewState);
    const canvas8SingleViewVisibleNodeIds = getExpandedNodeIds(canvas8SingleViewState, { companionWindowId: 'cw123', windowId: 'w1' });
    expect(canvas8SingleViewVisibleNodeIds).toEqual(expect.arrayContaining([
      '0-1',
      '0-1-1',
    ]));
    expect(canvas8SingleViewVisibleNodeIds.length).toBe(2);
  });

  it('returns a combination of manually opened and current canvas containing node ids', () => {
    const canvas9State = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c9'], expandedNodesState);
    const expandedNodeIds = getExpandedNodeIds(canvas9State, { companionWindowId: 'cw123', windowId: 'w1' });
    expect(expandedNodeIds).toEqual(expect.arrayContaining([
      '0-1',
      '0-1-1',
      '0-2',
      '0-2-1',
      '0-2-2',
    ]));
    expect(expandedNodeIds.length).toBe(5);
  });

  it('does not contain ids of nodes whos descendants do not contain currently visible canvases', () => {
    const canvas13State = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c13'], state);
    const expandedNodeIds = getExpandedNodeIds(canvas13State, { companionWindowId: 'cw123', windowId: 'w1' });
    expect(expandedNodeIds.length).toBe(0);
  });
});

describe('getNodeIdToScrollTo', () => {
  it('returns first leaf node with visible canvas', () => {
    expect(getNodeIdToScrollTo(state, { companionWindowId: 'cw123', windowId: 'w1' })).toBe('0-1-1-0');
  });

  it('returns branch node with visible canvas if it is the deepest in the tree to contain a canvas', () => {
    const canvas10State = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c10'], expandedNodesState);
    expect(getNodeIdToScrollTo(canvas10State, { companionWindowId: 'cw123', windowId: 'w1' })).toBe('0-2-1');
  });

  it('returns the deepest non hidden branch node if leaf node or its parent node are collapsed', () => {
    const closedParentState1 = set(['companionWindows', 'cw123', 'tocNodes'], { '0-1-1': { expanded: false } }, state);
    expect(getNodeIdToScrollTo(closedParentState1, { companionWindowId: 'cw123', windowId: 'w1' })).toBe('0-1-1');
    const closedParentState2 = set(['companionWindows', 'cw123', 'tocNodes'], {
      '0-1': { expanded: false },
      '0-1-1': { expanded: false },
    }, state);
    expect(getNodeIdToScrollTo(closedParentState2, { companionWindowId: 'cw123', windowId: 'w1' })).toBe('0-1');
  });

  it('returns no node id if current canvas is not contained in any range', () => {
    const singleViewState = set(['windows', 'w1', 'view'], 'single', expandedNodesState);
    const rangeFreeCanvasState = set(['windows', 'w1', 'visibleCanvases'], ['http://foo.test/1/canvas/c12'], singleViewState);
    expect(getNodeIdToScrollTo(rangeFreeCanvasState, { companionWindowId: 'cw123', windowId: 'w1' })).toBe(null);
  });
});

describe('getDefaultSidebarVariant', () => {
  it('returns thumbnail when no ranges exist', () => {
    const noRangeState = set(['manifests', 'mID', 'json'], noRangesJson, state);
    expect(getDefaultSidebarVariant(noRangeState, { windowId: 'w1' })).toBe('item');
  });
  it('returns tableOfContents when ranges exist', () => {
    expect(getDefaultSidebarVariant(state, { windowId: 'w1' })).toBe('tableOfContents');
  });
});

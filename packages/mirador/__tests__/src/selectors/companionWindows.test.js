import {
  getCompanionAreaVisibility,
  getThumbnailNavigationPosition,
  getCompanionWindow,
  getCompanionWindowsForPosition,
  selectCompanionWindowDimensions,
  getCompanionWindowsForContent,
} from '../../../src/state/selectors/companionWindows';

describe('getThumbnailNavigationPosition', () => {
  const state = {
    companionWindows: {
      cw_a: { position: 'bottom' },
    },
    windows: {
      a: { id: 'a', thumbnailNavigationId: 'cw_a' },
      b: { id: 'b', thumbnailNavigationId: 'cw_b' },
    },
  };

  it('should return thumbnail navigation position if window exists', () => {
    const received = getThumbnailNavigationPosition(state, { windowId: 'a' });
    expect(received).toBe('bottom');
  });

  it('should return undefined if position does not exist in window', () => {
    const received = getThumbnailNavigationPosition(state, { windowId: 'b' });
    expect(received).toBeUndefined();
  });

  it('should return undefined if window does not exists', () => {
    const received = getThumbnailNavigationPosition(state, { windowId: 'c' });
    expect(received).toBeUndefined();
  });
});

describe('getCompanionWindowsForPosition', () => {
  const state = {
    companionWindows: {
      abc: { id: 'abc', position: 'right' },
      xyz: { id: 'xyz', position: 'bottom' },
    },
    windows: {
      a: { companionWindowIds: ['abc'] },
      b: { companionWindowIds: ['xyz'] },
    },
  };

  it('the companion window type based on the given position', () => {
    const received = getCompanionWindowsForPosition(state, {
      position: 'right',
      windowId: 'a',
    });
    expect(received.length).toBe(1);
    expect(received[0].id).toEqual('abc');
  });

  it('returns undefined if the given window does not exist', () => {
    const received = getCompanionWindowsForPosition(state, {
      position: 'right',
      windowId: 'c',
    });

    expect(received).toEqual([]);
  });

  it('returns undefined if a companion window at the given position does not exist', () => {
    const received = getCompanionWindowsForPosition(state, {
      position: 'bottom',
      windowId: 'a',
    });

    expect(received).toEqual([]);
  });

  it('uses the same arrays to mimimize downstream rerendering', () => {
    const expected = getCompanionWindowsForPosition(state, {
      position: 'right',
      windowId: 'a',
    });

    getCompanionWindowsForPosition(state, {
      position: 'bottom',
      windowId: 'b',
    });

    const received = getCompanionWindowsForPosition(state, {
      position: 'right',
      windowId: 'a',
    });

    expect(received).toBe(expected);
  });
});

describe('getCompanionWindow', () => {
  const state = {
    companionWindows: {
      bar: {
        content: 'canvas',
        id: 'bar',
      },
    },
  };

  it('should return companion windows for a given window id', () => {
    const received = getCompanionWindow(state, { companionWindowId: 'bar' });

    expect(received).toEqual({
      content: 'canvas',
      id: 'bar',
    });
  });
});

describe('getCompanionAreaVisibility', () => {
  describe('in the left position', () => {
    it('is true if the companionArea and sideBar are set to be open', () => {
      const state = {
        windows: {
          abc123: { companionAreaOpen: true, sideBarOpen: true },
        },
      };
      const props = { position: 'left', windowId: 'abc123' };

      expect(getCompanionAreaVisibility(state, props)).toBe(true);
    });

    it('is false if either companionArea or the sideBar are set to be closed', () => {
      const companionAreaClosedState = {
        windows: {
          abc123: { companionAreaOpen: false, sideBarOpen: true },
        },
      };
      const sideBarClosedState = {
        windows: {
          abc123: { companionAreaOpen: true, sideBarOpen: false },
        },
      };
      const props = { position: 'left', windowId: 'abc123' };

      expect(getCompanionAreaVisibility(companionAreaClosedState, props)).toBe(false);
      expect(getCompanionAreaVisibility(sideBarClosedState, props)).toBe(false);
    });
  });

  describe('in any non-left position', () => {
    it('is true', () => {
      const state = {
        windows: {
          abc123: { companionAreaOpen: false, sideBarOpen: false },
        },
      };
      const props = { position: 'right', windowId: 'abc123' };

      expect(getCompanionAreaVisibility(state, props)).toBe(true);
    });
  });
});

describe('selectCompanionWindowDimensions', () => {
  it('tallies up the width/height of the companion windows', () => {
    const state = {
      companionWindows: {
        abc: { id: 'abc', position: 'right' },
        def: { id: 'def', position: 'right' },
        xyz: { id: 'xyz', position: 'bottom' },
      },
      windows: { a: { companionWindowIds: ['abc', 'def', 'xyz'] } },
    };

    const props = { windowId: 'a' };

    expect(selectCompanionWindowDimensions(state, props)).toEqual({
      height: 201,
      width: 235 * 2,
    });
  });
});

describe('getCompanionWindowsForContent', () => {
  it('filters the companion windows for a window based on content', () => {
    const state = {
      companionWindows: {
        abc: { content: 'search', id: 'abc' },
        def: { content: 'search', id: 'def' },
        xyz: { content: 'annotations', id: 'xyz' },
      },
      windows: { a: { companionWindowIds: ['abc', 'def', 'xyz'] } },
    };

    const props = { content: 'search', windowId: 'a' };

    expect(getCompanionWindowsForContent(state, props).map(cw => cw.id)).toEqual([
      'abc', 'def',
    ]);
  });
});

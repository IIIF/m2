import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture002 from '../../fixtures/version-2/002.json';
import manifestFixture015 from '../../fixtures/version-2/015.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import {
  getWindowConfig,
  getWindowTitles,
  getWindowViewType,
  getWindowDraggability,
  getMaximizedWindowsIds,
  getAllowedWindowViewTypes,
} from '../../../src/state/selectors/windows';

describe('getWindowConfig', () => {
  it('merges the current window with the global defaults', () => {
    const state = {
      config: {
        window: { a: '1', b: '2' },
      },
      windows: {
        a: { b: '3', c: '4' },
      },
    };

    expect(getWindowConfig(state, { windowId: 'a' })).toEqual({ a: '1', b: '3', c: '4' });
  });
  it('gracefully handles missing windows', () => {
    const state = {
      config: {
        window: { a: '1', b: '2' },
      },
      windows: {
        a: {},
      },
    };

    expect(getWindowConfig(state, { windowId: 'c' })).toEqual({ a: '1', b: '2' });
  });
});

describe('getMaximizedWindowsIds', () => {
  it('filters windows to only those maximized', () => {
    const state = {
      windows: {
        a: { id: 'a', maximized: true },
        b: { id: 'b' },
      },
    };

    const received = getMaximizedWindowsIds(state);

    expect(received).toEqual(['a']);
  });
});

describe('getWindowTitles', () => {
  it('should return manifest titles for the open windows', () => {
    const state = {
      manifests: {
        amanifest: { json: manifestFixture001 },
        bmanifest: { json: manifestFixture002 },
        cmanifest: { json: manifestFixture019 },
      },
      windows: {
        a: { manifestId: 'amanifest' },
        b: { manifestId: 'bmanifest' },
      },
    };

    const received = getWindowTitles(state);

    expect(received).toEqual({
      a: 'Bodleian Library Human Freaks 2 (33)',
      b: 'Test 2 Manifest: Metadata Pairs',
    });
  });
});

describe('getWindowViewType', () => {
  const state = {
    config: {
      window: {
        defaultView: 'default',
        views: [
          { behaviors: ['individuals'], key: 'single' },
          { behaviors: ['paged'], key: 'book' },
          { behaviors: ['continuous'], key: 'scroll' },
          { key: 'gallery' },
        ],
      },
    },
    manifests: {
      x: { json: { ...manifestFixture001 } },
      y: { json: { ...manifestFixture015 } },
    },
    windows: {
      a: { id: 'a', view: 'single' },
      b: { id: 'b' },
      d: { id: 'd', manifestId: 'x' },
      e: { id: 'e', manifestId: 'x', view: 'book' },
      f: { id: 'f', manifestId: 'y' },
    },
  };

  it('should return view type if window exists', () => {
    const received = getWindowViewType(state, { windowId: 'a' });
    expect(received).toBe('single');
  });

  it('should return the default if view type does not exist in window', () => {
    const received = getWindowViewType(state, { windowId: 'b' });
    expect(received).toBe('default');
  });

  it('should return the default if window does not exists', () => {
    const received = getWindowViewType(state, { windowId: 'c' });
    expect(received).toBe('default');
  });

  it('should return modified viewingHint if view type does not exist', () => {
    const received = getWindowViewType(state, { windowId: 'd' });
    expect(received).toEqual('single');
  });

  it('should return window view type even if viewingHint is available', () => {
    const received = getWindowViewType(state, { windowId: 'e' });
    expect(received).toEqual('book');
  });

  it('should return modified viewingHint for a book', () => {
    const received = getWindowViewType(state, { windowId: 'f' });
    expect(received).toEqual('book');
  });
});

describe('getAllowedWindowViewTypes', () => {
  const state = {
    config: {
      window: {
        defaultView: 'single',
        views: [
          { behaviors: ['individuals'], key: 'single' },
          { behaviors: ['paged'], key: 'book' },
          { behaviors: ['continuous'], key: 'scroll' },
          { key: 'gallery' },
        ],
      },
    },
    manifests: {
      x: { json: { ...manifestFixture001 } },
      y: { json: { ...manifestFixture015 } },
    },
  };

  it('should return unrestricted view types', () => {
    const received = getAllowedWindowViewTypes(state, { manifestId: 'x' });
    expect(received).toEqual(['single', 'gallery']);
  });

  it('should return view types where behaviors match', () => {
    const received = getAllowedWindowViewTypes(state, { manifestId: 'y' });
    expect(received).toEqual(['single', 'book', 'gallery']);
  });
});

describe('getWindowDraggability', () => {
  describe('in elastic mode', () => {
    it('is always true', () => {
      const state = {
        workspace: { type: 'elastic' },
      };
      const props = {};

      expect(getWindowDraggability(state, props)).toBe(true);
    });
  });

  describe('in non-elastic mode', () => {
    it('is false if there is only one window', () => {
      const state = {
        workspace: { type: 'mosaic', windowIds: ['abc123'] },
      };
      const props = { windowId: 'abc123' };

      expect(getWindowDraggability(state, props)).toBe(false);
    });

    it('is false when the window is maximized', () => {
      const state = {
        windows: { abc123: { maximized: true }, abc321: { maximized: false } },
        workspace: { type: 'mosaic', windowIds: ['abc123', 'abc321'] },
      };
      const props = { windowId: 'abc123' };

      expect(getWindowDraggability(state, props)).toBe(false);
    });

    it('is true if there are many windows (as long as the window is not maximized)', () => {
      const state = {
        windows: { abc123: { maximized: false }, abc321: { maximized: false } },
        workspace: { type: 'mosaic', windowIds: ['abc123', 'abc321'] },
      };
      const props = { windowId: 'abc123' };

      expect(getWindowDraggability(state, props)).toBe(true);
    });
  });
});

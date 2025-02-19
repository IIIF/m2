import {
  getManifest,
  getViewer,
  getWindowManifests,
  getWindows,
  getCatalog,
} from '../../../src/state/selectors/getters';

describe('getManifest()', () => {
  const state = {
    manifests: {
      x: { id: 'x' },
    },
    windows: {
      a: { id: 'a', manifestId: 'x' },
      b: { id: 'b', manifestId: 'y' },
      c: { id: 'c' },
    },
  };

  it('should return the manifest of a certain id', () => {
    const received = getManifest(state, { manifestId: 'x' });
    const expected = { id: 'x' };
    expect(received).toEqual(expected);
  });

  it('should return the manifest of a certain window', () => {
    const received = getManifest(state, { windowId: 'a' });
    const expected = { id: 'x' };
    expect(received).toEqual(expected);
  });

  it('should return undefined if window doesnt exist', () => {
    const received = getManifest(state, { windowId: 'unknown' });
    expect(received).toBeUndefined();
  });

  it('should return undefined if window has no manifest id', () => {
    const received = getManifest(state, { windowId: 'c' });
    expect(received).toBeUndefined();
  });

  it('should return undefined if manifest does not exist', () => {
    const received = getManifest(state, { windowId: 'b' });
    expect(received).toBeUndefined();
  });
});

describe('getWindows', () => {
  it('should return windows from state', () => {
    const state = {
      windows: {
        a: { manifestId: 'amanifest' },
        b: { manifestId: 'bmanifest' },
      },
    };

    const received = getWindows(state);

    expect(received).toEqual(state.windows);
  });
});

describe('getWindowManifests', () => {
  it('should return manifest titles for the open windows', () => {
    const state = {
      windows: {
        a: { manifestId: 'amanifest' },
        b: { manifestId: 'bmanifest' },
      },
    };

    const received = getWindowManifests(state);

    expect(received).toEqual(['amanifest', 'bmanifest']);
  });
});

describe('getViewer', () => {
  const state = {
    viewers: {
      bar: {
        id: 'bar',
      },
    },
  };

  it('should return companion windows for a given window id', () => {
    const received = getViewer(state, { windowId: 'bar' });

    expect(received).toEqual({
      id: 'bar',
    });
  });
});

describe('getCatalog', () => {
  const catalog = [{ a: 1 }];
  const state = {
    catalog,
  };

  it('should return companion windows for a given window id', () => {
    const received = getCatalog(state);

    expect(received).toEqual(catalog);
  });
});

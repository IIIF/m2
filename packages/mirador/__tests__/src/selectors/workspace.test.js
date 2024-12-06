import {
  getFullScreenEnabled,
  getWorkspaceType,
  isFocused,
} from '../../../src/state/selectors';

describe('getFullScreenEnabled', () => {
  it('returns the workspace configuration for full screen', () => {
    const state = { workspace: { isFullscreenEnabled: true } };
    expect(getFullScreenEnabled(state)).toEqual(true);
  });
});

describe('getWorkspaceType', () => {
  it('returns the workspace type', () => {
    const state = { workspace: { type: 'elastic' } };
    expect(getWorkspaceType(state)).toEqual('elastic');
  });
});

describe('isFocused', () => {
  it('is true if the window has focus', () => {
    const state = { workspace: { focusedWindowId: 'a' } };
    expect(isFocused(state, { windowId: 'a' })).toEqual(true);
  });
  it('is false if the window does not has focus', () => {
    const state = { workspace: { focusedWindowId: 'a' } };
    expect(isFocused(state, { windowId: 'b' })).toEqual(false);
  });
});

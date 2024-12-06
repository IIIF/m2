import { expect, it } from 'vitest';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/index';

describe('Import/Export state', () => {
  setupIntegrationTestViewer(config);

  it('persists a viewer state after importing', async (context) => {
    const state = context.miradorInstance.store.getState();
    const windows = Object.keys(state.viewers);
    state.viewers[windows[0]] = {
      x: 1000,
      y: 1000,
      zoom: 0.001,
    };
    context.miradorInstance.store.dispatch({ state, type: 'mirador/IMPORT_MIRADOR_STATE' });
    expect(state.viewers[windows[0]]).toEqual(
      { x: 1000, y: 1000, zoom: 0.001 },
    );
  });

  // TODO: test the bugfix for the OSD viewer somehow?
});

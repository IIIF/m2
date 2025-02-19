import { expect, it } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-state';

describe('how plugins relate to state', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('plugin can read from state', async () => {
    const text = 'Plugin:https://iiif.harvardartmuseums.org/manifests/object/299843';
    const elementWithText = await screen.findByText(text);
    expect(elementWithText).toHaveTextContent(text);
  });

  it('plugin reducers should be included to state', async (context) => {
    // Test if the plugin state exists in the store
    const { pluginState } = context.miradorInstance.store.getState();
    expect(pluginState).toBeDefined();
  });

  // TODO: not working, likely due to thumnails not loading, see thumbnail-navigation.test.js
  it.skip('plugin can dispatch custom action to write to its reducer', async (context) => {
    expect(context.miradorInstance.store.getState().pluginState.canvasChangeCount).toBe(0);
    const nextCanvas = screen.getByRole('button', { name: 'Next item' });
    fireEvent.click(nextCanvas);
    expect(await context.miradorInstance.store.getState().pluginState.canvasChangeCount).toBe(1);
  });
});

import { expect, it } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-companion-window';

describe('add plugins for companion windows', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('added a plugin to the window sidebar and companion window', async () => {
    const toggleButtons = await screen.findAllByLabelText(/toggle sidebar/i);

    // Click the first toggle button (ignore a weird mui clone that is also in the DOM?)
    fireEvent.click(toggleButtons[0]);

    // Open sidebar where our custom plugin button will be
    await waitFor(async () => {
      const companionWindowLeft = document.querySelector('.mirador-companion-window-left.mirador-window-sidebar-info-panel'); // eslint-disable-line testing-library/no-node-access
      expect(companionWindowLeft).toBeInTheDocument();
    });

    // Click our custom button
    const pluginButton = screen.getByTestId('add-plugin-companion-window-button');
    expect(pluginButton).toBeInTheDocument();
    fireEvent.click(pluginButton);

    const plugin = screen.getByTestId('add-plugin-companion-window');
    expect(plugin).toBeInTheDocument();
  });
});

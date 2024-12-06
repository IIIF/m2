import { expect, it } from 'vitest';
import {
  screen, waitFor, fireEvent, within,
} from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-add';

describe('add two plugins to <WorkspaceControlPanelButtons>', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('all add plugins are present', async () => {
    expect(await screen.findByText('Plugin A')).toBeInTheDocument();
    expect(await screen.findByText('Plugin B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('hello componentD')).toBeInTheDocument();
  });

  it('wrapped and added plugins are present', async () => {
    const pluginDiv = screen.getByTestId('wrapped-plugin-with-adds');
    // The umbrella icon that this component wraps
    expect(pluginDiv.querySelector('.umbrella')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access

    const button = within(pluginDiv).getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // Plugin C is added by the wrapped plugin
      expect(screen.getByText('Plugin C')).toBeInTheDocument();
    });
  });
});

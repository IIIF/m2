import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/minimalist';

describe('Minimalist configuration to Mirador', () => {
  setupIntegrationTestViewer(config);

  it('Loads a manifest and displays it without some of the default controls', async () => {
    expect(await screen.findByRole('region', { name: /Window: Self-Portrait Dedicated to Paul Gauguin/i })).toBeInTheDocument();

    const infoButton = await screen.findByRole('tab', { name: /Information/i });
    expect(infoButton).toBeInTheDocument();
    const rightsButton = await screen.findByRole('tab', { name: /Rights/i });
    expect(rightsButton).toBeInTheDocument();

    expect(screen.queryByRole('', { name: /Close window/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Toggle sidebar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add resource/i })).not.toBeInTheDocument();
  });
});

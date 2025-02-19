import { expect, it } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/blank';

describe('Basic end to end Mirador', () => {
  setupIntegrationTestViewer(config);

  it('Adds a manifest and displays it', async () => {
    // Start on empty viewer
    fireEvent.click(await screen.findByRole('button', { name: 'Start Here' }));

    // Now we are in the resource list view
    fireEvent.click(screen.getByRole('button', { name: 'Add resource' }));

    // Input a manifest URL
    fireEvent.change(document.getElementById('manifestURL'), { target: { value: 'https://iiif.io/api/cookbook/recipe/0266-full-canvas-annotation/manifest.json' } }); // eslint-disable-line testing-library/no-node-access

    fireEvent.click(screen.getByText('Add'));

    // Click the added manifest item
    const listItem = document.querySelector('[data-manifestid="https://iiif.io/api/cookbook/recipe/0266-full-canvas-annotation/manifest.json"]'); // eslint-disable-line testing-library/no-node-access
    const button = await within(listItem).findByRole('button');
    fireEvent.click(button);

    // The viewer is loaded with the manifest
    const element = await screen.findByRole('heading', { name: /Picture of Göttingen taken during the 2019 IIIF Conference/i });
    expect(element).toBeInTheDocument();
  });
});

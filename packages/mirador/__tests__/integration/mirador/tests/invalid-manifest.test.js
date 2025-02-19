import { expect, it } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/blank';

describe('Invalid response while adding manifest', () => {
  setupIntegrationTestViewer(config);

  /** */
  const addManifest = async (uri) => {
    // Now we are in the resource list view
    fireEvent.click(await screen.findByRole('button', { name: 'Add resource' }));

    // Input a manifest URL
    fireEvent.change(screen.getByLabelText('Resource location'), { target: { value: uri } });
    fireEvent.click(screen.getByText('Add'));
  };

  it('Loads a blank manifest row', async () => {
    // Start on empty viewer
    fireEvent.click(await screen.findByRole('button', { name: 'Start Here' }));

    // Add an invalid manifest URL
    const invalidUrl = 'http://localhost:4444/invalid';
    await addManifest(invalidUrl);

    await waitFor(() => {
      const listItem = document.querySelector(`[data-manifestid="${invalidUrl}"]`); // eslint-disable-line testing-library/no-node-access
      expect(listItem).toBeInTheDocument();
    });
  }, 2000); // Wait 2 seconds

  // TODO: fix this. The error is not being rendered because of an overlay
  it.skip('renders an error message when a manifest cannot be loaded (and allows it to be dismissed)', async () => {
    const uri = 'http://localhost:4444/__tests__/fixtures/version-2/broken.json';
    await addManifest('http://localhost:4444/__tests__/fixtures/version-2/broken.json');

    // Try the added manifest item
    const listItem = document.querySelector(`[data-manifestid="${uri}"]`); // eslint-disable-line testing-library/no-node-access
    expect(listItem).toBeInTheDocument();

    const errorMessage = await screen.findByText('The resource cannot be added');
    expect(errorMessage).toBeInTheDocument();
  });
});

import { expect, it } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/single-bodleian';

describe('Canvas navigation by clicking thumbnails', () => {
  setupIntegrationTestViewer(config);

  // TODO: fix this (possible issue with lazy loading the images) -- no thumbnails are rendered
  /* eslint-disable */
  it.skip('navigates a manifest using thumbnail navigation', async (context) => {
    // Make sure we have the manifest
    const windowElement = await screen.findByRole('region', { name: /Window: Bodleian Library MS. Ind. Inst. Misc. 22/i });
    expect(windowElement).toBeInTheDocument();

    const windowId = windowElement.getAttribute('id');
    const storedCanvasId = context.miradorInstance.store.getState().windows[windowId].canvasId;

    const thumbnailsContainer = await screen.findByLabelText('Thumbnails');
    const thumbnailButtons = thumbnailsContainer.querySelectorAll('.mirador-thumbnail-nav-canvas');
    fireEvent.click(thumbnailButtons[4]);
  });
  /* eslint-enable */
});

import { expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/initial-viewer-config';

describe('initialViewerConfig', () => {
  setupIntegrationTestViewer(config);

  describe('initialViewerConfig', () => {
    it('allows initialViewerConfig to be passed', async (context) => {
      expect(await screen.findByRole('region', { name: /Window: Self-Portrait Dedicated to Paul Gauguin/i })).toBeInTheDocument();

      let viewerObject;
      await waitFor(() => {
        const { viewers = {} } = context.miradorInstance.store.getState();
        viewerObject = viewers[Object.keys(viewers)[0]];
        expect(viewerObject?.x).toBe(934);
      }, { timeout: 3000 });

      expect(viewerObject.x).toBe(934);
      expect(viewerObject.y).toBe(782);
      expect(viewerObject.zoom).toBe(0.0007);
    });
  });
});

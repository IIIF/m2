import { expect, it } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/single-van-gogh';

describe('Window actions', () => {
  setupIntegrationTestViewer(config);

  it('Closes a Mirador window', async () => {
    expect(await screen.findByRole('region', { name: /Window: Self-Portrait Dedicated to Paul Gauguin/i })).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /Close window/i });
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.queryByRole('region', { name: /Window: Self-Portrait Dedicated to Paul Gauguin/i })).not.toBeInTheDocument());

    // No windows should be present
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});

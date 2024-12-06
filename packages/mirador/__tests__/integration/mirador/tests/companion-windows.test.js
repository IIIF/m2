import { expect, it } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/single-van-gogh';

describe('Basic end to end Mirador', () => {
  setupIntegrationTestViewer(config);

  it('allows the sidebar panel to be popped out into a companion window and closed', async () => {
    const toggleButtons = await screen.findAllByLabelText(/toggle sidebar/i);
    fireEvent.click(toggleButtons[0]);

    // Companion window is on the left
    expect(await screen.findByRole('complementary', { name: /About this item/i })).toHaveClass('mirador-companion-window-left');

    const openButton = screen.getByRole('button', { name: /Open in separate panel/i });
    fireEvent.click(openButton);

    // Companion window is on the right
    expect(await screen.findByRole('complementary', { name: /About this item/i })).toHaveClass('mirador-companion-window-right');

    // Close the panel
    const closeButton = screen.getByRole('button', { name: /Close panel/i });
    fireEvent.click(closeButton);

    // The companion window is removed
    expect(screen.queryByRole('complementary', { name: /About this item/i })).not.toBeInTheDocument();
  });
});

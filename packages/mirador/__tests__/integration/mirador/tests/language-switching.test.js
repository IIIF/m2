import { expect, it } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import config from '../mirador-configs/blank';

describe('Application language', () => {
  setupIntegrationTestViewer(config);

  it('allows the user to switch the application language', async () => {
    // The viewer is in English
    const start = await screen.findByRole('button', { name: /Start Here/i });
    expect(start).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Workspace settings' }));

    // Open the language menu
    fireEvent.click(screen.getByRole('menuitem', { name: 'Language' }));

    // Switch to German
    fireEvent.click(screen.getByRole('menuitem', { name: 'Deutsch' }));

    // The viewer is now in German
    const starten = await screen.findByRole('button', { name: /Hier starten/i });
    expect(starten).toBeInTheDocument();
  });
});

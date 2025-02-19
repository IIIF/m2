import { expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import settings from '../mirador-configs/plugin-validate';

describe('how plugins relate to state', () => {
  setupIntegrationTestViewer(settings.config, settings.plugins);

  it('valid plugins will be applied <WorkspaceControlPanelButtons>', async () => {
    expect(await screen.findByTestId('valid-plugin-a')).toBeInTheDocument();
    expect(await screen.findByTestId('valid-plugin-b')).toBeInTheDocument();
  });

  it('invalid plugins will not be applied <WorkspaceControlPanelButtons>', async () => {
    expect(screen.queryByTestId('invalid-plugin-a')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-plugin-b')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-plugin-c')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-plugin-d')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-plugin-e')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-plugin-f')).not.toBeInTheDocument();
  });
});

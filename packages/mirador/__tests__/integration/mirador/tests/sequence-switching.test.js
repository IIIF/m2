import { expect, it } from 'vitest';
import { setupIntegrationTestViewer } from '@tests/utils/test-utils';
import { screen, fireEvent } from '@testing-library/react';
import config from '../mirador-configs/multiple-sequences';

describe('Window Sidebar Sequence Dropdown', () => {
  setupIntegrationTestViewer(config);

  // TODO: find a suitable manifest in the wild, so that we don't have to run
  // the server :4444 in the background just for this test.
  // See mirador-configs/multiple-sequences.js for the form of manifest used in this test.
  it.skip('allows the user to switch the sequence', async () => {
    // Make sure we have the manifest
    const element = await screen.findByRole('heading', { name: /Urnäsch, Gemeindearchiv Urnäsch, Fragment/i });
    expect(element).toBeInTheDocument();

    // Open the index tab
    const toggleButtons = await screen.findAllByLabelText(/toggle sidebar/i);
    fireEvent.click(toggleButtons[0]);

    const indexButton = await screen.findByRole('tab', { name: /Index/i });
    fireEvent.click(indexButton);

    // Confirm initial sequence (1740) is loaded
    const sequenceWrapper = await screen.findByTestId('sequence-select');
    const sequenceInput = sequenceWrapper.querySelector('input[name="sequenceId"]'); // eslint-disable-line testing-library/no-node-access

    expect(sequenceInput).toHaveValue('https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1740.json');

    // Change the sequence (1741)
    fireEvent.change(sequenceInput, { target: { value: 'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json' } });

    expect(sequenceInput).toHaveValue('https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json');
  });
});

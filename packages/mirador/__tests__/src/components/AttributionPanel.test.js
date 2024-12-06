/**
 * @jest-environment-options { "resources": "usable" }
 */
import { render, screen, waitFor } from '@tests/utils/test-utils';

import { AttributionPanel } from '../../../src/components/AttributionPanel';

/**
 * Helper function to create a shallow wrapper around AttributionPanel
 */
function createWrapper(props) {
  return render(
    <AttributionPanel
      id="xyz"
      windowId="window"
      {...props}
    />,
    { preloadedState: { companionWindows: { xyz: { content: 'attribution' } } } },
  );
}

describe('AttributionPanel', () => {
  it('renders the required statement', () => {
    const requiredStatement = [
      { label: 'required statement', values: ['must be shown'] },
    ];
    createWrapper({ requiredStatement });

    expect(screen.getByText('required statement')).toBeInTheDocument();
    expect(screen.getByText('must be shown')).toBeInTheDocument();
  });

  it('renders the rights statement', () => {
    createWrapper({ rights: ['http://example.com', 'http://stanford.edu'] });

    expect(screen.getByText('License')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'http://example.com' })).toHaveAttribute('href', 'http://example.com');
    expect(screen.getByRole('link', { name: 'http://stanford.edu' })).toHaveAttribute('href', 'http://stanford.edu');
  });

  it('does not render the rights statement if it is empty', () => {
    createWrapper({ rights: [] });
    expect(screen.queryByText('License')).not.toBeInTheDocument();
  });

  // Requires canvas to handle img loading.
  it.skip('renders the manifest logo', async () => {
    const manifestLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMDQmtBwADgwF/Op8FmAAAAABJRU5ErkJggg==';

    const { container } = createWrapper({ manifestLogo });
    await waitFor(() => { expect(container.querySelector('img')).toBeInTheDocument(); }); // eslint-disable-line testing-library/no-container, testing-library/no-node-access

    expect(container.querySelector('img')).toHaveAttribute('src', manifestLogo); // eslint-disable-line testing-library/no-container, testing-library/no-node-access
  });
});

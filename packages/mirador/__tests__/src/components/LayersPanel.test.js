import { render, screen } from '@tests/utils/test-utils';

import { LayersPanel } from '../../../src/components/LayersPanel';

/**
 * Helper function to create a shallow wrapper around AttributionPanel
 */
function createWrapper(props) {
  return render(
    <LayersPanel
      id="xyz"
      windowId="window"
      {...props}
    />,
    { preloadedState: { companionWindows: { xyz: { content: 'layers' } } } },
  );
}

describe('LayersPanel', () => {
  it('renders layers for each canvas', () => {
    const canvasIds = ['a', 'b'];
    createWrapper({ canvasIds });

    expect(screen.getAllByRole('list').length).toBe(2);
  });
});

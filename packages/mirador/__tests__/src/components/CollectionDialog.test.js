import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';

import { CollectionDialog } from '../../../src/components/CollectionDialog';
import collection from '../../fixtures/version-2/collection.json';

/** */
function createWrapper(props) {
  const manifest = Utils.parseManifest(props.manifest ? props.manifest : collection);

  render(<div id="window" />);

  return render(
    <CollectionDialog
      addWindow={() => {}}
      classes={{}}
      ready
      manifest={manifest}
      windowId="window"
      {...props}
    />,
    { preloadedState: { windows: { window: { id: 'window' } } } },
  );
}

describe('CollectionDialog', () => {
  it('renders a dialog with collection menu items', () => {
    createWrapper({});

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(55);
    expect(screen.getByRole('menuitem', { name: 'Test 1 Manifest: Minimum Required Fields' })).toBeInTheDocument();
  });
  it('when not ready returns placeholder skeleton', () => {
    createWrapper({ ready: false });

    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();

    expect(screen.getByRole('dialog').querySelectorAll('.MuiSkeleton-root')).toHaveLength(3); // eslint-disable-line testing-library/no-node-access
  });
  it('clicking the hide button fires hideCollectionDialog', async () => {
    const user = userEvent.setup();
    const hideCollectionDialog = vi.fn();
    createWrapper({ hideCollectionDialog });

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(hideCollectionDialog).toHaveBeenCalled();
  });
});

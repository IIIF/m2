import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { CollectionInfo } from '../../../src/components/CollectionInfo';

/** */
function createWrapper(props) {
  return render(
    <CollectionInfo
      collectionPath={[1, 2]}
      showCollectionDialog={() => {}}
      {...props}
    />,
  );
}

describe('CollectionInfo', () => {
  it('renders a collapsible section', async () => {
    const user = userEvent.setup();
    createWrapper();

    expect(screen.getByRole('heading', { name: 'Collection' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Show collection' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Collapse "Collection" section' }));

    expect(screen.queryByRole('button', { name: 'Show collection' })).not.toBeInTheDocument();
  });
  it('without a collectionPath, renders nothing', () => {
    const wrapper = createWrapper({ collectionPath: [] });
    expect(wrapper.container).toBeEmptyDOMElement();
  });
  it('clicking the button fires showCollectionDialog', async () => {
    const user = userEvent.setup();
    const showCollectionDialog = vi.fn();

    createWrapper({ showCollectionDialog });

    await user.click(screen.getByRole('button', { name: 'Show collection' }));
    expect(showCollectionDialog).toHaveBeenCalled();
  });
});

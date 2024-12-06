import { render, screen, waitFor } from '@tests/utils/test-utils';
import { Resource } from 'manifesto.js';
import textManifest from '../../fixtures/version-3/text-pdf.json';
import { PrimaryWindow } from '../../../src/components/PrimaryWindow';

/** create wrapper */
function createWrapper(props) {
  return render(
    <PrimaryWindow
      classes={{}}
      windowId="xyz"
      {...props}
    />,
    { preloadedState: { windows: { xyz: { collectionPath: [{}], companionWindowIds: [] } } } },
  );
}

describe('PrimaryWindow', () => {
  it('should render expected elements', async () => {
    createWrapper({ isFetching: false });
    await screen.findByTestId('test-window');
    expect(document.querySelector('.mirador-primary-window')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access
    expect(document.querySelector('.mirador-companion-area-left')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access
  });
  it('should render children when available', () => {
    createWrapper({ children: <span>hi</span>, isFetching: false });
    expect(screen.getByText('hi')).toBeInTheDocument();
  });
  it('should render nothing if still fetching', () => {
    createWrapper({ isFetching: true });
    expect(screen.queryByRole('region', { accessibleName: 'item' })).not.toBeInTheDocument();
  });
  it('should render <GalleryView> if fetching is complete and view is gallery', async () => {
    createWrapper({ isFetching: false, view: 'gallery' });
    await screen.findByTestId('test-window');
    await waitFor(() => {
      expect(document.querySelector('#xyz-gallery')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access
    });
  });
  it('should render <CollectionDialog> and <SelectCollection> if manifest is collection and isCollectionDialogVisible', async () => {
    render(<div id="xyz" />);
    render(
      <PrimaryWindow
        classes={{}}
        isCollection
        isCollectionDialogVisible
        windowId="xyz"
      />,
      { preloadedState: { windows: { xyz: { collectionPath: [{}] } } } },
    );
    await screen.findByRole('button', { accessibleName: 'show collection' });
  });
  it('should render a TextViewer when window has textResources but not audio, video or image', async () => {
    render(<div id="xyz" />);
    const manifests = {};
    const manifestId = 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json';
    manifests[manifestId] = {
      id: manifestId,
      json: textManifest,
    };
    const textResources = [true]; // this is a flag; the actual value will be given by a state selector against the preloaded state

    const xyz = {
      manifestId: 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json',
      visibleCanvases: ['https://iiif.io/api/cookbook/recipe/0001-text-pdf/canvas'],
    };

    render(
      <PrimaryWindow
        classes={{}}
        textResources={textResources}
        windowId="xyz"
      />,
      { preloadedState: { manifests, windows: { xyz } } },
    );
    await waitFor(() => {
      expect(document.querySelector('source:nth-of-type(1)')).toHaveAttribute('type', 'application/pdf'); // eslint-disable-line testing-library/no-node-access
    });
  });
});

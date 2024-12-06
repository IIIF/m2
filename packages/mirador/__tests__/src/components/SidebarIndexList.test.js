import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';

import { SidebarIndexList } from '../../../src/components/SidebarIndexList';
import manifestJson from '../../fixtures/version-2/019.json';

/**
 * Helper function to create a shallow wrapper around SidebarIndexList
 */
function createWrapper(props) {
  const canvases = Utils.parseManifest(manifestJson).getSequences()[0].getCanvases();

  return render(
    <SidebarIndexList
      id="asdf"
      canvases={canvases}
      classes={{}}
      containerRef={{ current: null }}
      windowId="xyz"
      setCanvas={() => {}}
      config={{ canvasNavigation: { height: 100 } }}
      updateVariant={() => {}}
      selectedCanvasIds={[canvases[1].id]}
      {...props}
    />,
  );
}

describe('SidebarIndexList', () => {
  let setCanvas;

  beforeEach(() => {
    setCanvas = vi.fn();
  });

  it('renders all needed elements for the thumbnail view', () => {
    const { container } = createWrapper({ variant: 'thumbnail' });

    expect(screen.getByRole('menuitem', { name: 'Test 19 Canvas: 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Image 2' })).toBeInTheDocument();

    expect(container.querySelectorAll('img').length).toBe(3); // eslint-disable-line testing-library/no-node-access, testing-library/no-container

    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toHaveClass('Mui-selected');
  });

  it('renders all needed elements for the item view', () => {
    createWrapper({ variant: 'item' });

    expect(screen.getAllByRole('menuitem').length).toBe(3);
    expect(screen.getByRole('menuitem', { name: 'Image 1' })).toHaveClass('Mui-selected');
  });

  it('should call the onClick handler of a list item', async () => {
    const user = userEvent.setup();
    createWrapper({ setCanvas });
    await user.click(screen.getByRole('menuitem', { name: 'Image 2' }));

    expect(setCanvas).toHaveBeenCalledWith('xyz', 'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1');
  });
});

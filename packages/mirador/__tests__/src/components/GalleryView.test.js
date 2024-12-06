import { render, screen } from '@tests/utils/test-utils';
import { Utils } from 'manifesto.js';

import manifestJson from '../../fixtures/version-2/019.json';
import { GalleryView } from '../../../src/components/GalleryView';

/** create wrapper */
function createWrapper(props) {
  return render(
    <GalleryView
      canvases={Utils.parseManifest(manifestJson).getSequences()[0].getCanvases()}
      windowId="1234"
      selectedCanvasIndex={0}
      {...props}
    />,
  );
}

describe('GalleryView', () => {
  let setCanvas;
  beforeEach(() => {
    setCanvas = vi.fn();
  });
  it('renders the component', () => {
    const { container } = createWrapper({ setCanvas });
    expect(container.querySelector('section')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });
  it('renders gallery items for all canvases', () => {
    createWrapper({ setCanvas });
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBe(3);
  });

  describe('when viewingDirection="right-to-left"', () => {
    it('sets up Paper to be rtl', () => {
      createWrapper({
        viewingDirection: 'right-to-left',
      });
      const buttons = screen.queryAllByRole('button');
      expect(buttons[0].closest('section')).toHaveAttribute('dir', 'rtl'); // eslint-disable-line testing-library/no-node-access
    });
  });
});

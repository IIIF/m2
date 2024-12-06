import { render, screen } from '@tests/utils/test-utils';
import { Utils } from 'manifesto.js';

import fixture from '../../fixtures/version-2/019.json';
import { SidebarIndexThumbnail } from '../../../src/components/SidebarIndexThumbnail';

/** */
function createWrapper(props) {
  return render(
    <SidebarIndexThumbnail
      canvas={Utils.parseManifest(fixture).getSequences()[0].getCanvases()[1]}
      label="yolo"
      classes={{}}
      config={{ canvasNavigation: { height: 200, width: 100 } }}
      {...props}
    />,
  );
}

describe('SidebarIndexThumbnail', () => {
  it('creates Typography with a canvas label', () => {
    createWrapper();

    expect(screen.getByText('yolo', { container: 'p' })).toBeInTheDocument();
  });

  it('contains a IIIFThumbnail', () => {
    const { container } = createWrapper();

    expect(container.querySelector('img')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });
});

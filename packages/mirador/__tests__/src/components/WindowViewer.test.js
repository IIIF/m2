import { render, screen } from '@tests/utils/test-utils';
import { WindowViewer } from '../../../src/components/WindowViewer';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WindowViewer
      {...props}
    />,
  );
}

describe('WindowViewer', () => {
  describe('when lazy imports have loaded', () => {
    it('renders openseadragon', async () => {
      createWrapper({});
      await screen.findByRole('img', { selector: 'canvas' });
    });
  });
});

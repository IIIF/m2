import { render, screen } from '@tests/utils/test-utils';

import { WindowSideBarInfoPanel } from '../../../src/components/WindowSideBarInfoPanel';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WindowSideBarInfoPanel
      id="asdf"
      windowId="zxcv"
      {...props}
    />,
    { preloadedState: { companionWindows: { asdf: { content: 'info' } } } },
  );
}
describe('WindowSideBarInfoPanel', () => {
  describe('when metadata is present', () => {
    it('renders headers', () => {
      createWrapper();
      expect(screen.getByRole('heading', { name: 'About this item' })).toBeInTheDocument();
    });

    it('renders the manifest elements', () => {
      createWrapper();

      expect(screen.getByRole('heading', { name: 'Resource' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Related' })).toBeInTheDocument();
    });

    it('renders the canvas elements', () => {
      createWrapper({ canvasIds: ['1', '2'] });
      expect(screen.getAllByRole('heading', { name: /(Left|Right)/ }).length).toEqual(2);
    });
  });
});

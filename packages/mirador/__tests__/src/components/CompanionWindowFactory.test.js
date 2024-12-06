import { render, screen } from '@tests/utils/test-utils';

import { CompanionWindowFactory } from '../../../src/components/CompanionWindowFactory';

/** create wrapper */
function createWrapper({ content = 'closed', ...props }) {
  return render(
    <CompanionWindowFactory
      windowId="x"
      id="123"
      content={content}
      {...props}
    />,
    { preloadedState: { companionWindows: { 123: { content }, thumb: {} }, windows: { x: { thumbnailNavigationId: 'thumb' } } } },
  );
}

describe('CompanionWindowFactory', () => {
  describe('for an info window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'info',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('About this item');
    });
  });

  describe('for a canvas navigation window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'canvas',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Index');
    });
  });

  describe('for an annotation window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'annotations',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Annotations');
    });
  });

  describe('for an attribution window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'attribution',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Rights');
    });
  });

  describe('for the thumbnail nav window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'thumbnailNavigation',
      });

      expect(screen.getByRole('grid')).toHaveAccessibleName('Thumbnails');
    });
  });

  describe('for the search window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'search',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Search');
    });
  });

  describe('for the layers window', () => {
    it('renders the appropriate arg component', () => {
      createWrapper({
        content: 'layers',
      });

      expect(screen.getByRole('heading', { level: 3 })).toHaveAccessibleName('Layers');
    });
  });
});

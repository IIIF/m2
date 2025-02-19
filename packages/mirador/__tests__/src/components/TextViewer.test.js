import { render, screen } from '@tests/utils/test-utils';
import { TextViewer } from '../../../src/components/TextViewer';

/** create wrapper */
function createWrapper(props, suspenseFallback) {
  return render(
    <TextViewer
      classes={{}}
      textOptions={{ crossOrigin: 'anonymous', 'data-testid': 'text' }}
      {...props}
    />,
  );
}

describe('TextViewer', () => {
  describe('render', () => {
    it('textResources as source elements', () => {
      createWrapper({
        textResources: [
          { getFormat: () => 'application/pdf', getType: () => 'Text', id: 1 },
        ],
        windowId: 'a',
      }, true);
      const text = screen.getByTestId('text');
      expect(text.querySelector('source:nth-of-type(1)')).toHaveAttribute('type', 'application/pdf'); // eslint-disable-line testing-library/no-node-access
    });
    it('passes through configurable options', () => {
      createWrapper({
        textResources: [
          { getFormat: () => 'application/pdf', getType: () => 'Text', id: 1 },
        ],
        windowId: 'a',
      }, true);
      expect(screen.getByTestId('text')).toHaveAttribute('crossOrigin', 'anonymous');
    });
    it('canvas navigation', () => {
      createWrapper({
        textResources: [
          { getFormat: () => 'application/pdf', getType: () => 'Text', id: 1 },
        ],
        windowId: 'a',
      }, true);
      const text = screen.getByTestId('text');
      expect(text.querySelector('.mirador-canvas-nav')).toBeDefined(); // eslint-disable-line testing-library/no-node-access
    });
  });
});

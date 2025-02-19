import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { PropTypes } from 'prop-types';
import { Utils } from 'manifesto.js';

import { ThumbnailNavigation } from '../../../src/components/ThumbnailNavigation';
import CanvasGroupings from '../../../src/lib/CanvasGroupings';
import manifestJson from '../../fixtures/version-2/019.json';
import zeroWidthFixture from '../../fixtures/version-2/zeroWidthCanvas.json';

/**
 * create a simple wrapper for rendering our component
 */
function Subject({ fixture = manifestJson, ...props }) {
  return (
    <ThumbnailNavigation
      canvasGroupings={new CanvasGroupings(
        Utils.parseManifest(fixture).getSequences()[0].getCanvases(),
      ).groupings()}
      canvasIndex={1}
      classes={{}}
      windowId="foobar"
      thumbnailNavigation={{ height: 150, width: 100 }}
      position="far-bottom"
      {...props}
    />
  );
}

Subject.propTypes = {
  fixture: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

vi.mock(
  'react-virtualized-auto-sizer',
  () => ({
    default: ({ children }) => children({ height: 600, width: 600 }),
  }),
);

describe('ThumbnailNavigation', () => {
  it('renders the component', async () => {
    render(<Subject />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
  it('renders containers based off of number of canvases', () => {
    render(<Subject />);

    expect(screen.getAllByRole('gridcell').length).toEqual(3);
  });

  // TODO: Test that we recalculate dimensions when the view changes (resetAfterIndex)
  // TODO: Test that the window scrolls when the canvasIndex prop changes (scorllToItem)

  it('gives the grid a size', () => {
    const { rerender } = render(<Subject />);
    expect(screen.getByRole('grid')).toHaveStyle({ height: '150px', width: '100%' });

    rerender(<Subject position="far-right" />);
    expect(screen.getByRole('grid')).toHaveStyle({ height: '100%', minHeight: 0, width: '123px' });
  });

  it('roughly doubles the width of the grid in book view', () => {
    const { rerender } = render(<Subject position="far-right" />);
    expect(screen.getByRole('grid')).toHaveStyle({ width: '123px' });

    rerender(<Subject position="far-right" view="book" />);
    expect(screen.getByRole('grid')).toHaveStyle({ width: '223px' });
  });

  it('calculates the scaled width of each cell', () => {
    render(<Subject />);

    expect(screen.getAllByRole('gridcell')[0]).toHaveStyle({ width: '74px' });
  });

  it('calculates the scaled height of each cell when on the right', () => {
    render(<Subject position="far-right" />);
    expect(screen.getAllByRole('gridcell')[0]).toHaveStyle({ height: '150px' });
  });

  it('keeps a minimum size for each cell', () => {
    render(<Subject fixture={zeroWidthFixture} />);

    expect(screen.getAllByRole('gridcell')[0]).toHaveStyle({ width: '100px' });
  });

  it('keeps a minimum size for each cell when on the right', () => {
    render(<Subject fixture={zeroWidthFixture} position="far-right" />);

    expect(screen.getAllByRole('gridcell')[0]).toHaveStyle({ height: '100px' });
  });

  describe('keyboard navigation', () => {
    const setNextCanvas = vi.fn();
    const setPreviousCanvas = vi.fn();

    describe('handleKeyUp', () => {
      it('handles right arrow by advancing the current canvas', async () => {
        render(<Subject canvasIndex={1} hasNextCanvas setNextCanvas={setNextCanvas} />);

        screen.getByRole('grid').focus();
        fireEvent.keyDown(screen.getByRole('grid'), { code: 'ArrowRight', key: 'ArrowRight' });
        expect(setNextCanvas).toHaveBeenCalled();
      });
      it('handles down arrow by advancing the current canvas when the canvas is on the right', () => {
        render(<Subject canvasIndex={1} hasNextCanvas position="far-right" setNextCanvas={setNextCanvas} />);

        screen.getByRole('grid').focus();
        fireEvent.keyDown(screen.getByRole('grid'), { code: 'ArrowDown', key: 'ArrowDown' });
        expect(setNextCanvas).toHaveBeenCalled();
      });
      it('handles left arrow by selecting the previous canvas', () => {
        render(<Subject canvasIndex={2} hasPreviousCanvas setPreviousCanvas={setPreviousCanvas} />);

        screen.getByRole('grid').focus();
        fireEvent.keyDown(screen.getByRole('grid'), { code: 'ArrowLeft', key: 'ArrowLeft' });
        expect(setPreviousCanvas).toHaveBeenCalled();
      });
      it('handles up arrow by selecting the previous canvas when the canvas is on the right', () => {
        render(<Subject canvasIndex={2} hasPreviousCanvas position="far-right" setPreviousCanvas={setPreviousCanvas} />);

        screen.getByRole('grid').focus();
        fireEvent.keyDown(screen.getByRole('grid'), { code: 'ArrowUp', key: 'ArrowUp' });
        expect(setPreviousCanvas).toHaveBeenCalled();
      });
    });
  });

  describe('when viewingDirection="right-to-left"', () => {
    it('sets up react-window to be rtl', () => {
      render(<Subject viewingDirection="right-to-left" />);

      expect(screen.getByRole('row').children[0]).toHaveStyle({ direction: 'rtl' }); // eslint-disable-line testing-library/no-node-access
    });
  });
});

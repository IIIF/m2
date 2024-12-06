import { render, screen } from '@tests/utils/test-utils';
import PropTypes from 'prop-types';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';
import { OpenSeadragonViewer } from '../../../src/components/OpenSeadragonViewer';
import CanvasWorld from '../../../src/lib/CanvasWorld';
import fixture from '../../fixtures/version-2/019.json';
import { OSDReferences } from '../../../src/plugins/OSDReferences';

const canvases = Utils.parseManifest(fixture).getSequences()[0].getCanvases();

/**
 * Helper function to create a shallow wrapper around OpenSeadragonViewer
 */
function createWrapper(props) {
  /** Stub child component for testing child props passing */
  const Child = ({ testId, zoomToWorld }) => <button type="button" data-testid={testId} onClick={zoomToWorld}>Child</button>;
  Child.propTypes = {
    testId: PropTypes.string.isRequired,
    zoomToWorld: PropTypes.func.isRequired,
  };

  const component = (
    <OpenSeadragonViewer
      classes={{}}
      windowId="base"
      config={{}}
      updateViewport={vi.fn()}
      canvasWorld={new CanvasWorld(canvases)}
      {...props}
    >
      <Child testId="foo" />
    </OpenSeadragonViewer>
  );

  const rendered = render(component);

  const viewer = OSDReferences.get('base').current;

  return { ...rendered, component, viewer };
}

describe('OpenSeadragonViewer', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the component', () => {
    createWrapper({});
    expect(screen.getByLabelText('Item:')).toHaveClass('mirador-osd-container');
  });

  it('renders child components enhanced with additional props', async () => {
    const { viewer } = createWrapper({});
    const fitBounds = vi.fn();
    vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({ fitBounds });

    await user.click(screen.getByTestId('foo'));
    expect(fitBounds).toHaveBeenCalled();
  });

  describe('zoomToWorld', () => {
    it('uses fitBounds with the existing CanvasWorld', async () => {
      const { viewer } = createWrapper({});
      const fitBounds = vi.fn();
      vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({ fitBounds });

      await user.click(screen.getByTestId('foo'));
      expect(fitBounds).toHaveBeenCalledWith({
        degrees: 0, height: 1800, width: 5041, x: 0, y: 0,
      }, expect.anything());
    });
  });

  describe('onViewportChange', () => {
    it('translates the OSD viewport data into an update to the component state', () => {
      const updateViewport = vi.fn();
      const { viewer } = createWrapper({ updateViewport });

      vi.spyOn(viewer, 'viewport', 'get').mockReturnValue({
        centerSpringX: { target: { value: 1 } },
        centerSpringY: { target: { value: 0 } },
        getBounds: () => [],
        getFlip: () => false,
        getRotation: () => 90,
        zoomSpring: { target: { value: 0.5 } },
      });

      viewer.raiseEvent('animation-finish');

      expect(updateViewport).toHaveBeenCalledWith(
        'base',
        {
          flip: false, rotation: 90, x: 1, y: 0, zoom: 0.5,
        },
      );
    });
  });

  describe('onCanvasMouseMove', () => {
    it('triggers an OSD event', () => {
      vi.useFakeTimers();
      const { viewer } = createWrapper({});
      const mockHandler = vi.fn();
      viewer.addHandler('mouse-move', mockHandler);

      const e = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
      viewer.innerTracker.moveHandler(e);

      vi.advanceTimersByTime(100);

      expect(mockHandler).toHaveBeenCalledWith(e);

      vi.useRealTimers();
    });
  });
});

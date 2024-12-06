import OpenSeadragon from 'openseadragon';
import OpenSeadragonCanvasOverlay from '../../../src/lib/OpenSeadragonCanvasOverlay';

vi.mock('openseadragon');

describe('OpenSeadragonCanvasOverlay', () => {
  let canvasOverlay;
  const ref = { current: undefined };
  beforeEach(() => {
    document.body.innerHTML = '<div id="canvas"><canvas></div>';
    ref.current = document.getElementById('canvas');
    OpenSeadragon.mockClear();
    OpenSeadragon.mockImplementation(() => ({
      canvas: ref,
      container: {
        clientHeight: 100,
        clientWidth: 200,
      },
      viewport: {
        getBoundsNoRotateWithMargins: vi.fn(() => ({
          height: 300,
          width: 200,
          x: 40,
          y: 80,
        })),
        getCenter: () => ({ x: 0, y: 0 }),
        getFlip: () => false,
        getRotation: () => 0,
        getZoom: vi.fn(() => (0.75)),
      },
      world: {
        getItemAt: vi.fn(() => ({
          source: {
            dimensions: {
              x: 1000,
              y: 2000,
            },
          },
          viewportToImageZoom: vi.fn(() => (0.075)),
        })),
      },
    }));
    canvasOverlay = new OpenSeadragonCanvasOverlay(new OpenSeadragon(), ref);
  });
  describe('constructor', () => {
    it('sets up initial values and canvas', () => {
      expect(canvasOverlay.containerHeight).toEqual(0);
      expect(canvasOverlay.containerWidth).toEqual(0);
    });
  });
  describe('context2d', () => {
    it('calls getContext on canvas', () => {
      const contextMock = vi.fn();
      ref.current = {
        firstElementChild: {
          getContext: contextMock,
        },
      };
      canvasOverlay.context2d; // eslint-disable-line no-unused-expressions
      expect(contextMock).toHaveBeenCalledTimes(1);
    });
  });
  describe('clear', () => {
    it('calls getContext and clearRect on canvas', () => {
      const clearRect = vi.fn();
      const contextMock = vi.fn(() => ({
        clearRect,
      }));
      ref.current = {
        firstElementChild: {
          getContext: contextMock,
        },
      };
      canvasOverlay.clear();
      expect(contextMock).toHaveBeenCalledTimes(2);
      expect(clearRect).toHaveBeenCalledTimes(1);
    });
  });
  describe('resize', () => {
    it('sets various values based off of image and container sizes', () => {
      canvasOverlay.resize();
      expect(canvasOverlay.containerHeight).toEqual(100);
      expect(canvasOverlay.containerWidth).toEqual(200);
      expect(canvasOverlay.imgAspectRatio).toEqual(0.5);
    });
    it('when image is undefined returns early', () => {
      OpenSeadragon.mockClear();
      OpenSeadragon.mockImplementation(() => ({
        canvas: document.getElementById('canvas'),
        container: {
          clientHeight: 100,
          clientWidth: 200,
        },
        viewport: {
          getBoundsNoRotateWithMargins: vi.fn(() => (new OpenSeadragon.Rect(0, 0, 200, 200))),
        },
        world: {
          getItemAt: vi.fn(),
        },
      }));
      canvasOverlay = new OpenSeadragonCanvasOverlay(new OpenSeadragon(), ref);
      canvasOverlay.resize();
      expect(canvasOverlay.imgHeight).toEqual(undefined);
      expect(canvasOverlay.imgWidth).toEqual(undefined);
    });
  });
  describe('canvasUpdate', () => {
    it('sets appropriate sizes and calls update argument', () => {
      const scale = vi.fn();
      const setAttribute = vi.fn();
      const setTransform = vi.fn();
      const translate = vi.fn();
      const contextMock = vi.fn(() => ({
        scale,
        setTransform,
        translate,
      }));
      ref.current = {
        firstElementChild: {
          getContext: contextMock,
          setAttribute,
        },
        setAttribute,
      };
      const update = vi.fn();
      canvasOverlay.resize();
      canvasOverlay.canvasUpdate(update);
      expect(update).toHaveBeenCalledTimes(1);
      expect(scale).toHaveBeenCalledWith(0.075, 0.075);
      expect(translate).toHaveBeenCalledWith(-39.96, -26.65333333333333);
      expect(setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);
    });
  });
});

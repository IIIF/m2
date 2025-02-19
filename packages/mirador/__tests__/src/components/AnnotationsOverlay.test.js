import { cloneElement } from 'react';
import { render, screen } from '@tests/utils/test-utils';
import OpenSeadragon from 'openseadragon';
import { Utils } from 'manifesto.js';
import { AnnotationsOverlay } from '../../../src/components/AnnotationsOverlay';
import OpenSeadragonCanvasOverlay from '../../../src/lib/OpenSeadragonCanvasOverlay';
import AnnotationList from '../../../src/lib/AnnotationList';
import CanvasWorld from '../../../src/lib/CanvasWorld';
import fixture from '../../fixtures/version-2/019.json';

const canvases = Utils.parseManifest(fixture).getSequences()[0].getCanvases();

vi.mock('../../../src/lib/OpenSeadragonCanvasOverlay');

/** */
const createWrapper = (props) => {
  render(<div data-testid="osd" />);
  const viewer = new OpenSeadragon({ element: screen.getByTestId('osd') });
  const component = (
    <AnnotationsOverlay
      annotations={[]}
      viewer={viewer}
      classes={{}}
      searchAnnotations={[]}
      windowId="base"
      config={{}}
      updateViewport={vi.fn()}
      canvasWorld={new CanvasWorld(canvases)}
      {...props}
    />
  );

  return { component, viewer, ...render(component) };
};

describe('AnnotationsOverlay', () => {
  beforeEach(() => {
    OpenSeadragonCanvasOverlay.mockClear();
  });

  describe('componentDidUpdate', () => {
    it('sets up a OpenSeadragonCanvasOverlay', () => {
      const { component, rerender } = createWrapper();

      rerender(cloneElement(component, { classes: { whatever: 'value' } }));
      expect(OpenSeadragonCanvasOverlay).toHaveBeenCalledTimes(1);
    });

    it('sets up a listener on update-viewport', () => {
      const { component, rerender, viewer } = createWrapper({ viewer: null });
      const mockAddHandler = vi.spyOn(viewer, 'addHandler');

      rerender(cloneElement(component, { viewer }));
      expect(mockAddHandler).toHaveBeenCalledWith('update-viewport', expect.anything());
    });

    it('sets up canvasUpdate to add annotations to the canvas and forces a redraw', () => {
      const clear = vi.fn();
      const resize = vi.fn();
      const canvasUpdate = vi.fn();

      OpenSeadragonCanvasOverlay.mockImplementation(() => ({
        canvasUpdate,
        clear,
        resize,
      }));

      const { component, rerender, viewer } = createWrapper({ viewer: null });

      const forceRedraw = vi.spyOn(viewer, 'forceRedraw');

      rerender(cloneElement(
        component,
        {
          annotations: [
            new AnnotationList(
              { '@id': 'foo', resources: [{ foo: 'bar' }] },
            ),
          ],
          viewer,
        },
      ));

      // OSD ordinarily would fire this event:
      viewer.raiseEvent('update-viewport');

      expect(clear).toHaveBeenCalled();
      expect(resize).toHaveBeenCalled();
      expect(canvasUpdate).toHaveBeenCalled();
      expect(forceRedraw).toHaveBeenCalled();
    });
  });

  describe('annotationsToContext', () => {
    it('converts the annotations to canvas and checks that the canvas is displayed', () => {
      const strokeRect = vi.fn();
      const context2d = {
        restore: () => { },
        save: () => { },
        strokeRect,
      };

      OpenSeadragonCanvasOverlay.mockImplementation(() => ({
        canvasUpdate: (f) => f(),
        clear: vi.fn(),
        context2d,
        resize: vi.fn(),
      }));

      const palette = {
        default: { strokeStyle: 'yellow' },
      };
      const { component, rerender, viewer } = createWrapper({ palette: { annotations: palette }, viewer: null });

      vi.spyOn(viewer.viewport, 'getMaxZoom').mockImplementation(() => (1));
      vi.spyOn(viewer.viewport, 'getZoom').mockImplementation(() => (0.05));

      rerender(cloneElement(component, {
        annotations: [
          new AnnotationList(
            { '@id': 'foo', resources: [{ on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=10,10,100,200' }] },
          ),
        ],
        viewer,
      }));

      // OSD ordinarily would fire this event:
      viewer.raiseEvent('update-viewport');

      const context = context2d;
      expect(context.strokeStyle).toEqual('yellow');
      expect(context.lineWidth).toEqual(20);
      expect(strokeRect).toHaveBeenCalledWith(10, 10, 100, 200);
    });
  });

  describe('onCanvasClick', () => {
    it('triggers a selectAnnotation for the clicked-on annotation', () => {
      const selectAnnotation = vi.fn();

      const { viewer } = createWrapper({
        annotations: [
          new AnnotationList(
            {
              '@id': 'foo',
              resources: [{
                '@id': 'http://example.org/identifier/annotation/anno-line',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=100,100,250,20',
              }],
            },
          ),
        ],
        selectAnnotation,
      });

      viewer.raiseEvent('canvas-click', {
        eventSource: { viewport: viewer.viewport },
        position: new OpenSeadragon.Point(101, 101),
      });

      expect(selectAnnotation).toHaveBeenCalledWith('base', 'http://example.org/identifier/annotation/anno-line');
    });

    it('triggers a deselectAnnotation for an already-selected annotation', () => {
      const deselectAnnotation = vi.fn();

      const { viewer } = createWrapper({
        annotations: [
          new AnnotationList(
            {
              '@id': 'foo',
              resources: [{
                '@id': 'http://example.org/identifier/annotation/anno-line',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=100,100,250,20',
              }],
            },
          ),
        ],
        deselectAnnotation,
        selectedAnnotationId: 'http://example.org/identifier/annotation/anno-line',
      });

      viewer.raiseEvent('canvas-click', {
        eventSource: { viewport: viewer.viewport },
        position: new OpenSeadragon.Point(101, 101),
      });

      expect(deselectAnnotation).toHaveBeenCalledWith('base', 'http://example.org/identifier/annotation/anno-line');
    });

    it('selects the closest annotation', () => {
      const selectAnnotation = vi.fn();

      const { viewer } = createWrapper({
        annotations: [
          new AnnotationList(
            {
              '@id': 'foo',
              resources: [{
                '@id': 'http://example.org/identifier/annotation/anno-line',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=100,100,250,20',
              }, {
                '@id': 'http://example.org/identifier/annotation/larger-box',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=0,0,250,250',
              }, {
                '@id': 'http://example.org/identifier/annotation/on-another-canvas',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/some-other-canvas#xywh=101,101,3,3',
              }],
            },
          ),
        ],
        selectAnnotation,
      });

      viewer.raiseEvent('canvas-click', {
        eventSource: { viewport: viewer.viewport },
        position: new OpenSeadragon.Point(101, 101),
      });

      expect(selectAnnotation).toHaveBeenCalledWith('base', 'http://example.org/identifier/annotation/anno-line');
    });
  });

  describe('onCanvasMouseMove', () => {
    it('triggers the hover event for every annotation at that point', () => {
      vi.useFakeTimers();
      const hoverAnnotation = vi.fn();

      const { viewer } = createWrapper({
        annotations: [
          new AnnotationList(
            {
              '@id': 'foo',
              resources: [{
                '@id': 'foo',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=100,100,250,20',
              }, {
                '@id': 'bar',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=0,0,250,250',
              }, {
                '@id': 'irrelevant-box',
                '@type': 'oa:Annotation',
                motivation: 'sc:painting',
                on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json#xywh=0,0,50,50',
              }],
            },
          ),
        ],
        hoverAnnotation,
      });

      viewer.raiseEvent('mouse-move', {
        position: new OpenSeadragon.Point(101, 101),
      });

      vi.advanceTimersByTime(20);
      expect(hoverAnnotation).toHaveBeenCalledWith('base', ['foo', 'bar']);

      vi.useRealTimers();
    });
  });
});

import CanvasAnnotationDisplay from '../../../src/lib/CanvasAnnotationDisplay';
import AnnotationResource from '../../../src/lib/AnnotationResource';
import dualStrategyAnno from '../../fixtures/version-2/annotationMiradorDual.json';

/** */
function createSubject(args) {
  return new CanvasAnnotationDisplay({
    offset: {
      x: -100,
      y: 0,
    },
    palette: {
      default: { globalAlpha: 1, strokeStyle: 'black' },
      hovered: { globalAlpha: 1, strokeStyle: 'blue' },
      selected: { globalAlpha: 1, strokeStyle: 'yellow' },
    },
    zoomRatio: 0.5,
    ...args,
  });
}

describe('CanvasAnnotationDisplay', () => {
  describe('toContext', () => {
    it('selects svgSelector if present in a dual anno', () => {
      const context = {
        stroke: vi.fn(),
      };
      const subject = createSubject({
        resource: new AnnotationResource(dualStrategyAnno),
      });
      subject.svgContext = vi.fn();
      subject.fragmentContext = vi.fn();
      subject.toContext(context);
      expect(subject.svgContext).toHaveBeenCalled();
      expect(subject.fragmentContext).not.toHaveBeenCalled();
    });
    it('selects fragmentSelector if present and if no svg is present', () => {
      const context = {
        stroke: vi.fn(),
      };
      const subject = createSubject({
        resource: new AnnotationResource({ on: 'www.example.com/#xywh=10,10,100,200' }),
      });
      subject.svgContext = vi.fn();
      subject.fragmentContext = vi.fn();
      subject.toContext(context);
      expect(subject.svgContext).not.toHaveBeenCalled();
      expect(subject.fragmentContext).toHaveBeenCalled();
    });
    it('ignores annotations without selectors', () => {
      const context = {
        stroke: vi.fn(),
      };
      const subject = createSubject({
        resource: new AnnotationResource({ on: 'www.example.com' }),
      });
      subject.svgContext = vi.fn();
      subject.fragmentContext = vi.fn();
      subject.toContext(context);
      expect(subject.svgContext).not.toHaveBeenCalled();
      expect(subject.fragmentContext).not.toHaveBeenCalled();
    });
  });
  describe('svgString', () => {
    it('selects the svg selector string value', () => {
      const subject = createSubject({
        resource: new AnnotationResource(dualStrategyAnno),
      });
      expect(subject.svgString).toMatch(/<svg/);
    });
  });
  describe.skip('svgContext', () => {
    it('draws the paths with selected arguments', () => {
      const context = {
        fill: vi.fn(),
        restore: vi.fn(),
        save: vi.fn(),
        setLineDash: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
      };
      const subject = createSubject({
        resource: new AnnotationResource(dualStrategyAnno),
      });
      subject.context = context;
      subject.svgContext();
      expect(context.stroke).toHaveBeenCalledWith({});
      expect(context.save).toHaveBeenCalledWith();
      expect(context.restore).toHaveBeenCalledWith();
      expect(context.translate).toHaveBeenCalledWith(-100, 0);
      expect(context.strokeStyle).toEqual('#00bfff');
      expect(context.lineWidth).toEqual(61.74334);
      expect(context.fill).toHaveBeenCalled();
    });
    it('resets the color if selected rather than using the SVG color', () => {
      const context = {
        fill: vi.fn(),
        restore: vi.fn(),
        save: vi.fn(),
        setLineDash: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
      };
      const subject = createSubject({
        resource: new AnnotationResource(dualStrategyAnno),
        selected: true,
      });
      subject.context = context;
      subject.svgContext();
      expect(subject.context.strokeStyle).toBe('yellow');
    });
  });
  describe('fragmentContext', () => {
    it('draws the fragment with selected arguments', () => {
      const context = {
        restore: vi.fn(),
        save: vi.fn(),
        strokeRect: vi.fn(),
      };
      const subject = createSubject({
        hovered: true,
        resource: new AnnotationResource({ on: 'www.example.com/#xywh=10,10,100,200' }),
      });
      subject.context = context;
      subject.fragmentContext();
      expect(context.strokeRect).toHaveBeenCalledWith(-90, 10, 100, 200);
      expect(context.strokeStyle).toEqual('blue');
      expect(context.lineWidth).toEqual(2);
    });
  });
});

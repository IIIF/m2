import { render, screen } from '@tests/utils/test-utils';
import { createRef } from 'react';
import { ScrollTo } from '../../../src/components/ScrollTo';

describe('ScrollTo', () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  const originalScrollTo = Element.prototype.scrollTo;
  const originalOffsetTop = Element.prototype.offsetTop;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = function mockBoundingClientRect() {
      if (this.dataset.mockboundingrect) {
        return JSON.parse(this.dataset.mockboundingrect);
      }

      return originalGetBoundingClientRect.call(this);
    };

    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    Element.prototype.scrollTo = originalScrollTo;
    Element.prototype.offsetTop = originalOffsetTop;
  });

  it('renders the children', () => {
    render(<ScrollTo><div data-testid="a" /></ScrollTo>);

    expect(screen.getByTestId('a')).toBeInTheDocument();
  });

  it('scrolls to the element if it is off-screen ', () => {
    const containerRef = createRef();

    render(
      <div data-testid="container" ref={containerRef} data-mockboundingrect={JSON.stringify({ bottom: 100, height: 100, top: 0 })}>
        <div data-testid="scrollableContainer" style={{ height: 100, overflowY: true }} className="mirador-scrollto-scrollable">
          <ScrollTo containerRef={containerRef}><div data-testid="a" style={{ height: 75 }} /></ScrollTo>
          <ScrollTo containerRef={containerRef}><div data-testid="b" style={{ height: 75 }} /></ScrollTo>
          <ScrollTo containerRef={containerRef} scrollTo><div data-testid="c" data-mockboundingrect={JSON.stringify({ bottom: 225, top: 150 })} style={{ height: 75 }} /></ScrollTo>
        </div>
      </div>,
    );

    expect(Element.prototype.scrollTo).toHaveBeenCalled();
  });

  it('does nothing if the element is visible', () => {
    const containerRef = createRef();

    render(
      <div data-testid="container" ref={containerRef} data-mockboundingrect={JSON.stringify({ bottom: 100, height: 100, top: 0 })}>
        <div data-testid="scrollableContainer" style={{ height: 100, overflowY: true }} className="mirador-scrollto-scrollable">
          <ScrollTo containerRef={containerRef}><div data-testid="a" style={{ height: 75 }} /></ScrollTo>
          <ScrollTo containerRef={containerRef}><div data-testid="b" style={{ height: 75 }} /></ScrollTo>
          <ScrollTo containerRef={containerRef} scrollTo><div data-testid="c" data-mockboundingrect={JSON.stringify({ bottom: 100, top: 25 })} style={{ height: 75 }} /></ScrollTo>
        </div>
      </div>,
    );

    expect(Element.prototype.scrollTo).not.toHaveBeenCalled();
  });
});

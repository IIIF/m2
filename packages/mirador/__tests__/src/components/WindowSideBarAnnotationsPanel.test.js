import { render, screen } from '@tests/utils/test-utils';
import CanvasAnnotations from '../../../src/containers/CanvasAnnotations';
import { WindowSideBarAnnotationsPanel } from '../../../src/components/WindowSideBarAnnotationsPanel';

/** */
function createWrapper(props, state) {
  return render(
    <WindowSideBarAnnotationsPanel
      annotationCount={4}
      classes={{}}
      id="xyz"
      windowId="abc"
      {...props}
    />,
    { preloadedState: { companionWindows: { xyz: { content: 'annotations' } }, windows: { abc: {} }, ...state } },
  );
}

describe('WindowSideBarAnnotationsPanel', () => {
  let wrapper;

  it('has a heading', () => {
    createWrapper();

    expect(screen.getByRole('heading')).toHaveTextContent('Annotations');
  });

  it('has the AnnotationSettings component', () => {
    createWrapper();

    expect(screen.getByRole('button', { name: 'Highlight all' })).toBeInTheDocument();
  });

  it('renders the annotationsCount', () => {
    createWrapper();

    expect(screen.getByText('Showing 4 annotations')).toHaveClass('MuiTypography-subtitle2');
  });

  // TODO: Requires a lot of state setup...
  test.skip('renders a CanvasAnnotations for every selected canvas', () => {
    wrapper = createWrapper({
      canvasIds: ['abc', 'xyz'],
    });

    expect(wrapper.find(CanvasAnnotations).length).toBe(2);
  });
});

import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';

import { CanvasAnnotations } from '../../../src/components/CanvasAnnotations';
import { ScrollTo } from '../../../src/components/ScrollTo';

/** Utility function to wrap CanvasAnnotations */
function createWrapper(props) {
  return render(
    <CanvasAnnotations
      classes={{}}
      deselectAnnotation={() => {}}
      hoverAnnotation={() => {}}
      index={0}
      label="A Canvas Label"
      selectAnnotation={() => {}}
      totalSize={1}
      windowId="abc"
      {...props}
    />,
  );
}

describe('CanvasAnnotations', () => {
  let wrapper;
  const annotations = [
    {
      content: 'First Annotation',
      id: 'abc123',
      tags: ['abc123', 'def456'],
      targetId: 'example.com/iiif/12345',
    },
    {
      content: 'Last Annotation',
      id: 'xyz321',
      tags: [],
      targetId: 'example.com/iiif/54321',
    },
  ];

  it('renders a heading for a single item', () => {
    createWrapper({ annotations });

    expect(screen.getByText('Item: [A Canvas Label]')).toBeInTheDocument();
  });

  it('renders a heading with the appropriate context based on index and totalSize', () => {
    wrapper = createWrapper({ annotations, index: 1, totalSize: 2 });
    expect(screen.getByText('Right: [A Canvas Label]')).toBeInTheDocument();

    wrapper.unmount();

    createWrapper({ annotations, index: 0, totalSize: 2 });
    expect(screen.getByText('Left: [A Canvas Label]')).toBeInTheDocument();
  });

  it('renders a List w/ a ListItem for every annotation', () => {
    createWrapper({ annotations });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem').length).toEqual(2);
  });

  test.skip('scrolls to the selected annotation', () => {
    wrapper = createWrapper({ annotations, selectedAnnotationId: 'abc123' });

    expect(wrapper.find(ScrollTo).length).toEqual(2);
    expect(wrapper.find(ScrollTo).first().prop('scrollTo')).toEqual(true);
    expect(wrapper.find(ScrollTo).last().prop('scrollTo')).toEqual(false);
  });

  it('renders a Chip for every tag', () => {
    createWrapper({ annotations });

    expect(screen.getByText('abc123', { container: 'span.MuiChip-label' })).toBeInTheDocument();
    expect(screen.getByText('def456', { container: 'span.MuiChip-label' })).toBeInTheDocument();
  });

  it('renders nothing when there are no annotations', () => {
    createWrapper();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  describe('interacting with annotations', () => {
    it('triggers the selectAnnotation prop with the correct arguments when clicking an unselected annotation', async () => {
      const selectAnnotation = vi.fn();
      const user = userEvent.setup();

      wrapper = createWrapper({
        annotations,
        selectAnnotation,
      });

      await user.click(screen.getByRole('menuitem', { name: /First Annotation/ }));

      expect(selectAnnotation).toHaveBeenCalledWith('abc', 'abc123');
    });

    it('triggers the deselectAnnotation prop with the correct arguments when clicking a selected annotation', async () => {
      const deselectAnnotation = vi.fn();
      const user = userEvent.setup();

      wrapper = createWrapper({
        annotations,
        deselectAnnotation,
        selectedAnnotationId: 'abc123',
      });

      await user.click(screen.getByRole('menuitem', { name: /First Annotation/ }));

      expect(deselectAnnotation).toHaveBeenCalledWith('abc', 'abc123');
    });

    it('highlights annotations on mouse enter', async () => {
      const hoverAnnotation = vi.fn();
      const user = userEvent.setup();

      wrapper = createWrapper({
        annotations: [
          {
            content: 'Annotation',
            id: 'annoId',
            tags: [],
            targetId: 'example.com/iiif/12345',
          },
        ],
        hoverAnnotation,
      });

      await user.hover(screen.getByRole('menuitem', { name: /Annotation/ }));

      expect(hoverAnnotation).toHaveBeenCalledWith('abc', ['annoId']);
    });

    it('highlights annotations on focus', async () => {
      const hoverAnnotation = vi.fn();
      const user = userEvent.setup();

      wrapper = createWrapper({
        annotations: [
          {
            content: 'Annotation',
            id: 'annoId',
            tags: [],
            targetId: 'example.com/iiif/12345',
          },
          {
            content: 'Annotation2',
            id: 'annoId2',
            tags: [],
            targetId: 'example.com/iiif/12345',
          },
        ],
        hoverAnnotation,
      });

      await user.keyboard('{ArrowDown}');

      expect(hoverAnnotation).toHaveBeenCalledWith('abc', ['annoId2']);
    });

    it('sets the highlighted annotation to null on mouse leave', async () => {
      const hoverAnnotation = vi.fn();
      const user = userEvent.setup();

      wrapper = createWrapper({
        annotations: [
          {
            content: 'Annotation',
            id: 'annoId',
            tags: [],
            targetId: 'example.com/iiif/12345',
          },
        ],
        hoverAnnotation,
      });
      await user.hover(screen.getByRole('menuitem', { name: /Annotation/ }));

      expect(hoverAnnotation).toHaveBeenCalledWith('abc', ['annoId']);

      await user.hover(screen.getByRole('menu'));
      expect(hoverAnnotation).toHaveBeenCalledWith('abc', []);
    });
  });
});

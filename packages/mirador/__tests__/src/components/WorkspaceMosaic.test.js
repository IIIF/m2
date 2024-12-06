import { render, screen, fireEvent } from '@tests/utils/test-utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { WorkspaceMosaic } from '../../../src/components/WorkspaceMosaic';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WorkspaceMosaic
      classes={{}}
      windowIds={[]}
      workspaceId="foo"
      updateWorkspaceMosaicLayout={() => {}}
      {...props}
    />,
    {
      preloadedState: {
        windows: {
          1: { companionWindowIds: [] },
          2: { companionWindowIds: [] },
          3: { companionWindowIds: [] },
        },
      },
    },
  );
}

/* eslint-disable testing-library/no-node-access */
describe('WorkspaceMosaic', () => {
  const windowIds = ['1', '2'];
  let wrapper;
  it('should render properly with an initialValue', () => {
    wrapper = createWrapper({ windowIds });
    const tiles = wrapper.container.querySelectorAll('.mosaic-tile');

    expect(tiles).toHaveLength(2);
    expect(tiles[0]).toHaveStyle({
      bottom: '0%', left: '0%', right: '50%', top: '0%',
    });
    expect(tiles[1]).toHaveStyle({
      bottom: '0%', left: '50%', right: '0%', top: '0%',
    });
  });

  describe('componentDidUpdate', () => {
    it('updates the workspace layout when windows change', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender(
        <WorkspaceMosaic classes={{}} windowIds={['1', '2', '3']} workspaceId="foo" updateWorkspaceMosaicLayout={updateWorkspaceMosaicLayout} />,
      );

      expect(updateWorkspaceMosaicLayout).toHaveBeenCalled();
    });
    it('updates the workspace layout when windows are removed', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      const props = {
        classes: {},
        layout: { direction: 'row', first: '1', second: '2' },
        updateWorkspaceMosaicLayout,
        windowIds,
        workspaceId: 'foo',
      };
      wrapper = createWrapper(props);

      wrapper.rerender(
        <WorkspaceMosaic {...props} windowIds={['1']} />,
      );

      expect(updateWorkspaceMosaicLayout).toHaveBeenLastCalledWith('1');
    });
    it('when no windows remain', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender(
        <WorkspaceMosaic layout={{}} classes={{}} windowIds={[]} workspaceId="foo" updateWorkspaceMosaicLayout={updateWorkspaceMosaicLayout} />,
      );
      expect(updateWorkspaceMosaicLayout).toHaveBeenLastCalledWith(null);
    });
    it('when the new and old layouts are the same', () => {
      const updateWorkspaceMosaicLayout = vi.fn();
      wrapper = createWrapper({
        layout: { direction: 'row', first: '1', second: '2' },
        updateWorkspaceMosaicLayout,
        windowIds,
      });

      wrapper.rerender(
        <WorkspaceMosaic classes={{}} windowIds={windowIds} layout={{ direction: 'row', first: '1', second: '2' }} workspaceId="foo" updateWorkspaceMosaicLayout={updateWorkspaceMosaicLayout} />,
      );

      expect(updateWorkspaceMosaicLayout).toHaveBeenCalledTimes(0);
    });
  });
  describe('tile rendering', () => {
    it('when window is available', () => {
      wrapper = createWrapper({ windowIds });

      expect(screen.getAllByLabelText('Window:', { container: 'section' })[0]).toHaveAttribute('id', '1');
      expect(screen.getAllByLabelText('Window:', { container: 'section' })[1]).toHaveAttribute('id', '2');

      expect(wrapper.container.querySelector('.mosaic-window-title')).toBeEmptyDOMElement();
      expect(wrapper.container.querySelector('.mosaic-window-controls')).toBeEmptyDOMElement();
      expect(wrapper.container.querySelectorAll('.mosaic-preview')).toHaveLength(2);
      expect(wrapper.container.querySelector('.mosaic-preview')).toHaveAttribute('aria-hidden', 'true');
    });
  });
  describe('mosaicChange', () => {
    it('calls the provided prop to update layout', async () => {
      const updateWorkspaceMosaicLayout = vi.fn();

      const { container } = render(
        <DndProvider backend={HTML5Backend}>
          <WorkspaceMosaic
            classes={{}}
            windowIds={['1', '2']}
            workspaceId="foo"
            updateWorkspaceMosaicLayout={updateWorkspaceMosaicLayout}
          />
        </DndProvider>,
        {
          preloadedState: {
            windows: {
              1: { companionWindowIds: [], maximized: false },
              2: { companionWindowIds: [], maximized: false },
            },
            workspace: {
              type: 'mosaic',
              windowIds: ['1', '2'],
            },
          },
        },
      );

      const dragTarget = screen.getAllByLabelText('Window navigation')[0];
      const dropTarget = container.querySelector('.mirador-mosaic > .drop-target-container > .drop-target.top'); // eslint-disable-line testing-library/no-container

      fireEvent.dragStart(dragTarget);
      fireEvent.drag(dragTarget);
      fireEvent.dragEnter(dropTarget);
      fireEvent.dragOver(dropTarget);
      fireEvent.drop(dropTarget);

      expect(updateWorkspaceMosaicLayout).toBeCalled();
    });
  });
});

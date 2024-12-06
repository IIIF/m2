import { fireEvent, render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';

import WorkspaceElastic from '../../../src/components/WorkspaceElastic';

/** create wrapper */
function createWrapper({ elasticLayout = {}, ...props }) {
  return render(
    <WorkspaceElastic
      classes={{}}
      elasticLayout={elasticLayout}
      workspace={{
        draggingEnabled: true,
        focusedWindowId: '2',
        height: 5000,
        viewportPosition: {
          x: 20,
          y: 20,
        },
        width: 5000,
      }}
      setWorkspaceViewportDimensions={() => {}}
      setWorkspaceViewportPosition={() => {}}
      updateElasticWindowLayout={() => {}}
      {...props}
    />,
    {
      preloadedState: {
        companionWindows: {},
        elasticLayout,
        windows: { 1: { companionWindowIds: [] }, 2: { companionWindowIds: [] } },
        workspace: { draggingEnabled: true },
      },
    },
  );
}

/* eslint-disable testing-library/no-node-access, testing-library/no-container */
describe('WorkspaceElastic', () => {
  const elasticLayout = {
    1: {
      height: 200,
      width: 200,
      windowId: '1',
      x: 20,
      y: 20,
    },
    2: {
      height: 400,
      width: 300,
      windowId: '2',
      x: 25,
      y: 25,
    },
  };

  it('should render properly with an initialValue', () => {
    createWrapper({ elasticLayout });
    expect(screen.getAllByLabelText('Window:')).toHaveLength(2);
  });
  describe('workspace behaviour', () => {
    it('when workspace itself is dragged', async () => {
      const user = userEvent.setup();
      const mockDragStop = vi.fn();
      const { container } = createWrapper({
        elasticLayout,
        setWorkspaceViewportPosition: mockDragStop,
      });

      container.getBoundingClientRect = () => ({
        left: -2500,
        offsetHeight: 5000,
        offsetWidth: 5000,
        top: -2500,
      });
      const el = container.querySelector('.mirador-workspace.react-draggable');

      const coords = {
        clientX: 400,
        clientY: 300,
      };

      await user.pointer([
        { coords: { clientX: 0, clientY: 0 }, keys: '[MouseLeft>]', target: el },
        { coords },
        { coords, keys: '[/MouseLeft]', target: el },
      ]);

      expect(mockDragStop).toHaveBeenCalledWith({
        x: -1 * (400 - 20),
        y: -1 * (300 - 20),
      });
    });

    it('when workspace itself is resized', () => {
      const mockResize = vi.fn();
      const { container } = createWrapper({
        elasticLayout,
        setWorkspaceViewportDimensions: mockResize,
      });

      container.firstChild.getBoundingClientRect = () => ({
        height: 500,
        width: 800,
      });

      fireEvent(window, new Event('resize'));

      expect(mockResize).toHaveBeenCalledWith({
        height: 500,
        width: 800,
      });
    });
  });
});

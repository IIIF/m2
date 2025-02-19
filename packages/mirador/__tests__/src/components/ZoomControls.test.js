import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ZoomControls } from '../../../src/components/ZoomControls';

/** Utility function to create a shallow rendering */
function createWrapper(props) {
  return render(
    <ZoomControls
      windowId="xyz"
      zoomToWorld={() => {}}
      {...props}
    />,
  );
}

describe('ZoomControls', () => {
  const viewer = { x: 100, y: 100, zoom: 1 };
  let updateViewport;

  const zoomToWorld = vi.fn();
  let user;
  beforeEach(() => {
    user = userEvent.setup();
    updateViewport = vi.fn();
    createWrapper({
      updateViewport, viewer, zoomToWorld,
    });
  });

  it('renders a couple buttons', () => {
    expect(screen.getByRole('button', { name: 'Zoom in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset zoom' })).toBeInTheDocument();
  });

  it('has a zoom-in button', async () => {
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));

    expect(updateViewport).toHaveBeenCalledWith('xyz', { zoom: 2 });
  });

  it('has a zoom-out button', async () => {
    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(updateViewport).toHaveBeenCalledWith('xyz', { zoom: 0.5 });
  });

  it('has a zoom reset button', async () => {
    await user.click(screen.getByRole('button', { name: 'Reset zoom' }));

    expect(zoomToWorld).toHaveBeenCalledWith(false);
  });
});

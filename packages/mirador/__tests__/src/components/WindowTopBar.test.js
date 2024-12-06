import { screen, fireEvent, render } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowTopBar } from '../../../src/components/WindowTopBar';

import FullscreenContext from '../../../src/contexts/FullScreenContext';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <FullscreenContext.Provider value={vi.fn()}>
      <WindowTopBar
        windowId="xyz"
        classes={{}}
        focusWindow={() => {}}
        maximized={false}
        maximizeWindow={() => {}}
        minimizeWindow={() => {}}
        removeWindow={() => {}}
        {...props}
      />
    </FullscreenContext.Provider>
  );
}

describe('WindowTopBar', () => {
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders all default components', () => {
    render(<Subject />);
    expect(screen.getByRole('navigation', { name: 'Window navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Window views & thumbnail display' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Maximize window' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close window' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Full screen' })).not.toBeInTheDocument();
  });

  it('uses allow flags to override defaults', () => {
    render(<Subject
      allowWindowSideBar={false}
      allowClose={false}
      allowMaximize={false}
      allowTopMenuButton={false}
      allowFullscreen
    />);
    expect(screen.queryByRole('button', { name: 'Toggle sidebar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Window views & thumbnail display' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Maximize window' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close window' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Full screen' })).toBeInTheDocument();
  });

  it('triggers window focus when clicked', () => {
    const focusWindow = vi.fn();
    render(<Subject focusWindow={focusWindow} />);
    const toolbar = screen.getByRole('navigation', { name: 'Window navigation' }).firstChild; // eslint-disable-line testing-library/no-node-access
    expect(toolbar).toBeInTheDocument();
    // we specifically need mouseDown not click for MUI Toolbar here
    fireEvent.mouseDown(toolbar);
    expect(focusWindow).toHaveBeenCalledTimes(1);
  });

  it('passes correct callback to toggleWindowSideBar button', async () => {
    const toggleWindowSideBar = vi.fn();
    render(
      <Subject allowWindowSideBar toggleWindowSideBar={toggleWindowSideBar} />,
      { preloadedState: { windows: { xyz: { sideBarOpen: false } } } },
    );
    const button = screen.getByRole('button', { name: 'Toggle sidebar' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(toggleWindowSideBar).toHaveBeenCalledTimes(1);
  });

  it('passes correct callback to closeWindow button', async () => {
    const removeWindow = vi.fn();
    render(<Subject allowClose removeWindow={removeWindow} />);
    const button = screen.getByRole('button', { name: 'Close window' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(removeWindow).toHaveBeenCalledTimes(1);
  });

  it('passes correct callback to maximizeWindow button', async () => {
    const maximizeWindow = vi.fn();
    render(<Subject allowMaximize maximizeWindow={maximizeWindow} />);
    const button = screen.getByRole('button', { name: 'Maximize window' });
    expect(button).toBeInTheDocument();
    await user.click(button);
    expect(maximizeWindow).toHaveBeenCalledTimes(1);
  });

  it('close button is configurable', () => {
    render(<Subject allowClose={false} />);
    const button = screen.queryByRole('button', { name: 'Close window' });
    expect(button).not.toBeInTheDocument();
  });

  it('maximize button is configurable', () => {
    render(<Subject allowMaximize={false} />);
    const button = screen.queryByRole('button', { name: 'Maximize window' });
    expect(button).not.toBeInTheDocument();
  });
});

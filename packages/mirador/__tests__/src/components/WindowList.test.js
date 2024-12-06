import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowList } from '../../../src/components/WindowList';

describe('WindowList', () => {
  let handleClose;
  let focusWindow;
  let titles;
  beforeEach(() => {
    handleClose = vi.fn();
    focusWindow = vi.fn();
    titles = {};

    render(<div data-testid="container" />);
  });

  it('renders without an error', () => {
    render(
      <WindowList
        anchorEl={screen.getByTestId('container')}
        open
        titles={titles}
        windowIds={[]}
        handleClose={handleClose}
        focusWindow={focusWindow}
      />,
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  describe('with a window without a matching manifest', () => {
    beforeEach(() => {
      render(
        <WindowList
          anchorEl={screen.getByTestId('container')}
          open
          titles={titles}
          windowIds={['xyz']}
          handleClose={handleClose}
          focusWindow={focusWindow}
        />,
      );
    });

    it('renders without an error', async () => {
      const user = userEvent.setup();
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
      await user.click(screen.getByRole('menuitem', { name: '[Untitled]' }));

      expect(handleClose).toBeCalled();
      expect(focusWindow).toBeCalledWith('xyz', true);
    });
  });

  describe('with a window with a matching manifest', () => {
    beforeEach(() => {
      titles = { xyz: 'Some title' };

      render(
        <WindowList
          anchorEl={screen.getByTestId('container')}
          open
          titles={titles}
          windowIds={['xyz']}
          handleClose={handleClose}
          focusWindow={focusWindow}
        />,
      );
    });

    it('renders without an error', () => {
      expect(screen.getByRole('menuitem', { name: 'Some title' })).toBeInTheDocument();
    });
  });

  describe('with a focused window', () => {
    beforeEach(() => {
      titles = { abc: 'Abc', xyz: 'Some title' };

      render(
        <WindowList
          anchorEl={screen.getByTestId('container')}
          open
          titles={titles}
          windowIds={['abc', 'xyz']}
          focusedWindowId="xyz"
          handleClose={handleClose}
          focusWindow={focusWindow}
        />,
      );
    });

    it('puts focus on the currently focused window', () => {
      expect(screen.getByRole('menuitem', { name: 'Some title' })).toHaveFocus();
    });
  });
});

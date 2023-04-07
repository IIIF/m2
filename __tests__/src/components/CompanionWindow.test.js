import { render, screen } from 'test-utils';
import PropTypes from 'prop-types';
import userEvent from '@testing-library/user-event';
import { CompanionWindow } from '../../../src/components/CompanionWindow';

/** create wrapper */
function createWrapper(props) {
  return render(
    <CompanionWindow
      id="abc123"
      isDisplayed
      direction="ltr"
      windowId="x"
      classes={{ horizontal: 'horizontal', small: 'small', vertical: 'vertical' }}
      companionWindow={{}}
      position="right"
      {...props}
    />,
  );
}

describe('CompanionWindow', () => {
  describe('aria-label', () => {
    it('has an aria-label for the landmark derived from the title', () => {
      createWrapper({ title: 'some title' });

      expect(screen.getByRole('complementary')).toHaveAccessibleName('some title');
    });
    it('can be overridden with an explicit ariaLabel prop', () => {
      createWrapper({ ariaLabel: 'some label', title: 'some title' });

      expect(screen.getByRole('complementary')).toHaveAccessibleName('some label');
    });
  });

  describe('when the openInCompanionWindow button is clicked', () => {
    it('passes the the updateCompanionWindow prop to MiradorMenuButton with the appropriate args', async () => {
      const updateCompanionWindow = jest.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'left',
        updateCompanionWindow,
      });

      await user.click(screen.getByRole('button', { name: 'openInCompanionWindow' }));

      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
    });
  });

  describe('when the close companion window button is clicked', () => {
    it('triggers the onCloseClick prop with the appropriate args', async () => {
      const removeCompanionWindowEvent = jest.fn();
      const user = userEvent.setup();

      createWrapper({
        onCloseClick: removeCompanionWindowEvent,
      });

      await user.click(screen.getByRole('button', { name: 'closeCompanionWindow' }));

      expect(removeCompanionWindowEvent).toHaveBeenCalledTimes(1);
    });

    it('allows the children to know about onCloseClick', async () => {
      const removeCompanionWindowEvent = jest.fn();
      const user = userEvent.setup();

      /** Some child component */
      const Button = ({ parentactions, ...props }) => (
        <button type="button" onClick={parentactions.closeCompanionWindow} {...props}>Close</button>
      );

      Button.propTypes = {
        parentactions: PropTypes.shape({ closeCompanionWindow: PropTypes.func.isRequired }).isRequired,
      };

      createWrapper({
        children: <Button data-testid="button" />,
        onCloseClick: removeCompanionWindowEvent,
      });

      await user.click(screen.getByTestId('button'));
      expect(removeCompanionWindowEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the companion window is on the right', () => {
    it('can be moved to the bottom', async () => {
      const updateCompanionWindow = jest.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'right',
        updateCompanionWindow,
      });

      expect(screen.getByRole('complementary')).toHaveClass('vertical');

      await user.click(screen.getByRole('button', { name: 'moveCompanionWindowToBottom' }));
      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'bottom' });
    });
  });

  describe('when the companion window is on the bottom', () => {
    it('can be moved to the right', async () => {
      const updateCompanionWindow = jest.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'bottom',
        updateCompanionWindow,
      });

      expect(screen.getByRole('complementary')).toHaveClass('horizontal');

      await user.click(screen.getByRole('button', { name: 'moveCompanionWindowToRight' }));

      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
    });
  });

  it('renders title controls when available', () => {
    createWrapper({ position: 'bottom', titleControls: <div data-testid="xyz" /> });

    expect(screen.getByTestId('xyz')).toBeInTheDocument();
  });

  it('adds a small class when the component width is small', () => {
    const { container } = createWrapper({ size: { width: 369 } });

    expect(container.querySelector('.MuiToolbar-root')).toHaveClass('small'); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });

  it('has a resize handler', () => {
    const { container } = createWrapper();

    expect(container.querySelector('.react-draggable')).toHaveStyle({ height: '100%', width: '235px' }); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector('[style*="cursor: col-resize;"]')).toHaveStyle({ left: '-5px' }); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });

  it('has a vertical resize handle when position is bottom', () => {
    const { container } = createWrapper({ position: 'bottom' });

    expect(container.querySelector('.react-draggable')).toHaveStyle({ height: '201px', width: 'auto' }); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
    expect(container.querySelector('[style*="cursor: row-resize;"]')).toHaveStyle({ top: '-5px' }); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });
});

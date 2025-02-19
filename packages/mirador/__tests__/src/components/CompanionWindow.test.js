import { render, screen } from '@tests/utils/test-utils';
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
      const updateCompanionWindow = vi.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'left',
        updateCompanionWindow,
      });

      await user.click(screen.getByRole('button', { name: 'Open in separate panel' }));

      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
    });
  });

  describe('when the close companion window button is clicked', () => {
    it('triggers the onCloseClick prop with the appropriate args', async () => {
      const removeCompanionWindowEvent = vi.fn();
      const user = userEvent.setup();

      createWrapper({
        onCloseClick: removeCompanionWindowEvent,
      });

      await user.click(screen.getByRole('button', { name: 'Close panel' }));

      expect(removeCompanionWindowEvent).toHaveBeenCalledTimes(1);
    });

    it('allows the children to know about onCloseClick', async () => {
      const removeCompanionWindowEvent = vi.fn();
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
      const updateCompanionWindow = vi.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'right',
        updateCompanionWindow,
      });

      expect(screen.getByRole('complementary')).toHaveClass('mirador-companion-window-right');

      await user.click(screen.getByRole('button', { name: 'Move to bottom' }));

      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'bottom' });
    });
  });

  describe('when the companion window is on the bottom', () => {
    it('can be moved to the right', async () => {
      const updateCompanionWindow = vi.fn();
      const user = userEvent.setup();

      createWrapper({
        position: 'bottom',
        updateCompanionWindow,
      });

      expect(screen.getByRole('complementary')).toHaveClass('mirador-companion-window-bottom ');

      await user.click(screen.getByRole('button', { name: 'Move to right' }));

      expect(updateCompanionWindow).toHaveBeenCalledWith({ position: 'right' });
    });
  });

  it('renders title controls when available', () => {
    createWrapper({ position: 'bottom', titleControls: <div data-testid="xyz" /> });

    expect(screen.getByTestId('xyz')).toBeInTheDocument();
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

import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { WindowTopBarPluginMenu } from '../../../src/components/WindowTopBarPluginMenu';

/** create wrapper */
function Subject({ ...props }) {
  return (
    <WindowTopBarPluginMenu
      windowId="abc123"
      {...props}
    />
  );
}
// needs to be a non-functional component to accept forwardRef the way we have it set up
/**  */
class mockComponentA extends React.Component {
  /**  */
  render() {
    return (
      <div data-testid="testA" />
    );
  }
}

describe('WindowTopBarPluginMenu', () => {
  describe('when there are no plugins present', () => {
    it('renders nothing (and no Button/Menu/PluginHook)', () => {
      render(<Subject />);
      expect(screen.queryByTestId('testA')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Window options' })).not.toBeInTheDocument();
    });
  });

  describe('when there are plugins present', () => {
    let user;
    beforeEach(() => {
      user = userEvent.setup();
      render(<Subject PluginComponents={[mockComponentA]} />);
    });

    it('renders the Button', async () => {
      expect(screen.getByRole('button', { name: 'Window options' })).toBeInTheDocument();
    });

    it('the Menu is controlled by the Button clicks', async () => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.queryByTestId('testA')).not.toBeInTheDocument();

      // open
      await user.click(screen.getByRole('button', { name: 'Window options' }));
      expect(screen.getByRole('menu')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});

import { render, screen } from '@tests/utils/test-utils';
import { WindowSideBar } from '../../../src/components/WindowSideBar';

/** create wrapper */
function createWrapper({ ...props }) {
  return render(
    <WindowSideBar
      windowId="xyz"
      {...props}
    />,
    {
      preloadedState: {
        windows: {
          xyz: {
            companionWindowIds: [],
            suggestedSearches: null,
          },
        },
      },
    },
  );
}

describe('WindowSideBar when closed', () => {
  it('renders without an error', () => {
    createWrapper({});
    expect(screen.queryByRole('navigation', { accessibleName: 'sidebarPanelsNavigation' })).not.toBeInTheDocument();
  });
});
describe('WindowSideBar when open', () => {
  it('renders in an open state', () => {
    createWrapper({ sideBarOpen: true });
    expect(screen.getByRole('navigation', { accessibleName: 'sidebarPanelsNavigation' })).toBeInTheDocument();
  });
  it('Renders drawer ltr by default', () => {
    createWrapper({ sideBarOpen: true });
    expect(screen.queryByRole('navigation', { accessibleName: 'sidebarPanelsNavigation' })).toHaveClass('MuiDrawer-paperAnchorLeft'); // eslint-disable-line testing-library/no-node-access
  });
  it('Renders drawer rtl when specified', () => {
    createWrapper({ direction: 'rtl', sideBarOpen: true });
    expect(screen.queryByRole('navigation', { accessibleName: 'sidebarPanelsNavigation' })).toHaveClass('MuiDrawer-paperAnchorRight'); // eslint-disable-line testing-library/no-node-access
  });
});

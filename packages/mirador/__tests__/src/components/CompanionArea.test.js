import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';

import { CompanionArea } from '../../../src/components/CompanionArea';

/** */
function createWrapper(props) {
  return render(
    <CompanionArea
      classes={{ horizontal: 'horizontal' }}
      direction="ltr"
      windowId="abc123"
      position="right"
      companionAreaOpen
      companionWindowIds={['foo', 'baz']}
      {...props}
    />,
    { preloadedState: { companionWindows: { baz: { content: 'attribution' }, foo: { content: 'info' } } } },
  );
}

describe('CompanionArea', () => {
  it('should render all <CompanionWindow>', () => {
    createWrapper();

    expect(screen.getAllByRole('complementary')).toHaveLength(2);
  });

  it('should add the appropriate classes when the companion area fills the full width', () => {
    const { container } = createWrapper({ position: 'bottom' });

    expect(container.querySelector('.mirador-companion-area-bottom')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });

  it('renders the appropriate <CompanionWindow> components', () => {
    createWrapper();

    expect(screen.getByRole('heading', { name: 'About this item' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rights' })).toBeInTheDocument();
  });

  it('has a toggle to show the companion area window in the left position', async () => {
    const setCompanionAreaOpen = vi.fn();
    const user = userEvent.setup();

    createWrapper({
      companionAreaOpen: false,
      position: 'left',
      setCompanionAreaOpen,
      sideBarOpen: true,
    });

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

    expect(setCompanionAreaOpen).toHaveBeenCalledWith('abc123', true);
  });

  it('has a toggle to hide the companion area window in the left position', async () => {
    const setCompanionAreaOpen = vi.fn();
    const user = userEvent.setup();

    createWrapper({
      companionAreaOpen: true,
      position: 'left',
      setCompanionAreaOpen,
      sideBarOpen: true,
    });

    expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

    expect(setCompanionAreaOpen).toHaveBeenCalledWith('abc123', false);
  });

  it('does not show a toggle if the sidebar is collapsed', () => {
    createWrapper({
      companionAreaOpen: true,
      position: 'left',
      setCompanionAreaOpen: () => {},
      sideBarOpen: false,
    });

    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();
  });

  it('does not show a toggle in other positions', () => {
    createWrapper({
      companionAreaOpen: true,
      position: 'whatever',
      setCompanionAreaOpen: () => {},
      sideBarOpen: true,
    });

    expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();
  });
});

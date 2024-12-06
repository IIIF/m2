import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowViewSettings } from '../../../src/components/WindowViewSettings';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WindowViewSettings
      classes={{}}
      windowId="xyz"
      setWindowViewType={() => {}}
      viewTypes={['single', 'book', 'scroll', 'gallery']}
      windowViewType="single"
      {...props}
    />,
  );
}

describe('WindowViewSettings', () => {
  it('renders all elements correctly', () => {
    createWrapper();
    expect(screen.getByRole('presentation', { selector: 'li' })).toBeInTheDocument();
    const menuItems = screen.queryAllByRole('menuitemradio');
    expect(menuItems.length).toBe(4);
    expect(menuItems[0]).toHaveTextContent(/Single/i);
    expect(menuItems[1]).toHaveTextContent(/Book/i);
    expect(menuItems[2]).toHaveTextContent(/Scroll/i);
    expect(menuItems[3]).toHaveTextContent(/Gallery/i);
  });
  it('single should set the correct label active (by setting the secondary color)', () => {
    createWrapper({ windowViewType: 'single' });
    expect(screen.getByRole('menuitemradio', { name: /Single/ }).querySelector('svg')).toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
    expect(screen.getByRole('menuitemradio', { name: /Book/ }).querySelector('svg')).not.toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
  });
  it('book should set the correct label active (by setting the secondary color)', () => {
    createWrapper({ windowViewType: 'book' });
    expect(screen.getByRole('menuitemradio', { name: /Book/ }).querySelector('svg')).toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
    expect(screen.getByRole('menuitemradio', { name: /Single/ }).querySelector('svg')).not.toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
  });
  it('scroll should set the correct label active (by setting the secondary color)', () => {
    createWrapper({ windowViewType: 'scroll' });
    expect(screen.getByRole('menuitemradio', { name: /Scroll/ }).querySelector('svg')).toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
    expect(screen.getByRole('menuitemradio', { name: /Single/ }).querySelector('svg')).not.toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
  });
  it('gallery should set the correct label active (by setting the secondary color)', () => {
    createWrapper({ windowViewType: 'gallery' });
    expect(screen.getByRole('menuitemradio', { name: /Gallery/ }).querySelector('svg')).toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
    expect(screen.getByRole('menuitemradio', { name: /Single/ }).querySelector('svg')).not.toHaveClass('MuiSvgIcon-colorSecondary'); // eslint-disable-line testing-library/no-node-access
  });
  it('updates state when the view config selection changes', async () => {
    const setWindowViewType = vi.fn();
    createWrapper({ setWindowViewType });
    const user = userEvent.setup();
    const menuItems = screen.queryAllByRole('menuitemradio');
    expect(menuItems.length).toBe(4);
    await user.click(menuItems[0]);
    expect(setWindowViewType).toHaveBeenCalledWith('xyz', 'single');
    await user.click(menuItems[1]);
    expect(setWindowViewType).toHaveBeenCalledWith('xyz', 'book');
    await user.click(menuItems[2]);
    expect(setWindowViewType).toHaveBeenCalledWith('xyz', 'scroll');
    await user.click(menuItems[3]);
    expect(setWindowViewType).toHaveBeenCalledWith('xyz', 'gallery');
  });
});

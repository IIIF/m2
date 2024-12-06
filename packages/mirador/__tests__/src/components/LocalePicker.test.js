import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { LocalePicker } from '../../../src/components/LocalePicker';

/**
 * Helper function to create a shallow wrapper around LocalePicker
 */
function createWrapper(props) {
  return render(
    <LocalePicker
      availableLocales={[]}
      locale={undefined}
      setLocale={() => {}}
      {...props}
    />,
  );
}

describe('LocalePicker', () => {
  it('hides the control if there are not locales to switch to', () => {
    const { container } = createWrapper({ availableLocales: ['en'] });

    expect(container).toBeEmptyDOMElement(); // eslint-disable-line testing-library/no-container
  });

  it('renders a select with the current value', () => {
    createWrapper({ availableLocales: ['en', 'de'], locale: 'de' });
    // The option to expand the dropdown menu is rendered by a CompanionWindow titleControls prop in WindowSideBarInfoPanel, which is a combobox
    const dropdownTitle = screen.getByRole('combobox');
    expect(dropdownTitle).toHaveTextContent('Deutsch');
  });

  it('renders a select with both options and sets the current value', async () => {
    const user = userEvent.setup();
    createWrapper({ availableLocales: ['en', 'de'], locale: 'de' });
    const dropdownTitle = screen.getByRole('combobox');
    // Open the menu
    await user.click(dropdownTitle);
    // The dropddown menu is not nested within the combobox, it is a sibling in the DOM, an MuiMenu
    const menu = screen.getByRole('listbox');
    // Assert that the menu element has 2 children (2 options)
    expect(menu.children).toHaveLength(2); // eslint-disable-line testing-library/no-node-access
    // Verify that the select element has the correct value ('de')
    const deOption = screen.getByRole('option', { name: 'Deutsch' });
    expect(deOption).toHaveAttribute('aria-selected', 'true');
    // Verify en is also an option
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
  });

  it('triggers setLocale prop when clicking a list item', async () => {
    const user = userEvent.setup();
    const setLocale = vi.fn();
    createWrapper({
      availableLocales: ['en', 'de'],
      locale: 'en',
      setLocale,
    });
    const dropdownTitle = screen.getByRole('combobox');
    // Open the Select component
    await user.click(dropdownTitle);
    // Change the locale to 'de'
    await user.click(screen.getByRole('option', { name: 'Deutsch' }));
    expect(setLocale).toHaveBeenCalledTimes(1);
    expect(setLocale).toHaveBeenCalledWith('de');
  });
});

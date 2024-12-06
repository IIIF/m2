import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { LanguageSettings } from '../../../src/components/LanguageSettings';

/**
 * Helper function to create a shallow wrapper around LanguageSettings
 */
function createWrapper(props) {
  return render(
    <LanguageSettings
      handleClick={() => {}}
      languages={{}}
      {...props}
    />,
  );
}

describe('LanguageSettings', () => {
  const languages = [
    {
      current: true,
      label: 'Deutsch',
      locale: 'de',
    },
    {
      current: false,
      label: 'English',
      locale: 'en',
    },
  ];

  it('renders a list with a list item for each language passed in props', () => {
    createWrapper({ languages });

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('renders the check icon when the active prop returns true', () => {
    createWrapper({ languages });

    expect(screen.getByRole('menuitem', { name: 'Deutsch' }).querySelector('svg')).toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access
    expect(screen.getByRole('menuitem', { name: 'English' }).querySelector('svg')).not.toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/prefer-presence-queries
  });

  it('renders the language value in an Typography element wrapped in a ListItemText', () => {
    createWrapper({ languages });

    expect(screen.getByText('Deutsch')).toHaveClass('MuiTypography-body1');
  });

  it('triggers the handleClick prop when clicking a list item', async () => {
    const user = userEvent.setup();
    const mockHandleClick = vi.fn();
    createWrapper({
      handleClick: mockHandleClick,
      languages,
    });

    await user.click(screen.getByRole('menuitem', { name: 'English' }));

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
    expect(mockHandleClick).toHaveBeenCalledWith('en');
  });
});

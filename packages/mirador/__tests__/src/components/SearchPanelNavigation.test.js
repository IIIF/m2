import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchPanelNavigation } from '../../../src/components/SearchPanelNavigation';

/**
 * Helper function to create a shallow wrapper around SearchPanelNavigation
 */
function createWrapper(props) {
  return render(
    <SearchPanelNavigation
      companionWindowId="cw"
      direction="ltr"
      windowId="window"
      {...props}
    />,
  );
}

describe('SearchPanelNavigation', () => {
  describe('when searchHits are available', () => {
    it('renders text with buttons', async () => {
      const selectAnnotation = vi.fn();
      const user = userEvent.setup();
      createWrapper({
        searchHits: [{ annotations: ['1'] }, { annotations: ['2'] }, { annotations: ['3'] }],
        selectAnnotation,
        selectedContentSearchAnnotation: ['2'],
      });
      expect(screen.getByText('2 of 3')).toBeInTheDocument();
      expect(screen.getAllByRole('button').length).toEqual(2);
      await user.click(screen.getByRole('button', { name: 'Previous result' }));
      expect(selectAnnotation).toHaveBeenCalledWith('1');
      await user.click(screen.getByRole('button', { name: 'Next result' }));
      expect(selectAnnotation).toHaveBeenCalledWith('3');
    });
    it('buttons disabled when no next/prev', () => {
      createWrapper({
        searchHits: [{ annotations: ['1'] }],
        selectedContentSearchAnnotation: ['1'],
      });
      expect(screen.getByRole('button', { name: 'Previous result' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next result' })).toBeDisabled();
    });
  });
});

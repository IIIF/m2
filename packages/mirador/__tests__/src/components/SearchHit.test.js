import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchHit } from '../../../src/components/SearchHit';

vi.mock(
  '../../../src/components/ScrollTo',
  () => ({
    ScrollTo: ({ children }) => (<div data-testid="scrollto">{children}</div>), // eslint-disable-line react/prop-types
  }),
);

/**
 * Helper function to create a shallow wrapper around SearchResults
 */
const Subject = (props) => (
  <SearchHit
    announcer={() => {}}
    annotation={{ targetId: 'x' }}
    annotationId="foo"
    hit={{
      after: ', and start the chainsaw',
      annotations: ['foo'],
      before: 'Light up the',
      match: 'moose',
    }}
    windowId="window"
    selected
    index={0}
    windowSelected
    {...props}
  />
);

describe('SearchHit', () => {
  it('renders a ListItem for each hit', async () => {
    const user = userEvent.setup();
    const selectAnnotation = vi.fn();
    render(<Subject selectAnnotation={selectAnnotation} />);

    expect(screen.getByRole('listitem')).toHaveClass('Mui-selected');
    expect(screen.getByRole('listitem')).toHaveTextContent('1Light up the moose , and start the chai more');

    await user.click(screen.getByRole('button'));
    expect(selectAnnotation).toHaveBeenCalledWith('foo');
  });

  it('renders the annotation char if the hit is not available', () => {
    render(<Subject annotation={{ chars: 'xyz' }} hit={undefined} />);

    expect(screen.getByRole('listitem')).toHaveTextContent('1xyz');
  });

  it('renders a ScrollTo', () => {
    render(<Subject containerRef="ref" />);

    expect(screen.getByTestId('scrollto')).toBeInTheDocument();
  });

  describe('Annotation Labels', () => {
    it('renders the annotationLabel if present', () => {
      render(<Subject annotationLabel="The Anno Label" />);

      expect(screen.getByRole('heading', { level: 4, name: 'The Anno Label' })).toBeInTheDocument();
    });

    it('does not render the typography if no annotation label is present', () => {
      render(<Subject />);

      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    });
  });

  describe('announcer', () => {
    it('sends information about the annotation when selected', () => {
      const announcer = vi.fn();
      const props = {
        annotationLabel: 'The Annotation Label',
        announcer,
        canvasLabel: 'The Canvas Label',
        selected: false,
        total: 9,
      };

      const { rerender } = render(<Subject {...props} />);
      expect(announcer).not.toHaveBeenCalled();

      rerender(<Subject {...props} selected />);
      expect(announcer).toHaveBeenCalledWith(
        '1 of 9 The Canvas Label The Annotation Label Light up the moose , and start the chai',
        'polite',
      );
    });

    it('calls the announcer when initially rendered as selected', () => {
      const announcer = vi.fn();
      render(<Subject announcer={announcer} selected />);

      expect(announcer).toHaveBeenCalled();
    });

    it('does not call the announcer when initially rendered as unselected', () => {
      const announcer = vi.fn();
      render(<Subject announcer={announcer} selected={false} />);

      expect(announcer).not.toHaveBeenCalled();
    });

    it('does not send information about annotations that are not being deselected', () => {
      const announcer = vi.fn();
      const { rerender } = render(<Subject announcer={announcer} selected />);

      announcer.mockClear();

      rerender(<Subject announcer={announcer} selected={false} />);
      expect(announcer).not.toHaveBeenCalled();
    });
  });
});

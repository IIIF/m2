import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';

import { SearchResults } from '../../../src/components/SearchResults';

/**
 * Helper function to create a shallow wrapper around SearchResults
 */
function createWrapper(props) {
  return render(
    <SearchResults
      companionWindowId="cwid"
      windowId="window"
      query="query"
      selectedContentSearchAnnotation={['foo']}
      searchHits={[
        {
          after: ', and start the chainsaw',
          annotations: ['foo'],
          before: 'Light up the',
          match: 'moose',
        },
      ]}
      {...props}
    />,
    {
      preloadedState: {
        companionWindows: {
          cwid: {},
        },
        searches: {
          window: {
            cwid: {
              data: {
                'http://example.com/contentsearch': {
                  id: 'http://example.com/contentsearch',
                  isFetching: false,
                  json: {
                    resources: [
                      {
                        '@id': 'foo',
                        '@type': 'oa:Annotation',
                        motivation: 'sc:painting',
                      },
                      {
                        '@id': 'x',
                        label: 'The Anno Label',
                      },
                      {
                        '@id': 'y',
                        label: 'Annother Anno Label',
                      },
                    ],
                  },
                },
              },
              query: '',
              selectedContentSearchAnnotation: null,
              selectedContentSearchAnnotationIds: [],
            },
          },
        },
        windows: {
          window: {},
        },
      },
    },
  );
}

describe('SearchResults', () => {
  it('renders a SearchHit for each hit', () => {
    createWrapper({});

    expect(screen.getByRole('button', { name: /Light up the moose/ })).toBeInTheDocument();
  });

  it('can focus on a single item', async () => {
    const user = userEvent.setup();
    createWrapper({});

    await user.click(screen.getByRole('button', { name: 'more...' }));
    expect(screen.getByRole('listitem')).toHaveTextContent(/start the chainsaw/);

    expect(screen.queryByRole('button', { name: 'more...' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to results' }));
    expect(screen.getByRole('button', { name: 'more...' })).toBeInTheDocument();
  });

  describe('annotation-only search results', () => {
    it('renders a SearchHit for each annotation', () => {
      createWrapper({
        searchAnnotations: [{ id: 'x' }, { id: 'y' }],
        searchHits: [],
      });

      expect(screen.getByRole('heading', { level: 4, name: 'The Anno Label' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4, name: 'Annother Anno Label' })).toBeInTheDocument();
    });
  });

  describe('no search results', () => {
    it('shows no results', () => {
      createWrapper({
        isFetching: false,
        query: 'nope',
        searchHits: [],
      });

      expect(screen.getByText('No results found')).toHaveClass('MuiTypography-body1');
    });

    it('while fetching', () => {
      createWrapper({
        isFetching: true,
        query: 'nope',
        searchHits: [],
      });

      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });

    it('without a query', () => {
      createWrapper({
        isFetching: false,
        query: '',
      });
      expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    });
  });

  describe('multi-page search results', () => {
    it('shows a button to request the next page', async () => {
      const user = userEvent.setup();
      const fetchSearch = vi.fn();
      createWrapper({
        fetchSearch,
        nextSearch: 'search?page=2',
      });

      await user.click(screen.getByRole('button', { name: /More results/ }));
      expect(fetchSearch).toHaveBeenCalledWith('window', 'cwid', 'search?page=2', 'query');
    });
  });
});

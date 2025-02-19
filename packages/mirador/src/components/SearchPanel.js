import { useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import CompanionWindow from '../containers/CompanionWindow';
import SearchPanelControls from '../containers/SearchPanelControls';
import SearchResults from '../containers/SearchResults';

/** */
export function SearchPanel({
  fetchSearch = undefined, id, query = '', removeSearch, searchService, suggestedSearches = [], windowId,
}) {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  return (
    <CompanionWindow
      ariaLabel={t('searchTitle')}
      title={(
        <>
          {t('searchTitle')}
          {
            query && query !== '' && (
              <Chip
                role="button"
                sx={{ marginLeft: 1 }}
                color="secondary"
                label={t('clearSearch')}
                onClick={removeSearch}
                onDelete={removeSearch}
                size="small"
                tabIndex={0}
                variant="outlined"
              />
            )
          }
        </>
      )}
      windowId={windowId}
      id={id}
      titleControls={<SearchPanelControls companionWindowId={id} windowId={windowId} />}
      ref={containerRef}
    >
      <SearchResults
        containerRef={containerRef}
        companionWindowId={id}
        windowId={windowId}
      />
      {
        fetchSearch && suggestedSearches && query === '' && suggestedSearches.map(search => (
          <Typography component="p" key={search} variant="body1" sx={{ margin: 2 }}>
            <Button
              variant="inlineText"
              color="secondary"
              onClick={() => fetchSearch(`${searchService.id}?q=${search}`, search)}
            >
              {t('suggestSearch', { query: search })}
            </Button>
          </Typography>
        ))
      }
    </CompanionWindow>
  );
}

SearchPanel.propTypes = {
  fetchSearch: PropTypes.func,
  id: PropTypes.string.isRequired,
  query: PropTypes.string,
  removeSearch: PropTypes.func.isRequired,
  searchService: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  suggestedSearches: PropTypes.arrayOf(PropTypes.string),
  windowId: PropTypes.string.isRequired,
};

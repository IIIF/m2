import PropTypes from 'prop-types';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronRightIcon from '@mui/icons-material/ChevronRightSharp';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import MiradorMenuButton from '../containers/MiradorMenuButton';

/**
 * SearchPanelNavigation ~
*/
export function SearchPanelNavigation({
  numTotal = undefined, searchHits = [], selectedContentSearchAnnotation, direction, selectAnnotation,
}) {
  const { t } = useTranslation();
  /** */
  const nextSearchResult = (currentHitIndex) => {
    selectAnnotation(searchHits[currentHitIndex + 1].annotations[0]);
  };

  /** */
  const previousSearchResult = (currentHitIndex) => {
    selectAnnotation(searchHits[currentHitIndex - 1].annotations[0]);
  };

  /** */
  const hasNextResult = (currentHitIndex) => {
    if (searchHits.length === 0) return false;
    if (currentHitIndex < searchHits.length - 1) return true;
    return false;
  };

  /** */
  const hasPreviousResult = (currentHitIndex) => {
    if (searchHits.length === 0) return false;
    if (currentHitIndex > 0) return true;
    return false;
  };

  const iconStyle = direction === 'rtl' ? { transform: 'rotate(180deg)' } : {};

  const currentHitIndex = searchHits
    .findIndex(val => val.annotations.includes(selectedContentSearchAnnotation[0]));
  let lengthText = searchHits.length;
  if (searchHits.length < numTotal) {
    lengthText += '+';
  }

  if (searchHits.length === 0) return null;

  return (
    <Typography variant="body2" align="center">
      <MiradorMenuButton
        aria-label={t('searchPreviousResult')}
        disabled={!hasPreviousResult(currentHitIndex)}
        onClick={() => previousSearchResult(currentHitIndex)}
      >
        <ChevronLeftIcon style={iconStyle} />
      </MiradorMenuButton>
      <span style={{ unicodeBidi: 'plaintext' }}>
        {t('pagination', { current: currentHitIndex + 1, total: lengthText })}
      </span>
      <MiradorMenuButton
        aria-label={t('searchNextResult')}
        disabled={!hasNextResult(currentHitIndex)}
        onClick={() => nextSearchResult(currentHitIndex)}
      >
        <ChevronRightIcon style={iconStyle} />
      </MiradorMenuButton>
    </Typography>
  );
}

SearchPanelNavigation.propTypes = {
  direction: PropTypes.string.isRequired,
  numTotal: PropTypes.number,
  searchHits: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  selectAnnotation: PropTypes.func.isRequired,
  selectedContentSearchAnnotation: PropTypes.arrayOf(PropTypes.string).isRequired,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

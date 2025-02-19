import PropTypes from 'prop-types';
import VisibilityIcon from '@mui/icons-material/VisibilitySharp';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffSharp';
import { useTranslation } from 'react-i18next';
import MiradorMenuButton from '../containers/MiradorMenuButton';

/**
 * AnnotationSettings is a component to handle various annotation
 * display settings in the Annotation companion window
*/
export function AnnotationSettings({
  displayAll, displayAllDisabled, toggleAnnotationDisplay,
}) {
  const { t } = useTranslation();
  return (
    <MiradorMenuButton
      aria-label={t(displayAll ? 'displayNoAnnotations' : 'highlightAllAnnotations')}
      onClick={toggleAnnotationDisplay}
      disabled={displayAllDisabled}
      size="small"
    >
      { displayAll ? <VisibilityIcon /> : <VisibilityOffIcon /> }
    </MiradorMenuButton>
  );
}

AnnotationSettings.propTypes = {
  displayAll: PropTypes.bool.isRequired,
  displayAllDisabled: PropTypes.bool.isRequired,
  toggleAnnotationDisplay: PropTypes.func.isRequired,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

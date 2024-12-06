import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import BookmarksIcon from '@mui/icons-material/BookmarksSharp';
import { useTranslation } from 'react-i18next';
import WindowList from '../containers/WindowList';
import MiradorMenuButton from '../containers/MiradorMenuButton';

/**
 * WindowListButton ~
*/
export function WindowListButton({ disabled = false, windowCount }) {
  const { t } = useTranslation();
  const [windowListAnchor, setWindowListAnchor] = useState(null);
  const id = useId();

  /** */
  const handleClose = () => { setWindowListAnchor(null); };
  /** */
  const handleOpen = (event) => { setWindowListAnchor(event.currentTarget); };

  return (
    <>
      <MiradorMenuButton
        aria-haspopup="true"
        aria-label={t('listAllOpenWindows')}
        aria-owns={windowListAnchor ? id : null}
        selected={Boolean(windowListAnchor)}
        disabled={disabled}
        badge
        BadgeProps={{
          badgeContent: windowCount,
          sx: {
            '.MuiBadge-badge': {
              paddingLeft: 1.5,
            },
          },
        }}
        onClick={(e) => handleOpen(e)}
      >
        <BookmarksIcon />
      </MiradorMenuButton>

      {Boolean(windowListAnchor) && (
      <WindowList
        anchorEl={windowListAnchor}
        id={id}
        open={Boolean(windowListAnchor)}
        handleClose={handleClose}
      />
      )}
    </>
  );
}

WindowListButton.propTypes = {
  disabled: PropTypes.bool,
  windowCount: PropTypes.number.isRequired,
};

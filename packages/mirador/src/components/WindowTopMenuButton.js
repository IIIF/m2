import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import WindowTopMenu from '../containers/WindowTopMenu';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import WindowOptionsIcon from './icons/WindowOptionsIcon';

/**
 */
export function WindowTopMenuButton({ classes = {}, windowId }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  /** */
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  /** */
  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <MiradorMenuButton
        aria-haspopup="true"
        aria-label={t('windowMenu')}
        aria-owns={open ? menuId : undefined}
        className={open ? classes.ctrlBtnSelected : undefined}
        selected={open}
        onClick={handleMenuClick}
      >
        <WindowOptionsIcon />
      </MiradorMenuButton>
      <WindowTopMenu
        windowId={windowId}
        anchorEl={anchorEl}
        handleClose={handleMenuClose}
        id={menuId}
        open={open}
      />
    </>
  );
}

WindowTopMenuButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  windowId: PropTypes.string.isRequired,
};

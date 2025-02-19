import { useState } from 'react';
import MoreHorizontalIcon from '@mui/icons-material/MoreHorizSharp';
import { useTranslation } from 'react-i18next';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import WorkspaceOptionsMenu from '../containers/WorkspaceOptionsMenu';

/**
 * WorkspaceOptionsButton ~
*/
export function WorkspaceOptionsButton() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  /**  */
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  /**  */
  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <MiradorMenuButton
        aria-label={t('workspaceOptions')}
        onClick={handleMenuClick}
        selected={open}
      >
        <MoreHorizontalIcon />
      </MiradorMenuButton>
      <WorkspaceOptionsMenu
        anchorEl={anchorEl}
        handleClose={handleMenuClose}
        open={open}
      />
    </>
  );
}

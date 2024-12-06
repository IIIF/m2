import { useContext, useId, useState } from 'react';
import PropTypes from 'prop-types';
import ImportIcon from '@mui/icons-material/Input';
import SaveAltIcon from '@mui/icons-material/SaveAltSharp';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import WorkspaceExport from '../containers/WorkspaceExport';
import WorkspaceImport from '../containers/WorkspaceImport';
import WorkspaceContext from '../contexts/WorkspaceContext';
import { PluginHook } from './PluginHook';

/**
 * WorkspaceOptionsMenu ~ the menu for workspace options such as import/export
*/
export function WorkspaceOptionsMenu({
  anchorEl = null, handleClose, open = false, ...rest
}) {
  const { t } = useTranslation();
  const container = useContext(WorkspaceContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const exportId = useId();
  const importId = useId();

  const pluginProps = {
    anchorEl, container, handleClose, open, t, ...rest,
  };

  /** */
  const handleClick = (option) => {
    setSelectedOption(option);
    handleClose();
  };

  /** */
  const handleDialogClose = () => {
    setSelectedOption(null);
  };

  return (
    <>
      <Menu
        id="workspace-options-menu"
        container={container?.current}
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          aria-haspopup="true"
          onClick={() => { handleClick('exportWorkspace'); }}
          aria-owns={selectedOption === 'exportWorkspace' ? exportId : undefined}
        >
          <ListItemIcon>
            <SaveAltIcon />
          </ListItemIcon>
          <Typography variant="body1">{t('downloadExportWorkspace')}</Typography>
        </MenuItem>
        <MenuItem
          aria-haspopup="true"
          onClick={() => { handleClick('importWorkspace'); }}
          aria-owns={selectedOption === 'importWorkspace' ? importId : undefined}
        >
          <ListItemIcon>
            <ImportIcon />
          </ListItemIcon>
          <Typography variant="body1">{t('importWorkspace')}</Typography>
        </MenuItem>
        <PluginHook {...pluginProps} />
      </Menu>
      {selectedOption === 'exportWorkspace' && (
        <WorkspaceExport
          id={exportId}
          open={selectedOption === 'exportWorkspace'}
          container={container?.current}
          handleClose={handleDialogClose}
        />
      )}
      {selectedOption === 'importWorkspace' && (
        <WorkspaceImport
          id={importId}
          open={selectedOption === 'importWorkspace'}
          container={container?.current}
          handleClose={handleDialogClose}
        />
      )}
    </>
  );
}

WorkspaceOptionsMenu.propTypes = {
  anchorEl: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

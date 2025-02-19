import { useCallback } from 'react';
import {
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuList,
  MenuItem,
  DialogContent,
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/PaletteSharp';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { WorkspaceDialog } from './WorkspaceDialog';

const ThemeIcon = styled(PaletteIcon, { name: 'ThemeIcon', slot: 'icon' })(({ theme }) => ({
  color: '#BDBDBD',
}));

/**
 * a simple dialog providing the possibility to switch the theme
 */
export function ChangeThemeDialog({
  handleClose, open = false, selectedTheme, setSelectedTheme, themeIds = [],
}) {
  const { t } = useTranslation();
  const handleThemeChange = useCallback((theme) => {
    setSelectedTheme(theme);
    handleClose();
  }, [handleClose, setSelectedTheme]);

  return (
    <WorkspaceDialog onClose={handleClose} open={open} variant="menu">
      <DialogTitle>
        {t('changeTheme')}
      </DialogTitle>
      <DialogContent>
        <MenuList autoFocusItem>
          {themeIds.map((value) => (
            <MenuItem
              key={value}
              className="listitem"
              onClick={() => handleThemeChange(value)}
              selected={value === selectedTheme}
              value={value}
            >
              <ListItemIcon>
                <ThemeIcon ownerState={{ value }} />
              </ListItemIcon>
              <ListItemText>{t(value)}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </DialogContent>
    </WorkspaceDialog>
  );
}

ChangeThemeDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  selectedTheme: PropTypes.string.isRequired,
  setSelectedTheme: PropTypes.func.isRequired,
  themeIds: PropTypes.arrayOf(PropTypes.string),
};

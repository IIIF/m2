import { useId, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import {
  DialogActions,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { WorkspaceDialog } from './WorkspaceDialog';
import ScrollIndicatedDialogContent from '../containers/ScrollIndicatedDialogContent';

/**
 */
export function WorkspaceImport({
  addError, id = undefined, importConfig, classes = {}, handleClose, open = false,
}) {
  const { t } = useTranslation();
  const [configImportValue, setConfigImportValue] = useState('');
  const titleId = useId();

  /** */
  const handleChange = (event) => {
    event.preventDefault();
    setConfigImportValue(event.target.value);
  };

  /** */
  const handleImportConfig = (_event) => {
    try {
      const configJSON = JSON.parse(configImportValue);
      importConfig(configJSON);
      handleClose();
    } catch (ex) {
      addError(ex.toString());
    }
  };

  return (
    <WorkspaceDialog
      aria-labelledby={titleId}
      id={id}
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id={titleId}>
        {t('importWorkspace')}
      </DialogTitle>
      <ScrollIndicatedDialogContent>
        <TextField
          className={classes.textField}
          id="workspace-import-input"
          multiline
          onChange={handleChange}
          minRows={15}
          variant="filled"
          sx={{
            '& .MuiInputBase-input': { fontFamily: 'monospace' },
            width: '100%',
          }}
          inputProps={{ autoFocus: 'autofocus' }}
          helperText={t('importWorkspaceHint')}
        />
      </ScrollIndicatedDialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button color="primary" onClick={handleImportConfig} variant="contained">
          {t('import')}
        </Button>
      </DialogActions>
    </WorkspaceDialog>
  );
}

WorkspaceImport.propTypes = {
  addError: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string,
  importConfig: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

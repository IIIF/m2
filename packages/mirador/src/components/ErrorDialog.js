import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { DialogActions, DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import isUndefined from 'lodash/isUndefined';

/**
 */
export function ErrorDialog({ error = null, removeError = () => {} }) {
  const { t } = useTranslation();
  const hasError = !isUndefined(error);

  if (!error) return null;

  return (
    <Dialog
      aria-labelledby="error-dialog-title"
      id="error-dialog"
      onClose={() => removeError(error.id)}
      open={hasError}
    >
      <DialogTitle id="error-dialog-title">
        {t('errorDialogTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2" noWrap color="inherit">
          {`${error.message}`}
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => removeError(error.id)} variant="contained">
            {t('errorDialogConfirm')}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  error: PropTypes.shape({
    id: PropTypes.string,
    message: PropTypes.string,
  }),
  removeError: PropTypes.func,
};

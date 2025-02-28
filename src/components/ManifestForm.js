import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

/**
 * Provides a form for user input of a manifest url
 * @prop {Function} fetchManifest
 */
export function ManifestForm({
  addResourcesOpen, addResource, onSubmit = () => {}, onCancel = null,
}) {
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState('');

  /** */
  const handleCancel = () => {
    onCancel();
    setFormValue('');
  };

  /** */
  const handleInputChange = (event) => {
    event.preventDefault();
    setFormValue(event.target.value);
  };

  /** */
  const formSubmit = (event) => {
    event.preventDefault();
    addResource(formValue);
    onSubmit();
    setFormValue('');
  };

  if (!addResourcesOpen) return null;

  return (
    <form onSubmit={formSubmit}>
      <Grid2 container spacing={2}>
        <Grid2 size={{ md: 9, sm: 8, xs: 12 }}>
          <TextField
            autoFocus
            fullWidth
            value={formValue}
            id="manifestURL"
            type="text"
            onChange={handleInputChange}
            variant="filled"
            label={t('addManifestUrl')}
            helperText={t('addManifestUrlHelp')}
            slotProps={{
              inputLabel: { shrink: true },
              inputProps: { style: { typography: 'body1' } },
            }}
          />
        </Grid2>
        <Grid2
          size={{ md: 3, sm: 4, xs: 12 }}
          sx={{
            textAlign: { sm: 'inherit', xs: 'right' },
          }}
        >
          { onCancel && (
            <Button onClick={handleCancel}>
              {t('cancel')}
            </Button>
          )}
          <Button id="fetchBtn" type="submit" variant="contained" color="primary">
            {t('fetchManifest')}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
}

ManifestForm.propTypes = {
  addResource: PropTypes.func.isRequired,
  addResourcesOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

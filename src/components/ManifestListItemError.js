import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/ErrorOutlineSharp';
import Grid2 from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

/**
 * ManifestListItemError renders a component displaying a
 * message to the user about a problem loading a manifest
*/
export function ManifestListItemError({
  manifestId, onDismissClick, onTryAgainClick,
}) {
  const { t } = useTranslation();
  return (
    <Grid2 container>
      <Grid2 container>
        <Grid2 container xs={12} sm={6}>
          <Grid2 xs={4} sm={3}>
            <Grid2 container justifyContent="center">
              <ErrorIcon sx={{
                color: 'error.main',
                height: '2rem',
                width: '2rem',
              }}
              />
            </Grid2>
          </Grid2>
          <Grid2 xs={8} sm={9}>
            <Typography>{t('manifestError')}</Typography>
            <Typography sx={{ wordBreak: 'break-all' }}>{manifestId}</Typography>
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 container xs={12} sm={6} justifyContent="flex-end">
          <Grid2>
            <Button onClick={() => { onDismissClick(manifestId); }}>
              {t('dismiss')}
            </Button>
            <Button onClick={() => { onTryAgainClick(manifestId); }}>
              {t('tryAgain')}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

ManifestListItemError.propTypes = {
  manifestId: PropTypes.string.isRequired,
  onDismissClick: PropTypes.func.isRequired,
  onTryAgainClick: PropTypes.func.isRequired,
};

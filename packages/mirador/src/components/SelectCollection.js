import { useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ListSharpIcon from '@mui/icons-material/ListSharp';
import { useTranslation } from 'react-i18next';

/**
 *
 */
export function SelectCollection({
  collectionPath = [], manifestId = null, showCollectionDialog, windowId = null,
}) {
  const { t } = useTranslation();
  const openCollectionDialog = useCallback(() => {
    showCollectionDialog(manifestId, collectionPath.slice(0, -1), windowId);
  }, [collectionPath, manifestId, showCollectionDialog, windowId]);

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid container direction="column" alignItems="center">
        <Typography variant="h4" paragraph>
          <em>
            {t('noItemSelected')}
          </em>
        </Typography>
        <Button
          aria-label="show collection"
          color="primary"
          variant="contained"
          onClick={openCollectionDialog}
          startIcon={<ListSharpIcon />}
        >
          {t('showCollection')}
        </Button>
      </Grid>
    </Grid>
  );
}

SelectCollection.propTypes = {
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  manifestId: PropTypes.string,
  showCollectionDialog: PropTypes.func.isRequired,
  windowId: PropTypes.string,
};

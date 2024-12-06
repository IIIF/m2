import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/AddSharp';
import CloseIcon from '@mui/icons-material/CloseSharp';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

/**
 * Be careful using this hook. It only works because the number of
 * breakpoints in theme is static. It will break once you change the number of
 * breakpoints. See https://legacy.reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

const Root = styled(Fab, { name: 'WorkspaceAddButton', slot: 'root' })(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

/**
 */
export function WorkspaceAddButton({
  setWorkspaceAddVisibility, isWorkspaceAddVisible = false, useExtendedFab,
}) {
  const width = useWidth();
  const { t } = useTranslation();

  return (
    <Tooltip title={isWorkspaceAddVisible ? t('closeAddResourceMenu') : t('addResource')}>
      <Root
        size="medium"
        color="primary"
        id="addBtn"
        aria-label={
          isWorkspaceAddVisible
            ? t('closeAddResourceMenu')
            : (((useExtendedFab && width !== 'xs') && t('startHere')) || t('addResource'))
        }
        variant={(useExtendedFab && width !== 'xs') ? 'extended' : 'circular'}
        onClick={() => { setWorkspaceAddVisibility(!isWorkspaceAddVisible); }}
      >
        {
          isWorkspaceAddVisible
            ? <CloseIcon />
            : <AddIcon />
        }
        { (useExtendedFab && width !== 'xs') && t('startHere') }
      </Root>
    </Tooltip>
  );
}

WorkspaceAddButton.propTypes = {
  isWorkspaceAddVisible: PropTypes.bool,
  setWorkspaceAddVisibility: PropTypes.func.isRequired,
  useExtendedFab: PropTypes.bool.isRequired,
};

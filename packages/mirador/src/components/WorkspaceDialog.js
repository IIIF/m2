import {
  Dialog,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const WorkspaceDialog = styled(Dialog, { name: 'WorkspaceDialog', slot: 'root' })(({ theme, variant }) => ({
  '& .MuiDialogTitle-root': theme.unstable_sx({ typography: 'h2' }),
  ...(variant === 'menu' && {
    '& .MuiDialogContent-root': {
      padding: 0,
    },
  }),
}));

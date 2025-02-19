import { styled } from '@mui/material/styles';

export const CompanionWindowSection = styled('div', { name: 'CompanionWindowSection', slot: 'root' })(({ theme }) => ({
  paddingBlockEnd: theme.spacing(1),
  paddingBlockStart: theme.spacing(2),
  paddingInlineEnd: theme.spacing(1),
  paddingInlineStart: theme.spacing(2),
}));

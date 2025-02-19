import { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/LockSharp';
import { useTranslation } from 'react-i18next';
import SanitizedHtml from '../containers/SanitizedHtml';
import { PluginHook } from './PluginHook';

const StyledTopBar = styled('div')(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
  alignItems: 'center',
  display: 'flex',
}));

const StyledFauxButton = styled('span')(({ theme }) => ({
  marginLeft: theme.spacing(2.5),
}));

/** */
export function WindowAuthenticationBar({
  confirmButton = undefined, continueLabel = undefined,
  header = undefined, description = undefined, icon = undefined, label,
  ruleSet = 'iiif', hasLogoutService = true, status = undefined, ConfirmProps = {}, onConfirm,
}) {
  const { t } = useTranslation();
  const pluginProps = arguments[0]; // eslint-disable-line prefer-rest-params
  const [open, setOpen] = useState(false);

  /** */
  const onSubmit = () => {
    setOpen(false);
    onConfirm();
  };

  if (status === 'ok' && !hasLogoutService) return null;

  const button = (
    <Button
      onClick={onSubmit}
      color="secondary"
      sx={(theme) => ({
        '&:hover': {
          backgroundColor: alpha(theme.palette.secondary.contrastText, 1 - theme.palette.action.hoverOpacity),
        },
        backgroundColor: theme.palette.secondary.contrastText,
      })}
      {...ConfirmProps}
    >
      {confirmButton || t('login')}
    </Button>
  );

  if (!description && !header) {
    return (
      <Paper
        square
        elevation={4}
        color="secondary"
      >
        <StyledTopBar>
          { icon || (
            <LockIcon sx={{ marginInlineEnd: 1.5 }} />
          ) }
          <Typography component="h3" variant="body1" color="inherit">
            { ruleSet ? <SanitizedHtml htmlString={label} ruleSet={ruleSet} /> : label }
          </Typography>
          <PluginHook {...pluginProps} />
          { button }
        </StyledTopBar>
      </Paper>
    );
  }

  return (
    <Paper
      square
      elevation={4}
      color="secondary"
    >
      <Button
        fullWidth
        onClick={() => setOpen(true)}
        component="div"
        color="inherit"
        sx={(theme) => ({
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
          },
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 0,
          color: theme.palette.secondary.contrastText,
          justifyContent: 'start',
          textTransform: 'none',
        })}
      >
        { icon || (
        <LockIcon sx={{ marginInlineEnd: 1.5 }} />
        ) }
        <Typography sx={{ paddingBlockEnd: 1, paddingBlockStart: 1 }} component="h3" variant="body1" color="inherit">
          { ruleSet ? <SanitizedHtml htmlString={label} ruleSet={ruleSet} /> : label }
        </Typography>
        <PluginHook {...pluginProps} />
        <StyledFauxButton>
          { !open && (
            <Typography variant="button" color="inherit">
              { continueLabel || t('continue') }
            </Typography>
          )}
        </StyledFauxButton>
      </Button>
      <Collapse
        sx={(theme) => ({
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          paddingInlineEnd: theme.spacing(1),
          paddingInlineStart: theme.spacing(1),
        })}
        in={open}
        onClose={() => setOpen(false)}
      >
        <Typography variant="body1" color="inherit">
          { ruleSet ? <SanitizedHtml htmlString={header} ruleSet={ruleSet} /> : header }
          { header && description ? ': ' : '' }
          { ruleSet ? <SanitizedHtml htmlString={description} ruleSet={ruleSet} /> : description }
        </Typography>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            { t('cancel') }
          </Button>

          { button }
        </DialogActions>
      </Collapse>
    </Paper>
  );
}

WindowAuthenticationBar.propTypes = {
  confirmButton: PropTypes.string,
  ConfirmProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  continueLabel: PropTypes.string,
  description: PropTypes.node,
  hasLogoutService: PropTypes.bool,
  header: PropTypes.node,
  icon: PropTypes.node,
  label: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  ruleSet: PropTypes.string,
  status: PropTypes.string,
};

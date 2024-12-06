import DialogTitle from '@mui/material/DialogTitle';
import {
  Card,
  CardContent,
  MenuList,
  MenuItem,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useId } from 'react';
import { WorkspaceDialog } from './WorkspaceDialog';
import WorkspaceTypeElasticIcon from './icons/WorkspaceTypeElasticIcon';
import WorkspaceTypeMosaicIcon from './icons/WorkspaceTypeMosaicIcon';
import ScrollIndicatedDialogContent from '../containers/ScrollIndicatedDialogContent';

const StyledDetails = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

/**
 */
export function WorkspaceSelectionDialog({
  container = null, handleClose, open = false, children = null, updateWorkspace, workspaceType,
}) {
  const { t } = useTranslation();
  const dialogTitleId = useId();

  /** */
  const handleWorkspaceTypeChange = (newWorkspaceType) => {
    updateWorkspace({
      type: newWorkspaceType,
    });
    handleClose();
  };

  return (
    <WorkspaceDialog
      aria-labelledby={dialogTitleId}
      container={container}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id={dialogTitleId}>
        {t('workspaceSelectionTitle')}
      </DialogTitle>
      <ScrollIndicatedDialogContent>
        {children}
        <MenuList
          sx={{
            '&active': {
              outline: 'none',
            },
            '&focus': {
              outline: 'none',
            },
            outline: 'none',
          }}
          selected={workspaceType}
          autoFocusItem
        >
          <MenuItem
            sx={{
              height: 'auto',
              overflow: 'auto',
              whiteSpace: 'inherit',
            }}
            onClick={() => handleWorkspaceTypeChange('elastic')}
            selected={workspaceType === 'elastic'}
            value="elastic"
          >
            <Card sx={{
              backgroundColor: 'transparent',
              borderRadius: '0',
              boxShadow: '0 0 transparent',
              display: 'flex',
            }}
            >
              <WorkspaceTypeElasticIcon
                sx={{
                  flexShrink: 0,
                  height: '90px',
                  width: '120px',
                }}
                viewBox="0 0 120 90"
              />
              <StyledDetails>
                <CardContent
                  sx={{
                    '&.MuiCardContent-root': {
                      '&:last-child': {
                        paddingBottom: '12px',
                      },
                      paddingBottom: 0,
                      paddingTop: 0,
                      textAlign: 'left',
                    },
                    flex: '1 0 auto',
                  }}
                >
                  <Typography sx={{ paddingBottom: '6px' }} component="p" variant="h3">{t('elastic')}</Typography>
                  <Typography variant="body1">{t('elasticDescription')}</Typography>
                </CardContent>
              </StyledDetails>
            </Card>
          </MenuItem>
          <MenuItem
            sx={{
              height: 'auto',
              overflow: 'auto',
              whiteSpace: 'inherit',
            }}
            onClick={() => handleWorkspaceTypeChange('mosaic')}
            selected={workspaceType === 'mosaic'}
            value="mosaic"
          >
            <Card sx={{
              backgroundColor: 'transparent',
              borderRadius: '0',
              boxShadow: '0 0 transparent',
              display: 'flex',
            }}
            >
              <WorkspaceTypeMosaicIcon
                sx={{
                  flexShrink: 0,
                  height: '90px',
                  width: '120px',
                }}
                viewBox="0 0 120 90"
              />
              <StyledDetails>
                <CardContent
                  sx={{
                    '&.MuiCardContent-root': {
                      '&:last-child': {
                        paddingBottom: '12px',
                      },
                      paddingBottom: 0,
                      paddingTop: 0,
                      textAlign: 'left',
                    },
                    flex: '1 0 auto',
                  }}
                >
                  <Typography sx={{ paddingBottom: '6px' }} component="p" variant="h3">{t('mosaic')}</Typography>
                  <Typography variant="body1">{t('mosaicDescription')}</Typography>
                </CardContent>
              </StyledDetails>
            </Card>
          </MenuItem>
        </MenuList>
      </ScrollIndicatedDialogContent>
    </WorkspaceDialog>
  );
}

WorkspaceSelectionDialog.propTypes = {
  children: PropTypes.node,
  container: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  updateWorkspace: PropTypes.func.isRequired,
  workspaceType: PropTypes.string.isRequired,
};

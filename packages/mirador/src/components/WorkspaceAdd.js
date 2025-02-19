import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import AddIcon from '@mui/icons-material/AddSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreSharp';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import ns from '../config/css-ns';
import ManifestForm from '../containers/ManifestForm';
import ManifestListItem from '../containers/ManifestListItem';
import MiradorMenuButton from '../containers/MiradorMenuButton';
import { IIIFDropTarget } from './IIIFDropTarget';
import { PluginHook } from './PluginHook';

const StyledWorkspaceAdd = styled('div')(() => ({
  boxSizing: 'border-box',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}));

const StyledMiradorMenuButton = styled(MiradorMenuButton)(() => ({
  marginLeft: -12,
  marginRight: 20,
}));

/**
 * An area for managing manifests and adding them to workspace
 * @memberof Workspace
 * @private
 */
export function WorkspaceAdd({
  addResource = () => {}, catalog = [], setWorkspaceAddVisibility, ...rest
}) {
  const { t } = useTranslation();
  const [addResourcesOpen, setAddResourcesVisibility] = useState(false);
  const ref = useRef();
  const [refWidth, setRefWidth] = useState('100%');

  /** */
  const updateRefWidth = () => {
    if (ref.current) {
      setRefWidth(ref.current.offsetWidth);
    }
  };

  /** */
  const handleDrop = ({ manifestId, manifestJson }, props, monitor) => {
    if (manifestJson) {
      addResource(manifestId, manifestJson, { provider: 'file' });
    } else {
      addResource(manifestId);
    }

    scrollToTop();
  };

  /** @private */
  const onSubmit = () => {
    setAddResourcesVisibility(false);
    scrollToTop();
  };

  /** Scroll the list back to the top */
  const scrollToTop = () => {
    if (ref.current) {
      const el = ref.current;
      el.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
    }
  };

  const manifestList = catalog.map((resource, index) => (
    <ManifestListItem
      {...(index === 0 && { buttonRef: (buttonRef => buttonRef && buttonRef.focus()) })}
      key={resource.manifestId}
      manifestId={resource.manifestId}
      provider={resource.provider}
      handleClose={() => setWorkspaceAddVisibility(false)}
    />
  ));

  const pluginProps = {
    addResource, catalog, setWorkspaceAddVisibility, t, ...rest,
  };

  useEffect(() => {
    window.addEventListener('resize', updateRefWidth);

    updateRefWidth();

    return () => {
      window.removeEventListener('resize', updateRefWidth);
    };
  }, []);

  return (
    <IIIFDropTarget onDrop={handleDrop}>
      <StyledWorkspaceAdd className={classNames(ns('workspace-add'))} ref={ref}>
        {catalog.length < 1 ? (
          <Grid
            alignItems="center"
            container
            style={{
              height: '100%',
            }}
          >
            <Grid
              xs={12}
              item
            >
              <Typography
                variant="h1"
                component="div"
                align="center"
              >
                {t('emptyResourceList')}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Paper sx={{ margin: 2 }}>
            <Typography style={visuallyHidden} component="h1">{t('miradorResources')}</Typography>
            <PluginHook {...pluginProps} />
            <List disablePadding>
              {manifestList}
            </List>
          </Paper>
        )}
        <Fab
          variant="extended"
          disabled={addResourcesOpen}
          sx={(theme) => ({
            bottom: theme.spacing(2),
            position: 'absolute',
            right: theme.spacing(2),
          })}
          className={classNames(ns('add-resource-button'))}
          aria-label={t('addResource')}
          color="primary"
          onClick={() => setAddResourcesVisibility(true)}
        >
          <AddIcon />
          {t('addResource')}
        </Fab>

        <Drawer
          sx={theme => ({
            '.MuiDrawer-paper': {
              borderTop: '0',
              left: 'unset',
              width: refWidth,
            },
            ...(!addResourcesOpen && {
              display: 'none',
            }),
          })}
          variant="persistent"
          anchor="bottom"
          open={addResourcesOpen}
          ModalProps={{
            disablePortal: true,
            hideBackdrop: true,
            style: { position: 'absolute' },
          }}
        >
          <Paper
            sx={{
              left: '0',
              marginTop: 6,
              paddingBottom: 2,
              paddingLeft: { sm: 3, xs: 2 },
              paddingRight: { sm: 3, xs: 2 },
              paddingTop: 2,
              right: '0',
            }}
          >
            <AppBar position="absolute" color="primary" enableColorOnDark onClick={() => setAddResourcesVisibility(false)}>
              <Toolbar variant="dense">
                <StyledMiradorMenuButton
                  aria-label={t('closeAddResourceForm')}
                  color="inherit"
                >
                  <ExpandMoreIcon />
                </StyledMiradorMenuButton>
                <Typography variant="h2" noWrap color="inherit" sx={{ flexGrow: 1 }}>
                  {t('addResource')}
                </Typography>
              </Toolbar>
            </AppBar>
            <ManifestForm
              addResourcesOpen={addResourcesOpen}
              onSubmit={onSubmit}
              onCancel={() => setAddResourcesVisibility(false)}
            />
          </Paper>
        </Drawer>
      </StyledWorkspaceAdd>
    </IIIFDropTarget>
  );
}

WorkspaceAdd.propTypes = {
  addResource: PropTypes.func,
  catalog: PropTypes.arrayOf(PropTypes.shape({
    manifestId: PropTypes.string.isRequired,
    provider: PropTypes.string,
  })),
  setWorkspaceAddVisibility: PropTypes.func.isRequired,
};

import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  Link,
  MenuList,
  MenuItem,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBackSharp';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import asArray from '../lib/asArray';
import { LabelValueMetadata } from './LabelValueMetadata';
import CollapsibleSection from '../containers/CollapsibleSection';
import ScrollIndicatedDialogContent from '../containers/ScrollIndicatedDialogContent';
import ManifestInfo from '../containers/ManifestInfo';
import WorkspaceContext from '../contexts/WorkspaceContext';
import { IIIFResourceLabel } from './IIIFResourceLabel';

const StyledScrollIndicatedDialogContent = styled(ScrollIndicatedDialogContent)(() => ({
  padding: (theme) => theme.spacing(1),
}));

const StyledCollectionMetadata = styled('div')(() => ({
  '& .MuiPaper-root': {
    background: 'transparent',
  },
  padding: (theme) => theme.spacing(2),
}));

const StyledCollectionFilter = styled('div')(() => ({
  padding: (theme) => theme.spacing(2),
  paddingTop: 0,
}));

/** */
const Placeholder = ({ onClose, container }) => (
  <Dialog
    variant="contained"
    onClose={onClose}
    open
    container={container}
  >
    <DialogTitle id="select-collection">
      <Skeleton variant="text" />
    </DialogTitle>
    <ScrollIndicatedDialogContent>
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </ScrollIndicatedDialogContent>
  </Dialog>
);

Placeholder.propTypes = {
  container: PropTypes.instanceOf(Element).isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * a dialog providing the possibility to select the collection
 */
export function CollectionDialog({
  addWindow, collection = null, collectionPath = [], error = null, hideCollectionDialog,
  isMultipart = false, manifest, manifestId, ready = false,
  setWorkspaceAddVisibility, showCollectionDialog, updateWindow, windowId = null,
}) {
  const container = useContext(WorkspaceContext);
  const { t } = useTranslation();
  const [filter, setFilter] = useState(null);

  /** */
  const hideDialog = () => {
    hideCollectionDialog(windowId);
  };

  /** */
  const selectCollection = (c) => {
    showCollectionDialog(c.id, [...collectionPath, manifestId], windowId);
  };

  /** */
  const goToPreviousCollection = () => {
    showCollectionDialog(
      collectionPath[collectionPath.length - 1],
      collectionPath.slice(0, -1),
      windowId,
    );
  };

  /** */
  const selectManifest = (m) => {
    if (windowId) {
      updateWindow(windowId, {
        canvasId: null, collectionPath: [...collectionPath, manifestId], manifestId: m.id,
      });
    } else {
      addWindow({ collectionPath: [...collectionPath, manifestId], manifestId: m.id });
    }

    hideDialog();
    setWorkspaceAddVisibility(false);
  };

  /** */
  const dialogContainer = (container?.current || document.body).querySelector(`#${windowId}`);

  if (error) return null;
  if (!dialogContainer) {
    return null;
  }

  if (!ready) return <Placeholder container={dialogContainer} onClose={hideDialog} />;

  const rights = manifest && (asArray(manifest.getProperty('rights') || manifest.getProperty('license')));

  const requiredStatement = manifest
    && asArray(manifest.getRequiredStatement()).filter(l => l && l.getValue()).map(labelValuePair => ({
      label: null,
      values: labelValuePair.getValues(),
    }));

  const collections = manifest.getCollections();

  const currentFilter = filter || (collections.length > 0 ? 'collections' : 'manifests');

  return (
    <Dialog
      variant="contained"
      onClose={hideDialog}
      container={dialogContainer}
      open
    >
      <DialogTitle id="select-collection">
        <Typography component="div" variant="overline">
          { t(isMultipart ? 'multipartCollection' : 'collection') }
        </Typography>
        <Typography component="div" variant="h3">
          <IIIFResourceLabel resource={manifest} />
        </Typography>
      </DialogTitle>
      <StyledScrollIndicatedDialogContent>
        { collection && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => goToPreviousCollection()}
          >
            <IIIFResourceLabel resource={collection} />
          </Button>
        )}

        <StyledCollectionMetadata>
          <ManifestInfo manifestId={manifest.id} />
          <CollapsibleSection
            id="select-collection-rights"
            label={t('attributionTitle')}
          >
            { requiredStatement && (
              <LabelValueMetadata labelValuePairs={requiredStatement} defaultLabel={t('attribution')} />
            )}
            {
              rights && rights.length > 0 && (
                <>
                  <Typography variant="subtitle2" component="dt">{t('rights')}</Typography>
                  { rights.map(v => (
                    <Typography variant="body1" component="dd" key={v}>
                      <Link target="_blank" rel="noopener noreferrer" href={v}>
                        {v}
                      </Link>
                    </Typography>
                  )) }
                </>
              )
            }
          </CollapsibleSection>
        </StyledCollectionMetadata>
        <StyledCollectionFilter>
          {manifest.getTotalCollections() > 0 && (
            <Chip clickable color={currentFilter === 'collections' ? 'primary' : 'default'} onClick={() => setFilter('collections')} label={t('totalCollections', { count: manifest.getTotalCollections() })} />
          )}
          {manifest.getTotalManifests() > 0 && (
            <Chip clickable color={currentFilter === 'manifests' ? 'primary' : 'default'} onClick={() => setFilter('manifests')} label={t('totalManifests', { count: manifest.getTotalManifests() })} />
          )}
        </StyledCollectionFilter>
        { currentFilter === 'collections' && (
          <MenuList>
            {
              collections.map(c => (
                <MenuItem
                  key={c.id}
                  onClick={() => { selectCollection(c); }}
                  variant="multiline"
                >
                  <IIIFResourceLabel resource={c} />
                </MenuItem>
              ))
            }
          </MenuList>
        )}
        { currentFilter === 'manifests' && (
          <MenuList>
            {
              manifest.getManifests().map(m => (
                <MenuItem
                  key={m.id}
                  onClick={() => { selectManifest(m); }}
                  variant="multiline"
                >
                  <IIIFResourceLabel resource={m} />
                </MenuItem>
              ))
            }
          </MenuList>
        )}
      </StyledScrollIndicatedDialogContent>
      <DialogActions>
        <Button onClick={hideDialog}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CollectionDialog.propTypes = {
  addWindow: PropTypes.func.isRequired,
  collection: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  error: PropTypes.string,
  hideCollectionDialog: PropTypes.func.isRequired,
  isMultipart: PropTypes.bool,
  manifest: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  manifestId: PropTypes.string.isRequired,
  ready: PropTypes.bool,
  setWorkspaceAddVisibility: PropTypes.func.isRequired,
  showCollectionDialog: PropTypes.func.isRequired,
  updateWindow: PropTypes.func.isRequired,
  windowId: PropTypes.string,
};

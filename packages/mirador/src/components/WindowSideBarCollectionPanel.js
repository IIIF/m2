import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardSharp';
import { useTranslation } from 'react-i18next';
import CompanionWindow from '../containers/CompanionWindow';
import IIIFThumbnail from '../containers/IIIFThumbnail';
import { IIIFResourceLabel } from './IIIFResourceLabel';

/** */
function Item({
  manifest, canvasNavigation, variant, ...otherProps
}) {
  return (
    <MenuItem
      alignItems="flex-start"
      button
      divider
      component="li"
      variant="multiline"
      sx={{
        paddingRight: 1,
      }}
      {...otherProps}
    >
      { variant === 'thumbnail' && (
        <ListItemIcon>
          <IIIFThumbnail
            resource={manifest}
            maxHeight={canvasNavigation.height}
            maxWidth={canvasNavigation.width}
          />
        </ListItemIcon>
      )}
      <ListItemText><IIIFResourceLabel resource={manifest} /></ListItemText>
    </MenuItem>
  );
}

Item.propTypes = {
  canvasNavigation: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  manifest: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  variant: PropTypes.string.isRequired,
};

/** */
export function WindowSideBarCollectionPanel({
  canvasNavigation,
  collectionPath = [],
  collection = null,
  id,
  isFetching = false,
  manifestId,
  parentCollection = null,
  updateCompanionWindow,
  updateWindow,
  variant = null,
  windowId,
}) {
  const { t } = useTranslation();
  /** */
  const isMultipart = (() => {
    if (!collection) return false;

    const behaviors = collection.getProperty('behavior');

    if (Array.isArray(behaviors)) return behaviors.includes('multi-part');

    return behaviors === 'multi-part';
  })();

  return (
    <CompanionWindow
      title={t(isMultipart ? 'multipartCollection' : 'collection')}
      windowId={windowId}
      id={id}
      titleControls={(
        <>
          { parentCollection && (
            <List>
              <ListItem
                button
                onClick={
                  () => updateCompanionWindow({ collectionPath: collectionPath.slice(0, -1) })
                }
              >
                <ListItemIcon>
                  <ArrowUpwardIcon />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: 'body1' }}>
                  <IIIFResourceLabel resource={parentCollection} />
                </ListItemText>
              </ListItem>
            </List>
          )}
          <Typography variant="h6">
            { collection && <IIIFResourceLabel resource={collection} />}
            { isFetching && <Skeleton variant="text" />}
          </Typography>
        </>
      )}
    >
      <MenuList>
        { isFetching && (
          <MenuItem>
            <ListItemText>
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
            </ListItemText>
          </MenuItem>
        )}
        {
          collection && collection.getCollections().map((manifest) => {
            /** select the new manifest and go back to the normal index */
            const onClick = () => {
              // close collection
              updateCompanionWindow({ collectionPath: [...collectionPath, manifest.id] });
            };

            return (
              <Item
                key={manifest.id}
                onClick={onClick}
                canvasNavigation={canvasNavigation}
                manifest={manifest}
                variant={variant}
                selected={manifestId === manifest.id}
              />
            );
          })
        }
        {
          collection && collection.getManifests().map((manifest) => {
            /** select the new manifest and go back to the normal index */
            const onClick = () => {
              // select new manifest
              updateWindow({ canvasId: null, collectionPath, manifestId: manifest.id });
              // close collection
              updateCompanionWindow({ multipart: false });
            };

            return (
              <Item
                key={manifest.id}
                onClick={onClick}
                canvasNavigation={canvasNavigation}
                manifest={manifest}
                variant={variant}
                selected={manifestId === manifest.id}
              />
            );
          })
        }
      </MenuList>
    </CompanionWindow>
  );
}

WindowSideBarCollectionPanel.propTypes = {
  canvasNavigation: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  collection: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  collectionPath: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  isFetching: PropTypes.bool,
  manifestId: PropTypes.string.isRequired,
  parentCollection: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateCompanionWindow: PropTypes.func.isRequired,
  updateWindow: PropTypes.func.isRequired,
  variant: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

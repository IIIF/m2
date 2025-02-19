import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getManifest, getManifestoInstance, getSequenceBehaviors, getWindow,
} from '../state/selectors';
import { CollectionDialog } from '../components/CollectionDialog';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof CollectionDialog
 * @private
 */
const mapDispatchToProps = {
  addWindow: actions.addWindow,
  hideCollectionDialog: actions.hideCollectionDialog,
  setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility,
  showCollectionDialog: actions.showCollectionDialog,
  updateWindow: actions.updateWindow,
};

/**
 * mapStateToProps - to hook up connect
 * @memberof CollectionDialog
 * @private
 */
const mapStateToProps = (state, { windowId }) => {
  const { collectionPath, collectionManifestId: manifestId } = getWindow(state, { windowId });
  const manifest = getManifest(state, { manifestId });

  const collectionId = collectionPath && collectionPath[collectionPath.length - 1];
  const collection = collectionId && getManifest(state, { manifestId: collectionId });

  return {
    collection: collection && getManifestoInstance(state, { manifestId: collection.id }),
    collectionPath,
    error: manifest && manifest.error,
    isMultipart: getSequenceBehaviors(state, { manifestId }).includes('multi-part'),
    manifest: manifest && getManifestoInstance(state, { manifestId }),
    manifestId,
    open: state.workspace.collectionDialogOn,
    ready: manifest && !!manifest.json,
    windowId,
  };
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CollectionDialog'),
);

export default enhance(CollectionDialog);

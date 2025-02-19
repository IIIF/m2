import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getManifestTitle,
  getWindow,
} from '../state/selectors';
import * as actions from '../state/actions';
import { CollectionInfo } from '../components/CollectionInfo';

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowSideBarInfoPanel
 * @private
 */
const mapStateToProps = (state, { companionWindowId, windowId }) => {
  const { collectionPath } = (getWindow(state, { windowId }) || {});
  const manifestId = collectionPath[collectionPath.length - 1];

  return {
    collectionLabel: getManifestTitle(state, { manifestId }),
    collectionPath,
  };
};

const mapDispatchToProps = {
  showCollectionDialog: actions.showCollectionDialog,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CollectionInfo'),
);

export default enhance(CollectionInfo);

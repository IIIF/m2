import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getManifest,
  getManifestTitle, getManifestThumbnail, getCanvases,
  getManifestLogo, getManifestProviderName, getWindowManifests,
  getManifestoInstance, getSequenceBehaviors,
} from '../state/selectors';
import * as actions from '../state/actions';
import { ManifestListItem } from '../components/ManifestListItem';

/** */
const mapStateToProps = (state, { manifestId, provider }) => {
  const manifest = getManifest(state, { manifestId }) || {};
  const manifesto = getManifestoInstance(state, { manifestId });
  const isCollection = (
    manifesto || { isCollection: () => false }
  ).isCollection();

  const size = isCollection
    ? manifesto.getTotalItems()
    : getCanvases(state, { manifestId }).length;
  return {
    active: getWindowManifests(state).includes(manifestId),
    error: manifest.error || (!manifesto && !!manifest.json),
    isCollection,
    isFetching: manifest.isFetching,
    isMultipart: isCollection
      && getSequenceBehaviors(state, { manifestId }).includes('multi-part'),
    manifestLogo: getManifestLogo(state, { manifestId }),
    provider: provider
      || getManifestProviderName(state, { manifestId }),
    ready: !!manifest.json,
    size,
    thumbnail: getManifestThumbnail(state, { manifestId }),
    title: getManifestTitle(state, { manifestId }),
  };
};

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = {
  addWindow: actions.addWindow,
  fetchManifest: actions.fetchManifest,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('ManifestListItem'),
);

export default enhance(ManifestListItem);

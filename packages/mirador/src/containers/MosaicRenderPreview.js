import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { getManifestTitle } from '../state/selectors';
import { MosaicRenderPreview } from '../components/MosaicRenderPreview';

/** */
const mapStateToProps = (state, { windowId }) => (
  {
    title: getManifestTitle(state, { windowId }),
  }
);

const enhance = compose(
  connect(mapStateToProps, null),
  withPlugins('MosaicRenderPreview'),
);

export default enhance(MosaicRenderPreview);

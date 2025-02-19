import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getConfig,
} from '../state/selectors';
import { IIIFThumbnail } from '../components/IIIFThumbnail';

/**
 * mapStateToProps - to hook up connect
 * @private
 */
const mapStateToProps = (state) => ({
  thumbnailsConfig: getConfig(state).thumbnails,
});

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('IIIFThumbnail'),
);

export default enhance(IIIFThumbnail);

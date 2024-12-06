import { connect } from 'react-redux';
import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { FullScreenButton } from '../components/FullScreenButton';

/**
 * mapStateToProps - to hook up connect
 * @memberof FullScreenButton
 * @private
 */
const mapStateToProps = _state => ({});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = {};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('FullScreenButton'),
);

export default enhance(FullScreenButton);

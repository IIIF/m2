import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { CustomPanel } from '../components/CustomPanel';

/**
 * mapStateToProps - to hook up connect
 */
const mapStateToProps = (state, { id, windowId }) => ({
});

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('CustomPanel'),
);

export default enhance(CustomPanel);

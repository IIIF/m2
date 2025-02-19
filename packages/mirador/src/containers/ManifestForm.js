import { connect } from 'react-redux';
import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { ManifestForm } from '../components/ManifestForm';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestForm
 * @private
 */
const mapDispatchToProps = { addResource: actions.addResource };

const enhance = compose(
  connect(null, mapDispatchToProps),
  withPlugins('ManifestForm'),
);

export default enhance(ManifestForm);

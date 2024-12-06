import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceImport } from '../components/WorkspaceImport';
import * as actions from '../state/actions';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof App
 * @private
 */
const mapDispatchToProps = {
  addError: actions.addError,
  importConfig: actions.importMiradorState,
};

const enhance = compose(
  connect(null, mapDispatchToProps),
  withPlugins('WorkspaceImport'),
);

export default enhance(WorkspaceImport);

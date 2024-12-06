import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceSelectionDialog } from '../components/WorkspaceSelectionDialog';
import * as actions from '../state/actions';
import { getWorkspaceType } from '../state/selectors';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = {
  updateWorkspace: actions.updateWorkspace,
};

/**
 * mapStateToProps - to hook up connect
 * @memberof Workspace
 * @private
 */
const mapStateToProps = state => ({ workspaceType: getWorkspaceType(state) });

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WorkspaceSelectionDialog'),
);

export default enhance(WorkspaceSelectionDialog);

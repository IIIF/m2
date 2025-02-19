import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { Workspace } from '../components/Workspace';
import {
  getMaximizedWindowsIds, getWindowIds, getWorkspaceType,
  getConfig, getWorkspace,
} from '../state/selectors';
import * as actions from '../state/actions';

/**
 * mapStateToProps - to hook up connect
 * @memberof Workspace
 * @private
 */
const mapStateToProps = state => (
  {
    allowNewWindows: getConfig(state).workspace.allowNewWindows,
    maximizedWindowIds: getMaximizedWindowsIds(state),
    windowIds: getWindowIds(state),
    workspaceId: getWorkspace(state).id,
    workspaceType: getWorkspaceType(state),
  }
);

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof Workspace
 * @private
 */
const mapDispatchToProps = {
  addWindow: actions.addWindow,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('Workspace'),
  // further HOC go here
);

export default enhance(Workspace);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceArea } from '../components/WorkspaceArea';
import { getConfig, getWindowIds, getWorkspace } from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof App
 * @private
 */
const mapStateToProps = state => (
  {
    controlPanelVariant: getWorkspace(state).isWorkspaceAddVisible || getWindowIds(state).length > 0 ? undefined : 'wide',
    isWorkspaceAddVisible: getWorkspace(state).isWorkspaceAddVisible,
    isWorkspaceControlPanelVisible: getConfig(state).workspaceControlPanel.enabled,
    lang: getConfig(state).language,
  }
);

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('WorkspaceArea'),
);

export default enhance(WorkspaceArea);

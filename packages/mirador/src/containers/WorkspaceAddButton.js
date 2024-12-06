import { connect } from 'react-redux';
import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getWindowIds, getWorkspace } from '../state/selectors';
import { WorkspaceAddButton } from '../components/WorkspaceAddButton';

/**
 * mapStateToProps - to hook up connect
 * @memberof WorkspaceControlPanel
 * @private
 */
const mapStateToProps = (state, { width }) => {
  const { isWorkspaceAddVisible } = getWorkspace(state);
  return {
    isWorkspaceAddVisible,
    useExtendedFab: (
      !isWorkspaceAddVisible
        && getWindowIds(state).length === 0
    ),
  };
};

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof Workspace
 * @private
 */
const mapDispatchToProps = { setWorkspaceAddVisibility: actions.setWorkspaceAddVisibility };

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WorkspaceAddButton'),
);

export default enhance(WorkspaceAddButton);

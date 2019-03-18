import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend';
import * as actions from '../state/actions';
import WorkspaceElastic from '../components/WorkspaceElastic';

/**
 * mapStateToProps - to hook up connect
 * @memberof Workspace
 * @private
 */
const mapStateToProps = state => (
  {
    workspace: state.workspace,
    windows: state.windows,
  }
);

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof Workspace
 * @private
 */
const mapDispatchToProps = (dispatch, props) => ({
  setWorkspaceViewportDimensions: (position) => {
    dispatch(
      actions.setWorkspaceViewportDimensions(position),
    );
  },
  setWorkspaceViewportPosition: (position) => {
    dispatch(
      actions.setWorkspaceViewportPosition(position),
    );
  },
  toggleWorkspaceExposeMode: size => dispatch(
    actions.toggleWorkspaceExposeMode(),
  ),
  updateWindowPosition: (windowId, position) => {
    dispatch(
      actions.updateWindowPosition(windowId, position),
    );
  },
  setWindowSize: (windowId, size) => {
    dispatch(
      actions.setWindowSize(windowId, size),
    );
  },
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WorkspaceElastic'),
  // further HOC go here
);

export default enhance(WorkspaceElastic);

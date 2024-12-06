import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import WorkspaceElastic from '../components/WorkspaceElastic';
import {
  getElasticLayout,
  getWorkspace,
} from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof Workspace
 * @private
 */
const mapStateToProps = state => (
  {
    elasticLayout: getElasticLayout(state),
    workspace: getWorkspace(state),
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
  updateElasticWindowLayout: (windowId, position) => {
    dispatch(
      actions.updateElasticWindowLayout(windowId, position),
    );
  },
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WorkspaceElastic'),
  // further HOC go here
);

export default enhance(WorkspaceElastic);

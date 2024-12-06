import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../state/actions';
import WorkspaceElasticWindow from '../components/WorkspaceElasticWindow';
import {
  selectCompanionWindowDimensions, getWorkspace, isFocused,
  getElasticLayout,
} from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof Workspace
 * @private
 */
const mapStateToProps = (state, { windowId }) => (
  {
    companionWindowDimensions: selectCompanionWindowDimensions(state, { windowId }),
    focused: isFocused(state, { windowId }),
    layout: getElasticLayout(state)[windowId],
    workspace: getWorkspace(state),
  }
);

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof Workspace
 * @private
 */
const mapDispatchToProps = (dispatch, props) => ({
  focusWindow: () => dispatch(actions.focusWindow(props.windowId)),
  updateElasticWindowLayout: (windowId, position) => {
    dispatch(
      actions.updateElasticWindowLayout(windowId, position),
    );
  },
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  // further HOC go here
);

export default enhance(WorkspaceElasticWindow);

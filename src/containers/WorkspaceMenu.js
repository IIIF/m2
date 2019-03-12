import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import miradorWithPlugins from '../lib/miradorWithPlugins';
import * as actions from '../state/actions';
import { WorkspaceMenu } from '../components/WorkspaceMenu';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof WorkspaceMenu
 * @private
 */
const mapDispatchToProps = {
  toggleZoomControls: actions.toggleZoomControls,
};

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowViewer
 * @private
 */
const mapStateToProps = state => ({
  containerId: state.config.id,
  showZoomControls: state.workspace.showZoomControls,
});

const enhance = compose(
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  miradorWithPlugins,
);

export default enhance(WorkspaceMenu);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { WindowTopMenu } from '../components/WindowTopMenu';
import { getConfig } from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowTopMenu
 * @private
 */
const mapStateToProps = state => ({
  showThumbnailNavigationSettings: getConfig(state).thumbnailNavigation.displaySettings,
});

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof WindowTopMenu
 * @private
 */
const mapDispatchToProps = dispatch => ({
  toggleDraggingEnabled: () => dispatch(actions.toggleDraggingEnabled()),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowTopMenu'),
);

export default enhance(WindowTopMenu);

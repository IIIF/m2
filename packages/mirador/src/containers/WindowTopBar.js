import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getWindowConfig, isFocused } from '../state/selectors';
import { WindowTopBar } from '../components/WindowTopBar';

/** mapStateToProps */
const mapStateToProps = (state, { windowId }) => {
  const config = getWindowConfig(state, { windowId });

  return {
    allowClose: config.allowClose,
    allowFullscreen: config.allowFullscreen,
    allowMaximize: config.allowMaximize,
    allowTopMenuButton: config.allowTopMenuButton,
    allowWindowSideBar: config.allowWindowSideBar,
    focused: isFocused(state, { windowId }),
    maximized: config.maximized,
  };
};

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  focusWindow: () => dispatch(actions.focusWindow(windowId)),
  maximizeWindow: () => dispatch(actions.maximizeWindow(windowId)),
  minimizeWindow: () => dispatch(actions.minimizeWindow(windowId)),
  removeWindow: () => dispatch(actions.removeWindow(windowId)),
  toggleWindowSideBar: () => dispatch(actions.toggleWindowSideBar(windowId)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowTopBar'),
);

export default enhance(WindowTopBar);

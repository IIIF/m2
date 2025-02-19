import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getCompanionWindow, getThemeDirection, getWindowConfig } from '../state/selectors';
import { CompanionWindow } from '../components/CompanionWindow';

/**
 * mapStateToProps - to hook up connect
 * @memberof CompanionWindow
 * @private
 */
const mapStateToProps = (state, { id, windowId }) => {
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });
  const {
    defaultSidebarPanelHeight, defaultSidebarPanelWidth,
  } = getWindowConfig(state, { windowId });

  return {
    ...companionWindow,
    defaultSidebarPanelHeight,
    defaultSidebarPanelWidth,
    direction: getThemeDirection(state),
    isDisplayed: (companionWindow
                  && companionWindow.content
                  && companionWindow.content.length > 0),
  };
};

/**
 * mapDispatchToProps - to hook up connect
 * @memberof CompanionWindow
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId, id }) => ({
  onCloseClick: () => dispatch(
    actions.removeCompanionWindow(windowId, id),
  ),
  updateCompanionWindow: (...args) => dispatch(
    actions.updateCompanionWindow(windowId, id, ...args),
  ),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }),
  withPlugins('CompanionWindow'),
);

export default enhance(CompanionWindow);

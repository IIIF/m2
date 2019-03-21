import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withTranslation } from 'react-i18next';
import { withPlugins } from '../extend';
import * as actions from '../state/actions';
import {
  getCompanionWindowForPosition,
  getSelectedCanvas,
  getSelectedTargetAnnotations,
  getAnnotationResourcesByMotivation,
} from '../state/selectors';
import { WindowSideBarButtons } from '../components/WindowSideBarButtons';


/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof WindowSideButtons
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  addCompanionWindow: content => dispatch(
    actions.addCompanionWindow(windowId, { content, position: 'left' }),
  ),
});


/**
 * mapStateToProps - used to hook up connect to state
 * @memberof WindowSideButtons
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  hasAnnotations: getAnnotationResourcesByMotivation(
    getSelectedTargetAnnotations(state, (getSelectedCanvas(state, { windowId }) || {}).id),
    ['oa:commenting', 'sc:painting'],
  ).length > 0,
  sideBarPanel: (getCompanionWindowForPosition(state, {
    position: 'left',
    windowId,
  }) || {}).content,
});

/** */
const style = theme => ({
  tab: {
    '&:hover': {
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
      backgroundColor: fade(theme.palette.text.primary, theme.palette.action.hoverOpacity),
      textDecoration: 'none',
      // Reset on touch devices, it doesn't add specificity
    },
    borderRight: '4px solid transparent',
    minWidth: 'auto',
  },
  tabSelected: {
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    backgroundColor: theme.palette.secondary.light,
    borderRight: `4px solid ${theme.palette.secondary.main}`,
  },
  tabsFlexContainer: {
    flexDirection: 'column',
  },
  tabsIndicator: {
    display: 'none',
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(style),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowSideBarButtons'),
);

export default enhance(WindowSideBarButtons);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { alpha, withStyles } from '@material-ui/core/styles';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getAnnotationResourcesByMotivationForCanvas,
  getCanvasLabel,
  getSelectedAnnotationId,
  getConfig,
  getWindow,
} from '../state/selectors';
import { CanvasAnnotations } from '../components/CanvasAnnotations';

/**
 * @param {Array} resources
 * @return {Array} [{ id: 'abc123', content: 'Annotation Content' }, ...]
 */
function getIdAndContentOfResources(resources) {
  return resources.map((resource, i) => ({
    content: resource.chars,
    id: resource.id,
    tags: resource.tags,
    targetId: resource.targetId,
  }));
}

/** For connect */
const mapStateToProps = (state, { canvasId, windowId }) => ({
  annotations: getIdAndContentOfResources(
    getAnnotationResourcesByMotivationForCanvas(state, { canvasId, windowId }),
  ),
  autoScroll: getWindow(state, { windowId }).autoScrollAnnotationList,
  htmlSanitizationRuleSet: getConfig(state).annotations.htmlSanitizationRuleSet,
  label: getCanvasLabel(state, {
    canvasId,
    windowId,
  }),
  selectedAnnotationId: getSelectedAnnotationId(state, { windowId }),
});

/**
 * mapDispatchToProps - to hook up connect
 * @memberof WindowSideBarAnnotationsPanel
 * @private
 */
const mapDispatchToProps = {
  deselectAnnotation: actions.deselectAnnotation,
  hoverAnnotation: actions.hoverAnnotation,
  selectAnnotation: actions.selectAnnotation,
};

/** For withStyles */
const styles = theme => ({
  annotationListItem: {
    '&$hovered': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover,&:focus': {
      backgroundColor: theme.palette.action.hover,
    },
    borderBottom: `0.5px solid ${theme.palette.divider}`,
    cursor: 'pointer',
    whiteSpace: 'normal',
  },
  chip: {
    backgroundColor: theme.palette.background.paper,
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  grow: {
    flexGrow: 1,
  },
  hovered: {},
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  manifestLabel: {
    fontSize: '10px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    marginRight: theme.spacing(2),
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
    width: '100%',
  },
  searchIcon: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    pointerEvents: 'none',
    position: 'absolute',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionHeading: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
});

const enhance = compose(
  withTranslation(),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CanvasAnnotations'),
);

export default enhance(CanvasAnnotations);

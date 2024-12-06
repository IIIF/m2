import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getAnnotationResourcesByMotivationForCanvas,
  getCanvasLabel,
  getSelectedAnnotationId,
  getConfig,
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CanvasAnnotations'),
);

export default enhance(CanvasAnnotations);

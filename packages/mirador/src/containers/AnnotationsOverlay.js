import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { AnnotationsOverlay } from '../components/AnnotationsOverlay';
import * as actions from '../state/actions';
import {
  getWindow,
  getSearchAnnotationsForWindow,
  getCompanionWindowsForContent,
  getTheme,
  getConfig,
  getPresentAnnotationsOnSelectedCanvases,
  getSelectedAnnotationId,
  getCurrentCanvasWorld,
} from '../state/selectors';

/**
 * mapStateToProps - used to hook up connect to action creators
 * @memberof Window
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  annotations: getPresentAnnotationsOnSelectedCanvases(state, { windowId }),
  canvasWorld: getCurrentCanvasWorld(state, { windowId }),
  drawAnnotations: getConfig(state).window.forceDrawAnnotations || getCompanionWindowsForContent(state, { content: 'annotations', windowId }).length > 0,
  drawSearchAnnotations: getConfig(state).window.forceDrawAnnotations || getCompanionWindowsForContent(state, { content: 'search', windowId }).length > 0,
  highlightAllAnnotations: getWindow(state, { windowId }).highlightAllAnnotations,
  hoveredAnnotationIds: getWindow(state, { windowId }).hoveredAnnotationIds,
  palette: getTheme(state).palette,
  searchAnnotations: getSearchAnnotationsForWindow(
    state,
    { windowId },
  ),
  selectedAnnotationId: getSelectedAnnotationId(state, { windowId }),
});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = {
  deselectAnnotation: actions.deselectAnnotation,
  hoverAnnotation: actions.hoverAnnotation,
  selectAnnotation: actions.selectAnnotation,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('AnnotationsOverlay'),
);

export default enhance(AnnotationsOverlay);

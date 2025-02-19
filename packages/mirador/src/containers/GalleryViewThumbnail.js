import { compose } from 'redux';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import * as actions from '../state/actions';
import { GalleryViewThumbnail } from '../components/GalleryViewThumbnail';
import {
  getSearchAnnotationsForWindow,
  getCurrentCanvas,
  getConfig,
  getPresentAnnotationsOnSelectedCanvases,
  getCompanionWindowsForContent,
} from '../state/selectors';

/** */
const mapStateToProps = (state, { canvas, windowId }) => {
  const currentCanvas = getCurrentCanvas(state, { windowId });
  const searchAnnotations = getSearchAnnotationsForWindow(
    state,
    { windowId },
  );

  const canvasAnnotations = flatten(searchAnnotations.map(a => a.resources))
    .filter(a => a.targetId === canvas.id);

  const hasOpenAnnotationsWindow = getCompanionWindowsForContent(state, { content: 'annotations', windowId }).length > 0;

  return {
    annotationsCount: (() => {
      if (!hasOpenAnnotationsWindow) return undefined;
      const annotations = getPresentAnnotationsOnSelectedCanvases(
        state,
        { canvasId: canvas.id },
      );

      return annotations.reduce(
        (v, a) => (v) + a.resources.filter(r => r.targetId === canvas.id).length,
        0,
      );
    })(),
    config: getConfig(state).galleryView,
    searchAnnotationsCount: canvasAnnotations.length,
    selected: currentCanvas && currentCanvas.id === canvas.id,
  };
};

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof WindowViewer
 * @private
 */
const mapDispatchToProps = (dispatch, { canvas, id, windowId }) => ({
  focusOnCanvas: () => dispatch(actions.setWindowViewType(windowId, 'single')),
  requestCanvasAnnotations: () => (
    dispatch(actions.requestCanvasAnnotations(windowId, canvas.id))
  ),
  setCanvas: (...args) => dispatch(actions.setCanvas(windowId, ...args)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  // further HOC go here
);

export default enhance(GalleryViewThumbnail);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { SearchHit } from '../components/SearchHit';
import * as actions from '../state/actions';
import {
  getCanvasLabel,
  getVisibleCanvasIds,
  getResourceAnnotationForSearchHit,
  getResourceAnnotationLabel,
  getSelectedContentSearchAnnotationIds,
  getSelectedAnnotationId,
} from '../state/selectors';

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SearchHit
 * @private
 */
const mapStateToProps = (state, {
  annotationId, hit = { annotations: [] }, companionWindowId, windowId,
}) => {
  const realAnnoId = annotationId || hit.annotations[0];
  const hitAnnotation = getResourceAnnotationForSearchHit(
    state,
    {
      annotationUri: realAnnoId,
      companionWindowId,
      windowId,
    },
  );

  const annotationLabel = getResourceAnnotationLabel(state, { annotationUri: realAnnoId, companionWindowId, windowId });
  const selectedCanvasIds = getVisibleCanvasIds(state, { windowId });

  const selectedContentSearchAnnotationsIds = getSelectedContentSearchAnnotationIds(state, {
    companionWindowId, windowId,
  });

  const windowSelectedAnnotationId = getSelectedAnnotationId(state, { windowId });

  const allAnnoIds = [annotationId, ...hit.annotations];

  return {
    adjacent: selectedCanvasIds.includes(hitAnnotation.targetId),
    annotation: hitAnnotation,
    annotationId: realAnnoId,
    annotationLabel: annotationLabel[0],
    canvasLabel: hitAnnotation && getCanvasLabel(state, {
      canvasId: hitAnnotation.targetId,
      windowId,
    }),
    selected: selectedContentSearchAnnotationsIds[0]
      && allAnnoIds.includes(selectedContentSearchAnnotationsIds[0]),
    windowSelected: windowSelectedAnnotationId
      && allAnnoIds.includes(windowSelectedAnnotationId),
  };
};

/**
 * mapDispatchToProps - to hook up connect
 * @memberof SearchPanelNavigation
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  selectAnnotation: (...args) => dispatch(
    actions.selectAnnotation(windowId, ...args),
  ),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SearchHit'),
);

export default enhance(SearchHit);

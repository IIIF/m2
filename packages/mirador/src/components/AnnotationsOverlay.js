import {
  useRef, useEffect, useCallback, useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import xor from 'lodash/xor';
import OpenSeadragonCanvasOverlay from '../lib/OpenSeadragonCanvasOverlay';
import CanvasWorld from '../lib/CanvasWorld';
import CanvasAnnotationDisplay from '../lib/CanvasAnnotationDisplay';

/** @private */
function isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, resource, canvas, point) {
  const [canvasX, canvasY] = canvasWorld.canvasToWorldCoordinates(canvas.id);
  const relativeX = point.x - canvasX;
  const relativeY = point.y - canvasY;

  if (resource.svgSelector) {
    const context = osdCanvasOverlay.context2d;
    const { svgPaths } = new CanvasAnnotationDisplay({ resource });
    return [...svgPaths].some(path => (
      context.isPointInPath(new Path2D(path.attributes.d.nodeValue), relativeX, relativeY)
    ));
  }

  if (resource.fragmentSelector) {
    const [x, y, w, h] = resource.fragmentSelector;
    return x <= relativeX && relativeX <= (x + w)
      && y <= relativeY && relativeY <= (y + h);
  }
  return false;
}

/**
 * Represents a OpenSeadragonViewer in the mirador workspace. Responsible for mounting
 * and rendering OSD.
 */
export function AnnotationsOverlay({
  annotations = [], canvasWorld, deselectAnnotation = () => {}, drawAnnotations = true, drawSearchAnnotations = true,
  highlightAllAnnotations = false, hoverAnnotation = () => {}, hoveredAnnotationIds = [],
  palette = {}, searchAnnotations = [], selectAnnotation = () => {}, selectedAnnotationId = null,
  viewer = null, windowId,
}) {
  const ref = useRef();

  const osdCanvasOverlay = useMemo(() => new OpenSeadragonCanvasOverlay(viewer, ref), [ref, viewer]);

  const toggleAnnotation = useCallback((id) => {
    if (selectedAnnotationId === id) {
      deselectAnnotation(windowId, id);
    } else {
      selectAnnotation(windowId, id);
    }
  }, [selectedAnnotationId, deselectAnnotation, selectAnnotation, windowId]);

  /**
   * annotationsToContext - converts anontations to a canvas context
   */
  const annotationsToContext = useCallback((renderedAnnotations, currentPalette) => {
    const context = osdCanvasOverlay.context2d;
    const zoomRatio = viewer.viewport.getZoom(true) / viewer.viewport.getMaxZoom();
    renderedAnnotations.forEach((annotation) => {
      annotation.resources.forEach((resource) => {
        if (!canvasWorld.canvasIds.includes(resource.targetId)) return;
        const offset = canvasWorld.offsetByCanvas(resource.targetId);
        const canvasAnnotationDisplay = new CanvasAnnotationDisplay({
          hovered: hoveredAnnotationIds.includes(resource.id),
          offset,
          palette: {
            ...currentPalette,
            default: {
              ...currentPalette.default,
              ...(!highlightAllAnnotations && currentPalette.hidden),
            },
          },
          resource,
          selected: selectedAnnotationId === resource.id,
          zoomRatio,
        });
        canvasAnnotationDisplay.toContext(context);
      });
    });
  }, [osdCanvasOverlay, viewer, canvasWorld, highlightAllAnnotations, hoveredAnnotationIds, selectedAnnotationId]);

  const renderAnnotations = useCallback(() => {
    if (drawSearchAnnotations) {
      annotationsToContext(searchAnnotations, palette.search);
    }

    if (drawAnnotations) {
      annotationsToContext(annotations, palette.annotations);
    }
  }, [annotations, annotationsToContext, drawAnnotations, drawSearchAnnotations, palette, searchAnnotations]);

  const updateCanvas = useCallback(() => {
    if (!osdCanvasOverlay) return;

    osdCanvasOverlay.clear();
    osdCanvasOverlay.resize();
    osdCanvasOverlay.canvasUpdate(renderAnnotations);
  }, [osdCanvasOverlay, renderAnnotations]);

  const annotationsAtPoint = useCallback((canvas, point) => {
    const lists = [...annotations, ...searchAnnotations];
    const annos = flatten(lists.map(l => l.resources)).filter((resource) => {
      if (canvas.id !== resource.targetId) return false;

      return isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, resource, canvas, point);
    });

    return annos;
  }, [annotations, canvasWorld, osdCanvasOverlay, searchAnnotations]);

  const onCanvasClick = useCallback((event) => {
    const { position: webPosition, eventSource: { viewport } } = event;
    const point = viewport.pointFromPixel(webPosition);

    const canvas = canvasWorld.canvasAtPoint(point);
    if (!canvas) return;
    const [
      _canvasX, _canvasY, canvasWidth, canvasHeight, // eslint-disable-line no-unused-vars
    ] = canvasWorld.canvasToWorldCoordinates(canvas.id);

    // get all the annotations that contain the click
    const annos = annotationsAtPoint(canvas, point);

    if (annos.length > 0) {
      event.preventDefaultAction = true; // eslint-disable-line no-param-reassign
    }

    if (annos.length === 1) {
      toggleAnnotation(annos[0].id);
    } else if (annos.length > 0) {
      /**
       * Try to find the "right" annotation to select after a click.
       *
       * This is perhaps a naive method, but seems to deal with rectangles and SVG shapes:
       *
       * - figure out how many points around a circle are inside the annotation shape
       * - if there's a shape with the fewest interior points, it's probably the one
       *       with the closest boundary?
       * - if there's a tie, make the circle bigger and try again.
       */
      const annosWithClickScore = (radius) => {
        const degreesToRadians = Math.PI / 180;

        return (anno) => {
          let score = 0;
          for (let degrees = 0; degrees < 360; degrees += 1) {
            const x = Math.cos(degrees * degreesToRadians) * radius + point.x;
            const y = Math.sin(degrees * degreesToRadians) * radius + point.y;

            if (isAnnotationAtPoint(canvasWorld, osdCanvasOverlay, anno, canvas, { x, y })) score += 1;
          }

          return { anno, score };
        };
      };

      let annosWithScore = [];
      let radius = 1;
      annosWithScore = sortBy(annos.map(annosWithClickScore(radius)), 'score');

      while (radius < Math.max(canvasWidth, canvasHeight)
        && annosWithScore[0].score === annosWithScore[1].score) {
        radius *= 2;
        annosWithScore = sortBy(annos.map(annosWithClickScore(radius)), 'score');
      }

      toggleAnnotation(annosWithScore[0].anno.id);
    }
  }, [annotationsAtPoint, canvasWorld, osdCanvasOverlay, toggleAnnotation]);

  const onCanvasMouseMove = useDebouncedCallback(useCallback((event) => {
    if (annotations.length === 0 && searchAnnotations.length === 0) return;

    const { position: webPosition } = event;
    const point = viewer.viewport.pointFromPixel(webPosition);

    const canvas = canvasWorld.canvasAtPoint(point);
    if (!canvas) {
      hoverAnnotation(windowId, []);
      return;
    }

    const annos = annotationsAtPoint(canvas, point);

    if (xor(hoveredAnnotationIds, annos.map(a => a.id)).length > 0) {
      hoverAnnotation(windowId, annos.map(a => a.id));
    }
  }, [annotations, annotationsAtPoint, canvasWorld, hoverAnnotation,
    hoveredAnnotationIds, searchAnnotations, viewer, windowId]), 10);

  const onCanvasExit = useCallback(() => {
    // a move event may be queued up by the debouncer
    onCanvasMouseMove.cancel();
    hoverAnnotation(windowId, []);
  }, [hoverAnnotation, onCanvasMouseMove, windowId]);

  const onUpdateViewport = useCallback(() => {
    updateCanvas();
  }, [updateCanvas]);

  useEffect(() => {
    if (!viewer) return undefined;

    viewer.addHandler('canvas-click', onCanvasClick);
    viewer.addHandler('canvas-exit', onCanvasExit);
    viewer.addHandler('mouse-move', onCanvasMouseMove);
    viewer.addHandler('update-viewport', onUpdateViewport);

    return () => {
      viewer.removeHandler('canvas-click', onCanvasClick);
      viewer.removeHandler('canvas-exit', onCanvasExit);
      viewer.removeHandler('mouse-move', onCanvasMouseMove);
      viewer.removeHandler('update-viewport', onUpdateViewport);
    };
  }, [onCanvasClick, onCanvasExit, onCanvasMouseMove, onUpdateViewport, viewer]);

  useEffect(() => {
    if (viewer) viewer.forceRedraw();
  }, [annotations, drawAnnotations, drawSearchAnnotations, highlightAllAnnotations,
    hoveredAnnotationIds, searchAnnotations, selectedAnnotationId, viewer]);

  useEffect(() => {
    if (!ref.current) return;

    if (hoveredAnnotationIds.length > 0) {
      ref.current.style.cursor = 'pointer';
    } else {
      ref.current.style.cursor = '';
    }
  }, [hoveredAnnotationIds, ref]);

  if (!viewer) return null;

  return ReactDOM.createPortal(
    (
      <div
        ref={ref}
        style={{
          height: '100%', left: 0, position: 'absolute', top: 0, width: '100%',
        }}
      >
        <canvas />
      </div>
    ),
    viewer.canvas,
  );
}

AnnotationsOverlay.propTypes = {
  annotations: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  canvasWorld: PropTypes.instanceOf(CanvasWorld).isRequired,
  deselectAnnotation: PropTypes.func,
  drawAnnotations: PropTypes.bool,
  drawSearchAnnotations: PropTypes.bool,
  highlightAllAnnotations: PropTypes.bool,
  hoverAnnotation: PropTypes.func,
  hoveredAnnotationIds: PropTypes.arrayOf(PropTypes.string),
  palette: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  searchAnnotations: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  selectAnnotation: PropTypes.func,
  selectedAnnotationId: PropTypes.string,
  viewer: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  windowId: PropTypes.string.isRequired,
};

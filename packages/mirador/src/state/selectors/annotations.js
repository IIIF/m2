import { createSelector } from 'reselect';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import AnnotationFactory from '../../lib/AnnotationFactory';
import { miradorSlice } from './utils';
import { getCanvas, getVisibleCanvasIds } from './canvases';
import { getConfig } from './config';
import { getWindow } from './getters';

/**
 * Returns the annotation object from the mirador slice.
 * @param {object} state redux state
 * @returns {object} Annotations from the state
 */
export const getAnnotations = state => miradorSlice(state).annotations;

const getMotivation = createSelector(
  [
    getConfig,
    (state, { motivations }) => motivations,
  ],
  (config, motivations) => motivations || config.annotations.filteredMotivations,
);

const getAnnotationsOnCanvas = createSelector(
  [
    getCanvas,
    getAnnotations,
  ],
  (canvas, annotations) => {
    if (!annotations || !canvas) return [];
    if (!annotations[canvas.id]) return [];

    return flatten(Object.values(annotations[canvas.id]));
  },
);

const getPresentAnnotationsCanvas = createSelector(
  [
    getAnnotationsOnCanvas,
  ],
  annotations => filter(
    Object.values(annotations)
      .map(annotation => annotation && AnnotationFactory.determineAnnotation(annotation.json)),
    annotation => annotation && annotation.present(),
  ),
);

const getAnnotationsOnSelectedCanvases = createSelector(
  [
    (state, { canvasId, ...otherProps }) => (canvasId
      ? [canvasId]
      : getVisibleCanvasIds(state, otherProps)
    ),
    getAnnotations,
  ],
  (canvasIds, annotations) => {
    if (!annotations || canvasIds.length === 0) return [];
    return flatten(
      canvasIds.map(
        targetId => annotations[targetId] && Object.values(annotations[targetId]),
      ),
    );
  },
);

/**
 * Returns an array of present annotations given a canvasId.
 * @param {object} state redux state
 * @param {string} canvasId canvasId
 * @returns {Array} An array of present annotations
 */
export const getPresentAnnotationsOnSelectedCanvases = createSelector(
  [
    getAnnotationsOnSelectedCanvases,
  ],
  annotations => filter(
    Object.values(annotations)
      .map(annotation => annotation && AnnotationFactory.determineAnnotation(annotation.json)),
    annotation => annotation && annotation.present(),
  ),
);

/**
 * Returns an array of annotation resources filtered by the given motivation for a particular canvas.
 * @param {Array} annotations
 * @param {Array} motivations
 * @returns {Array}
 */
export const getAnnotationResourcesByMotivationForCanvas = createSelector(
  [
    getPresentAnnotationsCanvas,
    getMotivation,
  ],
  (annotations, motivations) => filter(
    flatten(annotations.map(annotation => annotation.resources)),
    resource => resource.motivations.some(
      motivation => motivations.includes(motivation),
    ),
  ),
);

/**
 * Returns an array of annotation resources filtered by the given motivation.
 * @param {Array} annotations
 * @param {Array} motivations
 * @returns {Array}
 */
export const getAnnotationResourcesByMotivation = createSelector(
  [
    getPresentAnnotationsOnSelectedCanvases,
    getMotivation,
  ],
  (annotations, motivations) => filter(
    flatten(annotations.map(annotation => annotation.resources)),
    resource => resource.motivations.some(
      motivation => motivations.includes(motivation),
    ),
  ),
);

/**
 * Returns the selected annotations IDs.
 * @param {object} state
 * @param {string} windowId
 * @param {Array} targetIds
 * @returns {Array}
 */
export const getSelectedAnnotationId = createSelector(
  [
    getWindow,
  ],
  ({ selectedAnnotationId }) => selectedAnnotationId,
);

/**
 * Returns annotations on selected canvases.
 * @param {object} state
 * @returns {Array}
 */
export const getSelectedAnnotationsOnCanvases = createSelector(
  [
    getPresentAnnotationsOnSelectedCanvases,
    getSelectedAnnotationId,
  ],
  (canvasAnnotations, selectedAnnotationId) => canvasAnnotations.map(annotation => ({
    id: (annotation['@id'] || annotation.id),
    resources: annotation.resources.filter(
      r => selectedAnnotationId === r.id,
    ),
  })).filter(val => val.resources.length > 0),
);

import { createSelector } from 'reselect';
import MiradorCanvas from '../../lib/MiradorCanvas';
import { getCanvas, getVisibleCanvasIds } from './canvases';
import { miradorSlice } from './utils';

/**
 * Get the image layers from a canvas.
 * @param {object} state
 * @param {object} props
 * @param {string} props.canvasId
 * @param {string} props.windowId
 * @param {string} props.companionWindowId
 * @returns {Array}
 */
export const getCanvasLayers = createSelector(
  [
    getCanvas,
  ],
  (canvas) => {
    if (!canvas) return [];
    const miradorCanvas = new MiradorCanvas(canvas);
    return miradorCanvas.imageResources;
  },
);

const EMPTY_ARRAY = Object.freeze([]);

export const getLayersForWindow = createSelector(
  [
    state => miradorSlice(state).layers,
    (state, { windowId }) => windowId,
  ],
  (layers, windowId) => (layers ? (layers[windowId] || EMPTY_ARRAY) : EMPTY_ARRAY),
);

/**
 * Get the layer state for a particular canvas.
 * @param {object} state
 * @param {string} windowId
 * @returns {object}
 */
export const getLayers = createSelector(
  [
    getLayersForWindow,
    (state, { canvasId }) => canvasId,
  ],
  (layers, canvasId) => layers[canvasId],
);

/**
 * Returns a list of canvas layers, sorted by the layer state configuration.
 * @param {object} state
 * @param {object} props
 * @param {string} props.companionWindowId
 * @returns {Array}
 */
export const getSortedLayers = createSelector(
  [
    getCanvasLayers,
    getLayers,
  ],
  (canvasLayers, layerConfig) => {
    if (!layerConfig) return canvasLayers;

    const sorted = canvasLayers.sort((a, b) => {
      if (layerConfig[a.id] && layerConfig[a.id].index !== undefined
        && layerConfig[b.id] && layerConfig[b.id].index !== undefined) {
        return layerConfig[a.id].index - layerConfig[b.id].index;
      }

      // sort a layer with index data above layers without
      if (layerConfig[a.id] && layerConfig[a.id].index !== undefined) return -1;
      if (layerConfig[b.id] && layerConfig[b.id].index !== undefined) return 1;

      return 0;
    });

    return sorted;
  },
);

/**
 * Get all the layer configuration for visible canvases.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {object}
 */
export const getLayersForVisibleCanvases = createSelector(
  [
    getVisibleCanvasIds,
    getLayersForWindow,
  ],
  (canvasIds, layers) => (
    canvasIds.reduce((acc, canvasId) => {
      acc[canvasId] = layers[canvasId];
      return acc;
    }, {})
  ),
);

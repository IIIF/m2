import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import CanvasGroupings from '../../lib/CanvasGroupings';
import MiradorCanvas from '../../lib/MiradorCanvas';
import { miradorSlice } from './utils';
import { getWindow } from './getters';
import { getSequence } from './sequences';
import { getWindowViewType } from './windows';
import { getManifestLocale } from './manifests';

/**
 * Returns the info response.
 * @param {object} state
 * @returns {object}
 */
export const selectInfoResponses = state => miradorSlice(state).infoResponses;

export const getCanvases = createSelector(
  [getSequence],
  sequence => (sequence && sequence.getCanvases()) || [],
);

/**
 * Return the canvas selected by an id
 * @param {object} state
 * @param {object} props
 * @param {string} props.canvasId
 * @returns {object}
 */
export const getCanvas = createSelector(
  [
    getSequence,
    (state, { canvasId }) => canvasId,
  ],
  (sequence, canvasId) => {
    if (!sequence || !canvasId) return undefined;

    return sequence.getCanvasById(canvasId);
  },
);

/**
 * Returns the current canvas.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {object|undefined}
 */
export const getCurrentCanvas = createSelector(
  [
    getSequence,
    getWindow,
  ],
  (sequence, window) => {
    if (!sequence || !window) return undefined;

    if (!window.canvasId) return sequence.getCanvasByIndex(0);

    return sequence.getCanvasById(window.canvasId);
  },
);

/**
 * Returns the visible canvas ids.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getVisibleCanvasIds = createSelector(
  [getWindow],
  window => (window && (window.visibleCanvases || (window.canvasId && [window.canvasId]))) || [],
);

/**
 * Returns the visible canvses.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getVisibleCanvases = createSelector(
  [getVisibleCanvasIds, getCanvases],
  (canvasIds, canvases) => (canvases || []).filter(c => canvasIds.includes(c.id)),
);

/**
 * Return the current canvases grouped by how they'll appear in the viewer.
 * For book view returns groups of 2, for single returns 1.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getCanvasGroupings = createSelector(
  [
    getCanvases,
    getWindowViewType,
  ],
  (canvases, view) => (canvases
      && new CanvasGroupings(
        canvases,
        view,
      ).groupings()),
);

/**
 * Return the current canvases selected in a window.
 * For book view returns 2, for single returns 1.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @param {string} props.canvasId
 * @returns {Array}
 */
export const getCanvasGrouping = createSelector(
  [
    getCanvasGroupings,
    (state, { canvasId }) => canvasId,
  ],
  (groupings, canvasId) => (groupings
      && groupings.find(group => group.some(c => c.id === canvasId))) || [],
);

/**
 * Return the next canvas(es) for a window.
 * For book view returns 2, for single returns 1.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getNextCanvasGrouping = createSelector(
  [
    getCanvasGroupings,
    getCurrentCanvas,
  ],
  (groupings, canvas, view) => {
    if (!groupings || !canvas) return undefined;
    const currentGroupIndex = groupings.findIndex(group => group.some(c => c.id === canvas.id));

    if (currentGroupIndex < 0 || currentGroupIndex + 1 >= groupings.length) return undefined;
    const newGroup = groupings[currentGroupIndex + 1];

    return newGroup;
  },
);

/**
 * Return the previous canvas(es) for a window.
 * For book view returns 2, for single returns 1.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getPreviousCanvasGrouping = createSelector(
  [
    getCanvasGroupings,
    getCurrentCanvas,
  ],
  (groupings, canvas, view) => {
    if (!groupings || !canvas) return undefined;

    const currentGroupIndex = groupings.findIndex(group => group.some(c => c.id === canvas.id));

    if (currentGroupIndex < 1) return undefined;
    const newGroup = groupings[currentGroupIndex - 1];

    return newGroup;
  },
);

/**
 * Return canvas label, or alternatively return the given index + 1 to be displayed.
 * @param {object} state
 * @param {object} props
 * @param {string} props.canvasId
 * @param {string} props.manifestId
 * @returns {string|number}
 */
export const getCanvasLabel = createSelector(
  [getCanvas, getManifestLocale],
  (canvas, locale) => (canvas && (
    canvas.getLabel().length > 0
      ? canvas.getLabel().getValue(locale)
      : String(canvas.index + 1)
  )),
);

/**
 * Return canvas description.
 * @param {object} canvas
 * @param {string} companionWindowId
 */
export const getCanvasDescription = createSelector(
  [getCanvas],
  canvas => canvas && canvas.getProperty('description'),
);

/**
 * Return visible non tiled canvas resources.
 * @param {object}
 * @param {string} windowId
 * @returns {Array}
 */
export const getVisibleCanvasNonTiledResources = createSelector(
  [
    getVisibleCanvases,
  ],
  canvases => flatten(canvases
    .map(canvas => new MiradorCanvas(canvas).imageResources))
    .filter(resource => resource.getServices().length < 1),
);

/**
 * Returns visible canvas text resources.
 * @param {object} state
 * @param {string} windowId
 * @return {Array}
 */
export const getVisibleCanvasTextResources = createSelector(
  [
    getVisibleCanvases,
  ],
  canvases => flatten(canvases
    .map(canvas => new MiradorCanvas(canvas).textResources)),
);

/**
 * Returns visible canvas video resources.
 * @param {object} state
 * @param {string} windowId
 * @return {Array}
 */
export const getVisibleCanvasVideoResources = createSelector(
  [
    getVisibleCanvases,
  ],
  canvases => flatten(canvases
    .map(canvas => new MiradorCanvas(canvas).videoResources)),
);

/**
 * Returns visible canvas captions.
 * @param {object} state
 * @param {string} windowId
 * @return {Array}
 */
export const getVisibleCanvasCaptions = createSelector(
  [
    getVisibleCanvases,
  ],
  canvases => flatten(canvases.map(canvas => {
    const miradorCanvas = new MiradorCanvas(canvas);
    // prefer v3, fallback to v2, which can also be an empty array if no captions exist.
    if (miradorCanvas.v3VttContent.length) return miradorCanvas.v3VttContent;
    return miradorCanvas.v2VttContent;
  })),
);

/**
 * Returns visible canvas audio resources.
 * @param {object} state
 * @param {string} windowId
 * @return {Array}
 */
export const getVisibleCanvasAudioResources = createSelector(
  [
    getVisibleCanvases,
  ],
  canvases => flatten(canvases
    .map(canvas => new MiradorCanvas(canvas).audioResources)),
);

/**
 * Returns info response.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @param {string} props.canvasId
 * @param {string} props.infoId
 * @returns {object|undefined}
 */
export const selectInfoResponse = createSelector(
  [
    (state, { infoId }) => infoId,
    getCanvas,
    selectInfoResponses,
  ],
  (infoId, canvas, infoResponses) => {
    let iiifServiceId = infoId;

    if (!infoId) {
      if (!canvas) return undefined;
      const miradorCanvas = new MiradorCanvas(canvas);
      const image = miradorCanvas.iiifImageResources[0];
      iiifServiceId = image && image.getServices()[0].id;
    }

    return iiifServiceId && infoResponses[iiifServiceId]
    && !infoResponses[iiifServiceId].isFetching
    && infoResponses[iiifServiceId];
  },
);

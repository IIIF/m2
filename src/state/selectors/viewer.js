import { createSelector } from 'reselect';
import CanvasWorld from '../../lib/CanvasWorld';

import { getVisibleCanvases } from './canvases';
import { getLayersForVisibleCanvases } from './layers';
import { getSequenceViewingDirection } from './sequences';
import { getMiradorCanvasWrapper } from './wrappers';

/**
 *  Instantiate a manifesto instance.
 * @param {object} state
 * @param {string} windowId
 * @return {object}
 */
export const getCurrentCanvasWorld = createSelector(
  [
    getVisibleCanvases, getLayersForVisibleCanvases, getSequenceViewingDirection,
    getMiradorCanvasWrapper,
  ],
  (canvases, layers, viewingDirection, getMiradorCanvas) => new CanvasWorld(
    canvases.map(getMiradorCanvas),
    layers,
    viewingDirection,
  ),
);

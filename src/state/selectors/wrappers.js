import { createSelector } from 'reselect';
import MiradorCanvas from '../../lib/MiradorCanvas';
import MiradorManifest from '../../lib/MiradorManifest';

/** */
export const getMiradorCanvasWrapper = createSelector(
  [],
  (canvasTypes, imageProfiles) => ((canvas) => canvas && new MiradorCanvas(canvas)),
);

/** */
export const getMiradorManifestWrapper = createSelector(
  [],
  (resourceTypes) => ((manifest) => manifest && new MiradorManifest(manifest)),
);

import { createSelector } from 'reselect';

import { getThumbnailsConfig } from './config';
import { getMiradorCanvasWrapper, getMiradorManifestWrapper } from './wrappers';

import { ThumbnailFactory } from '../../lib/ThumbnailFactory';

/** memoize thumbnail opts for selector */
export const getIiifThumbnailOpts = createSelector(
  [getThumbnailsConfig, (state, maxHeight, maxWidth) => maxHeight, (state, maxHeight, maxWidth) => maxWidth],
  (thumbnails, maxHeight, maxWidth) => ({ maxHeight, maxWidth, preferredFormats: thumbnails.preferredFormats }),
);

/**
 *  Instantiate a thumbnail factory.
 * @param {object} state
 * @param {integer} maxHeight
 * @param {integer} maxWidth
 * @return {object}
 */
export const getThumbnailFactory = createSelector(
  [getIiifThumbnailOpts, getMiradorCanvasWrapper, getMiradorManifestWrapper],
  (iiifOpts, getMiradorCanvas, getMiradorManifest) => new ThumbnailFactory(
    iiifOpts,
    { getMiradorCanvas, getMiradorManifest },
  ),
);

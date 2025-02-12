import { Utils } from 'manifesto.js';
import settings from '../../../src/config/settings';
import { ThumbnailFactory } from '../../../src/lib/ThumbnailFactory';
import {
  getThumbnailFactory,
} from '../../../src/state/selectors/thumbnails';

/** return the slice of config relevant to MiradorCanvas */
const miradorConfigSlice = () => ({ auth: settings.auth, canvas: settings.canvas, image: settings.image });

describe('getThumbnailFactory', () => {
  const state = { config: miradorConfigSlice() };
  const iiifOpts = {};
  it('returns the manifest of a certain id', () => {
    const received = getThumbnailFactory(state, iiifOpts);
    expect(received).toBeInstanceOf(ThumbnailFactory);
  });
});

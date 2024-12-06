import { stateDependentPlugin } from '../plugins/index';

export default {
  config: {
    id: 'mirador',
    windows: [{
      canvasIndex: 2,
      loadedManifest: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
      thumbnailNavigationPosition: 'far-bottom',
    }],
  },
  plugins: [stateDependentPlugin],
};

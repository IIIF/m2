import { companionWindowButtonPlugin, companionWindowPlugin } from '../plugins/index';

export default {
  config: { id: 'mirador', windows: [{ manifestId: 'https://purl.stanford.edu/hg676jb4964/iiif/manifest' }] },
  plugins: [companionWindowButtonPlugin, companionWindowPlugin],
};

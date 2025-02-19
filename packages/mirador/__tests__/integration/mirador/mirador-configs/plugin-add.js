import {
  addPluginA, addPluginB, addPluginC, addPluginD, wrapIconPlugin,
} from '../plugins/index';

export default {
  config: {
    id: 'mirador',
    windows: [{ manifestId: 'https://purl.stanford.edu/hg676jb4964/iiif/manifest' }],
  },
  plugins: [[addPluginA, addPluginB], addPluginC, wrapIconPlugin, addPluginD],
};

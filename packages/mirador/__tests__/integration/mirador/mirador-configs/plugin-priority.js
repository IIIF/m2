import {
  wrapPluginA, wrapPluginB, addPluginA, addPluginB,
} from '../plugins/index';

export default {
  config: { id: 'mirador' },
  plugins: [
    addPluginA,
    wrapPluginA,
    addPluginB,
    wrapPluginB,
  ],
};

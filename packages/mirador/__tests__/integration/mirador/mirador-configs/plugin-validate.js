import {
  validPluginA,
  validPluginB,
  invalidPluginA,
  invalidPluginB,
  invalidPluginC,
  invalidPluginD,
  invalidPluginE,
  invalidPluginF,
} from '../plugins/index';

export default {
  config: { id: 'mirador' },
  plugins: [
    validPluginA,
    validPluginB,
    invalidPluginA,
    invalidPluginB,
    invalidPluginC,
    invalidPluginD,
    invalidPluginE,
    [invalidPluginF],
  ],
};

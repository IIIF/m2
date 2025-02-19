import deepmerge from 'deepmerge';
import { validatePlugin } from './pluginValidation';

/** */
export function filterValidPlugins(plugins) {
  const { validPlugins, invalidPlugins } = splitPluginsByValidation(plugins);
  logInvalidPlugins(invalidPlugins);
  return validPlugins;
}

/** */
function splitPluginsByValidation(plugins) {
  const invalidPlugins = [];
  const validPlugins = [];
  plugins.forEach(plugin => {
    if (Array.isArray(plugin)) {
      const allValid = plugin.every(p => validatePlugin(p));

      allValid ? validPlugins.push(...plugin) : invalidPlugins.push(...plugin);
    } else {
      validatePlugin(plugin)
        ? validPlugins.push(plugin)
        : invalidPlugins.push(plugin);
    }
  });
  return { invalidPlugins, validPlugins };
}

/** */
function logInvalidPlugins(plugins) {
  plugins.forEach(plugin => (
    console.log(`Mirador: Plugin ${plugin.name} is not valid and was rejected.`)
  ));
}

/**  */
export function getReducersFromPlugins(plugins) {
  return plugins && plugins.reduce((acc, plugin) => ({ ...acc, ...plugin.reducers }), {});
}

/**  */
export function getConfigFromPlugins(plugins) {
  return plugins && plugins.reduce((acc, plugin) => (deepmerge(acc, plugin.config || {})), {});
}

/**  */
export function getSagasFromPlugins(plugins) {
  return plugins && plugins.filter(plugin => plugin.saga).map(plugin => plugin.saga);
}

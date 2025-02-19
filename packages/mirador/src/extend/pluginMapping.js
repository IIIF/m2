import update from 'lodash/update';
import { connect } from 'react-redux';
import CompanionWindowRegistry from '../lib/CompanionWindowRegistry';

/**
 * Returns a mapping from targets to plugins and modes
 *
 * @param {Array} plugins
 * @return {Object} - looks like:
 *
 *  {
 *    'WorkspacePanel': {
 *      wrap:     [plugin3, ...],
 *      add:      [plugin4, ...],
 *    },
 *    ...
 *  }
 */
export function createTargetToPluginMapping(plugins) {
  return plugins.reduce((map, plugin) => (
    update(map, [plugin.target, plugin.mode], x => [...(x || []), plugin])
  ), {});
}

/** */
export function connectPluginsToStore(plugins) {
  return plugins.map(plugin => (
    { ...plugin, component: connectPluginComponent(plugin) }
  ));
}

/** */
export function addPluginsToCompanionWindowsRegistry(plugins) {
  plugins.filter(p => p.companionWindowKey).forEach((plugin) => {
    CompanionWindowRegistry[plugin.companionWindowKey] = plugin.component;
  });

  return CompanionWindowRegistry;
}

/** Connect plugin component to state */
function connectPluginComponent(plugin) {
  if (!plugin.mapStateToProps && !plugin.mapDispatchToProps) return plugin.component;

  return connect(
    plugin.mapStateToProps,
    plugin.mapDispatchToProps,
    ...(plugin.connectOptions || []),
  )(plugin.component);
}

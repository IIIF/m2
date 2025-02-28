import { useContext } from 'react';
import PluginContext from './PluginContext';

/** withPlugins should be the innermost HOC */
export function usePlugins(targetName) {
  const pluginMap = useContext(PluginContext);

  const plugins = (pluginMap || {})[targetName];

  const PluginComponents = (plugins?.add || []).map(plugin => plugin.component);

  return { PluginComponents };
}

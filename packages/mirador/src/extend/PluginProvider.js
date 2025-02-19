import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PluginContext from './PluginContext';
import {
  connectPluginsToStore,
  createTargetToPluginMapping,
  addPluginsToCompanionWindowsRegistry,
} from './pluginMapping';

/**  */
export default function PluginProvider({ plugins = [], children = null }) {
  const [pluginMap, setPluginMap] = useState({});

  useEffect(() => {
    const connectedPlugins = connectPluginsToStore(plugins);
    addPluginsToCompanionWindowsRegistry(connectedPlugins);
    setPluginMap(createTargetToPluginMapping(connectedPlugins));
  }, [plugins]);

  return (
    <PluginContext.Provider value={pluginMap}>
      { children }
    </PluginContext.Provider>
  );
}

PluginProvider.propTypes = {
  children: PropTypes.node,
  plugins: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

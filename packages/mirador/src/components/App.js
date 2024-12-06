import {
  createRef, lazy, Suspense,
} from 'react';
import PropTypes from 'prop-types';
import PluginProvider from '../extend/PluginProvider';
import AppProviders from '../containers/AppProviders';
import WorkspaceContext from '../contexts/WorkspaceContext';

const WorkspaceArea = lazy(() => import('../containers/WorkspaceArea'));

/**
 * This is the top level Mirador component.
 * @prop {Object} manifests
 */
export function App({ dndManager = undefined, plugins = [] }) {
  const areaRef = createRef();

  return (
    <PluginProvider plugins={plugins}>
      <AppProviders dndManager={dndManager}>
        <WorkspaceContext.Provider value={areaRef}>
          <Suspense
            fallback={<div />}
          >
            <WorkspaceArea areaRef={areaRef} />
          </Suspense>
        </WorkspaceContext.Provider>
      </AppProviders>
    </PluginProvider>
  );
}

App.propTypes = {
  dndManager: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  plugins: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

export default App;

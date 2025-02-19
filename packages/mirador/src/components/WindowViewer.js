import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';
import WindowCanvasNavigationControls from '../containers/WindowCanvasNavigationControls';

const OSDViewer = lazy(() => import('../containers/OpenSeadragonViewer'));

/**
 * Represents a WindowViewer in the mirador workspace. Responsible for mounting
 * OSD and Navigation
 */
export function WindowViewer({ windowId }) {
  return (
    <ErrorBoundary fallback={null}>
      <Suspense fallback={<div />}>
        <OSDViewer
          windowId={windowId}
        >
          <WindowCanvasNavigationControls windowId={windowId} />
        </OSDViewer>
      </Suspense>
    </ErrorBoundary>
  );
}

WindowViewer.propTypes = {
  windowId: PropTypes.string.isRequired,
};

import { createRef } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import AnnotationSettings from '../containers/AnnotationSettings';
import CanvasAnnotations from '../containers/CanvasAnnotations';
import CompanionWindow from '../containers/CompanionWindow';
import { CompanionWindowSection } from './CompanionWindowSection';
import ns from '../config/css-ns';

/**
 * WindowSideBarAnnotationsPanel ~
*/
export function WindowSideBarAnnotationsPanel({
  annotationCount, canvasIds = [], windowId, id,
}) {
  const { t } = useTranslation();
  const containerRef = createRef();
  return (
    <CompanionWindow
      title={t('annotations')}
      paperClassName={ns('window-sidebar-annotation-panel')}
      windowId={windowId}
      id={id}
      ref={containerRef}
      titleControls={<AnnotationSettings windowId={windowId} />}
    >
      <CompanionWindowSection>
        <Typography component="p" variant="subtitle2">{t('showingNumAnnotations', { count: annotationCount, number: annotationCount })}</Typography>
      </CompanionWindowSection>

      {canvasIds.map((canvasId, index) => (
        <CanvasAnnotations
          canvasId={canvasId}
          containerRef={containerRef}
          key={canvasId}
          index={index}
          totalSize={canvasIds.length}
          windowId={windowId}
        />
      ))}
    </CompanionWindow>
  );
}

WindowSideBarAnnotationsPanel.propTypes = {
  annotationCount: PropTypes.number.isRequired,
  canvasIds: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};

import {
  useRef, Children, cloneElement, useCallback, useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import OpenSeadragon from 'openseadragon';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ns from '../config/css-ns';
import AnnotationsOverlay from '../containers/AnnotationsOverlay';
import CanvasWorld from '../lib/CanvasWorld';
import { PluginHook } from './PluginHook';
import { OSDReferences } from '../plugins/OSDReferences';
import OpenSeadragonComponent from './OpenSeadragonComponent';
import TileSource from './OpenSeadragonTileSource';

const StyledSection = styled('section')({
  cursor: 'grab',
  flex: 1,
  position: 'relative',
});

/**
 * Represents a OpenSeadragonViewer in the mirador workspace. Responsible for mounting
 * and rendering OSD.
 */
export function OpenSeadragonViewer({
  children = null, label = null, windowId, osdConfig = {}, viewerConfig = null,
  drawAnnotations = false, infoResponses = [], canvasWorld, nonTiledImages = [], updateViewport,
  ...rest
}) {
  const { t } = useTranslation();
  const apiRef = useRef();
  const [viewer, setViewer] = useState(null);
  const onViewportChange = useCallback(({
    flip, rotation, x, y, zoom,
  }) => {
    updateViewport(windowId, {
      flip,
      rotation,
      x,
      y,
      zoom,
    });
  }, [updateViewport, windowId]);

  const zoomToWorld = useCallback((immediately = true) => {
    if (!apiRef.current?.viewport) return;

    apiRef.current.viewport.fitBounds(
      new OpenSeadragon.Rect(...canvasWorld.worldBounds()),
      immediately,
    );
  }, [canvasWorld, apiRef]);

  useEffect(() => {
    OSDReferences.set(windowId, apiRef);
  }, [apiRef, windowId]);

  useEffect(() => {
    apiRef.current = viewer;
  }, [apiRef, viewer]);

  const enhancedChildren = Children.map(children, child => (
    cloneElement(
      child,
      {
        zoomToWorld,
      },
    )
  ));

  const pluginProps = {
    canvasWorld,
    drawAnnotations,
    infoResponses,
    label,
    nonTiledImages,
    osdConfig,
    t,
    updateViewport,
    viewerConfig,
    windowId,
    ...rest,
  };

  return (
    <OpenSeadragonComponent
      className={classNames(ns('osd-container'))}
      Container={StyledSection}
      osdConfig={osdConfig}
      viewerConfig={viewerConfig || (canvasWorld.hasDimensions() ? { bounds: canvasWorld.worldBounds() } : undefined)}
      onUpdateViewport={onViewportChange}
      setViewer={setViewer}
      aria-label={t('item', { label })}
      aria-live="polite"
    >
      { infoResponses.map((infoResponse) => {
        const contentResource = canvasWorld.contentResource(infoResponse.id);

        if (!contentResource) return null;

        const fitBounds = canvasWorld.contentResourceToWorldCoordinates(contentResource);
        const index = canvasWorld.layerIndexOfImageResource(contentResource);
        const opacity = canvasWorld.layerOpacityOfImageResource(contentResource);

        return (
          <TileSource
            key={infoResponse.id}
            tileSource={infoResponse.json}
            fitBounds={fitBounds}
            index={index}
            opacity={opacity}
          />
        );
      })}
      { nonTiledImages.map((contentResource) => {
        const type = contentResource.getProperty('type');
        const format = contentResource.getProperty('format') || '';

        if (!(type === 'Image' || type === 'dctypes:Image' || format.startsWith('image/'))) return null;

        const fitBounds = canvasWorld.contentResourceToWorldCoordinates(contentResource);
        const index = canvasWorld.layerIndexOfImageResource(contentResource);
        const opacity = canvasWorld.layerOpacityOfImageResource(contentResource);

        return (
          <TileSource
            key={contentResource.id}
            url={contentResource.id}
            fitBounds={fitBounds}
            index={index}
            opacity={opacity}
          />
        );
      })}
      { drawAnnotations
          && <AnnotationsOverlay viewer={viewer} windowId={windowId} /> }
      { enhancedChildren }
      <PluginHook viewer={viewer} {...pluginProps} />
    </OpenSeadragonComponent>
  );
}

OpenSeadragonViewer.propTypes = {
  canvasWorld: PropTypes.instanceOf(CanvasWorld).isRequired,
  children: PropTypes.node,
  drawAnnotations: PropTypes.bool,
  infoResponses: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string,
  nonTiledImages: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  osdConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  updateViewport: PropTypes.func.isRequired,
  viewerConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  windowId: PropTypes.string.isRequired,
};

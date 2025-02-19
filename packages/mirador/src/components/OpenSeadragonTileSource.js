import Openseadragon from 'openseadragon';
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef } from 'react';
import OpenSeadragonViewerContext from '../contexts/OpenSeadragonViewerContext';

/** OSD tile source shim that adds + updates its tile source data */
export default function OpenSeadragonTileSource({
  index = undefined, opacity = undefined, fitBounds = undefined, tileSource = {}, url = undefined,
}) {
  const viewer = useContext(OpenSeadragonViewerContext);
  const tiledImage = useRef(undefined);

  useEffect(() => {
    if (opacity == null) return;

    tiledImage.current?.setOpacity(opacity);
  }, [opacity]);

  useEffect(() => {
    if (!fitBounds) return;

    tiledImage.current?.fitBounds(new Openseadragon.Rect(...fitBounds));
  }, [fitBounds]);

  useEffect(() => {
    if (!tiledImage.current || !viewer?.current || index == null) return;

    viewer.current.world.setItemIndex(tiledImage.current, index);
  }, [index, viewer]);

  useEffect(() => {
    if (!viewer?.current) return undefined;

    const promise = new Promise((resolve, reject) => {
      const localTileSource = (url && { type: 'image', url })
        || (((typeof tileSource === 'string' || tileSource instanceof String) && tileSource)
        // OSD mutates this object, so we give it a shallow copy
        || { ...tileSource });

      viewer.current?.addTiledImage({
        error: (event) => reject(event),
        fitBounds: (fitBounds ? new Openseadragon.Rect(...fitBounds) : undefined),
        index,
        opacity,
        success: (event) => resolve(event),
        tileSource: localTileSource,
      });
    }).then((event) => {
      tiledImage.current = event.item;
    });

    const osd = viewer.current;
    return () => (
      promise.finally(() => {
        if (osd && tiledImage.current) {
          osd.world.removeItem(tiledImage.current);
        }
      })
    );
  }, [viewer?.current, url]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

OpenSeadragonTileSource.propTypes = {
  fitBounds: PropTypes.arrayOf(PropTypes.number),
  index: PropTypes.number,
  opacity: PropTypes.number,
  tileSource: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  url: PropTypes.string,
};

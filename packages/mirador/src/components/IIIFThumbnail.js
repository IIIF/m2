import {
  useMemo, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';
import getThumbnail from '../lib/ThumbnailFactory';
import { IIIFResourceLabel } from './IIIFResourceLabel';

const Root = styled('div', { name: 'IIIFThumbnail', slot: 'root' })({});

const Label = styled('span', { name: 'IIIFThumbnail', slot: 'label' })(({ theme }) => ({
  ...theme.typography.caption,
}));

const Image = styled('img', { name: 'IIIFThumbnail', slot: 'image' })(() => ({
  height: 'auto',
  width: 'auto',
}));

/**
 * A lazy-loaded image that uses IntersectionObserver to determine when to
 * try to load the image (or even calculate that the image url/height/width are)
 */
const LazyLoadedImage = ({
  border = false, placeholder, style = {}, thumbnail = null,
  resource, maxHeight = null, maxWidth = null, thumbnailsConfig = {}, ...props
}) => {
  const { ref, inView } = useInView();
  const [loaded, setLoaded] = useState(false);

  /**
   * Handles the intersection (visibility) of a given thumbnail, by requesting
   * the image and then updating the state.
   */
  useEffect(() => {
    if (loaded || !inView) return;

    setLoaded(true);
  }, [inView, loaded]);

  const image = useMemo(() => {
    if (thumbnail) return thumbnail;

    const i = getThumbnail(resource, { ...thumbnailsConfig, maxHeight, maxWidth });

    if (i && i.url) return i;

    return undefined;
  }, [resource, thumbnail, maxWidth, maxHeight, thumbnailsConfig]);

  const imageStyles = useMemo(() => {
    const styleProps = {
      height: undefined,
      maxHeight: undefined,
      maxWidth: undefined,
      width: undefined,
    };

    if (!image) return { ...style, height: maxHeight, width: maxWidth };

    const { height: thumbHeight, width: thumbWidth } = image;
    if (thumbHeight && thumbWidth) {
      if ((maxHeight && (thumbHeight > maxHeight)) || (maxWidth && (thumbWidth > maxWidth))) {
        const aspectRatio = thumbWidth / thumbHeight;

        if (maxHeight && maxWidth) {
          if ((maxWidth / maxHeight) < aspectRatio) {
            styleProps.height = Math.round(maxWidth / aspectRatio);
            styleProps.width = maxWidth;
          } else {
            styleProps.height = maxHeight;
            styleProps.width = Math.round(maxHeight * aspectRatio);
          }
        } else if (maxHeight) {
          styleProps.height = maxHeight;
          styleProps.maxWidth = Math.round(maxHeight * aspectRatio);
        } else if (maxWidth) {
          styleProps.width = maxWidth;
          styleProps.maxHeight = Math.round(maxWidth / aspectRatio);
        }
      } else {
        styleProps.width = thumbWidth;
        styleProps.height = thumbHeight;
      }
    } else if (thumbHeight && !thumbWidth) {
      styleProps.height = maxHeight;
    } else if (!thumbHeight && thumbWidth) {
      styleProps.width = maxWidth;
    } else {
      // The thumbnail wasn't retrieved via an Image API service,
      // and its dimensions are not specified in the JSON-LD
      // (note that this may result in a blurry image)
      styleProps.width = maxWidth;
      styleProps.height = maxHeight;
    }

    return {
      ...styleProps,
      ...style,
    };
  }, [image, maxWidth, maxHeight, style]);

  const { url: src = placeholder } = (loaded && (thumbnail || image)) || {};

  return (
    <Image
      ownerState={{ border }}
      ref={ref}
      alt=""
      role="presentation"
      src={src}
      style={imageStyles}
      {...props}
    />
  );
};

LazyLoadedImage.propTypes = {
  border: PropTypes.bool,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  placeholder: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  thumbnail: PropTypes.shape({
    height: PropTypes.number,
    url: PropTypes.string.isRequired,
    width: PropTypes.number,
  }),
  thumbnailsConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultPlaceholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMMDQmtBwADgwF/Op8FmAAAAABJRU5ErkJggg==';

/**
 * Uses InteractionObserver to "lazy" load canvas thumbnails that are in view.
 */
export function IIIFThumbnail({
  border = false,
  children = null,
  imagePlaceholder = defaultPlaceholder,
  label = undefined,
  labelled = false,
  maxHeight = null,
  maxWidth = null,
  resource,
  style = {},
  thumbnail = null,
  thumbnailsConfig = {},
}) {
  const ownerState = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <Root ownerState={ownerState}>
      <LazyLoadedImage
        placeholder={imagePlaceholder}
        thumbnail={thumbnail}
        resource={resource}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        thumbnailsConfig={thumbnailsConfig}
        style={style}
        border={border}
      />

      { labelled && (
        <Label ownerState={ownerState}>
          {label || <IIIFResourceLabel resource={resource} />}
        </Label>
      )}
      {children}
    </Root>
  );
}

IIIFThumbnail.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node,
  imagePlaceholder: PropTypes.string,
  label: PropTypes.string,
  labelled: PropTypes.bool,
  maxHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  resource: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  thumbnail: PropTypes.shape({
    height: PropTypes.number,
    url: PropTypes.string.isRequired,
    width: PropTypes.number,
  }),
  thumbnailsConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  variant: PropTypes.oneOf(['inside', 'outside']), // eslint-disable-line react/no-unused-prop-types
};

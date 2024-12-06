import { Utils } from 'manifesto.js';
import MiradorManifest from './MiradorManifest';
import MiradorCanvas from './MiradorCanvas';
import asArray from './asArray';

/** */
function isLevel0ImageProfile(service) {
  const profile = service.getProfile();

  // work around a bug in manifesto with normalized urls that strip # values.
  if (profile.endsWith('#level1') || profile.endsWith('#level2')) return false;

  // support IIIF v3-style profiles
  if (profile === 'level0') return true;

  return Utils.isLevel0ImageProfile(profile);
}

/** */
function isLevel2ImageProfile(service) {
  const profile = service.getProfile();

  // work around a bug in manifesto with normalized urls that strip # values.
  if (profile.endsWith('#level0') || profile.endsWith('#level1')) return false;

  // support IIIF v3-style profiles
  if (profile === 'level2') return true;

  return Utils.isLevel2ImageProfile(profile);
}

/** */
function iiifv3ImageServiceType(service) {
  const type = service.getProperty('type') || [];

  return asArray(type).some(v => v.startsWith('ImageService'));
}

/** */
function iiifImageService(resource) {
  const service = resource
    && resource.getServices().find(s => (
      iiifv3ImageServiceType(s) || Utils.isImageProfile(s.getProfile())
    ));

  if (!(service)) return undefined;

  return service;
}

/** */
class ThumbnailFactory {
  /** */
  constructor(resource, iiifOpts = {}) {
    this.resource = resource;
    this.iiifOpts = iiifOpts;
  }

  /** */
  static staticImageUrl(resource) {
    return { height: resource.getProperty('height'), url: resource.id, width: resource.getProperty('width') };
  }

  /**
   * Selects the image resource that is representative of the given canvas.
   * @param {Object} canvas A Manifesto Canvas
   * @return {Object} A Manifesto Image Resource
   */
  static getPreferredImage(canvas) {
    const miradorCanvas = new MiradorCanvas(canvas);
    return miradorCanvas.iiifImageResources[0] || miradorCanvas.imageResource;
  }

  /**
   * Chooses the best available image size based on a target area (w x h) value.
   * @param {Object} service A IIIF Image API service that has a `sizes` array
   * @param {Number} targetArea The target area value to compare potential sizes against
   * @return {Object|undefined} The best size, or undefined if none are acceptable
   */
  static selectBestImageSize(service, targetArea) {
    const sizes = asArray(service.getProperty('sizes'));

    let closestSize = {
      default: true,
      height: service.getProperty('height') || Number.MAX_SAFE_INTEGER,
      width: service.getProperty('width') || Number.MAX_SAFE_INTEGER,
    };

    /** Compare the total image area to our target */
    const imageFitness = (test) => test.width * test.height - targetArea;

    /** Look for the size that's just bigger than we prefer... */
    closestSize = sizes.reduce((best, test) => {
      const score = imageFitness(test);

      if (score < 0) return best;

      return Math.abs(score) < Math.abs(imageFitness(best))
        ? test
        : best;
    }, closestSize);

    /** .... but not "too" big; we'd rather scale up an image than download too much */
    if (closestSize.width * closestSize.height > targetArea * 6) {
      closestSize = sizes.reduce((best, test) => (
        Math.abs(imageFitness(test)) < Math.abs(imageFitness(best))
          ? test
          : best
      ), closestSize);
    }

    if (closestSize.default) return undefined;

    return closestSize;
  }

  /**
   * Determines the appropriate thumbnail to use to represent an Image Resource.
   * @param {Object} resource The Image Resource from which to derive a thumbnail
   * @return {Object} The thumbnail URL and any spatial dimensions that can be determined
   */
  iiifThumbnailUrl(resource) {
    let size;
    let width;
    let height;
    const minDimension = 120;
    let maxHeight = minDimension;
    let maxWidth = minDimension;
    const { maxHeight: requestedMaxHeight, maxWidth: requestedMaxWidth } = this.iiifOpts;

    if (requestedMaxHeight) maxHeight = Math.max(requestedMaxHeight, minDimension);
    if (requestedMaxWidth) maxWidth = Math.max(requestedMaxWidth, minDimension);

    const service = iiifImageService(resource);

    if (!service) return ThumbnailFactory.staticImageUrl(resource);

    const aspectRatio = resource.getWidth()
      && resource.getHeight()
      && (resource.getWidth() / resource.getHeight());
    const target = (requestedMaxWidth && requestedMaxHeight)
      ? requestedMaxWidth * requestedMaxHeight
      : maxHeight * maxWidth;
    const closestSize = ThumbnailFactory.selectBestImageSize(service, target);

    if (closestSize) {
      // Embedded service advertises an appropriate size
      width = closestSize.width;
      height = closestSize.height;
      size = `${width},${height}`;
    } else if (isLevel0ImageProfile(service)) {
      /** Bail if the best available size is the full size.. maybe we'll get lucky with the @id */
      if (!service.getProperty('height') && !service.getProperty('width')) {
        return ThumbnailFactory.staticImageUrl(resource);
      }
    } else if (requestedMaxHeight && requestedMaxWidth) {
      // IIIF level 2, no problem.
      if (isLevel2ImageProfile(service)) {
        size = `!${maxWidth},${maxHeight}`;
        width = maxWidth;
        height = maxHeight;

        if (aspectRatio && aspectRatio > 1) height = Math.round(maxWidth / aspectRatio);
        if (aspectRatio && aspectRatio < 1) width = Math.round(maxHeight * aspectRatio);
      } else if ((maxWidth / maxHeight) < aspectRatio) {
        size = `${maxWidth},`;
        width = maxWidth;
        if (aspectRatio) height = Math.round(maxWidth / aspectRatio);
      } else {
        size = `,${maxHeight}`;
        height = maxHeight;
        if (aspectRatio) width = Math.round(maxHeight * aspectRatio);
      }
    } else if (requestedMaxHeight && !requestedMaxWidth) {
      size = `,${maxHeight}`;
      height = maxHeight;
      if (aspectRatio) width = Math.round(maxHeight * aspectRatio);
    } else if (!requestedMaxHeight && requestedMaxWidth) {
      size = `${maxWidth},`;
      width = maxWidth;
      if (aspectRatio) height = Math.round(maxWidth / aspectRatio);
    } else {
      size = `,${minDimension}`;
      height = minDimension;
      if (aspectRatio) width = Math.round(height * aspectRatio);
    }

    const region = 'full';
    const quality = Utils.getImageQuality(service.getProfile());
    const id = service.id.replace(/\/+$/, '');
    const format = this.getFormat(service);
    return {
      height,
      url: [id, region, size, 0, `${quality}.${format}`].join('/'),
      width,
    };
  }

  /**
   * Figure out what format thumbnail to use by looking at the preferred formats
   * on offer, and selecting a format shared in common with the application's
   * preferred format list.
   *
   * Fall back to jpg, which is required to work for all IIIF services.
   */
  getFormat(service) {
    const { preferredFormats = [] } = this.iiifOpts;
    const servicePreferredFormats = service.getProperty('preferredFormats');

    if (!servicePreferredFormats) return 'jpg';

    const filteredFormats = servicePreferredFormats.filter(
      value => preferredFormats.includes(value),
    );

    // this is a format found in common between the preferred formats of the service
    // and the application
    if (filteredFormats[0]) return filteredFormats[0];

    // IIIF Image API guarantees jpg support; if it wasn't provided by the service
    // but the application is fine with it, we might as well try it.
    if (!servicePreferredFormats.includes('jpg') && preferredFormats.includes('jpg')) {
      return 'jpg';
    }

    // there were no formats in common, and the application didn't want jpg... so
    // just trust that the IIIF service is advertising something useful?
    if (servicePreferredFormats[0]) return servicePreferredFormats[0];

    // JPG support is guaranteed by the spec, so it's a good worst-case fallback
    return 'jpg';
  }

  /**
   * Determines the content resource from which to derive a thumbnail to represent a given resource.
   * This method is recursive.
   * @param {Object} resource A IIIF resource to derive a thumbnail from
   * @return {Object|undefined} The Image Resource to derive a thumbnail from, or undefined
   * if no appropriate resource exists
   */
  getSourceContentResource(resource) {
    const thumbnail = resource.getThumbnail();

    // Any resource type may have a thumbnail
    if (thumbnail) {
      if (typeof thumbnail.__jsonld === 'string') return thumbnail.__jsonld;

      // Prefer an image's ImageService over its image's thumbnail
      // Note that Collection, Manifest, and Canvas don't have `getType()`
      if (!resource.isCollection() && !resource.isManifest() && !resource.isCanvas()) {
        if (resource.getType() === 'image' && iiifImageService(resource) && !iiifImageService(thumbnail)) {
          return resource;
        }
      }

      return thumbnail;
    }

    if (resource.isCollection()) {
      const firstManifest = resource.getManifests()[0];
      if (firstManifest) return this.getSourceContentResource(firstManifest);

      return undefined;
    }

    if (resource.isManifest()) {
      const miradorManifest = new MiradorManifest(resource);
      const canvas = miradorManifest.startCanvas || miradorManifest.canvasAt(0);
      if (canvas) return this.getSourceContentResource(canvas);

      return undefined;
    }

    if (resource.isCanvas()) {
      const image = ThumbnailFactory.getPreferredImage(resource);
      if (image) return this.getSourceContentResource(image);

      return undefined;
    }

    if (resource.getType() === 'image') {
      return resource;
    }

    return undefined;
  }

  /**
   * Gets a thumbnail representing the resource.
   * @return {Object|undefined} A thumbnail representing the resource, or undefined if none could
   * be determined
   */
  get() {
    if (!this.resource) return undefined;

    // Determine which content resource we should use to derive a thumbnail
    const sourceContentResource = this.getSourceContentResource(this.resource);
    if (!sourceContentResource) return undefined;

    // Special treatment for external resources
    if (typeof sourceContentResource === 'string') return { url: sourceContentResource };

    return this.iiifThumbnailUrl(sourceContentResource);
  }
}

/** */
function getBestThumbnail(resource, iiifOpts) {
  return new ThumbnailFactory(resource, iiifOpts).get();
}

export { ThumbnailFactory };
export default getBestThumbnail;

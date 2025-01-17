import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import { Canvas, AnnotationPage, Annotation } from 'manifesto.js';
/**
 * MiradorCanvas - adds additional, testable logic around Manifesto's Canvas
 * https://iiif-commons.github.io/manifesto/classes/_canvas_.manifesto.canvas.html
 */
export default class MiradorCanvas {
  /**
   * @param {MiradorCanvas} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
  }

  /** */
  get id() {
    return this.canvas.id;
  }

  /** */
  getWidth() {
    return this.canvas.getWidth();
  }

  /** */
  getHeight() {
    return this.canvas.getHeight();
  }

  /**
   */
  get aspectRatio() {
    return this.canvas.getWidth() / this.canvas.getHeight();
  }

  /**
   * Fetches AnnotationList URIs from canvas's otherContent property
   *
   * Supported otherContent types:
   * - Objects having @type property of "sc:AnnotationList" and URI in @id
   * - Strings being the URIs
   */
  get annotationListUris() {
    return flatten(
      new Array(this.canvas.__jsonld.otherContent), // eslint-disable-line no-underscore-dangle
    )
      .filter(otherContent => otherContent && (typeof otherContent === 'string' || otherContent['@type'] === 'sc:AnnotationList'))
      .map(otherContent => (typeof otherContent === 'string' ? otherContent : otherContent['@id']));
  }

  /** */
  get canvasAnnotationPages() {
    return flatten(
      new Array(this.canvas.__jsonld.annotations), // eslint-disable-line no-underscore-dangle
    )
      .filter(annotations => annotations && annotations.type === 'AnnotationPage');
  }

  /**
   * Will negotiate a v2 or v3 type of resource
   */
  get imageResource() {
    return this.imageResources[0];
  }

  /** */
  get imageResources() {
    // TODO Clean up the following hack as soon as manifesto.js provides any information if an annotation body is a Choice option, and if so, whether it is the preferred one.
    const resources = flattenDeep([
      this.canvas.getImages().map(i => i.getResource()),
      this.canvas.getContent().map(i => (i.__jsonld.body.type === 'Choice' ? i.__jsonld.body : i.getBody())),
    ]);

    return flatten(resources.map((resource) => {
      const type = resource.type || resource.getProperty('type');
      switch (type) {
        case 'Choice': {
          return new Canvas({ images: resource.items.map(r => ({ resource: r })) }, this.canvas.options)
            .getImages().map((img, index) => {
              const r = img.getResource();
              if (r) {
                r.preferred = !index;
              }
              return r;
            });
        }
        case 'oa:Choice': {
          return new Canvas({ images: flattenDeep([resource.getProperty('default'), resource.getProperty('item')]).map(r => ({ resource: r })) }, this.canvas.options).getImages()
            .map((img, index) => {
              const r = img.getResource();
              if (r) {
                r.preferred = !index;
              }
              return r;
            });
        }
        default: {
          const r = resource;
          r.preferred = true;
          return r;
        }
      }
    }));
  }

  /** */
  get videoResources() {
    const resources = flattenDeep([
      this.canvas.getContent().map(i => i.getBody()),
    ]);
    return flatten(resources.filter((resource) => resource.getProperty('type') === 'Video'));
  }

  /** */
  get audioResources() {
    const resources = flattenDeep([
      this.canvas.getContent().map(i => i.getBody()),
    ]);

    return flatten(resources.filter((resource) => resource.getProperty('type') === 'Sound'));
  }

  /** */
  get v2VttContent() {
    const resources = flattenDeep([
      this.canvas.getContent().map(i => i.getBody()),
    ]);

    return flatten(resources.filter((resource) => resource.getProperty('format') === 'text/vtt'));
  }

  /** IIIF v3 captions are stored as 'supplementing' Annotations rather than in the resource content itself */
  get v3VttContent() {
    const resources = flattenDeep(this.canvasAnnotationPages.map(annoPage => {
      const manifestoAnnoPage = new AnnotationPage(annoPage, this.canvas.options);
      return manifestoAnnoPage.getItems().map(item => {
        const manifestoAnnotation = new Annotation(item, this.canvas.options);
        return manifestoAnnotation.getBody();
      });
    }));

    return flatten(resources.filter((resource) => resource.getProperty('format') === 'text/vtt'));
  }

  /** */
  get resourceAnnotations() {
    return flattenDeep([
      this.canvas.getImages(),
      this.canvas.getContent(),
    ]);
  }

  /**
   * Returns a given resource Annotation, based on a contained resource or body
   * id
   */
  resourceAnnotation(id) {
    return this.resourceAnnotations.find(
      anno => anno.getResource().id === id || flatten(
        new Array(anno.getBody()),
      ).some(body => body.id === id),
    );
  }

  /**
   * Returns the fragment placement values if a resourceAnnotation is placed on
   * a canvas somewhere besides the full extent
   */
  onFragment(id) {
    const resourceAnnotation = this.resourceAnnotation(id);
    if (!resourceAnnotation) return undefined;
    // IIIF v2
    const on = resourceAnnotation.getProperty('on');
    // IIIF v3
    const target = resourceAnnotation.getProperty('target');
    const fragmentMatch = (on || target).match(/xywh=(.*)$/);
    if (!fragmentMatch) return undefined;
    return fragmentMatch[1].split(',').map(str => parseInt(str, 10));
  }

  /** */
  get iiifImageResources() {
    return this.imageResources
      .filter(r => r && r.getServices()[0] && r.getServices()[0].id);
  }

  /** */
  get imageServiceIds() {
    return this.iiifImageResources.map(r => r.getServices()[0].id);
  }

  /**
   * Get the canvas service
   */
  get service() {
    return this.canvas.__jsonld.service; // eslint-disable-line no-underscore-dangle
  }

  /**
   * Get the canvas label
   */
  getLabel(locale = undefined) {
    return this.canvas.getLabel().length > 0
      ? this.canvas.getLabel().getValue(locale)
      : String(this.canvas.index + 1);
  }
}

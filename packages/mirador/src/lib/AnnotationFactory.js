import AnnotationList from './AnnotationList';
import AnnotationPage from './AnnotationPage';

/**
 * Used to determine the type of Annotation supported by a version of the IIIF
 * Presentation API.
 */
export default class AnnotationFactory {
  /** */
  static determineAnnotation(json, target) {
    if (!json) {
      return null;
    }

    // IIIF Presentation API v3. AnnotationPage
    if (json.type === 'AnnotationPage') {
      return new AnnotationPage(json, target);
    }

    // IIIF Presentation API v2. OpenAnnotation and SharedCanvas models
    return new AnnotationList(json, target);
  }
}

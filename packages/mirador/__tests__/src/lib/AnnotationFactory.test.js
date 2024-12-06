import AnnotationFactory from '../../../src/lib/AnnotationFactory';
import AnnotationList from '../../../src/lib/AnnotationList';
import AnnotationPage from '../../../src/lib/AnnotationPage';

describe('AnnotationFactory', () => {
  describe('determineAnnotation', () => {
    describe('when falsey', () => {
      it('returns null', () => {
        expect(AnnotationFactory.determineAnnotation(undefined)).toBeNull();
      });
    });
    describe('when Presentation v3', () => {
      it('returns an AnnotationPage', () => {
        expect(AnnotationFactory.determineAnnotation({
          type: 'AnnotationPage',
        })).toBeInstanceOf(AnnotationPage);
      });
    });
    describe('when Presentation v2', () => {
      it('returns an AnnotationPage', () => {
        expect(AnnotationFactory.determineAnnotation({
          '@type': 'AnnotationList',
        })).toBeInstanceOf(AnnotationList);
      });
    });
  });
});

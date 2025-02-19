import AnnotationList from '../../../src/lib/AnnotationList';
import AnnotationResource from '../../../src/lib/AnnotationResource';

describe('AnnotationList', () => {
  describe('id', () => {
    it('returns the @id', () => {
      expect(new AnnotationList({ '@id': 'foo' }).id).toEqual('foo');
    });
  });
  describe('present', () => {
    it('checks for json', () => {
      expect(new AnnotationList().present()).toEqual(false);
    });
    it('checks for resources', () => {
      expect(new AnnotationList({ '@id': 'foo' }).present()).toEqual(false);
      expect(new AnnotationList({ resources: [] }).present()).toEqual(false);
    });
  });
  describe('resources', () => {
    it('maps resources to AnnotationResource', () => {
      new AnnotationList(
        { resources: [{ foo: 'bar' }] },
      ).resources.forEach(resource => expect(resource).toBeInstanceOf(AnnotationResource));
    });

    it('handles resources that are just a single object instead of an array of objects', () => {
      new AnnotationList(
        { resources: { foo: 'bar' } },
      ).resources.forEach(resource => expect(resource).toBeInstanceOf(AnnotationResource));
    });
  });
});

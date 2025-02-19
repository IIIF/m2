import AnnotationPage from '../../../src/lib/AnnotationPage';
import AnnotationItem from '../../../src/lib/AnnotationItem';

describe('AnnotationPage', () => {
  describe('id', () => {
    it('returns the id', () => {
      expect(new AnnotationPage({ id: 'foo' }).id).toEqual('foo');
    });
  });
  describe('present', () => {
    it('checks for json', () => {
      expect(new AnnotationPage().present()).toEqual(false);
    });
    it('checks for items', () => {
      expect(new AnnotationPage({ id: 'foo' }).present()).toEqual(false);
      expect(new AnnotationPage({ items: [] }).present()).toEqual(false);
    });
  });
  describe('items', () => {
    it('returns items', () => {
      new AnnotationPage(
        { items: [{ foo: 'bar' }] },
      ).items.forEach(resource => expect(resource).toBeInstanceOf(AnnotationItem));
    });
  });
  describe('resources', () => {
    it('returns items', () => {
      new AnnotationPage(
        { items: [{ foo: 'bar' }] },
      ).items.forEach(resource => expect(resource).toBeInstanceOf(AnnotationItem));
    });
  });
});

import MosaicLayout from '../../../src/lib/MosaicLayout';

describe('MosaicLayout', () => {
  describe('constructor', () => {
    it('sets layout', () => {
      expect(new MosaicLayout('foo').layout).toEqual('foo');
    });
  });
  describe('addWindows', () => {
    let instance;
    beforeEach(() => {
      instance = new MosaicLayout('foo');
    });
    it('case 1 window: adds to the top right', () => {
      expect(instance.layout).toEqual('foo');
      instance.addWindows(['bar']);
      expect(instance.layout).toEqual({
        direction: 'row',
        first: 'foo',
        second: 'bar',
      });
    });
    it('case 3 windows: adds to the top right', () => {
      expect(instance.layout).toEqual('foo');
      instance.addWindows(['bar', 'bat', 'bark']);
      expect(instance.layout).toEqual({
        direction: 'row',
        first: 'foo',
        second: {
          direction: 'column',
          first: {
            direction: 'row',
            first: 'bat',
            second: 'bark',
          },
          second: 'bar',
        },
      });
    });
  });
  describe('removeWindows', () => {
    let instance;
    beforeEach(() => {
      instance = new MosaicLayout({ first: 'foo', second: 'bar' });
    });
    it('case 1 window: returns a single window', () => {
      instance.removeWindows(['bar'], { bar: ['second'] });
      expect(instance.layout).toEqual('foo');
    });
  });
});

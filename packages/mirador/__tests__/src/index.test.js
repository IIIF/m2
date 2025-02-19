import * as imports from '../../src';

describe('index', () => {
  it('does not have default exports (suggesting we are treating a default export as a named export)', () => {
    Object.keys(imports).forEach((key) => {
      expect(imports[key]).not.toHaveProperty('default');
    });
  });
});

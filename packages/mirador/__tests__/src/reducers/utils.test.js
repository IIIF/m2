import { set, update, unset } from '../../../src/state/reducers/utils';

describe('set', () => {
  it('does not change input object', () => {
    const object = { foo: { a: 1 } };
    set(object, 'foo', { b: 2 });
    expect(object).toEqual({ foo: { a: 1 } });
  });

  it('sets a new item with the provided props', () => {
    const object = { foo: { a: 1 } };
    const result = set(object, 'bar', { b: 2 });
    expect(result).toEqual({
      bar: { b: 2 },
      foo: { a: 1 },
    });
  });

  it('overrides an existing item', () => {
    const object = { foo: { a: 1 } };
    const result = set(object, 'foo', { b: 2 });
    expect(result).toEqual({ foo: { b: 2 } });
  });
});

describe('updateItem', () => {
  it('does not change input object', () => {
    const object = { foo: { a: 1 } };
    update(object, 'foo', { b: 2 });
    expect(object).toEqual({ foo: { a: 1 } });
  });

  it('updates an item with the provided props', () => {
    const object = { bar: { b: 2, c: 3 }, foo: { a: 1 } };
    const result = update(object, 'bar', { c: 4, d: 5 });
    expect(result).toEqual({
      bar: { b: 2, c: 4, d: 5 },
      foo: { a: 1 },
    });
  });

  it('updates an item based on the function passed', () => {
    const object = { bar: { b: 2, c: 3 }, foo: { a: 1 } };
    /** */ const fn = props => ({ ...props, c: props.c + 1 });
    const result = update(object, 'bar', fn);
    expect(result).toEqual({
      bar: { b: 2, c: 4 },
      foo: { a: 1 },
    });
  });
});

describe('removeItem', () => {
  it('does not change input object', () => {
    const object = { foo: { a: 1 } };
    unset(object, 'foo');
    expect(object).toEqual({ foo: { a: 1 } });
  });

  it('removes item from object', () => {
    const object = { bar: { a: 1 }, foo: { b: 2 } };
    const result = unset(object, 'bar');
    expect(result).toEqual({ foo: { b: 2 } });
  });

  it('returns the same object shape if item does not exist', () => {
    const object = { bar: { a: 1 }, foo: { b: 2 } };
    const result = unset(object, 'bubu');
    expect(result).toEqual({ bar: { a: 1 }, foo: { b: 2 } });
  });
});

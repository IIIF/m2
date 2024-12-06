import { validatePlugin } from '../../../src/extend/pluginValidation';

/** */
const createPlugin = props => ({
  component: x => x,
  mapDispatchToProps: x => x,
  mapStateToProps: x => x,
  mode: 'add',
  name: 'test',
  reducers: {
    bar: x => x,
    foo: x => x,
  },
  target: 'Window',
  ...props,
});

describe('validatePlugin', () => {
  it('return true if plugin is valid', () => {
    const plugin = createPlugin();
    expect(validatePlugin(plugin)).toBe(true);
  });

  it('plugin must be a object', () => {
    const plugin = 'some string';
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('name must be undefined or string', () => {
    let plugin = createPlugin({ name: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ name: 'test' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ name: [] });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('target must be string', () => {
    let plugin = createPlugin({ mode: 'add', target: undefined });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ mode: 'add', target: 'test' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mode: 'add', target: [] });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('mode must be missing, "add" or "wrap"', () => {
    let plugin = createPlugin({ mode: undefined, target: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mode: 'somethink' });
    expect(validatePlugin(plugin)).toBe(false);
    plugin = createPlugin({ mode: 'add' });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mode: 'wrap' });
    expect(validatePlugin(plugin)).toBe(true);
  });

  it('mapStateToProps must be undefined, null or function', () => {
    let plugin = createPlugin({ mapStateToProps: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: x => x });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: null });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapStateToProps: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('mapDispatchToProps must be undefined, null, function or object', () => {
    let plugin = createPlugin({ mapDispatchToProps: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: x => x });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: {} });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: null });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ mapDispatchToProps: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('reducers must be undefined or object', () => {
    let plugin = createPlugin({ reducers: undefined });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ reducers: {} });
    expect(validatePlugin(plugin)).toBe(true);
    plugin = createPlugin({ reducers: 'something' });
    expect(validatePlugin(plugin)).toBe(false);
  });

  it('each reducer must be a function', () => {
    let reducers = { bar: x => x, foo: x => x };
    let plugin = createPlugin({ reducers });
    expect(validatePlugin(plugin)).toBe(true);
    reducers = { bar: x => x, foo: undefined };
    plugin = createPlugin({ reducers });
    expect(validatePlugin(plugin)).toBe(false);
  });
});

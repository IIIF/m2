import {
  filterValidPlugins,
} from '../../../src/extend/pluginPreprocessing';

describe('filterValidPlugins', () => {
  it('returns empty array if plugin array is empty', () => {
    expect(filterValidPlugins([])).toEqual([]);
  });

  it('returns only valid plugins', () => {
    const plugins = [
      {
        component: props => null,
        mode: 'add',
        name: 'valid plugin 1',
        target: 'Window',
      },
      {
        component: props => null,
        mode: 'wrap',
        name: 'valid plugin 2',
        target: 'Window',
      },
      {
        mode: 'wrap',
        name: 'invalid Plugin 1',
      },
      [
        {
          name: 'invalid Plugin 2',
          target: 'missing-mode',
        },
        {
          component: props => null,
          mode: 'wrap',
          name: 'valid plugin, grouped with an invalid one',
          target: 'WindowTopBar',
        },
      ],
    ];
    const result = filterValidPlugins(plugins);
    expect(result.map(r => r.name)).toEqual(['valid plugin 1', 'valid plugin 2']);
  });
});

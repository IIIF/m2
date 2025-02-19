import {
  connectPluginsToStore,
  createTargetToPluginMapping,
  addPluginsToCompanionWindowsRegistry,
} from '../../../src/extend/pluginMapping';

describe('createTargetToPluginMapping', () => {
  it('returns empty object if plugin array is empty', () => {
    expect(createTargetToPluginMapping([])).toEqual({});
  });

  it('should create a mapping from targets to plugins and modes', () => {
    /** */
    const component = props => null;

    const plugins = [
      { component, mode: 'wrap', target: 'Window' },
      { component, mode: 'wrap', target: 'Window' },
      { component, mode: 'add', target: 'Window' },
      { component, mode: 'add', target: 'Window' },

      { component, mode: 'wrap', target: 'TopBar' },
      { component, mode: 'wrap', target: 'TopBar' },
      { component, mode: 'add', target: 'TopBar' },
      { component, mode: 'add', target: 'TopBar' },
    ];

    expect(createTargetToPluginMapping(plugins)).toEqual({
      TopBar: {
        add: [
          { component, mode: 'add', target: 'TopBar' },
          { component, mode: 'add', target: 'TopBar' },
        ],
        wrap: [
          { component, mode: 'wrap', target: 'TopBar' },
          { component, mode: 'wrap', target: 'TopBar' },
        ],
      },
      Window: {
        add: [
          { component, mode: 'add', target: 'Window' },
          { component, mode: 'add', target: 'Window' },
        ],
        wrap: [
          { component, mode: 'wrap', target: 'Window' },
          { component, mode: 'wrap', target: 'Window' },
        ],
      },
    });
  });
});

describe('connectPluginsToStore', () => {
  it('returns plugins with components connected to store', () => {
    /** */
    const ComponentA = props => null;
    /** */
    const ComponentB = props => null;

    const plugins = [
      {
        component: ComponentA, mapStateToProps: {}, mode: 'wrap', target: 'Window',
      },
      {
        component: ComponentB, mapDispatchToProps: {}, mode: 'add', target: 'TopBar',
      },
    ];

    const result = connectPluginsToStore(plugins);
    expect(result.length).toBe(2);
    expect(result[0].component.displayName).toBe('Connect(ComponentA)');
    expect(result[1].component.displayName).toBe('Connect(ComponentB)');
  });

  it('returns plugins unchanged that do not need a connection to the store', () => {
    /** */
    const ComponentA = props => null;

    const plugins = [
      {
        component: ComponentA, mode: 'wrap', target: 'Window',
      },
    ];

    const result = connectPluginsToStore(plugins);
    expect(result[0].component).toEqual(ComponentA);
  });
});

describe('addPluginsToCompanionWindowsRegistry', () => {
  it('adds plugin references to the companion window registry', () => {
    /** */
    const ComponentA = props => null;

    const plugins = [
      {
        companionWindowKey: 'xyz',
        component: ComponentA,
        mode: 'add',
        target: 'CompanionWindowFactory',
      },
    ];

    const result = addPluginsToCompanionWindowsRegistry(plugins);

    expect(result.xyz).toBe(ComponentA);
  });
});

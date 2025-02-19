import PropTypes from 'prop-types';
import { render, screen, within } from '@tests/utils/test-utils';
import { withPlugins } from '../../../src/extend/withPlugins';
import { PluginHook } from '../../../src/components/PluginHook';
import PluginContext from '../../../src/extend/PluginContext';

/** Mock target component */
const Target = ({ PluginComponents, TargetComponent, ...props }) => (
  <div data-testid="target" {...props}>
    Hello
    <PluginHook PluginComponents={PluginComponents} {...props} />
  </div>
);

Target.propTypes = {
  PluginComponents: PropTypes.arrayOf(PropTypes.element).isRequired,
  TargetComponent: PropTypes.elementType.isRequired,
};

/** create wrapper  */
function createPluginHoc(pluginMap) {
  const props = { bar: 2, foo: 1 };
  const PluginHoc = withPlugins('Target', Target);
  return render(
    <PluginContext.Provider value={pluginMap}>
      <PluginHoc {...props} />
    </PluginContext.Provider>,
  );
}

describe('withPlugins', () => {
  it('should return a function (normal function call)', () => {
    expect(withPlugins('Target', Target)).toBeInstanceOf(Object);
  });

  it('should return a function (curry function call)', () => {
    expect(withPlugins('Target')(Target)).toBeInstanceOf(Object);
  });

  it('displayName prop of returned function is based on target name argument', () => {
    expect(withPlugins('Bubu', Target).displayName)
      .toBe('WithPlugins(Bubu)');
  });
});

describe('PluginHoc: if no plugin exists for the target', () => {
  it('renders the target component', () => {
    createPluginHoc({});

    expect(screen.getByTestId('target')).toHaveAttribute('foo', '1');
    expect(screen.getByTestId('target')).toHaveAttribute('bar', '2');
  });
});

describe('PluginHoc: if wrap plugins exist for target', () => {
  it('renders the first wrap plugin', () => {
    /** */ const WrapPluginComponentA = props => <div data-testid="plugin">look i am a plugin</div>;
    const pluginMap = {
      Target: {
        wrap: [
          { component: WrapPluginComponentA, mode: 'wrap', target: 'Target' },
        ],
      },
    };
    createPluginHoc(pluginMap);

    expect(screen.getByTestId('plugin')).toBeInTheDocument();
    expect(screen.queryByTestId('target')).not.toBeInTheDocument();
  });

  it('passes the whole wrapped stack to the plugins', () => {
    /** */ const WrapPluginComponentA = ({ children }) => <div data-testid="pluginA">{children}</div>;
    WrapPluginComponentA.propTypes = { children: PropTypes.node.isRequired };
    /** */ const WrapPluginComponentB = props => <div data-testid="pluginB">look i am a plugin</div>;
    const pluginMap = {
      Target: {
        wrap: [
          { component: WrapPluginComponentA, mode: 'wrap', target: 'Target' },
          { component: WrapPluginComponentB, mode: 'wrap', target: 'Target' },
        ],
      },
    };
    createPluginHoc(pluginMap);

    expect(screen.getByTestId('pluginA')).toBeInTheDocument();
    expect(within(screen.getByTestId('pluginA')).getByTestId('pluginB')).toBeInTheDocument();
  });
});

describe('PluginHoc: if add plugins exist but no wrap plugin', () => {
  it('renders the target component and passes all add plugin components as a prop', () => {
    /** */ const AddPluginComponentA = props => <div data-testid="a">look i am a plugin</div>;
    /** */ const AddPluginComponentB = props => <div data-testid="b">look i am a plugin</div>;
    const plugins = {
      Target: {
        add: [
          { component: AddPluginComponentA, mode: 'add', target: 'Target' },
          { component: AddPluginComponentB, mode: 'add', target: 'Target' },
        ],
      },
    };

    createPluginHoc(plugins);

    expect(screen.getByTestId('target')).toBeInTheDocument();
    expect(within(screen.getByTestId('target')).getByTestId('a')).toBeInTheDocument();
    expect(within(screen.getByTestId('target')).getByTestId('b')).toBeInTheDocument();
  });
});

describe('PluginHoc: if wrap plugins AND add plugins exist for target', () => {
  it('renders the first wrap plugin, ignores add plugins if props are not passed through', () => {
    /** */ const WrapPluginComponentA = props => <div data-testid="a">look i am a plugin</div>;
    /** */ const WrapPluginComponentB = props => <div>look i am a plugin</div>;
    /** */ const AddPluginComponentA = props => <div>look i am a plugin</div>;
    /** */ const AddPluginComponentB = props => <div>look i am a plugin</div>;
    const plugins = {
      Target: {
        add: [
          { component: AddPluginComponentA, mode: 'add', target: 'Target' },
          { component: AddPluginComponentB, mode: 'add', target: 'Target' },
        ],
        wrap: [
          { component: WrapPluginComponentA, mode: 'wrap', target: 'Target' },
          { component: WrapPluginComponentB, mode: 'wrap', target: 'Target' },
        ],
      },
    };

    createPluginHoc(plugins);

    expect(screen.getByTestId('a')).toBeInTheDocument();
    expect(screen.queryByTestId('target')).not.toBeInTheDocument();
  });
  it('renders the first wrap plugin, renders add plugins if plugin/props are passed through', () => {
    /** */ const WrapPluginComponentA = ({ targetProps, ...plugin }) => (
      // eslint-disable-next-line react/destructuring-assignment
      <div data-testid="a">
        <plugin.TargetComponent {...targetProps} {...plugin} />
      </div>
    );

    WrapPluginComponentA.propTypes = {
      targetProps: PropTypes.shape({}).isRequired,
    };

    /** */ const WrapPluginComponentB = props => <div>look i am a plugin</div>;
    /** */ const AddPluginComponentC = props => <div data-testid="c">look i am a plugin</div>;
    /** */ const AddPluginComponentD = props => <div data-testid="d">look i am a plugin</div>;
    const plugins = {
      Target: {
        add: [
          { component: AddPluginComponentC, mode: 'add', target: 'Target' },
          { component: AddPluginComponentD, mode: 'add', target: 'Target' },
        ],
        wrap: [
          { component: WrapPluginComponentA, mode: 'wrap', target: 'Target' },
          { component: WrapPluginComponentB, mode: 'wrap', target: 'Target' },
        ],
      },
    };

    createPluginHoc(plugins);

    expect(screen.getByTestId('a')).toBeInTheDocument();
    expect(within(screen.getByTestId('a')).getByTestId('target')).toBeInTheDocument();
    expect(within(screen.getByTestId('target')).getByTestId('c')).toBeInTheDocument();
    expect(within(screen.getByTestId('target')).getByTestId('d')).toBeInTheDocument();
  });
});

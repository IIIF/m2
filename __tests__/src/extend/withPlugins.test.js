import PropTypes from 'prop-types';
import { render, screen, within } from '@tests/utils/test-utils';
import { withPlugins } from '../../../src/extend/withPlugins';
import { PluginHook } from '../../../src/components/PluginHook';
import PluginContext from '../../../src/extend/PluginContext';

/** Mock target component */
const Target = ({ ...props }) => (
  <div data-testid="target" {...props}>
    Hello
  </div>
);

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

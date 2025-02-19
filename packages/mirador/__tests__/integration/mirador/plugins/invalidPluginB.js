export default {
  component: props => (<div data-testid="invalid-plugin-b" />),
  mode: 'add',
  name: 'invalidPluginB',
  target: x => x, // invalid
};

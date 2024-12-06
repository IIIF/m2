export default {
  component: props => (<div data-testid="invalid-plugin-f" />),
  mode: 'add',
  name: 'invalidPluginF',
  reducers: {
    foo: 'foo', // invalid
  },
  target: 'WorkspaceControlPanelButtons',
};

export default {
  component: props => (<div data-testid="invalid-plugin-d" />),
  mapDispatchToProps: 'foo', // invalid
  mode: 'add',
  name: 'invalidPluginD',
  target: 'WorkspaceControlPanelButtons',
};

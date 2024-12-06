export default {
  component: props => (<div data-testid="valid-plugin-b" />),
  mapDispatchToProps: {},
  mapStateToProps: () => ({}),
  mode: 'add',
  name: 'validPluginB',
  reducers: {
    bar: (state = null, action) => state,
  },
  target: 'WorkspaceControlPanelButtons',
};

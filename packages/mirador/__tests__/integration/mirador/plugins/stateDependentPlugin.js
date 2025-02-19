import StateDependentComponent from '../components/StateDependentComponent';

const initialState = {
  canvasChangeCount: 0,
  someNumber: 0,
};

/** */
const pluginStateReducer = (state = initialState, action) => {
  if (action.type === 'mirador/INC_SOME_NUMBER') return { ...state, someNumber: state.someNumber + 1 };
  if (action.type === 'mirador/SET_CANVAS') return { ...state, canvasChangeCount: state.canvasChangeCount + 1 };
  return state;
};

/** */
const mapDispatchToProps = (dispatch) => ({
  incSomeNumber: () => dispatch({ type: 'mirador/INC_SOME_NUMBER' }),
});

/** */
const mapStateToProps = (state) => ({
  manifestId: (state.manifests[Object.keys(state.manifests)[0]] || {}).id,
});

const stateDependentPlugin = {
  component: StateDependentComponent,
  mapDispatchToProps,
  mapStateToProps,
  mode: 'wrap',
  reducers: {
    pluginState: pluginStateReducer,
  },
  target: 'WorkspaceControlPanelButtons',
};

export default stateDependentPlugin;

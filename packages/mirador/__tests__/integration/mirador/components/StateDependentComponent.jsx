const StateDependentComponent = (props) => (
    <button id="plugin-button" onClick={props.incSomeNumber} style={{ width: 64 }}>
      { "Plugin:" + props.manifestId }
    </button>
  );

  export default StateDependentComponent;
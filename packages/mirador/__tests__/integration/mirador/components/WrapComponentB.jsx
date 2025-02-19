const WrapComponentB = (props) => (
    <div data-testid="wrap-plugin-component-b">
      Wrap Plugin B
      <props.TargetComponent {...props} />
    </div>
  );

export default WrapComponentB;
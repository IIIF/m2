import React from 'react';

const WrapComponentA = (props) => (
  <div data-testid="wrap-plugin-component-a">
    Wrap Plugin A
    <props.TargetComponent {...props} />
  </div>
);

export default WrapComponentA;

import { forwardRef, isValidElement, cloneElement } from 'react';

/** Renders plugins */
export const PluginHook = forwardRef((props, ref) => {
  const { PluginComponents } = props; // eslint-disable-line react/prop-types
  const { classes, ...otherProps } = props; // eslint-disable-line react/prop-types
  return PluginComponents ? (
    PluginComponents.map((PluginComponent, index) => ( // eslint-disable-line react/prop-types
      isValidElement(PluginComponent)
        ? cloneElement(PluginComponent, { ...otherProps, ref })
        : (
          <PluginComponent
            ref={ref}
            {...otherProps}
            key={index} // eslint-disable-line react/no-array-index-key
          />
        )
    ))
  ) : null;
});

PluginHook.displayName = 'PluginHook';

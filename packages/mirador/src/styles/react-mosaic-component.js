// Generated using jss convert node_modules/react-mosaic-component/react-mosaic-component.css > src/styles/react-mosaic-component.js
// .mosaic-blueprint-theme styles have also been removed
const globalReactMosaicStyles = {
  '.mosaic': {
    height: '100%',
    width: '100%',
  },
  '.mosaic, .mosaic > *': {
    boxSizing: 'border-box',
  },
  '.mosaic .mosaic-zero-state': {
    position: 'absolute',
    top: 6,
    right: 6,
    bottom: 6,
    left: 6,
    width: 'auto',
    height: 'auto',
    zIndex: '1',
  },
  '.mosaic-root': {
    position: 'absolute',
    top: 3,
    right: 3,
    bottom: 3,
    left: 3,
  },
  '.mosaic-split': {
    position: 'absolute',
    zIndex: '1',
    touchAction: 'none',
  },
  '.mosaic-split:hover': {
    background: 'black',
  },
  '.mosaic-split .mosaic-split-line': {
    position: 'absolute',
  },
  '.mosaic-split.-row': {
    marginLeft: -3,
    width: 6,
    cursor: 'ew-resize',
  },
  '.mosaic-split.-row .mosaic-split-line': {
    top: '0',
    bottom: '0',
    left: 3,
    right: 3,
  },
  '.mosaic-split.-column': {
    marginTop: -3,
    height: 6,
    cursor: 'ns-resize',
  },
  '.mosaic-split.-column .mosaic-split-line': {
    top: 3,
    bottom: 3,
    left: '0',
    right: '0',
  },
  '.mosaic-tile': {
    position: 'absolute',
    margin: 3,
  },
  '.mosaic-tile > *': {
    height: '100%',
    width: '100%',
  },
  '.mosaic-drop-target': {
    position: 'relative',
  },
  '.mosaic-drop-target.drop-target-hover .drop-target-container': {
    display: 'block',
  },
  '.mosaic-drop-target.mosaic > .drop-target-container .drop-target.left': {
    right: 'calc(100% -  10px )',
  },
  '.mosaic-drop-target.mosaic > .drop-target-container .drop-target.right': {
    left: 'calc(100% -  10px )',
  },
  '.mosaic-drop-target.mosaic > .drop-target-container .drop-target.bottom': {
    top: 'calc(100% -  10px )',
  },
  '.mosaic-drop-target.mosaic > .drop-target-container .drop-target.top': {
    bottom: 'calc(100% -  10px )',
  },
  '.mosaic-drop-target .drop-target-container': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    display: 'none',
  },
  '.mosaic-drop-target .drop-target-container.-dragging': {
    display: 'block',
  },
  '.mosaic-drop-target .drop-target-container .drop-target': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '2px solid black',
    opacity: '0',
    zIndex: '5',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.left': {
    right: 'calc(100% -  30% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.right': {
    left: 'calc(100% -  30% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.bottom': {
    top: 'calc(100% -  30% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.top': {
    bottom: 'calc(100% -  30% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.drop-target-hover': {
    opacity: '1',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.drop-target-hover.left': {
    right: 'calc(100% -  50% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.drop-target-hover.right': {
    left: 'calc(100% -  50% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.drop-target-hover.bottom': {
    top: 'calc(100% -  50% )',
  },
  '.mosaic-drop-target .drop-target-container .drop-target.drop-target-hover.top': {
    bottom: 'calc(100% -  50% )',
  },
  '.mosaic-window, .mosaic-preview': {
    position: 'relative',
    display: 'flex',
    fallbacks: [
      {
        display: '-webkit-box',
      },
    ],
    webkitBoxOrient: 'vertical',
    webkitBoxDirection: 'normal',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)',
  },
  '.mosaic-window .mosaic-window-toolbar, .mosaic-preview .mosaic-window-toolbar': {
    zIndex: '4',
    display: 'flex',
    fallbacks: [
      {
        display: '-webkit-box',
      },
    ],
    webkitBoxPack: 'justify',
    justifyContent: 'space-between',
    webkitBoxAlign: 'center',
    alignItems: 'center',
    flexShrink: '0',
    height: 30,
    background: 'white',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
  },
  '.mosaic-window .mosaic-window-toolbar.draggable, .mosaic-preview .mosaic-window-toolbar.draggable': {
    cursor: 'move',
  },
  '.mosaic-window .mosaic-window-title, .mosaic-preview .mosaic-window-title': {
    paddingLeft: 15,
    webkitBoxFlex: '1',
    flex: '1',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    minHeight: 18,
  },
  '.mosaic-window .mosaic-window-controls, .mosaic-preview .mosaic-window-controls': {
    display: 'flex',
    fallbacks: [
      {
        display: '-webkit-box',
      },
    ],
    height: '100%',
  },
  '.mosaic-window .mosaic-window-controls .separator, .mosaic-preview .mosaic-window-controls .separator': {
    height: 20,
    borderLeft: '1px solid black',
    margin: '5px 4px',
  },
  '.mosaic-window .mosaic-window-body, .mosaic-preview .mosaic-window-body': {
    position: 'relative',
    webkitBoxFlex: '1',
    flex: '1',
    height: '0',
    background: 'white',
    zIndex: '1',
    overflow: 'hidden',
  },
  '.mosaic-window .mosaic-window-additional-actions-bar, .mosaic-preview .mosaic-window-additional-actions-bar': {
    position: 'absolute',
    top: 30,
    right: '0',
    bottom: 'initial',
    left: '0',
    height: '0',
    overflow: 'hidden',
    background: 'white',
    webkitBoxPack: 'end',
    justifyContent: 'flex-end',
    display: 'flex',
    fallbacks: [
      {
        display: '-webkit-box',
      },
    ],
    zIndex: '3',
  },
  '.mosaic-window .mosaic-window-additional-actions-bar .bp3-button, .mosaic-preview .mosaic-window-additional-actions-bar .bp3-button': {
    margin: '0',
  },
  '.mosaic-window .mosaic-window-additional-actions-bar .bp3-button:after, .mosaic-preview .mosaic-window-additional-actions-bar .bp3-button:after': {
    display: 'none',
  },
  '.mosaic-window .mosaic-window-body-overlay, .mosaic-preview .mosaic-window-body-overlay': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    opacity: '0',
    background: 'white',
    display: 'none',
    zIndex: '2',
  },
  '.mosaic-window.additional-controls-open .mosaic-window-additional-actions-bar, .mosaic-preview.additional-controls-open .mosaic-window-additional-actions-bar': {
    height: 30,
  },
  '.mosaic-window.additional-controls-open .mosaic-window-body-overlay, .mosaic-preview.additional-controls-open .mosaic-window-body-overlay': {
    display: 'block',
  },
  '.mosaic-window .mosaic-preview, .mosaic-preview .mosaic-preview': {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: '0',
    border: '1px solid black',
    maxHeight: 400,
  },
  '.mosaic-window .mosaic-preview .mosaic-window-body, .mosaic-preview .mosaic-preview .mosaic-window-body': {
    display: 'flex',
    fallbacks: [
      {
        display: '-webkit-box',
      },
    ],
    webkitBoxOrient: 'vertical',
    webkitBoxDirection: 'normal',
    flexDirection: 'column',
    webkitBoxAlign: 'center',
    alignItems: 'center',
    webkitBoxPack: 'center',
    justifyContent: 'center',
  },
  '.mosaic-window .mosaic-preview h4, .mosaic-preview .mosaic-preview h4': {
    marginBottom: 10,
  },
  '.mosaic:not(.mosaic-blueprint-theme) .mosaic-default-control.close-button:before': {
    content: '\'Close\'',
  },
  '.mosaic:not(.mosaic-blueprint-theme) .mosaic-default-control.split-button:before': {
    content: '\'Split\'',
  },
  '.mosaic:not(.mosaic-blueprint-theme) .mosaic-default-control.replace-button:before': {
    content: '\'Replace\'',
  },
  '.mosaic:not(.mosaic-blueprint-theme) .mosaic-default-control.expand-button:before': {
    content: '\'Expand\'',
  },
};

export default globalReactMosaicStyles;

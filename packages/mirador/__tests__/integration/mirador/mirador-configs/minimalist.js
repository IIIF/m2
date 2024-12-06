export default {
  id: 'mirador',
  theme: {
    transitions: {},
  },
  window: {
    allowWindowSideBar: false,
    sideBarOpen: true,
    sideBarPanel: '',
  },
  windows: [{
    allowClose: false,
    canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174892',
    manifestId: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
    thumbnailNavigationPosition: 'far-bottom',
  }],
  workspace: {
    type: 'not-mosaic-or-elastic',
  },
  workspaceControlPanel: {
    enabled: false,
  },
};

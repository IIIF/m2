export default {
  catalog: [
    { manifestId: 'https://demos.biblissima.fr/iiif/metadata/BVMM/chateauroux/manifest.json' },
    { manifestId: 'https://prtd.app/aom/manifest.json' },
    { manifestId: 'https://prtd.app/fv/manifest.json' },
    { manifestId: 'https://manifests.britishart.yale.edu/Osbornfa1' },
  ],
  id: 'mirador',
  window: {
    defaultSideBarPanel: 'layers',
    panels: { // Configure which panels are visible in WindowSideBarButtons
      layers: true,
      search: true,
    },
    sideBarOpenByDefault: true,
  },
  windows: [{
    manifestId: 'https://dvp.prtd.app/hamilton/manifest.json',
  }],
};

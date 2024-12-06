// has 2 windows, one gaugin and one bodleian
export default {
  catalog: [
    { manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json' },
    { manifestId: 'https://iiif.harvardartmuseums.org/manifests/object/299843' },
    { manifestId: 'https://media.nga.gov/public/manifests/nga_highlights.json', provider: 'National Gallery of Art' },
    { manifestId: 'https://data.ucd.ie/api/img/manifests/ucdlib:33064', provider: 'Irish Architectural Archive' },
    { manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest', provider: 'Wellcome Library' },
    { manifestId: 'https://demos.biblissima.fr/iiif/metadata/florus-dispersus/manifest.json', provider: 'Biblissima' },
    { manifestId: 'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/manifest.json', provider: 'e-codices - Virtual Manuscript Library of Switzerland' },
    { manifestId: 'https://wellcomelibrary.org/iiif/collection/b18031511', provider: 'Wellcome Library' },
    { manifestId: 'https://gallica.bnf.fr/iiif/ark:/12148/btv1b10022508f/manifest.json', provider: 'Bibliothèque nationale de France' },
    { manifestId: 'https://manifests.britishart.yale.edu/Osbornfa1', provider: 'Beinecke Rare Book and Manuscript Library, Yale University' },
    { manifestId: 'https://iiif.biblissima.fr/chateauroux/B360446201_MS0005/manifest.json', provider: 'Biblissima' },
    { manifestId: 'https://iiif.durham.ac.uk/manifests/trifle/32150/t1/m4/q7/t1m4q77fr328/manifest', provider: 'Durham University Library' },
    { manifestId: 'https://zavicajna.digitalna.rs/iiif/api/presentation/3/96571949-03d6-478e-ab44-a2d5ad68f935%252F00000001%252Fostalo01%252F00000071/manifest', provider: "Библиотека 'Милутин Бојић'" },
  ],
  id: 'mirador',
  theme: {
    transitions: {},
  },
  windows: [{
    canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174892',
    manifestId: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
  },
  {
    canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/e58b8c60-005c-4c41-a22f-07d49cb25ede.json',
    manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json',
    thumbnailNavigationPosition: 'far-bottom',
  }],
};

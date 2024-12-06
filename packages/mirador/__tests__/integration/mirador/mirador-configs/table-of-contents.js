export default {
  catalog: [
    { manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/390fd0e8-9eae-475d-9564-ed916ab9035c.json', provider: 'Bodleian Libraries' },
    { manifestId: 'http://dams.llgc.org.uk/iiif/newspaper/issue/3100021/manifest.json', provider: 'The National Library of Wales' },
    { manifestId: 'https://iiif.lib.harvard.edu/manifests/drs:5981093', provider: 'Houghton Library (Harvard University)' },
    { manifestId: 'https://cudl.lib.cam.ac.uk/iiif/MS-ADD-03965' },
    { manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/ca3dc326-4a7b-479f-a754-5aed9d2f2cb4.json' },
    //  'https://gist.githubusercontent.com/jeffreycwitt/90b33c1c4e119e7a48b7a66ea41a48c1/raw/522b132409d6c67a78f8f26b0ceb7346a52cfe62/test-manifest-with-complicated-toc.json': {},
    //  'https://gist.githubusercontent.com/jeffreycwitt/1a75fdb4a97e1c2a98bd35797aad263d/raw/859104cb6cd7bd99f3be668f064066f4b3ba2b29/manifest-with-three-level-deep-toc.json': {},
  ],
  id: 'mirador',
  window: {
    defaultSideBarPanel: 'canvas',
    sideBarOpenByDefault: true,
  },
  windows: [{
    canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/a024a538-aef3-44b3-ad11-51c6a8b04ea2.json',
    manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/390fd0e8-9eae-475d-9564-ed916ab9035c.json',
  }],
};

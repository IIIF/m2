export default {
  catalog: [
    { manifestId: 'https://damsssl.llgc.org.uk/iiif/2.0/4566425/manifest.json', provider: 'LLGC' },
    { manifestId: 'https://data.ucd.ie/api/img/manifests/ucdlib:33064', provider: 'Irish Architectural Archive' },
    { manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest', provider: 'Wellcome Library' },
    { manifestId: 'https://scta.info/iiif/graciliscommentary/lon/manifest', provider: 'SCTA' },
    { manifestId: 'https://purl.stanford.edu/zx429wp8334/iiif/manifest', provider: 'SUL' },
  ],
  id: 'mirador',
  windows: [{
    loadedManifest: 'https://purl.stanford.edu/fg165hz3589/iiif/manifest',
    // defaultSearchQuery: 'NSF',
    suggestedSearches: ['NSF'],
  }],
};

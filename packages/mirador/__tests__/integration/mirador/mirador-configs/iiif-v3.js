export default {
  id: 'mirador',
  requests: {
    preprocessors: [
      (url, options) => ({
        ...options,
        headers: {
          Accept: 'application/ld+json;profile="http://iiif.io/api/presentation/3/context.json"',
        },
      }),
    ],
  },
  window: {
    hideSearchPanel: false,
  },
  windows: [{
    manifestId: 'https://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json',
  }],
};

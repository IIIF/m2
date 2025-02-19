import {
  getAnnotationResourcesByMotivation,
  getAnnotationResourcesByMotivationForCanvas,
  getSelectedAnnotationId,
} from '../../../src/state/selectors';

describe('getAnnotationResourcesByMotivationForCanvas', () => {
  it('returns an array of annotation resources on a given canvas (filtered by the passed in array of motiviations)', () => {
    const expected = [
      ['oa:commenting'],
      ['sc:something-else', 'oa:commenting'],
    ];

    const state = {
      annotations: {
        cid1: {
          annoId1: {
            id: 'annoId1',
            json: {
              resources: [{ '@id': 'annoId1', motivation: 'oa:commenting' }],
            },
          },
        },
        cid2: {
          annoId1: {
            id: 'annoId2',
            json: {
              resources: [
                { '@id': 'annoId1', motivation: 'oa:commenting' },
                { '@id': 'annoId2', motivation: 'oa:not-commenting' },
                { '@id': 'annoId3', motivation: ['sc:something-else', 'oa:commenting'] },
              ],
            },
          },
        },
      },
      manifests: {
        mid: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id': 'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  { '@id': 'cid1' },
                  { '@id': 'cid2' },
                ],
              },
            ],
          },
        },
      },
      windows: {
        abc123: {
          manifestId: 'mid',
        },
      },
    };

    expect(
      getAnnotationResourcesByMotivationForCanvas(state, { canvasId: 'cid2', motivations: ['something', 'oa:commenting'], windowId: 'abc123' }).map(r => r.motivations),
    ).toEqual(expected);
  });
});

describe('getAnnotationResourcesByMotivation', () => {
  it('returns an array of annotation resources (filtered by the passed in array of motiviations)', () => {
    const expected = [
      ['oa:commenting'],
      ['sc:something-else', 'oa:commenting'],
    ];

    const state = {
      annotations: {
        cid1: {
          annoId1: {
            id: 'annoId1',
            json: {
              resources: [
                { '@id': 'annoId1', motivation: 'oa:commenting' },
                { '@id': 'annoId2', motivation: 'oa:not-commenting' },
                { '@id': 'annoId3', motivation: ['sc:something-else', 'oa:commenting'] },
              ],
            },
          },
        },
      },
      manifests: {
        mid: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id':
             'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  {
                    '@id': 'cid1',
                  },
                ],
              },
            ],
          },
        },
      },
      windows: {
        abc123: {
          manifestId: 'mid',
          visibleCanvases: ['cid1'],
        },
      },
    };

    expect(
      getAnnotationResourcesByMotivation(state, { motivations: ['something', 'oa:commenting'], windowId: 'abc123' }).map(r => r.motivations),
    ).toEqual(expected);
  });
});

it('getSelectedAnnotationId returns the selected annotation ID from state', () => {
  const state = {
    manifests: {
      mid: {
        json: {
          '@context': 'http://iiif.io/api/presentation/2/context.json',
          '@id':
           'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
          '@type': 'sc:Manifest',
          sequences: [
            {
              canvases: [
                {
                  '@id': 'tid1',
                },
              ],
            },
          ],
        },
      },
    },
    windows: {
      wid: {
        canvasIndex: 0,
        manifestId: 'mid',
        selectedAnnotationId: 'aid1',
        visibleCanvases: ['tid1'],
      },
    },
  };

  expect(getSelectedAnnotationId(state, { windowId: 'wid' })).toEqual(
    'aid1',
  );
});

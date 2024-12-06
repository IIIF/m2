import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import minimumRequired from '../../fixtures/version-2/minimumRequired.json';
import minimumRequired3 from '../../fixtures/version-3/minimumRequired.json';
import audioFixture from '../../fixtures/version-3/0002-mvm-audio.json';
import textFixture from '../../fixtures/version-3/text-pdf.json';
import videoFixture from '../../fixtures/version-3/0015-start.json';
import videoWithAnnoCaptions from '../../fixtures/version-3/video_with_annotation_captions.json';
import settings from '../../../src/config/settings';

import {
  getVisibleCanvases,
  getNextCanvasGrouping,
  getPreviousCanvasGrouping,
  getCanvas,
  getCanvasLabel,
  selectInfoResponse,
  getVisibleCanvasNonTiledResources,
  getVisibleCanvasTextResources,
  getVisibleCanvasVideoResources,
  getVisibleCanvasAudioResources,
  getVisibleCanvasCaptions,
  getVisibleCanvasIds,
} from '../../../src/state/selectors/canvases';

describe('getVisibleCanvasIds', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  const noManifestationState = {
    manifests: {
      x: {
        id: 'x',
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return canvas groupings based on the canvas index stored window state', () => {
    const selectedCanvases = getVisibleCanvasIds(state, { windowId: 'a' });

    expect(selectedCanvases.length).toEqual(2);
    expect(selectedCanvases).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('should return undefined when there is no manifestation to get a canvas from', () => {
    const selectedCanvas = getVisibleCanvasIds(noManifestationState, { windowId: 'a' });

    expect(selectedCanvas).toEqual([]);
  });
});

describe('getVisibleCanvases', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  const noManifestationState = {
    manifests: {
      x: {
        id: 'x',
      },
    },
    windows: {
      a: {
        id: 'a',
        manifestId: 'x',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  it('should return canvas groupings based on the canvas index stored window state', () => {
    const selectedCanvases = getVisibleCanvases(state, { windowId: 'a' });

    expect(selectedCanvases.length).toEqual(2);
    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('should return undefined when there is no manifestation to get a canvas from', () => {
    const selectedCanvas = getVisibleCanvases(noManifestationState, { windowId: 'a' });

    expect(selectedCanvas).toEqual([]);
  });
});

describe('getNextCanvasGrouping', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        canvasId: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json',
        id: 'a',
        manifestId: 'x',
        view: 'book',
      },
      b: {
        canvasId: 'does-not-exist',
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return the next canvas groupings', () => {
    const selectedCanvases = getNextCanvasGrouping(state, { windowId: 'a' });

    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
    ]);
  });

  it('returns undefined if the canvas is not found', () => {
    expect(getNextCanvasGrouping(state, { windowId: 'b' })).toBeUndefined();
  });
});

describe('getPreviousCanvasGrouping', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixture019,
      },
    },
    windows: {
      a: {
        canvasId: 'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        id: 'a',
        manifestId: 'x',
        view: 'book',
      },
      b: {
        canvasId: 'does-not-exist',
        id: 'a',
        manifestId: 'x',
      },
    },
  };

  it('should return the next canvas groupings', () => {
    const selectedCanvases = getPreviousCanvasGrouping(state, { windowId: 'a' });

    expect(selectedCanvases.map(canvas => canvas.id)).toEqual([
      'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json',
    ]);
  });

  it('returns undefined if the canvas is not found', () => {
    expect(getPreviousCanvasGrouping(state, { windowId: 'b' })).toBeUndefined();
  });
});

describe('getCanvas', () => {
  it('returns the canvas by id', () => {
    const state = { manifests: { a: { json: manifestFixture001 } } };
    const received = getCanvas(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'a',
    });
    expect(received.id).toBe('https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json');
  });
});

describe('getCanvasLabel', () => {
  it('should return label of the canvas', () => {
    const state = { manifests: { a: { json: manifestFixture001 } } };
    const received = getCanvasLabel(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'a',
    });
    expect(received).toBe('Whole Page');
  });

  it('should return undefined if the canvas is undefined', () => {
    const state = { manifests: { } };
    expect(getCanvasLabel(state, {
      canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
      manifestId: 'b',
    })).toBeUndefined();
  });

  it('should return the canvas index as (+1) as string if no label given', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      sequences: [
        {
          canvases: [
            {
              '@id': 'some-canvas-without-a-label',
            },
          ],
        },
      ],
    };

    const state = { manifests: { a: { json: manifest } } };
    const received = getCanvasLabel(state, {
      canvasId: 'some-canvas-without-a-label',
      manifestId: 'a',
    });
    expect(received).toBe('1');
  });
});

describe('selectInfoResponse', () => {
  it('returns in the info response for the first canvas resource', () => {
    const resource = { some: 'resource' };

    const state = {
      auth: {},
      config: { auth: settings.auth },
      infoResponses: {
        'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
          json: resource,
        },
      },
      manifests: {
        a: {
          json: manifestFixture001,
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json', manifestId: 'a' }).json).toBe(resource);
  });

  it('returns nothing if there are no canvas resources', () => {
    const state = {
      auth: {},
      manifests: {
        a: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id':
             'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  {
                    '@id': 'some-canvas-without-resources',
                  },
                ],
              },
            ],
          },
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'some-canvas-without-resources', manifestId: 'a' })).toBe(undefined);
  });

  it('returns nothing if there are no canvas services', () => {
    const state = {
      auth: {},
      manifests: {
        a: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id':
             'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            sequences: [
              {
                canvases: [
                  {
                    '@id': 'some-canvas-without-services',
                    images: [
                      {
                        resource: {
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };

    expect(selectInfoResponse(state, { canvasId: 'some-canvas-without-services', manifestId: 'a' })).toBe(undefined);
  });
});

describe('getVisibleCanvasNonTiledResources', () => {
  it('returns canvases resources without services', () => {
    const state = {
      manifests: {
        'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json': {
          id: 'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json',
          json: minimumRequired,
        },
      },
      windows: {
        a: {
          manifestId: 'http://iiif.io/api/presentation/2.0/example/fixtures/1/manifest.json',
          visibleCanvases: [
            'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/1/c1.json',
          ],
        },
      },
    };
    expect(getVisibleCanvasNonTiledResources(state, { windowId: 'a' })[0].id).toBe('http://iiif.io/api/presentation/2.0/example/fixtures/resources/page1-full.png');
  });
  it('works for v3 Presentation API', () => {
    const state = {
      manifests: {
        'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json': {
          id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json',
          json: minimumRequired3,
        },
      },
      windows: {
        a: {
          manifestId: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json',
          visibleCanvases: [
            'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/canvas/p1',
          ],
        },
      },
    };
    expect(getVisibleCanvasNonTiledResources(state, { windowId: 'a' })[0].id).toBe('http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png');
  });

  describe('getVisibleCanvasVideoResources', () => {
    it('returns canvases resources', () => {
      const state = {
        manifests: {
          'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json': {
            id: 'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json',
            json: videoFixture,
          },
        },
        windows: {
          a: {
            manifestId: 'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json',
            visibleCanvases: [
              'https://iiif.io/api/cookbook/recipe/0015-start/canvas/segment1',
            ],
          },
        },
      };
      expect(getVisibleCanvasVideoResources(state, { windowId: 'a' })[0].id).toBe('https://fixtures.iiif.io/video/indiana/30-minute-clock/medium/30-minute-clock.mp4');
    });
  });

  describe('getVisibleCanvasCaptions', () => {
    it('returns v2 canvases resources', () => {
      const state = {
        manifests: {
          'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json': {
            id: 'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json',
            json: videoFixture,
          },
        },
        windows: {
          a: {
            manifestId: 'https://iiif.io/api/cookbook/recipe/0015-start/manifest.json',
            visibleCanvases: [
              'https://iiif.io/api/cookbook/recipe/0015-start/canvas/segment1',
            ],
          },
        },
      };
      expect(getVisibleCanvasCaptions(state, { windowId: 'a' })[0].id).toBe('https://example.com/file.vtt');
    });
    it('returns v3 canvases resources', () => {
      const state = {
        manifests: {
          'https://preview.iiif.io/cookbook/0219-using-caption-file/recipe/0219-using-caption-file/manifest.json': {
            id: 'https://preview.iiif.io/cookbook/0219-using-caption-file/recipe/0219-using-caption-file/manifest.json',
            json: videoWithAnnoCaptions,
          },
        },
        windows: {
          b: {
            manifestId: 'https://preview.iiif.io/cookbook/0219-using-caption-file/recipe/0219-using-caption-file/manifest.json',
            visibleCanvases: [
              'https://preview.iiif.io/cookbook/0219-using-caption-file/recipe/0219-using-caption-file/canvas',
            ],
          },
        },
      };
      expect(getVisibleCanvasCaptions(state, { windowId: 'b' })[0].id).toBe('https://fixtures.iiif.io/video/indiana/lunchroom_manners/lunchroom_manners.vtt');
    });
  });

  describe('getVisibleCanvasAudioResources', () => {
    it('returns canvases resources', () => {
      const state = {
        manifests: {
          'https://iiif.io/api/cookbook/recipe/0002-mvm-audio/manifest.json': {
            id: 'https://iiif.io/api/cookbook/recipe/0002-mvm-audio/manifest.json',
            json: audioFixture,
          },
        },
        windows: {
          a: {
            manifestId: 'https://iiif.io/api/cookbook/recipe/0002-mvm-audio/manifest.json',
            visibleCanvases: [
              'https://iiif.io/api/cookbook/recipe/0002-mvm-audio/canvas',
            ],
          },
        },
      };
      expect(getVisibleCanvasAudioResources(state, { windowId: 'a' })[0].id).toBe('https://fixtures.iiif.io/audio/indiana/mahler-symphony-3/CD1/medium/128Kbps.mp4');
    });
  });

  describe('getVisibleCanvasTextResources', () => {
    it('returns canvases resources', () => {
      const state = {
        manifests: {
          'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json': {
            id: 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json',
            json: textFixture,
          },
        },
        windows: {
          a: {
            manifestId: 'https://iiif.io/api/cookbook/recipe/0001-text-pdf/manifest.json',
            visibleCanvases: [
              'https://iiif.io/api/cookbook/recipe/0001-text-pdf/canvas',
            ],
          },
        },
      };
      expect(getVisibleCanvasTextResources(state, { windowId: 'a' })[0].id).toBe('https://fixtures.iiif.io/other/UCLA/kabuki_ezukushi_rtl.pdf');
    });
  });
});

import manifestFixture019 from '../../fixtures/version-2/019.json';
import manifestFixtureHamilton from '../../fixtures/version-2/hamilton.json';
import {
  getCanvasLayers,
  getLayers,
  getSortedLayers,
  getLayersForVisibleCanvases,
} from '../../../src/state/selectors/layers';

describe('getCanvasLayers', () => {
  const state = {
    manifests: {
      x: {
        id: 'x',
        json: manifestFixtureHamilton,
      },
    },
  };

  it('returns the image resources for a canvas', () => {
    const actual = getCanvasLayers(state, { canvasId: 'https://prtd.app/hamilton/canvas/p1.json', manifestId: 'x' });
    expect(actual.length).toEqual(23);
    expect(actual[0].id).toEqual('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PSC/full/862,1024/0/default.jpg');
  });
});

describe('getLayers', () => {
  const state = {
    layers: {
      x: {
        bar: {
          whatever: true,
        },
      },
    },
  };

  it('returns the layers state for a canvas', () => {
    const actual = getLayers(state, { canvasId: 'bar', windowId: 'x' });
    expect(actual).toEqual({ whatever: true });
  });
});

describe('getSortedLayers', () => {
  let state;

  beforeEach(() => {
    state = {
      layers: {
      },
      manifests: {
        hamilton: {
          id: 'hamilton',
          json: manifestFixtureHamilton,
        },
      },
      windows: {
        x: {
          manifestId: 'hamilton',
        },
      },
    };
  });

  it('returns the image resources in the manifest order when there is no configuration', () => {
    const actual = getSortedLayers(state, { canvasId: 'https://prtd.app/hamilton/canvas/p1.json', windowId: 'x' });
    const imageIds = actual.map(i => i.id);
    expect(imageIds[0]).toEqual('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PSC/full/862,1024/0/default.jpg');
    expect(imageIds[22]).toEqual('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PCA_RGB-1-3-5_gradi/full/739,521/0/default.jpg');
  });

  it('uses the layers configuration to sort the image resources', () => {
    state.layers = {
      x: {
        'https://prtd.app/hamilton/canvas/p1.json': {
          'https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PCA_RGB-1-3-5_gradi/full/739,521/0/default.jpg': {
            index: 0,
          },
        },
      },
    };
    const actual = getSortedLayers(state, { canvasId: 'https://prtd.app/hamilton/canvas/p1.json', windowId: 'x' });
    const imageIds = actual.map(i => i.id);
    expect(imageIds[0]).toEqual('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PCA_RGB-1-3-5_gradi/full/739,521/0/default.jpg');
  });
});

describe('getLayersForVisibleCanvases', () => {
  const state = {
    layers: {
      x: {
        'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1': {
          first: true,
        },
        'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1': {
          second: true,
        },
        not_present: {
          missing: true,
        },
      },
    },
    manifests: {
      m019: {
        id: 'm019',
        json: manifestFixture019,
      },
    },
    windows: {
      x: {
        manifestId: 'm019',
        view: 'book',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
          'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1',
        ],
      },
    },
  };

  it('returns the layers state for all visible canvases', () => {
    const actual = getLayersForVisibleCanvases(state, { windowId: 'x' });
    expect(actual).toEqual({
      'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1': {
        first: true,
      },
      'https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1': {
        second: true,
      },
    });
  });
});

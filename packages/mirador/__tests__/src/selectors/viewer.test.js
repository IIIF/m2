import {
  getCurrentCanvasWorld,
} from '../../../src/state/selectors/viewer';

describe('getCurrentCanvasWorld', () => {
  it('returns a CanvasWorld', () => {
    const windowId = 'id';
    const state = {
      manifests: {
        a: {
          json: {
            '@context': 'http://iiif.io/api/presentation/3/context.json',
            id: 'whatever',
            items: [
              { '@id': 'a1', type: 'Canvas' },
              { '@id': 'a2', type: 'Canvas' },
            ],
            type: 'Manifest',
            viewingDirection: 'sideways',
          },
        },
      },
      windows: {
        [windowId]: {
          manifestId: 'a',
          visibleCanvases: [
            'a1', 'a2',
          ],
        },
      },
    };

    const actual = getCurrentCanvasWorld(state, { windowId });
    expect(actual.canvases.length).toEqual(2);
    expect(Object.keys(actual.layers).length).toEqual(2);
    expect(actual.viewingDirection).toEqual('sideways');
  });
});

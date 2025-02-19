import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import settings from '../../../src/config/settings';
import {
  getAccessTokens,
  selectCurrentAuthServices,
} from '../../../src/state/selectors/auth';

describe('getAccessTokens', () => {
  const state = {
    accessTokens: {
      x: {},
      y: {},
    },
  };

  it('returns the stored access tokens', () => {
    const accessTokens = getAccessTokens(state);

    expect(accessTokens).toEqual(state.accessTokens);
  });
});

describe('selectCurrentAuthServices', () => {
  const resource = {
    service: [
      {
        '@id': 'external',
        profile: 'http://iiif.io/api/auth/1/external',
      },
      {
        '@id': 'login',
        profile: 'http://iiif.io/api/auth/1/login',
      },
    ],
  };
  const externalOnly = {
    service: [
      {
        '@id': 'external',
        profile: 'http://iiif.io/api/auth/1/external',
      },
    ],
  };

  const state = {
    auth: {},
    config: { auth: settings.auth },
    infoResponses: {
      'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
        json: resource,
      },
      'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44': {
        json: externalOnly,
      },
    },
    manifests: {
      a: {
        json: manifestFixture001,
      },
      b: {
        json: manifestFixture019,
      },
    },
    windows: {
      noCanvas: {
        manifestId: 'a',
      },
      w: {
        manifestId: 'a',
        visibleCanvases: [
          'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
        ],
      },
      x: {
        manifestId: 'b',
        visibleCanvases: [
          'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json',
        ],
      },
      y: {
        manifestId: 'b',
        visibleCanvases: [
          'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1',
        ],
      },
    },
  };

  it('returns undefined if there is no current canvas', () => {
    expect(selectCurrentAuthServices({ config: { auth: settings.auth }, manifests: {} }, { windowId: 'noCanvas' })[0]).toBeUndefined();
  });

  it('returns the next auth service to try', () => {
    expect(selectCurrentAuthServices(state, { windowId: 'w' })[0].id).toEqual('external');
  });

  it('returns the service if the next auth service is interactive', () => {
    const auth = { external: { isFetching: false, ok: false } };
    expect(selectCurrentAuthServices({ ...state, auth }, { windowId: 'w' })[0].id).toEqual('login');
  });

  it('returns the last attempted auth service if all of them have been tried', () => {
    const auth = {
      external: { isFetching: false, ok: false },
      login: { isFetching: false, ok: false },
    };
    expect(selectCurrentAuthServices({ ...state, auth }, { windowId: 'w' })[0].id).toEqual('login');
    expect(selectCurrentAuthServices({ ...state, auth }, { windowId: 'x' })[0].id).toEqual('external');
    expect(selectCurrentAuthServices({ ...state, auth }, { windowId: 'y' })[0]).toBeUndefined();
  });

  describe('proscribed order', () => {
    let auth = {};
    const orderedState = {
      config: { auth: settings.auth },
      infoResponses: {
        'https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d': {
          json: {
            service: [
              {
                '@id': 'external',
                profile: 'http://iiif.io/api/auth/1/external',
              },
              {
                '@id': 'kiosk',
                profile: 'http://iiif.io/api/auth/1/kiosk',
              },
              {
                '@id': 'clickthrough',
                profile: 'http://iiif.io/api/auth/1/clickthrough',
              },
              {
                '@id': 'login',
                profile: 'http://iiif.io/api/auth/1/login',
              },
              {
                '@id': 'login2',
                profile: 'http://iiif.io/api/auth/1/login',
              },
            ],
          },
        },
      },
      manifests: {
        a: {
          json: manifestFixture001,
        },
      },
      windows: {
        w: {
          manifestId: 'a',
          visibleCanvases: [
            'https://iiif.bodleian.ox.ac.uk/iiif/canvas/9cca8fdd-4a61-4429-8ac1-f648764b4d6d.json',
          ],
        },
      },
    };

    it('returns external first', () => {
      auth = {};
      expect(selectCurrentAuthServices({ ...orderedState, auth }, { windowId: 'w' })[0].id).toEqual('external');
    });

    it('returns kiosk next', () => {
      auth = { external: { isFetching: false, ok: false } };
      expect(selectCurrentAuthServices({ ...orderedState, auth }, { windowId: 'w' })[0].id).toEqual('kiosk');
    });

    it('returns clickthrough next', () => {
      auth = {
        external: { isFetching: false, ok: false },
        kiosk: { isFetching: false, ok: false },
      };
      expect(selectCurrentAuthServices({ ...orderedState, auth }, { windowId: 'w' })[0].id).toEqual('clickthrough');
    });

    it('returns logins last', () => {
      auth = {
        clickthrough: { isFetching: false, ok: false },
        external: { isFetching: false, ok: false },
        kiosk: { isFetching: false, ok: false },
      };
      expect(selectCurrentAuthServices({ ...orderedState, auth }, { windowId: 'w' })[0].id).toEqual('login');
    });

    it('returns services within a given type using the order from the manifest', () => {
      auth = {
        clickthrough: { isFetching: false, ok: false },
        external: { isFetching: false, ok: false },
        kiosk: { isFetching: false, ok: false },
        login: { isFetching: false, ok: false },
      };
      expect(selectCurrentAuthServices({ ...orderedState, auth }, { windowId: 'w' })[0].id).toEqual('login2');
    });
  });
});

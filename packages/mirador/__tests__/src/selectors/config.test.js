import {
  getLanguagesFromConfigWithCurrent,
  getShowZoomControlsConfig,
  getTheme,
  getThemeIds,
  getContainerId,
  getThemeDirection,
  getConfig,
  getRequestsConfig,
  getExportableState,
} from '../../../src/state/selectors';

describe('getConfig', () => {
  it('returns the whole config', () => {
    const state = { config: { x: {} } };
    expect(getConfig(state)).toEqual(state.config);
  });
});

describe('getExportableState', () => {
  it('returns whole stems', () => {
    const a = { some: 'value' };
    const b = [1, 2, 3];
    const state = { a, b, config: { export: { a: true, b: true } } };
    expect(getExportableState(state)).toEqual({ a, b });
  });

  it('filters out parts of stems', () => {
    const f = {
      a: 1, b: 2, c: 3, d: 4,
    };
    const state = { config: { export: { f: { filter: ([k, v]) => (v % 2) === 0 } } }, f };
    expect(getExportableState(state)).toEqual({ f: { b: 2, d: 4 } });
  });
});

describe('getLanguagesFromConfigWithCurrent', () => {
  it('returns an array of objects with locale, label, and current properties', () => {
    const state = {
      config: {
        availableLanguages: {
          epo: 'Esparanto',
          tlh: 'Klingon',
        },
        language: 'epo',
      },
    };

    const expected = [
      {
        current: true,
        label: 'Esparanto',
        locale: 'epo',
      },
      {
        current: false,
        label: 'Klingon',
        locale: 'tlh',
      },
    ];

    expect(getLanguagesFromConfigWithCurrent(state)).toEqual(expected);
  });
});

describe('getShowZoomControlsConfig', () => {
  it('returns the settings config if it has not been set on the workspace', () => {
    const state = {
      config: { workspace: { showZoomControls: true } },
      workspace: {},
    };
    expect(getShowZoomControlsConfig(state)).toEqual(true);
  });

  it('returns the workspace configuration for showing zoom controls', () => {
    const state = {
      config: { workspace: { showZoomControls: true } },
      workspace: { showZoomControls: false },
    };
    expect(getShowZoomControlsConfig(state)).toEqual(false);
  });
});

describe('getTheme', () => {
  it('returns the theme', () => {
    const state = {
      config: {
        selectedTheme: 'custom',
        theme: {
          whatever: 'dark',
        },
        themes: {
          custom: {
            and_another_thing: true,
          },
        },
      },
    };

    expect(getTheme(state)).toEqual({ and_another_thing: true, whatever: 'dark' });
  });
});

describe('getThemeIds', () => {
  it('returns the available themes', () => {
    const state = {
      config: {
        themes: {
          a: {},
          b: {},
          c: {},
        },
      },
    };

    expect(getThemeIds(state)).toEqual(['a', 'b', 'c']);
  });
});

describe('getContainerId', () => {
  it('returns the container id', () => {
    const state = { config: { id: 'mirador' } };
    expect(getContainerId(state)).toEqual('mirador');
  });
});

describe('getThemeDirection', () => {
  it('returns the configured theme direction', () => {
    const state = { config: { theme: { direction: 'rtl' } } };
    expect(getThemeDirection(state)).toBe('rtl');
  });
  it('returns ltr as default', () => {
    const state = { config: { theme: { } } };
    expect(getThemeDirection(state)).toBe('ltr');
  });
});

describe('getRequestsConfig', () => {
  it('returns the requests configration', () => {
    const state = { config: { requests: 'whatever' } };
    expect(getRequestsConfig(state)).toEqual('whatever');
  });
});

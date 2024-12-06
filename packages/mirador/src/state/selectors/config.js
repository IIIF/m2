import { createSelector } from 'reselect';
import deepmerge from 'deepmerge';
import { miradorSlice } from './utils';
import { getWorkspace } from './getters';

const defaultConfig = Object.freeze({});

/**
 * Returns the config from the redux state.
 * @param {object} state
 * @returns {object} containing config
 */
export function getConfig(state) {
  const slice = miradorSlice(state || {});
  return slice.config || defaultConfig;
}

/**
 * Extract an exportable version of state using the configuration from the config.
 * @param {object} state
 * @returns {object} containing exportable state
 */
export function getExportableState(state) {
  const exportConfig = getConfig(state).export;

  return Object.entries(exportConfig).reduce(
    (acc, [stem, value]) => {
      if (value === true) {
        acc[stem] = state[stem];
      } else if (value.filter) {
        acc[stem] = Object.entries(state[stem])
          .filter(value.filter)
          .reduce(
            (stemAcc, [k, v]) => {
              stemAcc[k] = v; // eslint-disable-line no-param-reassign
              return stemAcc;
            },
            {},
          );
      }
      return acc;
    },
    {},
  );
}

/**
* Return languages from config (in state) and indicate which is currently set.
* @param {object} state
* @returns {Array} [ {locale: 'de', label: 'Deutsch', current: true}, ... ]
*/
export const getLanguagesFromConfigWithCurrent = createSelector(
  [getConfig],
  ({ availableLanguages, language }) => Object.keys(availableLanguages).map(key => ({
    current: key === language,
    label: availableLanguages[key],
    locale: key,
  })),
);

/**
 * Returns if showZoomControls is set in the config.
 * @param {object} state
 * @returns {boolean}
 */
export const getShowZoomControlsConfig = createSelector(
  [
    getWorkspace,
    getConfig,
  ],
  (workspace, config) => (
    workspace.showZoomControls === undefined
      ? (config.workspace.showZoomControls)
      : workspace.showZoomControls
  ),
);

/**
 * Returns the theme from the config.
 * @param {object} state
 * @returns {object} {palette: {...}, typography: {...}, overrides: {...}, ...}
 */
export const getTheme = createSelector(
  [getConfig],
  ({ theme, themes, selectedTheme }) => deepmerge(theme, themes[selectedTheme] || {}),
);

/**
 * Returns the theme ids from the config.
 * @param {object} state
 * @returns {Array} ['dark', 'light']
 */
export const getThemeIds = createSelector(
  [getConfig],
  ({ themes }) => Object.keys(themes),
);

/* @deprecated */
export const getContainerId = createSelector(
  [getConfig],
  ({ id }) => id,
);

/**
 * Returns the theme direction from the config.
 * @param {object} state
 * @returns {string}
 */
export const getThemeDirection = createSelector(
  [getConfig],
  ({ theme }) => theme.direction || 'ltr',
);
/**
 * Returns the theme direction from the config.
 * @param {object} state
 * @returns {object} {preprocessor: [...], postprocessor: [...]}
 */
export const getRequestsConfig = createSelector(
  [getConfig],
  ({ requests }) => requests || {},
);

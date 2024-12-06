import settings from '../../config/settings';

/**
 * Returns a slice of the mirador redux state based on settings.
 * Otherwise the entire Redux state is returned.
 * @param {object} state
 * @returns {object}
 */
export function miradorSlice(state) {
  if (settings.state.slice) return state[settings.state.slice];

  return state;
}

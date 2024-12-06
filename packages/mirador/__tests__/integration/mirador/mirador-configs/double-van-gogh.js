/**
 * Creates a Mirador config object with two windows:
 * - One with a specific canvas index
 * - One with a specific manifest
 *
 * You can pass in an `id` to ensure that the configuration objects do not conflict when used in integration tests.
 *
 * @param {string} [id] - Optional unique identifier for the config to avoid conflicts in tests.
 * @returns {Object} The Mirador configuration object with two windows.
 */
export default function createConfig(id) {
  return {
    id: id || 'mirador',
    windows: [
      {
        canvasIndex: 2,
        loadedManifest: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
      },
      {
        loadedManifest: 'https://media.nga.gov/public/manifests/nga_highlights.json',
        thumbnailNavigationPosition: 'off',
      },
    ],
  };
}

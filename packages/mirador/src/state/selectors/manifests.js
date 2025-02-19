import { createSelector } from 'reselect';
import { PropertyValue, Utils, Resource } from 'manifesto.js';
import getThumbnail from '../../lib/ThumbnailFactory';
import asArray from '../../lib/asArray';
import { getCompanionWindowLocale } from './companionWindows';
import { getManifest } from './getters';
import { getConfig } from './config';

/** */
function createManifestoInstance(json, locale) {
  if (!json) return undefined;
  // Use structuredClone to create a deep copy and prevent Manifesto from mutating the json
  const manifestoObject = Utils.parseManifest(structuredClone(json), locale ? { locale } : undefined);
  if (manifestoObject) {
    // Local patching of Manifesto so that when its a Collection, it behaves similarly
    if (typeof manifestoObject.getSequences != 'function') {
      manifestoObject.getSequences = () => [];
    }
    return manifestoObject;
  }
  return undefined;
}

/** */
export const getLocale = createSelector(
  [
    getCompanionWindowLocale,
    getConfig,
    (state, { locale }) => locale,
  ],
  (companionWindowLocale, config = {}, locale) => (
    locale || companionWindowLocale || config.language || config.fallbackLanguages
  ),
);

const defaultManifestStatus = Object.freeze({ missing: true });

/**
 * Convenience selector to get a manifest (or placeholder).
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {object} {error: null: id: string, isFetching: boolean, json: {...}}
 */
export const getManifestStatus = createSelector(
  [getManifest],
  manifest => manifest || defaultManifestStatus,
);

/**
 * Convenience selector to get a manifest loading error
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @returns {string|null}
 */
export const getManifestError = createSelector(
  [getManifest],
  manifest => manifest && manifest.error,
);

/** Instantiate a manifesto instance */
const getContextualManifestoInstance = createSelector(
  getManifest,
  manifest => manifest && createManifestoInstance(manifest.json),
);

/**
 * Instantiate a manifesto instance
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @returns {object}
 */
export const getManifestoInstance = createSelector(
  getContextualManifestoInstance,
  (state, { json }) => json,
  (manifesto, manifestJson) => (
    manifestJson && createManifestoInstance(manifestJson, locale)
  ) || manifesto,
);

export const getManifestLocale = createSelector(
  [getManifestoInstance, getLocale],
  (manifest, locale) => locale ?? (manifest && manifest.options && manifest.options.locale && manifest.options.locale.replace(/-.*$/, '')),
);

/** */
function getProperty(property) {
  return createSelector(
    [getManifestoInstance],
    manifest => manifest && manifest.getProperty(property),
  );
}

/**
 * Return the IIIF v3 provider of a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestProviderName = createSelector(
  [
    getProperty('provider'),
    getManifestLocale,
  ],
  (provider, locale) => provider
    && provider[0].label
    && PropertyValue.parse(provider[0].label).getValue(locale),
);

/**
 * Return the IIIF v3 provider logo.
 * @param {object} state
 * @param {object} props
 * @returns {string|null}
 */
export const getProviderLogo = createSelector(
  [getProperty('provider')],
  (provider) => {
    const logo = provider && provider[0] && provider[0].logo && provider[0].logo[0];
    if (!logo) return null;
    return getThumbnail(new Resource(logo))?.url;
  },
);

/**
 * Get the logo for a manifest.
 * @param {object} state
 * @param {object} props
 * @returns {string|null}
 */
export const getManifestLogo = createSelector(
  [getManifestoInstance, getProviderLogo],
  (manifest, v3logo) => v3logo || (manifest && manifest.getLogo()),
);

/**
 * Return the IIIF v3 homepage of a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestHomepage = createSelector(
  [
    getProperty('homepage'),
    getManifestLocale,
  ],
  (homepages, locale) => homepages
    && asArray(homepages).map(homepage => (
      {
        label: PropertyValue.parse(homepage.label)
          .getValue(locale),
        value: homepage.id || homepage['@id'],
      }
    )),
);

/**
 * Return the IIIF v3 renderings of a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestRenderings = createSelector(
  [getManifestoInstance, getManifestLocale],
  (manifest, locale) => manifest
    && manifest.getRenderings().map(rendering => (
      {
        label: rendering.getLabel().getValue(locale),
        value: rendering.id,
      }
    )),
);

/**
 * Return the IIIF v2/v3 seeAlso data from a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestSeeAlso = createSelector(
  [
    getProperty('seeAlso'),
    getManifestLocale,
  ],
  (seeAlso, locale) => seeAlso
    && asArray(seeAlso).map(related => (
      {
        format: related.format,
        label: PropertyValue.parse(related.label)
          .getValue(locale),
        value: related.id || related['@id'],
      }
    )),
);

/**
 * Return the IIIF v2/v3 seeAlso data from a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 * @deprecated This does not actually return the content of "related" and
 * might be removed in a future version.
 * @see getManifestSeeAlso
 */
export const getManifestRelatedContent = getManifestSeeAlso;

/**
 * Return the IIIF v2 realated links manifest or null
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestRelated = createSelector(
  [
    getProperty('related'),
    getManifestLocale,
  ],
  (relatedLinks, locale) => relatedLinks
    && asArray(relatedLinks).map(related => (
      typeof related === 'string'
        ? {
          value: related,
        }
        : {
          format: related.format,
          label: PropertyValue.parse(related.label)
            .getValue(locale),
          value: related.id || related['@id'],
        }
    )),
);

/**
 * Return the IIIF requiredStatement (v3) or attribution (v2) data from a manifest or null
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getRequiredStatement = createSelector(
  [getManifestoInstance, getManifestLocale],
  (manifest, locale) => manifest
    && asArray(manifest.getRequiredStatement())
      .filter(l => l && l.getValues().some(v => v))
      .map(labelValuePair => ({
        label: (labelValuePair.label && labelValuePair.label.getValue(locale)) || null,
        values: labelValuePair.getValues(locale),
      })),
);

/**
 * Return the IIIF v2 rights (v3) or license (v2) data from a manifest or null
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
*/
export const getRights = createSelector(
  [
    getProperty('rights'),
    getProperty('license'),
    getManifestLocale,
  ],
  (rights, license, locale) => {
    const data = rights || license;
    return asArray(PropertyValue.parse(data).getValues(locale));
  },
);

/**
 * Return the supplied thumbnail for a manifest or null.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export function getManifestThumbnail(state, props) {
  const manifest = getManifestoInstance(state, props);
  const { thumbnails = {} } = getConfig(state);

  if (!manifest) return undefined;

  const thumbnail = getThumbnail(manifest, {
    maxHeight: 80, maxWidth: 120, preferredFormats: thumbnails.preferredFormats,
  });

  return thumbnail && thumbnail.url;
}

/**
 * Return manifest title.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string}
 */
export const getManifestTitle = createSelector(
  [getManifestoInstance, getManifestLocale],
  (manifest, locale) => manifest
    && manifest.getLabel().getValue(locale),
);

/**
 * Return manifest description (IIIF v2) -- distinct from any description field nested under metadata.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string|null}
 */
export const getManifestDescription = createSelector(
  [getLocale, getManifestoInstance],
  (locale, manifest) => manifest
    && manifest.getDescription().getValue(locale),
);

/**
* Return manifest summary (IIIF v3).
* @param {object} state
* @param {object} props
* @param {string} props.manifestId
* @param {string} props.windowId
* @return {string|null}
*/
export const getManifestSummary = createSelector(
  [
    getProperty('summary'),
    getManifestLocale,
  ],
  (summary, locale) => summary
    && PropertyValue.parse(summary).getValue(locale),
);

/**
 * Return manifest title.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {string}
 */
export const getManifestUrl = createSelector(
  [getManifestoInstance],
  manifest => manifest && manifest.id,
);

/**
 * Return metadata in a label / value structure
 * This is a potential seam for pulling the i18n locale from
 * state and plucking out the appropriate language.
 * For now we're just getting the first.
 * @param {object} Manifesto IIIF Resource (e.g. canvas, manifest)
 * @param iiifResource
 * @returns {Array[Object]}
 */
export function getDestructuredMetadata(iiifResource, locale = undefined) {
  return (iiifResource
    && iiifResource.getMetadata().map(labelValuePair => ({
      label: labelValuePair.getLabel(locale),
      values: labelValuePair.getValues(locale),
    }))
  );
}

/**
 * Return manifest metadata in a label / value structure
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {Array[Object]}
 */
export const getManifestMetadata = createSelector(
  [getManifestoInstance, getManifestLocale],
  (manifest, locale) => manifest && getDestructuredMetadata(manifest, locale),
);

/** */
function getLocalesForStructure(item) {
  const languages = new Set([]);

  /** Extract language indicators from IIIF v2 or v3 manifests */
  const extractLanguage = (i) => {
    if (!(i && typeof i === 'object')) return;

    // IIIF v2 pattern
    if (i['@language'] && i['@value']) {
      languages.add(i['@language']);
      return;
    }

    // IIIF v3 pattern
    Object.keys(i).forEach((key) => {
      languages.add(key);
    });
  };

  if (Array.isArray(item)) {
    item.forEach(i => extractLanguage(i));
  } else {
    extractLanguage(item);
  }

  return [...languages];
}

/** */
function getLocales(resource) {
  if (!resource) return [];

  const metadata = resource.getProperty('metadata') || [];
  const languages = {};

  for (let i = 0; i < metadata.length; i += 1) {
    const item = metadata[i];
    getLocalesForStructure(item.label).forEach((l) => { languages[l] = true; });
    getLocalesForStructure(item.value).forEach((l) => { languages[l] = true; });
  }
  return Object.keys(languages);
}

export const getMetadataLocales = createSelector(
  [getManifestoInstance],
  manifest => getLocales(manifest),
);

/**
 * Returns manifest search service.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @returns {string|null}
 */
export const getManifestSearchService = createSelector(
  [getManifestoInstance],
  (manifest) => {
    if (!manifest) return null;
    const searchService = manifest.getService('http://iiif.io/api/search/0/search')
     || manifest.getService('http://iiif.io/api/search/1/search');
    if (searchService) return searchService;
    return null;
  },
);

/**
 * Returns manifest autocomplete service.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @returns {string|null}
 */
export const getManifestAutocompleteService = createSelector(
  [getManifestSearchService],
  (searchService) => {
    const autocompleteService = searchService && (
      searchService.getService('http://iiif.io/api/search/0/autocomplete')
      || searchService.getService('http://iiif.io/api/search/1/autocomplete')
    );

    return autocompleteService && autocompleteService;
  },
);

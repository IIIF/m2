import { Utils } from 'manifesto.js';

import collection from '../../fixtures/version-2/collection.json';
import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture002 from '../../fixtures/version-2/002.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import manifestFixtureSn904cj3429 from '../../fixtures/version-2/sn904cj3429.json';
import manifestFixturev3001 from '../../fixtures/version-3/001.json';
import manifestFixtureWithAProvider from '../../fixtures/version-3/with_a_provider.json';
import manifestFixtureFg165hz3589 from '../../fixtures/version-2/fg165hz3589.json';
import manifestFixtureRelated from '../../fixtures/version-2/related.json';

import {
  getManifestoInstance,
  getManifestLocale,
  getDestructuredMetadata,
  getManifestStatus,
  getManifestLogo,
  getManifestDescription,
  getManifestHomepage,
  getProviderLogo,
  getManifestProviderName,
  getManifestTitle,
  getManifestThumbnail,
  getManifestMetadata,
  getManifestRelated,
  getManifestRelatedContent,
  getManifestRenderings,
  getManifestSeeAlso,
  getManifestSummary,
  getManifestUrl,
  getMetadataLocales,
  getRequiredStatement,
  getRights,
  getManifestSearchService,
  getManifestAutocompleteService,
} from '../../../src/state/selectors/manifests';

describe('getManifestStatus', () => {
  const state = {
    manifests: {
      x: { id: 'x' },
    },
  };

  it('returns the manifest of a certain id', () => {
    const received = getManifestStatus(state, { manifestId: 'x' });
    const expected = { id: 'x' };
    expect(received).toEqual(expected);
  });

  it('returns a placeholder', () => {
    const received = getManifestStatus(state, { manifestId: 'y' });
    const expected = { missing: true };
    expect(received).toEqual(expected);
  });
});

describe('getManifestoInstance', () => {
  it('creates a manifesto instance', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    const received = getManifestoInstance(state, { manifestId: 'x' });
    expect(received.id).toEqual('http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json');
  });
});

describe('getManifestLogo()', () => {
  it('should return manifest logo id', () => {
    const received = getManifestLogo({ manifests: { x: { json: manifestFixture001 } } }, { manifestId: 'x' });
    expect(received).toEqual(manifestFixture001.logo['@id']);
  });

  it('should return null if manifest has no logo', () => {
    const received = getManifestLogo({ manifests: { x: {} } }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestThumbnail()', () => {
  it('should return manifest-level thumbnail', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    const received = getManifestThumbnail(state, { manifestId: 'x' });
    expect(received).toEqual('https://iiif.bodleian.ox.ac.uk/iiif/image/9cca8fdd-4a61-4429-8ac1-f648764b4d6d/full/,120/0/default.jpg');
  });

  it('returns the first canvas thumbnail id', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      sequences: [
        {
          canvases: [
            {
              thumbnail: { id: 'xyz' },
            },
          ],
        },
      ],
    };

    const state = { manifests: { x: { json: manifest } } };
    const received = getManifestThumbnail(state, { manifestId: 'x' });
    expect(received).toEqual('xyz');
  });

  it('returns a thumbnail sized image url from the first canvas', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    const received = getManifestThumbnail(state, { manifestId: 'x' });
    expect(received).toEqual('https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/full/!120,120/0/default.jpg');
  });

  it('should return null if manifest has no thumbnail', () => {
    const state = { manifests: { x: {} } };
    const received = getManifestThumbnail(state, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestTitle', () => {
  it('should return manifest title', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    const received = getManifestTitle(state, { manifestId: 'x' });
    expect(received).toBe('Bodleian Library Human Freaks 2 (33)');
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestTitle({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestDescription', () => {
  it('should return manifest description', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    const received = getManifestDescription(state, { manifestId: 'x' });
    expect(received).toBe('[Handbill of Mr. Becket, [1787] ]');
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestDescription({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestSummary', () => {
  it('should return manifest summary', () => {
    const state = { manifests: { x: { json: manifestFixturev3001 } } };
    const received = getManifestSummary(state, { manifestId: 'x' });
    expect(received).toBe('[Handbill of Mr. Becket, [1787] ]');
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestSummary({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getProviderLogo', () => {
  it('should return manifest provider logo', () => {
    const state = { manifests: { x: { json: manifestFixtureWithAProvider } } };
    const received = getProviderLogo(state, { manifestId: 'x' });
    expect(received).toBe('https://example.org/images/logo.png');
  });

  it('should return null if no logo', () => {
    // use the fixture but overwrite the 'provider' property to be empty/not include logo
    const state = { manifests: { x: { json: { ...manifestFixtureWithAProvider, provider: [] } } } };
    const received = getProviderLogo(state, { manifestId: 'x' });
    expect(received).toBeNull();
  });
});

describe('getManifestProviderName', () => {
  it('should return manifest provider label', () => {
    const state = { manifests: { x: { json: manifestFixtureWithAProvider } } };
    const received = getManifestProviderName(state, { manifestId: 'x' });
    expect(received).toBe('Example Organization');
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestProviderName({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestHomepage', () => {
  it('should return manifest homepage', () => {
    const state = { manifests: { x: { json: manifestFixturev3001 } } };
    const received = getManifestHomepage(state, { manifestId: 'x' });
    expect(received).toEqual([
      {
        label: 'View on Digital Bodleian',
        value: 'https://digital.bodleian.ox.ac.uk/inquire/p/9cca8fdd-4a61-4429-8ac1-f648764b4d6d',
      },
    ]);
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestHomepage({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestRenderings', () => {
  it('should return manifest renderings', () => {
    const state = {
      manifests: {
        x: {
          json: {
            '@context': 'http://iiif.io/api/presentation/2/context.json',
            '@id': 'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
            '@type': 'sc:Manifest',
            rendering: [
              {
                format: 'application/pdf',
                id: 'https://example.org/1.pdf',
                label: { en: ['PDF Rendering of Book'] },
                type: 'Text',
              },
            ],
          },
        },
      },
    };

    const received = getManifestRenderings(state, { manifestId: 'x' });
    expect(received).toEqual([
      {
        label: 'PDF Rendering of Book',
        value: 'https://example.org/1.pdf',
      },
    ]);
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestRenderings({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestRelated', () => {
  it('should return manifest related', () => {
    const state = { manifests: { x: { json: manifestFixtureRelated } } };
    const received = getManifestRelated(state, { manifestId: 'x' });
    expect(received).toEqual([
      {
        value: 'http://example.com/related1',
      },
      {
        format: undefined,
        label: null,
        value: 'http://example.com/related2',
      },
      {
        format: 'text/html',
        label: 'Something related',
        value: 'http://example.com/related3',
      },
    ]);
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestRelated({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestRelatedContent', () => {
  it('should return manifest seeAlso content', () => {
    const state = { manifests: { x: { json: manifestFixtureSn904cj3429 } } };
    const received = getManifestRelatedContent(state, { manifestId: 'x' });
    expect(received).toEqual([
      {
        format: 'application/mods+xml',
        label: null,
        value: 'https://purl.stanford.edu/sn904cj3429.mods',
      },
    ]);
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestRelatedContent({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestSeeAlso', () => {
  it('should return manifest seeAlso content', () => {
    const state = { manifests: { x: { json: manifestFixtureSn904cj3429 } } };
    const received = getManifestSeeAlso(state, { manifestId: 'x' });
    expect(received).toEqual([
      {
        format: 'application/mods+xml',
        label: null,
        value: 'https://purl.stanford.edu/sn904cj3429.mods',
      },
    ]);
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestSeeAlso({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getManifestUrl', () => {
  it('should return manifest url', () => {
    const state = { manifests: { x: { json: manifestFixtureWithAProvider } } };
    const received = getManifestUrl(state, { manifestId: 'x' });
    expect(received).toBe('https://example.com/with_a_provider.json');
  });

  it('should return undefined if manifest undefined', () => {
    const received = getManifestUrl({ manifests: {} }, { manifestId: 'x' });
    expect(received).toBeUndefined();
  });
});

describe('getDestructuredMetadata', () => {
  it('should return the first value of label/value attributes for each object in the array ', () => {
    const iiifResource = Utils.parseManifest(manifestFixture002);
    const received = getDestructuredMetadata(iiifResource);
    const expected = [{
      label: 'date',
      values: ['some date'],
    }];

    expect(received).toEqual(expected);
  });

  it('returns an empty array if there is no metadata', () => {
    const iiifResource = Utils.parseManifest(manifestFixture019);
    const received = getDestructuredMetadata(iiifResource);

    expect(received).toEqual([]);
  });
});

describe('getManifestMetadata', () => {
  it('should return the first value of label/value attributes for each object in the array ', () => {
    const state = { manifests: { x: { json: manifestFixture002 } } };
    const received = getManifestMetadata(state, { manifestId: 'x' });
    const expected = [{
      label: 'date',
      values: ['some date'],
    }];

    expect(received).toEqual(expected);
  });

  it('returns an empty array if there is no metadata', () => {
    const iiifResource = Utils.parseManifest(manifestFixture019);
    const received = getDestructuredMetadata(iiifResource);

    expect(received).toEqual([]);
  });
});

describe('getManifestLocale', () => {
  it('gets the default locale for the manifest', () => {
    const state = { manifests: { x: { json: manifestFixture002 } } };
    const received = getManifestLocale(state, { manifestId: 'x' });
    expect(received).toEqual('en');
  });
});

describe('getMetadataLocales', () => {
  it('gets the locales preseent in the IIIF v2 manifest metadata', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      metadata: [
        {
          label: [
            { '@language': 'de-label', '@value': 'Besitzende Einrichtung' },
            { '@language': 'en-label', '@value': 'Holding Institution' },
          ],
          value: 'Herzog August Bibliothek Wolfenb\u00fcttel',
        },
        {
          label: 'Digitization Project',
          value: [
            { '@language': 'en-value', '@value': 'Manuscripts from German-Speaking Lands - A Polonsky Foundation Digitization Project - A collaboration between the Bodleian Libraries and the Herzog August Bibliothek.' },
            { '@language': 'de-value', '@value': 'Handschriften aus dem deutschen Sprachraum. Ein Digitalisierungsprojekt der Polonsky Stiftung. Eine Zusammenarbeit zwischen der Universit\u00e4t Oxford und der Herzog August Bibliothek Wolfenb\u00fcttel' },
          ],
        },
        {
          label: 'Some label',
          value: { '@language': 'one-value', '@value': '1' },
        },
        { label: 'Bad value', value: null },
        { label: null, value: 'Bad label' },
      ],
    };
    const state = { manifests: { x: { json: manifest } } };
    const received = getMetadataLocales(state, { manifestId: 'x' });
    expect(received).toEqual(['de-label', 'en-label', 'en-value', 'de-value', 'one-value']);
  });
  it('gets the locales preseent in the IIIF v3 manifest metadata', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://iiif.io/api/cookbook/recipe/0006-text-language/manifest.json',
      label: {
        en: [
          "Whistler's Mother",
        ],
        fr: [
          'La Mère de Whistler',
        ],
      },
      metadata: [
        {
          label: {
            en: [
              'Creator',
            ],
            fr: [
              'Auteur',
            ],
          },
          value: {
            none: [
              'Whistler, James Abbott McNeill',
            ],
          },
        },
        {
          label: {
            en: [
              'Subject',
            ],
            fr: [
              'Sujet',
            ],
          },
          value: {
            en: [
              'McNeill Anna Matilda, mother of Whistler (1804-1881)',
            ],
            fr: [
              'McNeill Anna Matilda, mère de Whistler (1804-1881)',
            ],
          },
        },
      ],
      type: 'Manifest',
    };
    const state = { manifests: { x: { json: manifest } } };
    const received = getMetadataLocales(state, { manifestId: 'x' });
    expect(received).toEqual(['en', 'fr', 'none']);
  });
});

describe('getRequiredStatement', () => {
  it('gets the attribution data for a IIIF v2 manifest', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    const received = getRequiredStatement(state, { manifestId: 'x' });
    expect(received).toEqual([{ label: null, values: ['http://creativecommons.org/licenses/by-nc-sa/3.0/.'] }]);
  });

  it('suppresses empty attribution data', () => {
    const state = { manifests: { x: { json: manifestFixture002 } } };
    const received = getRequiredStatement(state, { manifestId: 'x' });
    expect(received).toEqual([]);
  });

  it('gets the required statement data for a IIIF v3 manifest', () => {
    const state = { manifests: { x: { json: manifestFixturev3001 } } };
    const received = getRequiredStatement(state, { manifestId: 'x' });
    expect(received).toEqual([{ label: 'Terms of Use', values: ['None'] }]);
  });
});

describe('getRights', () => {
  it('gets the license data for a IIIF v2 manifest', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      license: 'http://example.com',
    };
    const state = { manifests: { x: { json: manifest } } };
    const received = getRights(state, { manifestId: 'x' });
    expect(received).toEqual(['http://example.com']);
  });
  it('gets the rights data for a IIIF v3 manifest', () => {
    const manifest = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@id':
       'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
      '@type': 'sc:Manifest',
      license: 'http://example.com',
    };
    const state = { manifests: { x: { json: manifest } } };
    const received = getRights(state, { manifestId: 'x' });
    expect(received).toEqual(['http://example.com']);
  });
});

describe('getManifestSearchService', () => {
  it('gets from the manifest', () => {
    const state = { manifests: { x: { json: manifestFixtureFg165hz3589 } } };
    expect(getManifestSearchService(state, { manifestId: 'x' }).id).toEqual('https://contentsearch.stanford.edu/fg165hz3589/search');
  });

  it('supports v1 of the search spec', () => {
    const v1 = structuredClone(manifestFixtureFg165hz3589);
    v1.service[0].profile = 'http://iiif.io/api/search/1/search';
    const state = { manifests: { x: { json: v1 } } };
    expect(getManifestSearchService(state, { manifestId: 'x' }).id).toEqual('https://contentsearch.stanford.edu/fg165hz3589/search');
  });

  it('is null if no search service is specified', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    expect(getManifestSearchService(state, { manifestId: 'x' })).toBeNull();
  });
});

describe('getManifestAutocompleteService', () => {
  it('gets from the manifest', () => {
    const state = { manifests: { x: { json: manifestFixtureFg165hz3589 } } };
    expect(getManifestAutocompleteService(state, { manifestId: 'x' }).id).toEqual('https://contentsearch.stanford.edu/fg165hz3589/autocomplete');
  });

  it('supports v1 of the search spec', () => {
    const v1 = structuredClone(manifestFixtureFg165hz3589);
    v1.service[0].profile = 'http://iiif.io/api/search/1/search';
    v1.service[0].service.profile = 'http://iiif.io/api/search/1/autocomplete';
    const state = { manifests: { x: { json: v1 } } };
    expect(getManifestAutocompleteService(state, { manifestId: 'x' }).id).toEqual('https://contentsearch.stanford.edu/fg165hz3589/autocomplete');
  });

  it('is null if no search service is specified', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    expect(getManifestAutocompleteService(state, { manifestId: 'x' })).toBeNull();
  });
});

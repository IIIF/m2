import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture015 from '../../fixtures/version-2/015.json';
import manifestFixture2017498721 from '../../fixtures/version-2/2017498721.json';
import manifestFixturev3001 from '../../fixtures/version-3/001.json';
import manifestFixture019 from '../../fixtures/version-2/019.json';
import manifestFixtureGau from '../../fixtures/version-2/gau.json';
import {
  getCanvasIndex,
  getSequences,
  getSequence,
  getSequenceViewingHint,
  getSequenceViewingDirection,
  getSequenceBehaviors,
} from '../../../src/state/selectors/sequences';

describe('getSequences', () => {
  describe('with a v2 manifest', () => {
    it('works', () => {
      const state = { manifests: { x: { json: manifestFixtureGau } } };
      const sequences = getSequences(state, { manifestId: 'x' });
      expect(sequences.length).toEqual(2);
      expect(sequences.map(s => s.id)).toEqual([
        'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1740.json',
        'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json',
      ]);
    });
  });
  describe('with a v2 manifest with top ranges', () => {
    it('works', () => {
      const manifest = {
        ...manifestFixture001,
        structures: [
          { id: 'a', type: 'sc:Range', viewingHint: 'top' },
          { id: 'b', type: 'sc:Range', viewingHint: 'top' },
          { id: 'a1' },
        ],
      };
      const state = { manifests: { x: { json: manifest } } };
      const sequences = getSequences(state, { manifestId: 'x' });
      expect(sequences.length).toEqual(1);
      expect(sequences.map(s => s.id)).toEqual(['https://iiif.bodleian.ox.ac.uk/iiif/sequence/9cca8fdd-4a61-4429-8ac1-f648764b4d6d_default.json']);
    });
  });
  describe('with a v3 manifest', () => {
    it('works', () => {
      const manifest = {
        ...manifestFixturev3001,
        structures: [
          { behavior: ['sequence', 'individuals'], id: 'a', type: 'Range' },
          { behavior: 'sequence', id: 'b', type: 'Range' },
          { id: 'a1', type: 'Range' },
        ],
      };
      const state = { manifests: { x: { json: manifest } } };
      const sequences = getSequences(state, { manifestId: 'x' });
      expect(sequences.length).toEqual(3);
      expect(sequences.map(s => s.id)).toEqual([undefined, 'a', 'b']);
    });
  });
});

describe('getSequence', () => {
  it('defaults to the first sequence', () => {
    const state = { manifests: { x: { json: manifestFixtureGau } } };
    const sequence = getSequence(state, { manifestId: 'x' });
    expect(sequence.id).toEqual(
      'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1740.json',
    );
  });
  it('picks the sequence selected by the window', () => {
    const state = {
      manifests: { x: { json: manifestFixtureGau } },
      windows: { a: { manifestId: 'x', sequenceId: 'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json' } },
    };
    const sequence = getSequence(state, { windowId: 'a' });
    expect(sequence.id).toEqual(
      'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json',
    );
  });
  it('picks the sequences with an explicit sequenceId', () => {
    const state = { manifests: { x: { json: manifestFixtureGau } } };
    const sequence = getSequence(state, { manifestId: 'x', sequenceId: 'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json' });
    expect(sequence.id).toEqual(
      'https://www.e-codices.unifr.ch/metadata/iiif/gau-Fragment/sequence/Sequence-1741.json',
    );
  });
});

describe('getCanvasIndex', () => {
  it('returns the current canvasIndex for the window', () => {
    const state = {
      manifests: {
        y: { json: { ...manifestFixture015 } },
      },
      windows: {
        a: { canvasId: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/15/c2.json', manifestId: 'y' },
      },
    };

    expect(getCanvasIndex(state, { windowId: 'a' })).toEqual(1);
  });
  it('defaults to the first canvas', () => {
    expect(getCanvasIndex({}, {})).toEqual(0);
  });
});

describe('getSequenceViewingHint', () => {
  it('gets from the manifest', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    expect(getSequenceViewingHint(state, { manifestId: 'x' })).toEqual('individuals');
  });

  it('gets from the manifest if this is no sequence', () => {
    const state = { manifests: { x: { json: manifestFixture2017498721 } } };
    expect(getSequenceViewingHint(state, { manifestId: 'x' })).toEqual('paged');
  });

  it('gets from the sequence', () => {
    const state = { manifests: { x: { json: manifestFixture015 } } };
    expect(getSequenceViewingHint(state, { manifestId: 'x' })).toEqual('paged');
  });

  it('is null if no viewingHint is specified', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    expect(getSequenceViewingHint(state, { manifestId: 'x' })).toBeNull();
  });
});

describe('getSequenceViewingDirection', () => {
  it('gets from the manifest', () => {
    const state = { manifests: { x: { json: manifestFixture001 } } };
    expect(getSequenceViewingDirection(state, { manifestId: 'x' })).toEqual('left-to-right');
  });

  it('gets from the sequence', () => {
    const state = { manifests: { x: { json: manifestFixture015 } } };
    expect(getSequenceViewingDirection(state, { manifestId: 'x' })).toEqual('left-to-right');
  });

  it('is null if no viewingDirection is specified', () => {
    const state = { manifests: { x: { json: manifestFixture019 } } };
    expect(getSequenceViewingDirection(state, { manifestId: 'x' })).toBeNull();
  });
});

describe('getSequenceBehaviors', () => {
  it('gets from the manifest', () => {
    const state = { manifests: { x: { json: manifestFixturev3001 } } };
    expect(getSequenceBehaviors(state, { manifestId: 'x' })).toEqual(['individuals']);
  });
});

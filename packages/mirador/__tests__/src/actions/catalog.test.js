import * as actions from '../../../src/state/actions';

describe('addResource', () => {
  it('dispatches ADD_RESOURCE', () => {
    expect(actions.addResource('https://purl.stanford.edu/sn904cj3429/iiif/manifest')).toEqual({
      manifestId: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
      type: 'mirador/ADD_RESOURCE',
    });
  });

  it('dispatches ADD_RESOURCE with the manifest and payload', () => {
    expect(actions.addResource(
      'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
      { id: 'x' },
      { provider: 'file' },
    )).toEqual({
      manifestId: 'https://purl.stanford.edu/sn904cj3429/iiif/manifest',
      manifestJson: { id: 'x' },
      payload: { provider: 'file' },
      type: 'mirador/ADD_RESOURCE',
    });
  });
});

describe('removeResource', () => {
  it('dispatches REMOVE_RESOURCE', () => {
    expect(actions.removeResource('some-url')).toEqual({
      manifestId: 'some-url',
      type: 'mirador/REMOVE_RESOURCE',
    });
  });
});

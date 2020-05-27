import { call, select } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import {
  fetchAnnotation,
  fetchManifest,
  fetchSearchResponse,
  fetchInfoResponse,
  refetchInfoResponses,
  fetchResourceManifest,
} from '../../../src/state/sagas/iiif';
import {
  getConfig,
  getManifests,
  selectInfoResponse,
  getAccessTokens,
} from '../../../src/state/selectors';

describe('IIIF sagas', () => {
  describe('fetchManifest', () => {
    it('fetches a IIIF manifest', () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchManifest, action)
        .provide([
          [select(getConfig), {}],
        ])
        .put({
          manifestId: 'manifestId',
          manifestJson: { data: '12345' },
          type: 'mirador/RECEIVE_MANIFEST',
        })
        .run();
    });

    it('handles failures', () => {
      fetch.mockResponseOnce('<h1>Not Json</h1>');
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchManifest, action)
        .provide([
          [select(getConfig), {}],
        ])
        .put.actionType('mirador/RECEIVE_MANIFEST_FAILURE')
        .run();
    });
  });

  describe('fetchInfoResponse', () => {
    it('fetches a IIIF info response', () => {
      fetch.mockResponseOnce(JSON.stringify({ id: 'infoId' }));
      const action = {
        imageResource: {},
        infoId: 'infoId',
      };

      return expectSaga(fetchInfoResponse, action)
        .put({
          infoId: 'infoId',
          infoJson: { id: 'infoId' },
          ok: true,
          tokenServiceId: undefined,
          type: 'mirador/RECEIVE_INFO_RESPONSE',
        })
        .run();
    });

    it('retrieves any previous IIIF info response to try any applicable access tokens', () => {
      fetch.mockResponseOnce(JSON.stringify({ id: 'infoId' }));
      const action = {
        infoId: 'infoId',
      };
      const infoResponse = {
        id: 'degradedInfoId',
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.org/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': 'https://authentication.example.org/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };

      return expectSaga(fetchInfoResponse, action)
        .provide([
          [select(selectInfoResponse, { infoId: 'infoId' }), infoResponse],
          [select(getAccessTokens), { 'https://authentication.example.org/token': { id: 'x', json: { accessToken: '123' } } }],
        ])
        .put({
          infoId: 'infoId',
          infoJson: { id: 'infoId' },
          ok: true,
          tokenServiceId: 'x',
          type: 'mirador/RECEIVE_INFO_RESPONSE',
        })
        .run();
    });

    it('handles failed requests', () => {
      fetch.mockResponseOnce('<h1>Not Found</h1>');
      const action = {
        imageResource: {},
        infoId: 'infoId',
      };

      return expectSaga(fetchInfoResponse, action)
        .put.actionType('mirador/RECEIVE_INFO_RESPONSE_FAILURE')
        .run();
    });
    it('handles degraded requests', () => {
      fetch.mockResponseOnce(JSON.stringify({ id: 'otherInfoId' }));
      const action = {
        imageResource: {},
        infoId: 'infoId',
      };

      return expectSaga(fetchInfoResponse, action)
        .put({
          infoId: 'infoId',
          infoJson: { id: 'otherInfoId' },
          ok: true,
          tokenServiceId: undefined,
          type: 'mirador/RECEIVE_DEGRADED_INFO_RESPONSE',
        })
        .run();
    });

    it('rerequests documents if the authoritative response suggests a different access token service', () => {
      const degradedInfoResponse = {
        id: 'degradedInfoId',
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.org/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': 'https://authentication.example.org/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      fetch.once(JSON.stringify(degradedInfoResponse)).once(JSON.stringify({ id: 'infoId' }));
      const action = {
        imageResource: {},
        infoId: 'infoId',
      };

      return expectSaga(fetchInfoResponse, action)
        .provide([
          [select(selectInfoResponse, { infoId: 'infoId' }), undefined],
          [select(getAccessTokens), { 'https://authentication.example.org/token': { id: 'x', json: { accessToken: '123' } } }],
        ])
        .put({
          infoId: 'infoId',
          infoJson: { id: 'infoId' },
          ok: true,
          tokenServiceId: 'x',
          type: 'mirador/RECEIVE_INFO_RESPONSE',
        })
        .run();
    });
  });

  describe('refetchInfoResponses', () => {
    it('refetches info responses when a new access token is available', () => {
      const serviceId = 'serviceId';
      const tokenService = { id: serviceId, infoIds: ['x', 'y'] };

      testSaga(refetchInfoResponses, { serviceId })
        .next()
        .select(getAccessTokens)
        .next({ serviceId: tokenService })
        .all([
          call(fetchInfoResponse, { imageId: 'x', tokenService }),
          call(fetchInfoResponse, { imageId: 'y', tokenService }),
        ])
        .next()
        .put({ serviceId, type: 'mirador/CLEAR_ACCESS_TOKEN_QUEUE' });
    });
  });

  describe('fetchSearchResponse', () => {
    it('fetches a IIIF search', () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));
      const action = {
        companionWindowId: 'companionWindowId',
        query: 'q',
        searchId: 'searchId',
        windowId: 'windowId',
      };

      return expectSaga(fetchSearchResponse, action)
        .put({
          companionWindowId: 'companionWindowId',
          searchId: 'searchId',
          searchJson: { data: '12345' },
          type: 'mirador/RECEIVE_SEARCH',
          windowId: 'windowId',
        })
        .run();
    });

    it('handles failures', () => {
      fetch.mockResponseOnce('<h1>Not Json</h1>');
      const action = {
        companionWindowId: 'companionWindowId',
        query: 'q',
        searchId: 'searchId',
        windowId: 'windowId',
      };

      return expectSaga(fetchSearchResponse, action)
        .put.actionType('mirador/RECEIVE_SEARCH_FAILURE')
        .run();
    });
  });

  describe('fetchAnnotation', () => {
    it('fetches a IIIF annotation page', () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));
      const action = {
        annotationId: 'annotationId',
        targetId: 'targetId',
      };

      return expectSaga(fetchAnnotation, action)
        .put({
          annotationId: 'annotationId',
          annotationJson: { data: '12345' },
          targetId: 'targetId',
          type: 'mirador/RECEIVE_ANNOTATION',
        })
        .run();
    });

    it('handles failures', () => {
      fetch.mockResponseOnce('<h1>Not Json</h1>');
      const action = {
        annotationId: 'annotationId',
        targetId: 'targetId',
      };

      return expectSaga(fetchAnnotation, action)
        .put.actionType('mirador/RECEIVE_ANNOTATION_FAILURE')
        .run();
    });
  });

  describe('fetchResourceManifest', () => {
    it('eagerly fetches the manifest for a resource', () => {
      fetch.mockResponseOnce(JSON.stringify({ data: '12345' }));
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchResourceManifest, action)
        .provide([
          [select(getConfig), {}],
          [select(getManifests), {}],
        ])
        .put({
          manifestId: 'manifestId',
          manifestJson: { data: '12345' },
          type: 'mirador/RECEIVE_MANIFEST',
        })
        .run();
    });
    it('does nothing if the manifest is already present', () => {
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchResourceManifest, action)
        .provide([
          [select(getConfig), {}],
          [select(getManifests), { manifestId: {} }],
        ])
        .run().then(({ allEffects }) => allEffects.length === 0);
    });
  });
});

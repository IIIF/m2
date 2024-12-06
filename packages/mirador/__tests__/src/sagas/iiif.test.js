import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import {
  fetchAnnotation,
  fetchManifest,
  fetchSearchResponse,
  fetchInfoResponse,
  fetchResourceManifest,
} from '../../../src/state/sagas/iiif';
import {
  getConfig,
  getManifests,
  selectInfoResponse,
  getAccessTokens,
  getRequestsConfig,
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

    it('supports request configuration preprocessors', () => {
      fetch.once(req => Promise.resolve(JSON.stringify({ data: req.headers.get('customheader') })));
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchManifest, action)
        .provide([
          [select(getRequestsConfig), {
            preprocessors: [
              (url, options) => ({ ...options, headers: { CustomHeader: 'config injected' } }),
            ],
          }],
        ])
        .put({
          manifestId: 'manifestId',
          manifestJson: { data: 'config injected' },
          type: 'mirador/RECEIVE_MANIFEST',
        })
        .run();
    });

    it('supports response postprocessors', () => {
      fetch.once(req => Promise.resolve(JSON.stringify({ data: req.headers.get('customheader') })));
      const action = {
        manifestId: 'manifestId',
      };

      return expectSaga(fetchManifest, action)
        .provide([
          [select(getRequestsConfig), {
            postprocessors: [
              (url, responseAction) => {
                responseAction.manifestJson = { foo: 'modified!' }; // eslint-disable-line no-param-reassign
              },
            ],
          }],
        ])
        .put({
          manifestId: 'manifestId',
          manifestJson: { foo: 'modified!' },
          type: 'mirador/RECEIVE_MANIFEST',
        })
        .run();
    });
  });

  describe('fetchInfoResponse', () => {
    it('fetches a IIIF info response', () => {
      fetch.mockResponseOnce(JSON.stringify({ id: 'http://server/prefix/infoId' }));
      const action = {
        imageResource: {},
        infoId: 'http://server/prefix/infoId',
      };

      return expectSaga(fetchInfoResponse, action)
        .put({
          infoId: 'http://server/prefix/infoId',
          infoJson: { id: 'http://server/prefix/infoId' },
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
        windowId: 'window',
      };

      return expectSaga(fetchInfoResponse, action)
        .put({
          infoId: 'infoId',
          infoJson: { id: 'otherInfoId' },
          ok: true,
          tokenServiceId: undefined,
          type: 'mirador/RECEIVE_DEGRADED_INFO_RESPONSE',
          windowId: 'window',
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

    it('receives existing manifest data from the action', () => {
      const manifestJson = { data: '12345' };

      const action = {
        manifestId: 'manifestId',
        manifestJson,
      };

      return expectSaga(fetchResourceManifest, action)
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

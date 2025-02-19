import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { Utils } from 'manifesto.js';
import serviceFixture from '../../fixtures/version-2/canvasService.json';
import settings from '../../../src/config/settings';
import ActionTypes from '../../../src/state/actions/action-types';
import {
  refetchInfoResponses,
  refetchInfoResponsesOnLogout,
  doAuthWorkflow,
  rerequestOnAccessTokenFailure,
  invalidateInvalidAuth,
} from '../../../src/state/sagas/auth';
import {
  fetchInfoResponse,
} from '../../../src/state/sagas/iiif';
import {
  getAccessTokens,
  getWindows,
  selectInfoResponses,
  getVisibleCanvases,
  getAuth,
  getConfig,
} from '../../../src/state/selectors';

describe('IIIF Authentication sagas', () => {
  describe('refetchInfoResponsesOnLogout', () => {
    it('delays and then refetches info responses', () => {
      const tokenServiceId = 'whatever';
      /** stub out delay... ugh. */
      const provideDelay = ({ fn }, next) => ((fn.name === 'delayP') ? null : next());

      return expectSaga(refetchInfoResponsesOnLogout, { tokenServiceId })
        .provide([
          { call: provideDelay },
          [call(refetchInfoResponses, { serviceId: tokenServiceId }), {}],
        ])
        .call(refetchInfoResponses, { serviceId: tokenServiceId })
        .run();
    });
  });
  describe('refetchInfoResponses', () => {
    it('discards info responses that could hvae used the new access token', () => {
      const serviceId = 'https://authentication.example.org/token';
      const tokenService = { id: serviceId };

      const authStanza = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.org/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': serviceId,
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };

      const x = {
        id: 'x',
        json: {
          ...authStanza,
        },
      };

      const y = {
        id: 'y',
        json: {
          ...authStanza,
        },
      };

      return expectSaga(refetchInfoResponses, { serviceId })
        .provide([
          [select(getAccessTokens), { [serviceId]: tokenService }],
          [select(getWindows), {}],
          [select(selectInfoResponses), { x, y }],
        ])
        .put({ infoId: 'x', type: ActionTypes.REMOVE_INFO_RESPONSE })
        .put({ infoId: 'y', type: ActionTypes.REMOVE_INFO_RESPONSE })
        .run();
    });

    it('ignores info responses that would not use the token', () => {
      const serviceId = 'https://authentication.example.org/token';
      const tokenService = { id: serviceId };

      const authStanza = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.org/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': 'https://authentication.example.org/some-other-token-service',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };

      const wrongService = {
        id: 'wrongService',
        json: {
          ...authStanza,
        },
      };

      const noAuth = {
        id: 'noAuth',
        json: {},
      };

      const noJson = {
        id: 'noJson',
      };

      return expectSaga(refetchInfoResponses, { serviceId })
        .provide([
          [select(getAccessTokens), { [serviceId]: tokenService }],
          [select(getWindows), {}],
          [select(selectInfoResponses), { noAuth, noJson, wrongService }],
        ])
        .not.put({ infoId: 'noAuth', type: ActionTypes.REMOVE_INFO_RESPONSE })
        .not.put({ infoId: 'noJson', type: ActionTypes.REMOVE_INFO_RESPONSE })
        .not.put({ infoId: 'wrongService', type: ActionTypes.REMOVE_INFO_RESPONSE })
        .run();
    });

    it('re-requests info responses for visible canvases', () => {
      const serviceId = 'https://authentication.example.org/token';
      const tokenService = { id: serviceId };

      const authStanza = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.org/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': serviceId,
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };

      const window = {};
      const canvases = [
        Utils.parseManifest(serviceFixture).getSequences()[0].getCanvases()[0],
      ];

      const iiifInfoId = 'https://api.digitale-sammlungen.de/iiif/image/v2/bsb00122140_00001';
      const infoResponse = {
        id: iiifInfoId,
        json: {
          ...authStanza,
        },
      };

      return expectSaga(refetchInfoResponses, { serviceId })
        .provide([
          [select(getAccessTokens), { [serviceId]: tokenService }],
          [select(getWindows), { window }],
          [select(getVisibleCanvases, { windowId: 'window' }), canvases],
          [select(selectInfoResponses), { [iiifInfoId]: infoResponse }],
          [call(fetchInfoResponse, { infoId: iiifInfoId }), {}],
        ])
        .call(fetchInfoResponse, { infoId: iiifInfoId })
        .run();
    });
  });
  describe('doAuthWorkflow', () => {
    it('kicks off the first external auth from the info.json', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/external',
          profile: 'http://iiif.io/api/auth/1/external',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      return expectSaga(doAuthWorkflow, { infoJson, windowId })
        .provide([
          [select(getAuth), {}],
          [select(getConfig), { auth: settings.auth }],
        ])
        .put({
          id: 'https://authentication.example.com/external',
          tokenServiceId: 'https://authentication.example.com/token',
          type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
        })
        .put({
          authId: 'https://authentication.example.com/external',
          serviceId: 'https://authentication.example.com/token',
          type: ActionTypes.REQUEST_ACCESS_TOKEN,
        })
        .run();
    });

    it('does nothing if the auth service has been tried already', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/external',
          profile: 'http://iiif.io/api/auth/1/external',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      return expectSaga(doAuthWorkflow, { infoJson, windowId })
        .provide([
          [select(getAuth), { 'https://authentication.example.com/external': { ok: false } }],
          [select(getConfig), { auth: settings.auth }],
        ])
        .not.put.like({ type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST })
        .not.put.like({ type: ActionTypes.REQUEST_ACCESS_TOKEN })
        .run();
    });

    it('does nothing if the auth service is "interactive"', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/login',
          profile: 'http://iiif.io/api/auth/1/login',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      return expectSaga(doAuthWorkflow, { infoJson, windowId })
        .provide([
          [select(getAuth), {}],
          [select(getConfig), { auth: settings.auth }],
        ])
        .not.put.like({ type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST })
        .not.put.like({ type: ActionTypes.REQUEST_ACCESS_TOKEN })
        .run();
    });

    it('kicks off the kiosk auth from the info.json', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/kiosk',
          profile: 'http://iiif.io/api/auth/1/kiosk',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      return expectSaga(doAuthWorkflow, { infoJson, windowId })
        .provide([
          [select(getAuth), {}],
          [select(getConfig), { auth: settings.auth }],
        ])
        .put({
          id: 'https://authentication.example.com/kiosk',
          profile: 'http://iiif.io/api/auth/1/kiosk',
          type: ActionTypes.ADD_AUTHENTICATION_REQUEST,
          windowId,
        })
        .run();
    });
  });

  describe('rerequestOnAccessTokenFailure', () => {
    it('does nothing if no access token was used', () => {
      const infoJson = {};
      const windowId = 'window';
      const tokenServiceId = undefined;
      return expectSaga(rerequestOnAccessTokenFailure, { infoJson, tokenServiceId, windowId })
        .provide([
          [select(getAccessTokens), {}],
        ])
        .not.put.like({ type: ActionTypes.REQUEST_ACCESS_TOKEN })
        .run();
    });

    it('does nothing if the access token has never worked', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/kiosk',
          profile: 'http://iiif.io/api/auth/1/kiosk',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      const tokenServiceId = 'https://authentication.example.com/token';
      return expectSaga(rerequestOnAccessTokenFailure, { infoJson, tokenServiceId, windowId })
        .provide([
          [select(getAccessTokens), { [tokenServiceId]: { success: false } }],
        ])
        .not.put.like({ type: ActionTypes.REQUEST_ACCESS_TOKEN })
        .run();
    });

    it('re-requests the access token if it might be reneweable', () => {
      const infoJson = {
        service: [{
          '@context': 'http://iiif.io/api/auth/1/context.json',
          '@id': 'https://authentication.example.com/kiosk',
          profile: 'http://iiif.io/api/auth/1/kiosk',
          service: [
            {
              '@id': 'https://authentication.example.com/token',
              profile: 'http://iiif.io/api/auth/1/token',
            },
          ],
        }],
      };
      const windowId = 'window';
      const tokenServiceId = 'https://authentication.example.com/token';
      return expectSaga(rerequestOnAccessTokenFailure, { infoJson, tokenServiceId, windowId })
        .provide([
          [select(getAccessTokens), { [tokenServiceId]: { success: true } }],
        ])
        .put({
          authId: 'https://authentication.example.com/kiosk',
          serviceId: 'https://authentication.example.com/token',
          type: ActionTypes.REQUEST_ACCESS_TOKEN,
        })
        .run();
    });
  });

  describe('invalidateInvalidAuth', () => {
    it('resets the auth service if the auth cookie might have expired', () => {
      const authId = 'authId';
      const serviceId = 'serviceId';

      return expectSaga(invalidateInvalidAuth, { serviceId })
        .provide([
          [select(getAccessTokens), { [serviceId]: { authId, id: serviceId, success: true } }],
          [select(getAuth), { [authId]: { id: authId } }],
        ])
        .put({
          id: authId,
          tokenServiceId: serviceId,
          type: ActionTypes.RESET_AUTHENTICATION_STATE,
        })
        .run();
    });

    it('marks the auth service as failed if the auth token was not successfully used', () => {
      const authId = 'authId';
      const serviceId = 'serviceId';

      return expectSaga(invalidateInvalidAuth, { serviceId })
        .provide([
          [select(getAccessTokens), { [serviceId]: { authId, id: serviceId } }],
          [select(getAuth), { [authId]: { id: authId } }],
        ])
        .put({
          id: authId,
          ok: false,
          tokenServiceId: serviceId,
          type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
        })
        .run();
    });
  });
});

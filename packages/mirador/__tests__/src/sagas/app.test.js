import { call } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';

import { importConfig, importState } from '../../../src/state/sagas/app';
import { fetchManifests } from '../../../src/state/sagas/iiif';
import { fetchWindowManifest } from '../../../src/state/sagas/windows';
import { addWindow } from '../../../src/state/actions';

describe('app-level sagas', () => {
  describe('importState', () => {
    it('calls into fetchWindowManifest for each window', () => {
      const action = {
        state: {
          manifests: [],
          windows: {
            x: { id: 'x', manifestId: 'url' },
            y: { id: 'y', manifestId: 'url2' },
          },
        },
      };

      testSaga(importState, action)
        .next()
        .all([
          call(fetchWindowManifest, { id: 'x', payload: { id: 'x', manifestId: 'url' } }),
          call(fetchWindowManifest, { id: 'y', payload: { id: 'y', manifestId: 'url2' } }),
        ]);
    });
    it('calls into fetchManifests for each manifest', () => {
      const action = {
        state: {
          manifests: { x: { id: 'x' } },
          windows: {},
        },
      };

      testSaga(importState, action)
        .next()
        .all([
          call(fetchManifests, 'x'),
        ]);
    });
    it('does not fetchManifest if the manifest json was provided', () => {
      const action = {
        state: {
          manifests: { x: { id: 'x', json: '{}' } },
          windows: {},
        },
      };

      testSaga(importState, action)
        .next()
        .all([]);
    });
  });

  describe('importConfig', () => {
    it('adds windows from the provided config', () => {
      const action = {
        config: {
          thumbnailNavigation: {},
          windows: [
            { id: 'x', manifestId: 'a' },
            { id: 'y', manifestId: 'b' },
          ],
        },
      };

      return expectSaga(importConfig, action)
        .provide([
          [call(addWindow, {
            id: 'x', manifestId: 'a', thumbnailNavigationPosition: undefined,
          }), { type: 'thunk1' }],
          [call(addWindow, {
            id: 'y', manifestId: 'b', thumbnailNavigationPosition: undefined,
          }), { type: 'thunk2' }],
        ])
        .put({ type: 'thunk1' })
        .put({ type: 'thunk2' })
        .run();
    });
  });
});

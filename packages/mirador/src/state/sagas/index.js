import {
  all, call, spawn,
} from 'redux-saga/effects';

import appSaga from './app';
import iiifSaga from './iiif';
import windowSaga from './windows';
import annotationsSaga from './annotations';
import authSaga from './auth';

/** */
function* launchSaga(saga) {
  while (true) {
    try {
      yield call(saga);
      break;
    } catch (e) {
      console.log(e);
    }
  }
}

/** */
function getRootSaga(pluginSagas = []) {
  return function* rootSaga() {
    const sagas = [
      annotationsSaga,
      appSaga,
      iiifSaga,
      windowSaga,
      authSaga,
      ...pluginSagas,
    ];

    yield all(sagas.map(saga => spawn(launchSaga, saga)));
  };
}

export default getRootSaga;

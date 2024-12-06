import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupIntersectionMocking } from 'react-intersection-observer/test-utils';
import i18next from 'i18next';
import createFetchMock from 'vitest-fetch-mock';
import en from './src/locales/en/translation.json';

// vitest doesn't set a default
window.origin = 'http://localhost';

vi.setConfig({ testTimeout: 10_000 });
const fetchMocker = createFetchMock(vi);

// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
beforeEach((context) => {
  if (context.task.file.name.includes('/integration')) {
    fetchMocker.disableMocks();
  } else {
    // sets globalThis.fetch and globalThis.fetchMock to our mocked version
    fetchMocker.enableMocks();
  }
});

/** */
class Path2D {

}

global.Path2D = Path2D;

setupIntersectionMocking(vi.fn);

i18next.init({
  lng: 'en',
  resources: {
    en,
  },
});

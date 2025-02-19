import { act, render, screen } from '@tests/utils/test-utils';
import MiradorViewer from '../../../src/lib/MiradorViewer';

/** */
const DummyPlugin = () => <div data-testid="plugin">Plugin</div>;

describe('MiradorViewer', () => {
  let container;
  beforeEach(async () => {
    render(<div id="mirador" data-testid="container" />);
    container = await screen.findByTestId('container');
  });

  describe('constructor', () => {
    it('returns viewer store', () => {
      const instance = new MiradorViewer({});

      act(() => { instance.renderInto(container); }); // eslint-disable-line testing-library/no-unnecessary-act
      expect(instance.store.dispatch).toBeDefined();
    });
    it('renders via ReactDOM', () => {
      const instance = new MiradorViewer({});

      act(() => { instance.renderInto(container); }); // eslint-disable-line testing-library/no-unnecessary-act

      expect(screen.getByTestId('container')).not.toBeEmptyDOMElement();
    });
  });
  describe('processConfig', () => {
    it('transforms config values to actions to dispatch to store', () => {
      const instance = new MiradorViewer(
        {
          catalog: [
            { manifestId: 'http://media.nga.gov/public/manifests/nga_highlights.json', provider: 'National Gallery of Art' },
          ],
          windows: [
            {
              canvasId: 'https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174892',
              loadedManifest: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
              thumbnailNavigationPosition: 'far-bottom',
            },
            {
              loadedManifest: 'https://iiif.harvardartmuseums.org/manifests/object/299843',
              view: 'book',
            },
          ],
        },
        {
          plugins: [{
            component: DummyPlugin,
            config: {
              foo: 'bar',
            },
            mode: 'add',
            target: 'WindowTopBarPluginArea',
          }],
        },
      );

      act(() => { instance.renderInto(container); }); // eslint-disable-line testing-library/no-unnecessary-act

      const { windows, catalog, config } = instance.store.getState();
      const windowIds = Object.keys(windows);
      expect(Object.keys(windowIds).length).toBe(2);
      expect(windows[windowIds[0]].canvasId).toBe('https://iiif.harvardartmuseums.org/manifests/object/299843/canvas/canvas-47174892');
      expect(windows[windowIds[1]].canvasId).toBe(undefined);
      expect(windows[windowIds[0]].thumbnailNavigationPosition).toBe('far-bottom');
      expect(windows[windowIds[1]].thumbnailNavigationPosition).toBe(undefined);
      expect(windows[windowIds[0]].view).toBe(undefined);
      expect(windows[windowIds[1]].view).toBe('book');

      expect(catalog.length).toBe(2);
      expect(catalog[0].manifestId).toBe('https://iiif.harvardartmuseums.org/manifests/object/299843');
      expect(catalog[1].manifestId).toBe('http://media.nga.gov/public/manifests/nga_highlights.json');
      expect(catalog[1].provider).toBe('National Gallery of Art');
      expect(config.foo).toBe('bar');
    });

    it('merges translation configs from multiple plugins', () => {
      const instance = new MiradorViewer(
        {},
        {
          plugins: [
            {
              component: DummyPlugin,
              config: {
                translations: {
                  en: {
                    foo: 'bar',
                  },
                },
              },
              mode: 'add',
              target: 'WindowTopBarPluginArea',
            },
            {
              component: DummyPlugin,
              config: {
                translations: {
                  en: {
                    bat: 'bar',
                  },
                },
              },
              mode: 'wrap',
              target: 'Window',
            },
          ],
        },
      );

      const { config } = instance.store.getState();

      expect(config.translations.en).toEqual(expect.objectContaining({
        bat: 'bar',
        foo: 'bar',
      }));
    });
  });

  describe('render', () => {
    it('passes props through to the App component', async () => {
      const instance = new MiradorViewer({});
      const plugins = [{
        component: DummyPlugin,
        mode: 'wrap',
        target: 'AppProviders',
      }];

      render(instance.render({ plugins }));

      expect(await screen.findByTestId('plugin')).toBeInTheDocument();
    });
  });

  describe('unmount', () => {
    it('unmounts via ReactDOM', () => {
      const instance = new MiradorViewer({});

      act(() => { instance.renderInto(container); }); // eslint-disable-line testing-library/no-unnecessary-act
      expect(container).not.toBeEmptyDOMElement();
      act(() => { instance.unmount(); });
      expect(container).toBeEmptyDOMElement();
    });
  });
});

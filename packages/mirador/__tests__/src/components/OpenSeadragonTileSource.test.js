import { act, render } from '@tests/utils/test-utils';
import TileSource from '../../../src/components/OpenSeadragonTileSource';
import OpenSeadragonViewerContext from '../../../src/contexts/OpenSeadragonViewerContext';

describe('OpenSeadragonTileSource', () => {
  it('calls addTiledImage with the tile source', () => {
    const viewer = {
      addTiledImage: vi.fn(),
    };
    const ref = { current: viewer };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    render(
      <OpenSeadragonViewerContext.Provider value={ref}>
        <TileSource tileSource={tileSource} />
      </OpenSeadragonViewerContext.Provider>,
    );

    expect(viewer.addTiledImage).toHaveBeenCalledWith(expect.objectContaining({ tileSource }));
  });

  it('updates the opacity when the prop changes', async () => {
    const mockOsdItem = { setOpacity: vi.fn() };
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => { success({ item: mockOsdItem }); }),
      world: {
        removeItem: vi.fn(),
      },
    };
    const ref = { current: viewer };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = render(
      <OpenSeadragonViewerContext.Provider value={ref}>
        <TileSource tileSource={tileSource} />
      </OpenSeadragonViewerContext.Provider>,
    );
    await act(async () => { // eslint-disable-line testing-library/no-unnecessary-act
      rerender(
        <OpenSeadragonViewerContext.Provider value={ref}>
          <TileSource tileSource={tileSource} opacity={0.5} />
        </OpenSeadragonViewerContext.Provider>,
      );
    });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(mockOsdItem.setOpacity).toHaveBeenCalledWith(0.5);
  });

  it('updates the index when the prop changes', async () => {
    const mockOsdItem = vi.fn();
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => { success({ item: mockOsdItem }); }),
      world: {
        removeItem: vi.fn(),
        setItemIndex: vi.fn(),
      },
    };

    const ref = { current: viewer };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = render(
      <OpenSeadragonViewerContext.Provider value={ref}>
        <TileSource tileSource={tileSource} />
      </OpenSeadragonViewerContext.Provider>,
    );
    await act(async () => { // eslint-disable-line testing-library/no-unnecessary-act
      rerender(
        <OpenSeadragonViewerContext.Provider value={ref}>
          <TileSource tileSource={tileSource} index={5} />
        </OpenSeadragonViewerContext.Provider>,
      );
    });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(viewer.world.setItemIndex).toHaveBeenCalledWith(mockOsdItem, 5);
  });

  it('updates the rendered bounds when the prop changes', async () => {
    const mockOsdItem = { fitBounds: vi.fn() };
    const viewer = {
      addTiledImage: vi.fn().mockImplementation(({ success }) => { success({ item: mockOsdItem }); }),
      world: {
        removeItem: vi.fn(),
        setItemIndex: vi.fn(),
      },
    };

    const ref = { current: viewer };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = render(
      <OpenSeadragonViewerContext.Provider value={ref}>
        <TileSource tileSource={tileSource} />
      </OpenSeadragonViewerContext.Provider>,
    );
    await act(async () => { // eslint-disable-line testing-library/no-unnecessary-act
      rerender(
        <OpenSeadragonViewerContext.Provider value={ref}>
          <TileSource tileSource={tileSource} fitBounds={[0, 0, 10, 10]} />
        </OpenSeadragonViewerContext.Provider>,
      );
    });

    expect(viewer.addTiledImage).toHaveBeenCalledTimes(1);
    expect(mockOsdItem.fitBounds).toHaveBeenCalled();
  });

  it('deletes the item from the world when the item is unmounted', async () => {
    const mockOsdItem = vi.fn();
    const viewer = {
      addTiledImage: ({ success }) => { success({ item: mockOsdItem }); },
      world: {
        removeItem: vi.fn(),
      },
    };
    const ref = { current: viewer };
    const tileSource = { '@id': 'http://example.com/image/info.json' };

    const { rerender } = render(
      <OpenSeadragonViewerContext.Provider value={ref}>
        <TileSource tileSource={tileSource} />
      </OpenSeadragonViewerContext.Provider>,
    );

    await act(async () => { // eslint-disable-line testing-library/no-unnecessary-act
      rerender(
        <OpenSeadragonViewerContext.Provider value={ref} />,
      );
    });

    expect(viewer.world.removeItem).toHaveBeenCalledWith(mockOsdItem);
  });
});

import { handleDrop } from '../../../src/components/IIIFDropTarget';

const monitor = vi.fn();

// jsdom doesn't load images, so we mock an implementation
vi.mock('../../../src/lib/readImageMetadata', () => ({
  readImageMetadata: file => Promise.resolve({
    height: 105, name: file.name, type: file.type, url: 'data:blah', width: 100,
  }),
}));

describe('handleDrop', () => {
  let onDrop;

  beforeEach(() => {
    onDrop = vi.fn();
  });

  it('handles url lists', () => {
    const item = {
      urls: [
        'http://example.com/?manifest=http://example.com/iiif/1.json',
        'http://example.com/?manifest=http://example.com/iiif/2.json&canvas=url',
      ],
    };
    const props = { onDrop };

    handleDrop(item, monitor, props);
    expect(onDrop).toHaveBeenCalledWith({ canvasId: null, manifestId: 'http://example.com/iiif/1.json' }, props, monitor);
    expect(onDrop).toHaveBeenCalledWith({ canvasId: 'url', manifestId: 'http://example.com/iiif/2.json' }, props, monitor);
  });

  it('handles manifests', () => {
    const file = new File(['{ "data": 123 }'], 'manifest.json', { type: 'application/json' });
    const item = {
      files: [
        file,
      ],
    };

    const props = { onDrop };

    const promise = handleDrop(item, monitor, props);

    return promise.then(() => {
      expect(onDrop).toHaveBeenCalledWith(
        expect.objectContaining({ manifestJson: '{ "data": 123 }' }),
        props,
        monitor,
      );
    });
  });

  it('handles images by fabricating a temporary manifest', () => {
    const file = new File(['image data'], 'image.gif', { type: 'image/gif' });
    const item = {
      files: [
        file,
      ],
    };

    const props = { onDrop };

    const promise = handleDrop(item, monitor, props);

    return promise.then(() => {
      expect(onDrop).toHaveBeenCalledWith(
        expect.objectContaining({
          manifestJson: expect.objectContaining({
            items: [
              expect.objectContaining({
                items: [
                  expect.objectContaining({
                    items: [
                      expect.objectContaining({
                        body: {
                          format: 'image/gif', id: 'data:blah', type: 'Image',
                        },
                        height: 105,
                        width: 100,
                      }),
                    ],
                    type: 'AnnotationPage',
                  }),
                ],
                type: 'Canvas',
              }),
            ],
            type: 'Manifest',
          }),
        }),
        props,
        monitor,
      );
    });
  });
});

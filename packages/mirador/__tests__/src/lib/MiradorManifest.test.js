import { Utils } from 'manifesto.js';
import MiradorManifest from '../../../src/lib/MiradorManifest';

/** */
function getSubject(manifest) {
  return new MiradorManifest(Utils.parseManifest(manifest));
}

describe('MiradorCanvas', () => {
  describe('startCanvas', () => {
    it('gets the startCanvas index for a IIIF v2 manifest', () => {
      const manifest = {
        '@context': 'http://iiif.io/api/presentation/2/context.json',
        '@id':
         'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
        '@type': 'sc:Manifest',
        sequences: [{
          canvases: [
            {
              '@id': 'http://example.com/1',
            },
            {
              '@id': 'http://example.com/2',
            },
          ],
          startCanvas: 'http://example.com/2',
        }],
      };
      expect(getSubject(manifest).startCanvas.id).toEqual('http://example.com/2');
    });

    it('gets the start data for a IIIF v3 manifest', () => {
      const manifest = {
        '@context': 'http://iiif.io/api/presentation/2/context.json',
        '@id':
         'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
        '@type': 'sc:Manifest',
        sequences: [{
          canvases: [
            {
              '@id': 'http://example.com/1',
            },
            {
              '@id': 'http://example.com/2',
            },
          ],
        }],
        start: { source: 'http://example.com/2' },
      };
      expect(getSubject(manifest).startCanvas.id).toEqual('http://example.com/2');
    });
  });

  describe('canvasAt', () => {
    it('gets the canvas at the specified index', () => {
      const manifest = {
        '@context': 'http://iiif.io/api/presentation/2/context.json',
        '@id':
         'http://iiif.io/api/presentation/2.1/example/fixtures/19/manifest.json',
        '@type': 'sc:Manifest',
        sequences: [{
          canvases: [
            {
              '@id': 'http://example.com/1',
            },
            {
              '@id': 'http://example.com/2',
            },
          ],
          startCanvas: 'http://example.com/2',
        }],
      };
      expect(getSubject(manifest).canvasAt(1).id).toEqual('http://example.com/2');
    });
  });
});

import { Utils } from 'manifesto.js';
import fixture from '../../fixtures/version-2/019.json';
import fragmentFixture from '../../fixtures/version-2/hamilton.json';
import CanvasWorld from '../../../src/lib/CanvasWorld';

const canvases = Utils.parseManifest(fixture).getSequences()[0].getCanvases();
const canvasSubset = [canvases[1], canvases[2]];

describe('CanvasWorld', () => {
  describe('constructor', () => {
    it('sets canvases', () => {
      expect(new CanvasWorld([1]).canvases.map(c => c.canvas)).toEqual([1]);
    });
  });
  describe('hasDimensions', () => {
    it('is true if we can calculate the canvas world dimensions', () => {
      expect(new CanvasWorld([canvases[1]]).hasDimensions()).toEqual(true);
      expect(new CanvasWorld([]).hasDimensions()).toEqual(false);
    });
  });
  describe('worldBounds', () => {
    it('calculates a world bounds for the given canvases', () => {
      expect(new CanvasWorld([canvases[1]]).worldBounds()).toEqual([0, 0, 6501, 4421]);
      expect(new CanvasWorld(canvasSubset).worldBounds()).toEqual([0, 0, 9153, 4288]);
    });
  });
  describe('contentResourceToWorldCoordinates', () => {
    it('converts canvas coordinates to world offset by location', () => {
      expect(new CanvasWorld([canvases[1]]).contentResourceToWorldCoordinates({ id: 'https://stacks.stanford.edu/image/iiif/fr426cg9537%2FSC1094_s3_b14_f17_Cats_1976_0005/full/full/0/default.jpg' }))
        .toEqual([0, 0, 6501, 4421]);
      expect(new CanvasWorld(canvasSubset).contentResourceToWorldCoordinates({ id: 'https://stacks.stanford.edu/image/iiif/rz176rt6531%2FPC0170_s3_Tree_Calendar_20081101_152516_0410/full/full/0/default.jpg' }))
        .toEqual([6305, 0, 2848, 4288]);
    });
    it('supports RTL orientations', () => {
      expect(new CanvasWorld(canvasSubset, null, 'right-to-left').contentResourceToWorldCoordinates({ id: 'https://stacks.stanford.edu/image/iiif/rz176rt6531%2FPC0170_s3_Tree_Calendar_20081101_152516_0410/full/full/0/default.jpg' }))
        .toEqual([0, 0, 2848, 4288]);
    });
    it('supports TTB orientations', () => {
      expect(new CanvasWorld(canvasSubset, null, 'top-to-bottom').contentResourceToWorldCoordinates({ id: 'https://stacks.stanford.edu/image/iiif/rz176rt6531%2FPC0170_s3_Tree_Calendar_20081101_152516_0410/full/full/0/default.jpg' }))
        .toEqual([0, 1936, 2848, 4288]);
    });
    it('supports BTT orientations', () => {
      expect(new CanvasWorld(canvasSubset, null, 'bottom-to-top').contentResourceToWorldCoordinates({ id: 'https://stacks.stanford.edu/image/iiif/rz176rt6531%2FPC0170_s3_Tree_Calendar_20081101_152516_0410/full/full/0/default.jpg' }))
        .toEqual([0, 0, 2848, 4288]);
    });
    it('when placed by a fragment contains the offset', () => {
      const subject = new CanvasWorld(
        [Utils.parseManifest(fragmentFixture).getSequences()[0].getCanvases()[0]],
      );
      expect(subject.contentResourceToWorldCoordinates({ id: 'https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PC17/full/739,521/0/default.jpg' }))
        .toEqual([552, 1584, 3360, 2368]);
    });
  });
  describe('canvasToWorldCoordinates', () => {
    it('converts canvas coordinates to world offset by location', () => {
      expect(new CanvasWorld([canvases[1]]).canvasToWorldCoordinates('https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1'))
        .toEqual([0, 0, 6501, 4421]);
      expect(new CanvasWorld(canvasSubset).canvasToWorldCoordinates('https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1'))
        .toEqual([6305, 0, 2848, 4288]);
    });
    it('supports RTL orientations', () => {
      expect(new CanvasWorld(canvasSubset, null, 'right-to-left').canvasToWorldCoordinates('https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1'))
        .toEqual([0, 0, 2848, 4288]);
    });
  });
  describe('offsetByCanvas', () => {
    it('calculates an offset that can be used to translate annotations', () => {
      expect(
        new CanvasWorld(canvasSubset).offsetByCanvas('https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1'),
      ).toEqual({ x: 0, y: 0 });
      expect(
        new CanvasWorld(canvasSubset).offsetByCanvas('https://purl.stanford.edu/rz176rt6531/iiif/canvas/rz176rt6531_1'),
      ).toEqual({ x: 6305, y: 0 });
    });
  });

  describe('layerOpacityOfImageResource', () => {
    const tileSource1 = { id: 'https://stacks.stanford.edu/image/iiif/fr426cg9537%2FSC1094_s3_b14_f17_Cats_1976_0005/full/full/0/default.jpg' };
    it('returns 0 if the layer is currently hidden', () => {
      const layers = {
        'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1': {
          'https://stacks.stanford.edu/image/iiif/fr426cg9537%2FSC1094_s3_b14_f17_Cats_1976_0005/full/full/0/default.jpg': {
            visibility: false,
          },
        },
      };

      expect(
        new CanvasWorld(canvases, layers).layerOpacityOfImageResource(tileSource1),
      ).toEqual(0);
    });

    it('returns 1 if there is no opacity configuration for the layer', () => {
      expect(
        new CanvasWorld(canvases).layerOpacityOfImageResource(tileSource1),
      ).toEqual(1);

      expect(
        new CanvasWorld(canvases, {}).layerOpacityOfImageResource(tileSource1),
      ).toEqual(1);

      const layers = {
        'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1': {
        },
      };

      expect(
        new CanvasWorld(canvases, layers).layerOpacityOfImageResource(tileSource1),
      ).toEqual(1);
    });

    it('returns the configured opacity value for the layer', () => {
      const layers = {
        'https://purl.stanford.edu/fr426cg9537/iiif/canvas/fr426cg9537_1': {
          'https://stacks.stanford.edu/image/iiif/fr426cg9537%2FSC1094_s3_b14_f17_Cats_1976_0005/full/full/0/default.jpg': {
            opacity: 0.5,
          },
        },
      };

      expect(
        new CanvasWorld(canvases, layers).layerOpacityOfImageResource(tileSource1),
      ).toEqual(0.5);
    });
  });

  describe('layerIndexOfImageResource', () => {
    const tileSource0 = { id: 'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/full/full/0/default.jpg' };
    it('returns undefined by default', () => {
      expect(
        new CanvasWorld(canvases).layerIndexOfImageResource(tileSource0),
      ).toEqual(undefined);
    });

    it('returns the inverse of the configured index', () => {
      const layers = {
        'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/24/c1.json': {
          'https://stacks.stanford.edu/image/iiif/hg676jb4964%2F0380_796-44/full/full/0/default.jpg': {
            index: 0,
          },
        },
      };

      expect(
        new CanvasWorld(canvases, layers).layerIndexOfImageResource(tileSource0),
      ).toEqual(0);
    });
  });
  describe('canvasAtPoint', () => {
    it('returns the canvas  at a particular point', () => {
      const canvasWorld = new CanvasWorld(canvasSubset);

      expect(canvasWorld.canvasAtPoint({ x: 1, y: 1 }).id).toEqual(canvases[1].id);
      expect(canvasWorld.canvasAtPoint({ x: 6400, y: 1 }).id).toEqual(canvases[2].id);
    });

    it('returns undefined if the  point is outside the world', () => {
      const canvasWorld = new CanvasWorld(canvasSubset);
      expect(canvasWorld.canvasAtPoint({ x: -1, y: -1 })).toEqual(undefined);
    });
  });
});

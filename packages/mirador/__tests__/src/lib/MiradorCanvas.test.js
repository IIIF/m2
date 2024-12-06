import { Utils } from 'manifesto.js';
import MiradorCanvas from '../../../src/lib/MiradorCanvas';
import fixture from '../../fixtures/version-2/019.json';
import serviceFixture from '../../fixtures/version-2/canvasService.json';
import otherContentFixture from '../../fixtures/version-2/299843.json';
import otherContentStringsFixture from '../../fixtures/version-2/BibliographicResource_3000126341277.json';
import fragmentFixture from '../../fixtures/version-2/hamilton.json';
import fragmentFixtureV3 from '../../fixtures/version-3/hamilton.json';
import audioFixture from '../../fixtures/version-3/0002-mvm-audio.json';
import textFixture from '../../fixtures/version-3/text-pdf.json';
import videoFixture from '../../fixtures/version-3/0015-start.json';
import videoWithAnnoCaptions from '../../fixtures/version-3/video_with_annotation_captions.json';

describe('MiradorCanvas', () => {
  let instance;
  beforeEach(() => {
    instance = new MiradorCanvas(
      Utils.parseManifest(fixture).getSequences()[0].getCanvases()[0],
    );
  });
  describe('annotationListUris', () => {
    describe('when no annotationLists are present', () => {
      it('returns an empty array', () => {
        expect(instance.annotationListUris).toEqual([]);
      });
    });
    describe('when annotationLists are present', () => {
      describe('with items as objects', () => {
        it('returns an array of uris', () => {
          const otherContentInstance = new MiradorCanvas(
            Utils.parseManifest(otherContentFixture).getSequences()[0].getCanvases()[0],
          );
          expect(otherContentInstance.annotationListUris.length).toEqual(1);
          expect(otherContentInstance.annotationListUris).toEqual([
            'https://iiif.harvardartmuseums.org/manifests/object/299843/list/47174896',
          ]);
        });
      });
      describe('with items as strings', () => {
        it('returns an array of uris', () => {
          const otherContentInstance = new MiradorCanvas(
            Utils.parseManifest(otherContentStringsFixture).getSequences()[0].getCanvases()[0],
          );
          expect(otherContentInstance.annotationListUris.length).toEqual(1);
          expect(otherContentInstance.annotationListUris).toEqual([
            'https://iiif.europeana.eu/presentation/9200301/BibliographicResource_3000126341277/annopage/1',
          ]);
        });
      });
    });
  });

  describe('aspectRatio', () => {
    it('calculates a width / height aspectRatio', () => {
      expect(instance.aspectRatio).toBeCloseTo(0.667);
    });
  });
  describe('service', () => {
    it('correctly returns the service information for the given canvas', () => {
      const serviceInstance = new MiradorCanvas(
        Utils.parseManifest(serviceFixture).getSequences()[0].getCanvases()[0],
      );

      expect(serviceInstance.service).toBeDefined();
    });

    it('returns undefined if there is no service', () => {
      expect(instance.service).toBeUndefined();
    });
  });
  describe('resourceAnnotation', () => {
    it('returns the containing Annotation for a given contentResource id', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(fragmentFixture).getSequences()[0].getCanvases()[0],
      );
      expect(
        instance.resourceAnnotation('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PC17/full/739,521/0/default.jpg').id,
      ).toEqual('https://prtd.app/hamilton/canvas/p1/anno-02.json');
    });
    it('returns the containing Annotation for a given contentResource id v3', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(fragmentFixtureV3).getSequences()[0].getCanvases()[0],
      );
      expect(
        instance.resourceAnnotation('https://images.prtd.app/iiif/2/hamilton%2fHL_524_1r_00_PC17/full/739,521/0/default.jpg').id,
      ).toEqual('https://dvp.prtd.app/hamilton/canvas/p1/anno-02.json');
    });
  });
  describe('onFragment', () => {
    it('when a fragment selector exists for a given contentResources id, returns that fragment', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(fragmentFixture).getSequences()[0].getCanvases()[0],
      );
      expect(
        instance.onFragment('https://prtd.app/image/iiif/2/hamilton%2fHL_524_1r_00_PC17/full/739,521/0/default.jpg'),
      ).toEqual([552, 1584, 3360, 2368]);
    });
    it('when a fragment selector exists for a given contentResources id, returns that fragment v3', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(fragmentFixtureV3).getSequences()[0].getCanvases()[0],
      );
      expect(
        instance.onFragment('https://images.prtd.app/iiif/2/hamilton%2fHL_524_1r_00_PC17/full/739,521/0/default.jpg'),
      ).toEqual([552, 1584, 3360, 2368]);
    });
  });
  describe('videoResources', () => {
    it('returns video', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(videoFixture).getSequences()[0].getCanvases()[0],
      );
      expect(instance.videoResources.length).toEqual(1);
    });
  });
  describe('audioResources', () => {
    it('returns audio', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(audioFixture).getSequences()[0].getCanvases()[0],
      );
      expect(instance.audioResources.length).toEqual(1);
    });
  });
  describe('vttContent', () => {
    it('returns v2 vttContent', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(videoFixture).getSequences()[0].getCanvases()[0],
      );
      expect(instance.v2VttContent.length).toEqual(1);
    });
    it('returns v3 vttContent', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(videoWithAnnoCaptions).getSequences()[0].getCanvases()[0],
      );
      expect(instance.v3VttContent.length).toEqual(1);
    });
  });
  describe('textResources', () => {
    it('returns text', () => {
      instance = new MiradorCanvas(
        Utils.parseManifest(textFixture).getSequences()[0].getCanvases()[0],
      );
      expect(instance.textResources.length).toEqual(1);
    });
  });
});

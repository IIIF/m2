import { render, screen } from '@tests/utils/test-utils';
import { VideoViewer } from '../../../src/components/VideoViewer';

/** create wrapper */
function createWrapper(props, suspenseFallback) {
  return render(
    <VideoViewer
      classes={{}}
      videoOptions={{ crossOrigin: 'anonymous', 'data-testid': 'video' }}
      {...props}
    />,
  );
}

describe('VideoViewer', () => {
  describe('render', () => {
    it('videoResources', () => {
      createWrapper({
        videoResources: [
          { getFormat: () => 'video/mp4', id: 1 },
          { getFormat: () => 'video/mp4', id: 2 },
        ],
      }, true);
      const video = screen.getByTestId('video');
      expect(video.querySelector('source:nth-of-type(1)')).toHaveAttribute('type', 'video/mp4'); // eslint-disable-line testing-library/no-node-access
      expect(video.querySelector('source:nth-of-type(2)')).toHaveAttribute('type', 'video/mp4'); // eslint-disable-line testing-library/no-node-access
    });
    it('passes through configurable options', () => {
      createWrapper({
        videoResources: [
          { getFormat: () => 'video/mp4', id: 1 },
        ],
      }, true);
      expect(screen.getByTestId('video')).toHaveAttribute('crossOrigin', 'anonymous');
    });
    it('captions', () => {
      createWrapper({
        captions: [
          { getDefaultLabel: () => 'English', getProperty: () => 'en', id: 1 },
          { getDefaultLabel: () => 'French', getProperty: () => 'fr', id: 2 },
        ],
        videoResources: [
          { getFormat: () => 'video/mp4', id: 1 },
        ],
      }, true);
      const video = screen.getByTestId('video');
      expect(video.querySelector('track:nth-of-type(1)')).toHaveAttribute('srcLang', 'en'); // eslint-disable-line testing-library/no-node-access
      expect(video.querySelector('track:nth-of-type(1)')).toHaveAttribute('label', 'English'); // eslint-disable-line testing-library/no-node-access
      expect(video.querySelector('track:nth-of-type(2)')).toHaveAttribute('srcLang', 'fr'); // eslint-disable-line testing-library/no-node-access
      expect(video.querySelector('track:nth-of-type(2)')).toHaveAttribute('label', 'French'); // eslint-disable-line testing-library/no-node-access
    });
  });
});

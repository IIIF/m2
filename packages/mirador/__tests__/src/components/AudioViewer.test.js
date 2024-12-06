import { render, screen } from '@tests/utils/test-utils';
import { AudioViewer } from '../../../src/components/AudioViewer';

/** create wrapper */
function createWrapper(props, suspenseFallback) {
  return render(
    <AudioViewer
      classes={{}}
      audioOptions={{ crossOrigin: 'anonymous', 'data-testid': 'audio' }}
      {...props}
    />,
  );
}

/* eslint-disable testing-library/no-node-access */
describe('AudioViewer', () => {
  describe('render', () => {
    it('audioResources', () => {
      createWrapper({
        audioResources: [
          { getFormat: () => 'video/mp4', id: 1 },
          { getFormat: () => 'video/mp4', id: 2 },
        ],
      }, true);
      const audio = screen.getByTestId('audio');

      expect(audio.querySelector('source:nth-of-type(1)')).toHaveAttribute('src', '1');
      expect(audio.querySelector('source:nth-of-type(2)')).toHaveAttribute('src', '2');
    });
    it('passes through configurable options', () => {
      createWrapper({
        audioResources: [
          { getFormat: () => 'audio/mp3', id: 1 },
        ],
      }, true);

      expect(screen.getByTestId('audio')).toHaveAttribute('crossOrigin', 'anonymous');
    });
    it('captions', () => {
      createWrapper({
        audioResources: [
          { getFormat: () => 'video/mp4', id: 1 },
        ],
        captions: [
          { getDefaultLabel: () => 'English', getProperty: () => 'en', id: 1 },
          { getDefaultLabel: () => 'French', getProperty: () => 'fr', id: 2 },
        ],
      }, true);
      const audio = screen.getByTestId('audio');

      expect(audio.querySelector('track:nth-of-type(1)')).toHaveAttribute('srcLang', 'en');
      expect(audio.querySelector('track:nth-of-type(1)')).toHaveAttribute('label', 'English');
      expect(audio.querySelector('track:nth-of-type(2)')).toHaveAttribute('srcLang', 'fr');
      expect(audio.querySelector('track:nth-of-type(2)')).toHaveAttribute('label', 'French');
    });
  });
});

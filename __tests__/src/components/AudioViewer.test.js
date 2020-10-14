import React from 'react';
import { shallow } from 'enzyme';
import { AudioViewer } from '../../../src/components/AudioViewer';

/** create wrapper */
function createWrapper(props, suspenseFallback) {
  return shallow(
    <AudioViewer
      classes={{}}
      {...props}
    />,
  );
}

describe('AudioViewer', () => {
  let wrapper;
  describe('render', () => {
    it('audioResources', () => {
      wrapper = createWrapper({
        audioResources: [
          { getFormat: () => 'video/mp4', id: 1 },
          { getFormat: () => 'video/mp4', id: 2 },
        ],
      }, true);
      expect(wrapper.contains(<source src="1" type="video/mp4" />));
      expect(wrapper.contains(<source src="2" type="video/mp4" />));
    });
    it('captions', () => {
      wrapper = createWrapper({
        audioResources: [
          { getFormat: () => 'video/mp4', id: 1 },
        ],
        captions: [
          { getLabel: () => 'English', getProperty: () => 'en', id: 1 },
          { getLabel: () => 'French', getProperty: () => 'fr', id: 2 },
        ],
      }, true);
      expect(wrapper.contains(<track src="1" label="English" srcLang="en" />));
      expect(wrapper.contains(<track src="2" label="French" srcLang="fr" />));
    });
  });
});

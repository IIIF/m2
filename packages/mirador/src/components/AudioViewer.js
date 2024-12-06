import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
});

const StyledAudio = styled('audio')({
  width: '100%',
});

/** */
export function AudioViewer({ audioOptions = {}, audioResources = [], captions = [] }) {
  /* eslint-disable jsx-a11y/media-has-caption */

  return (
    <StyledContainer>
      <StyledAudio {...audioOptions}>
        {audioResources.map((audio) => (
          <Fragment key={audio.id}>
            <source src={audio.id} type={audio.getFormat()} />
          </Fragment>
        ))}
        {captions.map((caption) => (
          <Fragment key={caption.id}>
            <track src={caption.id} label={caption.getDefaultLabel()} srcLang={caption.getProperty('language')} />
          </Fragment>
        ))}
      </StyledAudio>
    </StyledContainer>
  );
}
/* eslint-enable jsx-a11y/media-has-caption */

AudioViewer.propTypes = {
  audioOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  audioResources: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  captions: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
};

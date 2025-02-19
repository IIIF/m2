import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledContainer = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
}));

const StyledVideo = styled('video')(() => ({
  maxHeight: '100%',
  width: '100%',
}));

/** */
export function VideoViewer({ captions = [], videoOptions = {}, videoResources = [] }) {
  return (
    <StyledContainer>
      <StyledVideo {...videoOptions}>
        {videoResources.map(video => (
          <source key={video.io} src={video.id} type={video.getFormat()} />
        ))}
        {captions.map(caption => (
          <track key={caption.id} src={caption.id} label={caption.getDefaultLabel()} srcLang={caption.getProperty('language')} />
        ))}
      </StyledVideo>
    </StyledContainer>
  );
}

VideoViewer.propTypes = {
  captions: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  videoOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  videoResources: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
};

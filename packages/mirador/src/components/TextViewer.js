import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import WindowCanvasNavigationControls from '../containers/WindowCanvasNavigationControls';

const StyledContainer = styled('div')(() => ({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
}));

const StyledText = styled('div')(() => ({
  maxHeight: '100%',
  width: '100%',
}));

/**
 * Simple divs with canvas navigation, which should mimic v3 fallthrough to WindowViewer
 * with non-image resources and provide a target for plugin overrides with minimal disruption.
 */
export function TextViewer({ textOptions = {}, textResources = [], windowId }) {
  return (
    <StyledContainer>
      <StyledText {...textOptions}>
        {textResources.map(text => (
          <source key={text.id} src={text.id} type={text.getFormat()} />
        ))}
        <WindowCanvasNavigationControls windowId={windowId} />
      </StyledText>
    </StyledContainer>
  );
}

TextViewer.propTypes = {
  textOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  textResources: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  windowId: PropTypes.string.isRequired,
};

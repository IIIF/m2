import PropTypes from 'prop-types';
import DialogContent from '@mui/material/DialogContent';
import { alpha, styled } from '@mui/material/styles';

/**
 * From https://github.com/mui/material-ui/blob/v5.15.0/packages/mui-material/src/styles/getOverlayAlpha.ts
 */
const getOverlayAlpha = (elevation) => {
  let alphaValue;
  if (elevation < 1) {
    alphaValue = 5.11916 * elevation ** 2;
  } else {
    alphaValue = 4.5 * Math.log(elevation + 1) + 2;
  }
  return (alphaValue / 100).toFixed(2);
};

const Root = styled(DialogContent, { name: 'ScrollIndicatedDialogContent', slot: 'root' })(({ ownerState, theme }) => {
  // In dark mode, paper has a elevation-dependent background color:
  // https://github.com/mui/material-ui/blob/v5.15.0/packages/mui-material/src/Paper/Paper.js#L55-L60
  const bgcolor = theme.palette.mode === 'dark' ? {
    backgroundImage: `linear-gradient(${alpha(
      '#fff',
      getOverlayAlpha(ownerState?.elevation || 24),
    )}, ${alpha('#fff', getOverlayAlpha(ownerState?.elevation || 24))})`,
  } : theme.palette.background.paper;
  return {
    /* Shadow covers */
    background: `linear-gradient(${bgcolor} 30%, rgba(255, 255, 255, 0)), `
      + `linear-gradient(rgba(255, 255, 255, 0), ${bgcolor} 70%) 0 100%, `
      // Shadows
      + 'radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), '
      + 'radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;',
    backgroundAttachment: 'local, local, scroll, scroll',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
    overflowY: 'auto',
  };
});

/**
 * ScrollIndicatedDialogContent ~ Inject a style into the DialogContent component
 *                                to indicate there is scrollable content
*/
export function ScrollIndicatedDialogContent({ classes = {}, className = '', ...otherProps }) {
  const ourClassName = [className, classes.shadowScrollDialog].join(' ');

  return (
    <Root
      className={ourClassName}
      {...otherProps}
    />
  );
}

ScrollIndicatedDialogContent.propTypes = {
  classes: PropTypes.shape({
    shadowScrollDialog: PropTypes.string,
  }),
  className: PropTypes.string,
};

import { useContext } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import WorkspaceContext from '../contexts/WorkspaceContext';

const Root = styled(IconButton, { name: 'MiradorMenuButton', slot: 'root' })(({ selected, theme }) => ({
  fill: 'currentcolor',
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
  }),
}));

/**
 * MiradorMenuButton ~ Wrap the given icon prop in an IconButton and a Tooltip.
 * This shares the passed in aria-label w/ the Tooltip (as title) and the IconButton
 * All props besides icon are spread to the IconButton component
*/
export function MiradorMenuButton({
  'aria-label': ariaLabel,
  badge = false,
  children,
  dispatch = () => {},
  selected = false,
  BadgeProps = {},
  TooltipProps = {},
  sx = {},
  ...iconButtonProps
}) {
  const container = useContext(WorkspaceContext);
  const button = (
    <Root
      selected={selected}
      aria-label={ariaLabel}
      {...iconButtonProps}
      sx={sx}
      size="large"
    >
      {badge
        ? (
          <Badge
            overlap="rectangular"
            {...BadgeProps}
          >
            {children}
          </Badge>
        )
        : children}
    </Root>
  );

  if (iconButtonProps.disabled) return button;

  return (
    <Tooltip
      PopperProps={{
        container: container?.current,
      }}
      title={ariaLabel}
      {...TooltipProps}
    >
      {button}
    </Tooltip>
  );
}

MiradorMenuButton.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  badge: PropTypes.bool,
  BadgeProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.element.isRequired,
  dispatch: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  TooltipProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

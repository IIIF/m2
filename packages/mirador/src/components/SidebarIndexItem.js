import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

/** */
export function SidebarIndexItem({ label }) {
  return (
    <Typography
      variant="body1"
    >
      {label}
    </Typography>
  );
}

SidebarIndexItem.propTypes = {
  label: PropTypes.string.isRequired,
};

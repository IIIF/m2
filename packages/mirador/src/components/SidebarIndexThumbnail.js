import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import IIIFThumbnail from '../containers/IIIFThumbnail';

/** */
export function SidebarIndexThumbnail({
  canvas, height = undefined, label, width = undefined,
}) {
  return (
    <>
      <div style={{ minWidth: 50 }}>
        <IIIFThumbnail
          label={label}
          resource={canvas}
          maxHeight={height}
          maxWidth={width}
        />
      </div>
      <Typography>
        {label}
      </Typography>
    </>
  );
}

SidebarIndexThumbnail.propTypes = {
  canvas: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  height: PropTypes.number,
  label: PropTypes.string.isRequired,
  width: PropTypes.number,
};

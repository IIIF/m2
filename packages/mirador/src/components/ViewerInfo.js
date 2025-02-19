import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ns from '../config/css-ns';

const StyledOsdInfo = styled('div')(() => ({
  overflow: 'hidden',
  paddingBottom: 0.5,
  textOverflow: 'ellipsis',
  unicodeBidi: 'plaintext',
  whiteSpace: 'nowrap',
  width: '100%',
}));

/**
 *
 */
export function ViewerInfo({
  canvasCount,
  canvasIndex,
  canvasLabel = undefined,
}) {
  const { t } = useTranslation();
  return (
    <StyledOsdInfo className={classNames(ns('osd-info'))}>
      <Typography display="inline" variant="caption" className={ns('canvas-count')}>
        { t('pagination', { current: canvasIndex + 1, total: canvasCount }) }
      </Typography>
      <Typography display="inline" variant="caption" className={ns('canvas-label')}>
        {canvasLabel && ` • ${canvasLabel}`}
      </Typography>
    </StyledOsdInfo>
  );
}

ViewerInfo.propTypes = {
  canvasCount: PropTypes.number.isRequired,
  canvasIndex: PropTypes.number.isRequired,
  canvasLabel: PropTypes.string,
};

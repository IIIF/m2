import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import SanitizedHtml from '../containers/SanitizedHtml';
import ns from '../config/css-ns';

/**
 * Renders label/value pair metadata in a dl
 * @prop {object} labelValuePair
 */
export function LabelValueMetadata({ defaultLabel = undefined, labelValuePairs }) {
  if (labelValuePairs.length === 0) {
    return null;
  }

  /* eslint-disable react/no-array-index-key */
  // Disabling array index key for dt/dd elements as
  // they are intended to display metadata that will not
  // need to be re-rendered internally in any meaningful way
  return (
    <dl className={ns('label-value-metadata')}>
      {labelValuePairs.reduce((acc, labelValuePair, i) => acc.concat([
        <Typography component="dt" key={`label-${i}`} variant="subtitle2">{labelValuePair.label || defaultLabel}</Typography>,
        <Typography style={{ marginBottom: '.5em', marginLeft: '0px' }} component="dd" key={`value-${i}`} variant="body1">
          <SanitizedHtml htmlString={labelValuePair.values.join(', ')} ruleSet="iiif" />
        </Typography>,
      ]), [])}
    </dl>
  );
}

LabelValueMetadata.propTypes = {
  defaultLabel: PropTypes.string,
  labelValuePairs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
};

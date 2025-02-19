import { useId } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from '../containers/CollapsibleSection';
import SanitizedHtml from '../containers/SanitizedHtml';
import { LabelValueMetadata } from './LabelValueMetadata';
import { PluginHook } from './PluginHook';

/**
 * CanvasInfo
 */
export function CanvasInfo({
  canvasDescription = null,
  canvasLabel = null,
  canvasMetadata = [],
  index = 1,
  totalSize = 1,
}) {
  const { t } = useTranslation();
  const id = useId();
  const titleId = useId();
  const pluginProps = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <CollapsibleSection
      id={id}
      label={t('currentItem', { context: `${index + 1}/${totalSize}` })}
    >
      {canvasLabel && (
        <Typography
          aria-labelledby={
            `${id} ${titleId}`
          }
          id={titleId}
          variant="h4"
          component="h5"
        >
          {canvasLabel}
        </Typography>
      )}

      {canvasDescription && (
        <Typography variant="body1">
          <SanitizedHtml htmlString={canvasDescription} ruleSet="iiif" />
        </Typography>
      )}

      {canvasMetadata && canvasMetadata.length > 0 && (
        <LabelValueMetadata labelValuePairs={canvasMetadata} />
      )}
      <PluginHook {...pluginProps} />
    </CollapsibleSection>
  );
}

CanvasInfo.propTypes = {
  canvasDescription: PropTypes.string,
  canvasLabel: PropTypes.string,
  canvasMetadata: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  index: PropTypes.number,
  totalSize: PropTypes.number,
};

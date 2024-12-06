import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import MinimalWindow from '../containers/MinimalWindow';

/**
 * MosaicRenderPreview is used for the preview when dragging a mosaic window/tile
 */
export function MosaicRenderPreview({
  title = '',
  windowId,
}) {
  const { t } = useTranslation();
  return (
    <MinimalWindow
      windowId={`${windowId}-preview`}
      label={t('previewWindowTitle', { title })}
      ariaLabel={false}
    />
  );
}

MosaicRenderPreview.propTypes = {
  title: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

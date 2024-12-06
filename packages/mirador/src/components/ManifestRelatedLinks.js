import { useId } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import CollapsibleSection from '../containers/CollapsibleSection';
import ns from '../config/css-ns';
import { PluginHook } from './PluginHook';

const StyledDl = styled('dl')(({ theme }) => ({
  '& dd': {
    marginBottom: '.5em',
    marginLeft: '0',
  },
}));

/**
 * ManifestRelatedLinks
 */
export function ManifestRelatedLinks({
  homepage = null,
  manifestUrl = null,
  related = null,
  renderings = null,
  seeAlso = null,
  ...rest
}) {
  const { t } = useTranslation();
  const id = useId();
  const titleId = useId();

  const pluginProps = {
    homepage, manifestUrl, related, renderings, seeAlso, t, ...rest,
  };

  return (
    <CollapsibleSection
      aria-labelledby={titleId}
      id={id}
      label={t('related')}
    >
      <Typography
        aria-labelledby={`${id} ${titleId}`}
        id={titleId}
        variant="h4"
        component="h5"
      >
        {t('links')}
      </Typography>
      <StyledDl className={classNames(ns('label-value-metadata'))}>
        { homepage && (
          <>
            <Typography variant="subtitle2" component="dt">{t('iiif_homepage')}</Typography>
            {
              homepage.map(page => (
                <Typography key={page.value} variant="body1" component="dd">
                  <Link target="_blank" rel="noopener noreferrer" href={page.value}>
                    {page.label || page.value}
                  </Link>
                </Typography>
              ))
            }
          </>
        )}
        { renderings && renderings.length > 0 && (
          <>
            <Typography variant="subtitle2" component="dt">{t('iiif_renderings')}</Typography>
            {
              renderings.map(rendering => (
                <Typography key={rendering.value} variant="body1" component="dd">
                  <Link target="_blank" rel="noopener noreferrer" href={rendering.value}>
                    {rendering.label || rendering.value}
                  </Link>
                </Typography>
              ))
            }
          </>
        )}
        { related && (
          <>
            <Typography variant="subtitle2" component="dt">{t('iiif_related')}</Typography>
            {
              related.map(relatedItem => (
                <Typography key={relatedItem.value} variant="body1" component="dd">
                  <Link target="_blank" rel="noopener noreferrer" href={relatedItem.value}>
                    {relatedItem.label || relatedItem.value}
                  </Link>
                  { relatedItem.format && (
                    <Typography component="span">{` (${relatedItem.format})`}</Typography>
                  )}
                </Typography>
              ))
            }
          </>
        )}
        { seeAlso && (
          <>
            <Typography variant="subtitle2" component="dt">{t('iiif_seeAlso')}</Typography>
            {
              seeAlso.map(seeAlsoItem => (
                <Typography key={seeAlsoItem.value} variant="body1" component="dd">
                  <Link target="_blank" rel="noopener noreferrer" href={seeAlsoItem.value}>
                    {seeAlsoItem.label || seeAlsoItem.value}
                  </Link>
                  { seeAlsoItem.format && (
                    <Typography component="span">{` (${seeAlsoItem.format})`}</Typography>
                  )}
                </Typography>
              ))
            }
          </>
        )}
        { manifestUrl && (
          <>
            <Typography variant="subtitle2" component="dt">{t('iiif_manifest')}</Typography>
            <Typography variant="body1" component="dd">
              <Link target="_blank" rel="noopener noreferrer" href={manifestUrl}>
                {manifestUrl}
              </Link>
            </Typography>
          </>
        )}
      </StyledDl>
      <PluginHook {...pluginProps} />
    </CollapsibleSection>
  );
}

ManifestRelatedLinks.propTypes = {
  homepage: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  manifestUrl: PropTypes.string,
  related: PropTypes.arrayOf(PropTypes.shape({
    format: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  renderings: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  seeAlso: PropTypes.arrayOf(PropTypes.shape({
    format: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
  })),
};

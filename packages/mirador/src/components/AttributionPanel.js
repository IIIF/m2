import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import { useTranslation } from 'react-i18next';
import { Img } from 'react-image';
import CompanionWindow from '../containers/CompanionWindow';
import { CompanionWindowSection } from './CompanionWindowSection';
import { LabelValueMetadata } from './LabelValueMetadata';
import ns from '../config/css-ns';
import { PluginHook } from './PluginHook';

const StyledLogo = styled(Img)(() => ({
  maxWidth: '100%',
}));

const StyledPlaceholder = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
}));

/**
 * WindowSideBarInfoPanel
 */
export function AttributionPanel({
  manifestLogo = null,
  requiredStatement = null,
  rights = null,
  windowId,
  id,
}) {
  const { t } = useTranslation();

  const pluginProps = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <CompanionWindow
      title={t('attributionTitle')}
      paperClassName={ns('attribution-panel')}
      windowId={windowId}
      id={id}
    >
      <CompanionWindowSection>
        { requiredStatement && (
        <LabelValueMetadata labelValuePairs={requiredStatement} defaultLabel={t('attribution')} />
        )}
        {
            rights && rights.length > 0 && (
              <dl className={ns('label-value-metadata')}>
                <Typography variant="subtitle2" component="dt">{t('rights')}</Typography>
                { rights.map(v => (
                  <Typography variant="body1" component="dd" key={v.toString()}>
                    <Link target="_blank" rel="noopener noreferrer" href={v}>
                      {v}
                    </Link>
                  </Typography>
                )) }
              </dl>
            )
          }
      </CompanionWindowSection>

      { manifestLogo && (
      <CompanionWindowSection>
        <StyledLogo
          src={[manifestLogo]}
          alt=""
          role="presentation"
          unloader={
            <StyledPlaceholder variant="rectangular" height={60} width={60} />
              }
        />
      </CompanionWindowSection>
      )}

      <PluginHook {...pluginProps} />
    </CompanionWindow>
  );
}

AttributionPanel.propTypes = {
  id: PropTypes.string.isRequired,
  manifestLogo: PropTypes.string,
  requiredStatement: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  rights: PropTypes.arrayOf(PropTypes.string),
  windowId: PropTypes.string.isRequired,
};

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { PluginHook } from './PluginHook';

const ErrorStackTrace = styled('pre', { name: 'ErrorContent', slot: 'stacktrace' })({
  overflowY: 'scroll',
});

const ErrorMetadata = styled('pre', { name: 'ErrorContent', slot: 'metadata' })({
  height: '100px',
  overflowY: 'scroll',
});

const InlineAccordion = styled(Accordion, { name: 'ErrorContent', slot: 'accordion' })({
  backgroundColor: 'inherit',
  color: 'inherit',
  margin: 0,
});

/** */
export function ErrorContent({
  error, metadata = null, showJsError = true, ...rest
}) {
  const { t } = useTranslation();
  if (!showJsError) return null;

  const pluginProps = {
    error, metadata, showJsError, t, ...rest,
  };

  return (
    <Alert elevation={6} variant="filled" severity="error">
      {t('errorDialogTitle')}
      {showJsError && (
        <InlineAccordion elevation={2} square>
          <AccordionSummary sx={{ marginInlineStart: '-1rem' }} expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}>
            {t('jsError', { message: error.message, name: error.name })}
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <ErrorStackTrace>{t('jsStack', { stack: error.stack })}</ErrorStackTrace>
              {metadata && <ErrorMetadata>{JSON.stringify(metadata, null, 2)}</ErrorMetadata>}
            </Stack>
          </AccordionDetails>
        </InlineAccordion>
      )}
      <PluginHook {...pluginProps} />
    </Alert>
  );
}

ErrorContent.propTypes = {
  error: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  metadata: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  showJsError: PropTypes.bool,
};

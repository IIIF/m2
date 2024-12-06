import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

/**
 * CollapsableSection ~
*/
export function CollapsibleSection({
  children, id, label,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  const handleChange = useCallback((_event, isExpanded) => {
    setOpen(isExpanded);
  }, [setOpen]);

  return (
    <Accordion id={id} elevation={0} expanded={open} onChange={handleChange} disableGutters square variant="compact">
      <AccordionSummary id={`${id}-header`} aria-controls={`${id}-content`} aria-label={t(open ? 'collapseSection' : 'expandSection', { section: label })} expandIcon={<ExpandMoreIcon />}>
        <Typography variant="overline" component="h4">
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

CollapsibleSection.propTypes = {
  children: PropTypes.node.isRequired,

  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

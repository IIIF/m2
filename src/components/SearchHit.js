import { useEffect, useId, useMemo } from 'react';
import { useEffectEvent } from 'use-effect-event';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import SanitizedHtml from '../containers/SanitizedHtml';
import TruncatedHit from '../lib/TruncatedHit';
import { ScrollTo } from './ScrollTo';

const Root = styled(ListItem, { name: 'SearchHit', slot: 'root' })(({ ownerState, theme }) => ({
  '&.Mui-focused': {
    '&:hover': {
      ...(ownerState.windowSelected && {
        backgroundColor: 'inherit',
      }),
    },
    ...(ownerState.windowSelected && {
      backgroundColor: 'inherit',
    }),
  },
  paddingRight: theme.spacing(1),
}));

const CanvasLabel = styled('h4', { name: 'SearchHit', slot: 'canvasLabel' })(({ theme }) => ({
  display: 'inline',
  marginBottom: theme.spacing(1.5),
}));

const Counter = styled(Chip, { name: 'SearchHit', slot: 'counter' })(({ ownerState, theme }) => ({
  // eslint-disable-next-line no-nested-ternary
  backgroundColor: theme.palette.hitCounter.default,
  ...(ownerState.windowSelected && {
    backgroundColor: theme.palette.highlights.primary,
  }),
  ...(ownerState.adjacent && !ownerState.windowSelected && {
    backgroundColor: theme.palette.highlights.secondary,
  }),
  height: 30,
  marginRight: theme.spacing(1),
  typography: 'subtitle2',
  verticalAlign: 'inherit',
}));

/** */
export function SearchHit({
  adjacent = false, annotation = undefined, annotationId = undefined, annotationLabel = undefined,
  announcer = undefined, canvasLabel = undefined, companionWindowId = undefined, containerRef = undefined,
  focused = false, hit = undefined, index = undefined, selectAnnotation = () => {}, selected = false,
  showDetails = () => {}, total = undefined, windowId, windowSelected = false,
}) {
  const { t } = useTranslation();
  useEffect(() => {
    if (selected) {
      announceHit();
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  /** */
  const handleClick = () => {
    if (annotation && annotationId) selectAnnotation(annotationId);
  };

  const truncatedHit = useMemo(() => (hit && new TruncatedHit(hit, annotation)), [hit, annotation]);

  /**
   * Pass content describing the hit to the announcer prop (intended for screen readers)
   */
  const announceHit = useEffectEvent(() => {
    if (!announcer || !truncatedHit) return;

    announcer(
      [
        t('pagination', { current: index + 1, total }),
        canvasLabel,
        annotationLabel,
        truncatedHit.before,
        truncatedHit.match,
        truncatedHit.after,
      ].join(' '),
      'polite',
    );
  });

  const canvasLabelHtmlId = useId();

  if (focused && !selected) return null;

  const renderedHit = focused ? hit : hit && truncatedHit;
  const truncated = hit && (renderedHit.before !== hit.before || renderedHit.after !== hit.after);
  const ownerState = {
    adjacent, focused, selected, windowSelected,
  };

  const header = (
    <>
      <Counter
        component="span"
        ownerState={ownerState}
        label={index + 1}
      />
      <CanvasLabel id={canvasLabelHtmlId}>
        {canvasLabel}
        {annotationLabel && (
          <Typography component="span" sx={{ display: 'block', marginTop: 1 }}>{annotationLabel}</Typography>
        )}
      </CanvasLabel>
    </>
  );

  return (
    <ScrollTo
      containerRef={containerRef}
      offsetTop={96} // offset for the height of the form above
      scrollTo={windowSelected && !focused}
    >
      <Root
        ownerState={ownerState}
        className={windowSelected ? 'windowSelected' : ''}
        divider
        component={selected ? 'li' : ListItemButton}
        onClick={handleClick}
        selected={selected}
      >
        <ListItemText
          primary={header}
          primaryTypographyProps={{ component: 'div', sx: { marginBottom: 1 }, variant: 'subtitle2' }}
          secondaryTypographyProps={{ variant: 'body1' }}
          secondary={(
            <>
              {hit && (
                <>
                  <SanitizedHtml ruleSet="iiif" htmlString={renderedHit.before} />
                  {' '}
                  <strong>
                    <SanitizedHtml ruleSet="iiif" htmlString={renderedHit.match} />
                  </strong>
                  {' '}
                  <SanitizedHtml ruleSet="iiif" htmlString={renderedHit.after} />
                  {' '}
                  {truncated && !focused && (
                    <Button
                      sx={{
                        '& span': {
                          lineHeight: '1.5em',
                        },
                        margin: 0,
                        padding: 0,
                        textTransform: 'none',
                      }}
                      onClick={showDetails}
                      color="secondary"
                      size="small"
                      aria-describedby={canvasLabelHtmlId}
                    >
                      {t('more')}
                    </Button>
                  )}
                </>
              )}
              {!hit && annotation && <SanitizedHtml ruleSet="iiif" htmlString={annotation.chars} />}
            </>
          )}
        />
      </Root>
    </ScrollTo>
  );
}

SearchHit.propTypes = {
  adjacent: PropTypes.bool,
  annotation: PropTypes.shape({
    chars: PropTypes.string,
    targetId: PropTypes.string,
  }),
  annotationId: PropTypes.string,
  annotationLabel: PropTypes.string,
  announcer: PropTypes.func,
  canvasLabel: PropTypes.string,
  companionWindowId: PropTypes.string,
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  focused: PropTypes.bool,
  hit: PropTypes.shape({
    after: PropTypes.string,
    before: PropTypes.string,
    match: PropTypes.string,
  }),
  index: PropTypes.number,
  selectAnnotation: PropTypes.func,
  selected: PropTypes.bool,
  showDetails: PropTypes.func,
  total: PropTypes.number,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  windowSelected: PropTypes.bool,
};

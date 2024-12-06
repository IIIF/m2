import { useId, useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ItemListIcon from '@mui/icons-material/ReorderSharp';
import TocIcon from '@mui/icons-material/SortSharp';
import ThumbnailListIcon from '@mui/icons-material/ViewListSharp';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardSharp';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import CompanionWindow from '../containers/CompanionWindow';
import SidebarIndexList from '../containers/SidebarIndexList';
import SidebarIndexTableOfContents from '../containers/SidebarIndexTableOfContents';
import { IIIFResourceLabel } from './IIIFResourceLabel';

const StyledBreak = styled('div')(() => ({
  flexBasis: '100%',
  height: 0,
}));

/**
 * a panel showing the canvases for a given manifest
 */
export function WindowSideBarCanvasPanel({
  collection = null,
  id,
  showMultipart,
  sequenceId = null,
  sequences = [],
  variant,
  showToc = false,
  updateSequence,
  updateVariant,
  windowId,
}) {
  const { t } = useTranslation();
  const containerRef = useRef();
  const tabPanelId = useId();

  /** */
  const handleSequenceChange = (event) => {
    updateSequence(event.target.value);
  };

  /** */
  const handleVariantChange = (event, value) => {
    updateVariant(value);
  };

  let listComponent;

  if (variant === 'tableOfContents') {
    listComponent = (
      <SidebarIndexTableOfContents
        id={id}
        containerRef={containerRef}
        windowId={windowId}
      />
    );
  } else {
    listComponent = (
      <SidebarIndexList
        id={id}
        containerRef={containerRef}
        windowId={windowId}
      />
    );
  }

  return (
    <CompanionWindow
      title={t('canvasIndex')}
      id={id}
      windowId={windowId}
      ref={containerRef}
      titleControls={(
        <>
          {
            sequences && sequences.length > 1 && (
              <FormControl>
                <Select
                  MenuProps={{
                    anchorOrigin: {
                      horizontal: 'left',
                      vertical: 'bottom',
                    },
                  }}
                  displayEmpty
                  value={sequenceId}
                  onChange={handleSequenceChange}
                  name="sequenceId"
                  sx={{
                    '&.MuiSelect-select': {
                      '&:focus': {
                        backgroundColor: 'background.paper',
                      },
                    },
                    backgroundColor: 'background.paper',
                  }}
                  data-testid="sequence-select"
                >
                  { sequences.map((s, i) => <MenuItem value={s.id} key={s.id}><Typography variant="body2"><IIIFResourceLabel resource={s} /></Typography></MenuItem>) }
                </Select>
              </FormControl>
            )
          }
          <StyledBreak />
          <Tabs
            value={variant}
            onChange={handleVariantChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            {showToc && (
              <Tooltip title={t('tableOfContentsList')} value="tableOfContents"><Tab sx={{ minWidth: 'auto' }} value="tableOfContents" aria-label={t('tableOfContentsList')} aria-controls={tabPanelId} icon={<TocIcon style={{ transform: 'scale(-1, 1)' }} />} /></Tooltip>
            )}
            <Tooltip title={t('itemList')} value="item"><Tab sx={{ minWidth: 'auto' }} value="item" aria-label={t('itemList')} aria-controls={tabPanelId} icon={<ItemListIcon />} /></Tooltip>
            <Tooltip title={t('thumbnailList')} value="thumbnail"><Tab sx={{ minWidth: 'auto' }} value="thumbnail" aria-label={t('thumbnailList')} aria-controls={tabPanelId} icon={<ThumbnailListIcon />} /></Tooltip>
          </Tabs>
        </>
      )}
    >
      <div id={tabPanelId}>
        { collection && (
          <Button
            fullWidth
            onClick={showMultipart}
            endIcon={<ArrowForwardIcon />}
          >
            <Typography sx={{ textTransform: 'none' }}>
              <IIIFResourceLabel resource={collection} />
            </Typography>
          </Button>
        )}
        {listComponent}
      </div>
    </CompanionWindow>
  );
}

WindowSideBarCanvasPanel.propTypes = {
  collection: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  id: PropTypes.string.isRequired,
  sequenceId: PropTypes.string,
  sequences: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
  showMultipart: PropTypes.func.isRequired,
  showToc: PropTypes.bool,
  updateSequence: PropTypes.func.isRequired,
  updateVariant: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['item', 'thumbnail', 'tableOfContents']).isRequired,
  windowId: PropTypes.string.isRequired,
};

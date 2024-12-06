import { useMemo } from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { ScrollTo } from './ScrollTo';
import MiradorCanvas from '../lib/MiradorCanvas';
import SidebarIndexItem from '../containers/SidebarIndexItem';
import SidebarIndexThumbnail from '../containers/SidebarIndexThumbnail';

const StyledItem = styled(MenuItem, { name: 'SidebarIndexList', slot: 'item' })(({ theme }) => ({
  alignItems: 'flex-start',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1),
  position: 'initial',
  whiteSpace: 'normal',
}));

/** */
function getIdAndLabelOfCanvases(canvases) {
  return canvases.map((canvas) => ({
    id: canvas.id,
    label: new MiradorCanvas(canvas).getLabel(),
  }));
}

/** */
export function SidebarIndexList({
  canvases,
  containerRef,
  selectedCanvasIds = [],
  setCanvas,
  variant = 'item',
  windowId,
}) {
  const canvasesIdAndLabel = useMemo(() => getIdAndLabelOfCanvases(canvases), [canvases]);
  let Item;

  switch (variant) {
    case 'thumbnail':
      Item = SidebarIndexThumbnail;
      break;
    default:
      Item = SidebarIndexItem;
  }

  return (
    <MenuList variant="selectedMenu">
      {
        canvasesIdAndLabel.map((canvas, canvasIndex) => {
          const onClick = () => { setCanvas(windowId, canvas.id); }; // eslint-disable-line require-jsdoc, max-len

          return (
            <ScrollTo
              containerRef={containerRef}
              key={`${canvas.id}-${variant}`}
              offsetTop={96} // offset for the height of the form above
              selected={selectedCanvasIds.includes(canvas.id)}
              scrollTo={selectedCanvasIds.includes(canvas.id)}
            >
              <StyledItem
                key={canvas.id}
                divider
                onClick={onClick}
                component="li"
              >
                <Item label={canvas.label} canvas={canvases[canvasIndex]} />
              </StyledItem>
            </ScrollTo>
          );
        })
      }
    </MenuList>
  );
}

SidebarIndexList.propTypes = {
  canvases: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  selectedCanvasIds: PropTypes.arrayOf(PropTypes.string),
  setCanvas: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['item', 'thumbnail']),
  windowId: PropTypes.string.isRequired,
};

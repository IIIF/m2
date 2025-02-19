import { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList as List } from 'react-window';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import CanvasWorld from '../lib/CanvasWorld';
import ThumbnailCanvasGrouping from '../containers/ThumbnailCanvasGrouping';
import ns from '../config/css-ns';
/**
 */
export function ThumbnailNavigation({
  canvasGroupings, canvasIndex, hasNextCanvas = false, hasPreviousCanvas = false, position,
  setNextCanvas = () => {}, setPreviousCanvas = () => {}, thumbnailNavigation, view = undefined, viewingDirection = '', windowId,
}) {
  const { t } = useTranslation();
  const scrollbarSize = 15;
  const spacing = 8; // 2 * (2px margin + 2px border + 2px padding + 2px padding)
  const gridRef = useRef();
  const previousView = useRef(view);

  useEffect(() => {
    if (previousView.current !== view && position !== 'off') {
      previousView.current = view;
      gridRef.current.resetAfterIndex(0);
    }
  }, [view, position]);

  useEffect(() => {
    let index = canvasIndex;
    if (view === 'book') index = Math.ceil(index / 2);
    gridRef.current?.scrollToItem(index, 'center');
  }, [canvasIndex, view]);

  /** */
  const handleKeyDown = (e) => {
    let nextKey = 'ArrowRight';
    let previousKey = 'ArrowLeft';
    if (position === 'far-right') {
      nextKey = 'ArrowDown';
      previousKey = 'ArrowUp';
    }
    switch (e.key) {
      case nextKey:
        nextCanvas();
        break;
      case previousKey:
        previousCanvas();
        break;
      default:
        break;
    }
  };

  /**
   * When on right, row height
   * When on bottom, column width
   */
  const calculateScaledSize = (index) => {
    const canvases = canvasGroupings[index];
    if (!canvases) return thumbnailNavigation.width + spacing;

    const world = new CanvasWorld(canvases);
    const bounds = world.worldBounds();
    switch (position) {
      case 'far-right': {
        const calc = Math.floor(
          calculatingWidth(canvases.length) * bounds[3] / bounds[2],
        );
        if (!Number.isInteger(calc)) return thumbnailNavigation.width + spacing;
        return calc + spacing;
      }
      // Default case bottom
      default: {
        if (bounds[3] === 0) return thumbnailNavigation.width + spacing;
        const calc = Math.ceil(
          (thumbnailNavigation.height - scrollbarSize - spacing - 4)
           * bounds[2] / bounds[3],
        );
        return calc;
      }
    }
  };

  /** */
  const calculatingWidth = (canvasesLength) => {
    if (canvasesLength === 1) {
      return thumbnailNavigation.width;
    }
    return thumbnailNavigation.width * 2;
  };

  /** */
  const style = useCallback(() => {
    const width = view === 'book' ? thumbnailNavigation.width * 2 : thumbnailNavigation.width;

    switch (position) {
      case 'far-right':
        return {
          height: '100%',
          minHeight: 0,
          width: `${width + scrollbarSize + spacing}px`,
        };
      // Default case bottom
      default:
        return {
          height: `${thumbnailNavigation.height}px`,
          width: '100%',
        };
    }
  }, [position, thumbnailNavigation, view]);

  /** */
  const areaHeight = (height) => {
    switch (position) {
      case 'far-right':
        return height;
      // Default case bottom
      default:
        return thumbnailNavigation.height;
    }
  };

  /** */
  const itemCount = () => canvasGroupings.length;

  /**
   */
  const nextCanvas = () => {
    if (hasNextCanvas) setNextCanvas();
  };

  /**
   */
  const previousCanvas = () => {
    if (hasPreviousCanvas) setPreviousCanvas();
  };

  if (position === 'off') {
    return null;
  }
  const htmlDir = viewingDirection === 'right-to-left' ? 'rtl' : 'ltr';
  const itemData = {
    canvasGroupings,
    height: thumbnailNavigation.height - spacing - scrollbarSize,
    position,
    windowId,
  };
  return (
    <Paper
      className={classNames(
        ns('thumb-navigation'),
      )}
      sx={{
        '&:focus': {
          boxShadow: 0,
          outline: 0,
        },
      }}
      aria-label={t('thumbnailNavigation')}
      square
      elevation={0}
      style={style()}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="grid"
    >
      <div role="row" style={{ height: '100%', width: '100%' }}>
        { canvasGroupings.length > 0 && (
        <AutoSizer
          defaultHeight={100}
          defaultWidth={400}
        >
          {({ height, width }) => (
            <List
              direction={htmlDir}
              height={areaHeight(height)}
              itemCount={itemCount()}
              itemSize={calculateScaledSize}
              width={width}
              layout={(position === 'far-bottom') ? 'horizontal' : 'vertical'}
              itemData={itemData}
              ref={gridRef}
            >
              {ThumbnailCanvasGrouping}
            </List>
          )}
        </AutoSizer>
        )}
      </div>
    </Paper>
  );
}

ThumbnailNavigation.propTypes = {
  canvasGroupings: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  canvasIndex: PropTypes.number.isRequired,
  hasNextCanvas: PropTypes.bool,
  hasPreviousCanvas: PropTypes.bool,
  position: PropTypes.string.isRequired,
  setNextCanvas: PropTypes.func,
  setPreviousCanvas: PropTypes.func,
  thumbnailNavigation: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  view: PropTypes.string,
  viewingDirection: PropTypes.string,
  windowId: PropTypes.string.isRequired,
};

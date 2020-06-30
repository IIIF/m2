import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SearchIcon from '@material-ui/icons/SearchSharp';
import classNames from 'classnames';
import MiradorCanvas from '../lib/MiradorCanvas';
import IIIFThumbnail from '../containers/IIIFThumbnail';

/**
 * Represents a WindowViewer in the mirador workspace. Responsible for mounting
 * OSD and Navigation
 */
export class GalleryViewThumbnail extends Component {
  /** */
  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  /** @private */
  handleSelect() {
    const {
      canvas, selected, setCanvas, focusOnCanvas,
    } = this.props;

    if (selected) {
      focusOnCanvas();
    } else {
      setCanvas(canvas.id);
    }
  }

  /** @private */
  handleKey(event) {
    const {
      canvas, setCanvas, focusOnCanvas,
    } = this.props;

    this.keys = {
      enter: 'Enter',
      space: ' ',
    };

    this.chars = {
      enter: 13,
      space: 32,
    };

    const enterOrSpace = (
      event.key === this.keys.enter
      || event.which === this.chars.enter
      || event.key === this.keys.space
      || event.which === this.chars.space
    );

    if (enterOrSpace) {
      focusOnCanvas();
    } else {
      setCanvas(canvas.index, canvas.id);
    }
  }

  /**
   * Renders things
   */
  render() {
    const {
      annotationsCount, canvas, classes, config, selected,
    } = this.props;

    const miradorCanvas = new MiradorCanvas(canvas);

    return (
      <div
        key={canvas.index}
        className={
          classNames(
            classes.galleryViewItem,
            selected ? classes.selected : '',
            annotationsCount > 0 ? classes.hasAnnotations : '',
          )
        }
        onClick={this.handleSelect}
        onKeyUp={this.handleKey}
        role="button"
        tabIndex={0}
      >
        <IIIFThumbnail
          resource={canvas}
          labelled
          variant="outside"
          maxWidth={config.width}
          maxHeight={config.height}
          style={{
            margin: '0 auto',
            maxWidth: `${Math.ceil(config.height * miradorCanvas.aspectRatio)}px`,
          }}
        >
          { annotationsCount > 0 && (
            <Chip
              avatar={(
                <Avatar className={classes.avatar} classes={{ circle: classes.avatarIcon }}>
                  <SearchIcon fontSize="small" />
                </Avatar>
              )}
              label={annotationsCount}
              className={
                classNames(
                  classes.chip,
                )
              }
              size="small"
            />
          )}
        </IIIFThumbnail>
      </div>
    );
  }
}

GalleryViewThumbnail.propTypes = {
  annotationsCount: PropTypes.number,
  canvas: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  config: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  focusOnCanvas: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  setCanvas: PropTypes.func.isRequired,
};

GalleryViewThumbnail.defaultProps = {
  annotationsCount: 0,
  config: {
    height: 100,
    width: null,
  },
  selected: false,
};

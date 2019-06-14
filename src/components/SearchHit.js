import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import SanitizedHtml from '../containers/SanitizedHtml';

/** */
export class SearchHit extends Component {
  /** */
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  /** */
  handleClick() {
    const {
      hit, selectContentSearchAnnotation, windowId,
    } = this.props;

    selectContentSearchAnnotation(windowId, hit.annotations);
  }

  /** */
  render() {
    const {
      canvasLabel,
      classes,
      hit,
      focused,
      index,
      showDetails,
      selected,
      t,
      truncated,
    } = this.props;

    if (focused && !selected) return null;

    return (
      <ListItem
        className={clsx(
          classes.listItem,
          {
            [classes.selected]: selected,
            [classes.focused]: focused,
          },
        )}
        button={!selected}
        component="li"
        onClick={this.handleClick}
        selected={selected}
      >
        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
          <Typography className={classes.canvasLabel}>
            <Chip component="span" label={index + 1} className={classes.hitCounter} />
            {canvasLabel}
          </Typography>
          <SanitizedHtml ruleSet="iiif" htmlString={hit.before} />
          {' '}
          <strong>
            <SanitizedHtml ruleSet="iiif" htmlString={hit.match} />
          </strong>
          {' '}
          <SanitizedHtml ruleSet="iiif" htmlString={hit.after} />
          {' '}
          { truncated && !focused && (
            <Button className={classes.inlineButton} onClick={showDetails} color="secondary" size="small">
              {t('more')}
            </Button>
          )}
        </ListItemText>
      </ListItem>
    );
  }
}

SearchHit.propTypes = {
  canvasLabel: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.string),
  focused: PropTypes.bool,
  hit: PropTypes.shape({
    after: PropTypes.string,
    before: PropTypes.string,
    match: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
  selectContentSearchAnnotation: PropTypes.func,
  selected: PropTypes.bool,
  showDetails: PropTypes.func,
  t: PropTypes.func,
  truncated: PropTypes.bool,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

SearchHit.defaultProps = {
  canvasLabel: undefined,
  classes: {},
  focused: false,
  index: undefined,
  selectContentSearchAnnotation: () => {},
  selected: false,
  showDetails: () => {},
  t: k => k,
  truncated: true,
};

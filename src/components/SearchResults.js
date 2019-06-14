import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import BackIcon from '@material-ui/icons/ArrowBackSharp';
import SearchHit from '../containers/SearchHit';

/** */
export class SearchResults extends Component {
  /** */
  constructor(props) {
    super(props);

    this.state = { focused: false };

    this.toggleFocus = this.toggleFocus.bind(this);
  }

  /** */
  toggleFocus() {
    const {
      focused,
    } = this.state;

    this.setState({ focused: !focused });
  }

  /** */
  render() {
    const {
      classes,
      searchHits,
      startIndex,
      t,
      windowId,
    } = this.props;

    const {
      focused,
    } = this.state;

    return (
      <>
        { focused && (
          <Button onClick={this.toggleFocus} className={classes.navigation} size="small">
            <BackIcon />
            {t('backToResults')}
          </Button>
        )}
        <List>
          {
            searchHits.map((hit, index) => (
              <SearchHit
                key={hit.annotations[0]}
                focused={focused}
                hit={hit}
                index={startIndex + index}
                windowId={windowId}
                showDetails={this.toggleFocus}
              />
            ))
          }
        </List>
      </>
    );
  }
}

SearchResults.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  searchHits: PropTypes.arrayOf(PropTypes.object).isRequired,
  startIndex: PropTypes.number,
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

SearchResults.defaultProps = {
  classes: {},
  startIndex: 0,
  t: k => k,
};

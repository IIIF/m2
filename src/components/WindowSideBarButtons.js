import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/InfoSharp';
import AnnotationIcon from '@material-ui/icons/CommentSharp';
import CanvasIndexIcon from './icons/CanvasIndexIcon';

/**
 *
 */
export class WindowSideBarButtons extends Component {
  /**
   *
   * @param {object} event
   */
  static selectPreviousTab(event) {
    const { previousSibling } = event.target;
    previousSibling && previousSibling.focus();
  }

  /**
   *
   * @param {object} event
   */
  static selectNextTab(event) {
    const { nextSibling } = event.target;
    nextSibling && nextSibling.focus();
  }

  /**
   *
   * @param {object} event the onKeyDown event
   */
  static handleKeyPress(event) {
    switch (event.keyCode) {
      case 38: // arrow up
        event.preventDefault();
        return WindowSideBarButtons.selectPreviousTab(event);
      case 40: // arrow down
        event.preventDefault();
        return WindowSideBarButtons.selectNextTab(event);
      default:
        return null;
    }
  }

  /** */
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @param {object} event the change event
   * @param {string} value the tab's value
  */
  handleChange(event, value) {
    const { addCompanionWindow } = this.props;

    addCompanionWindow(value);
  }

  /**
   * render
   *
   * @return {type}  description
   */
  render() {
    const {
      classes, hasAnnotations, sideBarPanel, t,
    } = this.props;

    return (
      <Tabs
        classes={{ flexContainer: classes.tabsFlexContainer, indicator: classes.tabsIndicator }}
        value={sideBarPanel === 'closed' ? false : sideBarPanel}
        onChange={this.handleChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="secondary"
        aria-orientation="vertical"
      >
        <Tab
          classes={{ root: classes.tab, selected: classes.tabSelected }}
          aria-label={
            t('openInfoCompanionWindow')
          }
          icon={(
            <Tooltip title={t('openInfoCompanionWindow')}>
              <InfoIcon />
            </Tooltip>
          )}
          onKeyDown={WindowSideBarButtons.handleKeyPress}
          value="info"
        />
        <Tab
          classes={{ root: classes.tab, selected: classes.tabSelected }}
          aria-label={
            t('openCanvasNavigationCompanionWindow')
          }
          icon={(
            <Tooltip title={t('openCanvasNavigationCompanionWindow')}>
              <CanvasIndexIcon />
            </Tooltip>
          )}
          onKeyDown={WindowSideBarButtons.handleKeyPress}
          value="canvas_navigation"
        />
        <Tab
          classes={{ root: classes.tab, selected: classes.tabSelected }}
          aria-label={
            t('openAnnotationCompanionWindow')
          }
          icon={(
            <Tooltip title={t('openAnnotationCompanionWindow')}>
              <Badge color="error" invisible={!hasAnnotations} variant="dot">
                <AnnotationIcon />
              </Badge>
            </Tooltip>
          )}
          onKeyDown={WindowSideBarButtons.handleKeyPress}
          value="annotations"
        />
      </Tabs>
    );
  }
}

WindowSideBarButtons.propTypes = {
  hasAnnotations: PropTypes.bool,
  addCompanionWindow: PropTypes.func.isRequired,
  sideBarPanel: PropTypes.string,
  t: PropTypes.func,
  classes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

WindowSideBarButtons.defaultProps = {
  hasAnnotations: false,
  sideBarPanel: 'closed',
  t: key => key,
  classes: {},
};

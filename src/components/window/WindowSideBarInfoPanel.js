import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { SanitizedHtml } from '../SanitizedHtml';
import { LabelValueMetadata } from './LabelValueMetadata';
import CompanionWindow from '../../containers/window/CompanionWindow';
import ns from '../../config/css-ns';


/**
 * WindowSideBarInfoPanel
 */
export class WindowSideBarInfoPanel extends Component {
  /**
   * render
   * @return
   */
  render() {
    const {
      canvasDescription,
      canvasLabel,
      canvasMetadata,
      manifestDescription,
      manifestLabel,
      manifestMetadata,
      manifestUrl,
      windowId,
      id,
      classes,
      t,
    } = this.props;

    return (
      <CompanionWindow title={t('aboutThisItem')} paperClassName={ns('window-sidebar-info-panel')} windowId={windowId} id={id}>
        <div className={classes.section}>
          {canvasLabel && (
            <>
              <Typography variant="overline" id={`${id}-currentItem`}>{t('currentItem')}</Typography>
              <Typography aria-labelledby={`${id}-currentItem`} variant="h4">
                {canvasLabel}
              </Typography>
            </>
          )}

          {canvasDescription && (
            <Typography variant="body1">
              <SanitizedHtml htmlString={canvasDescription} ruleSet="iiif" />
            </Typography>
          )}

          {canvasMetadata.length > 0 && (
            <LabelValueMetadata labelValuePairs={canvasMetadata} />
          )}
        </div>

        <div className={classes.section}>
          {manifestLabel && (
            <>
              <Typography variant="overline" id={`${id}-resource`}>{t('resource')}</Typography>
              <Typography aria-labelledby={`${id}-resource`} variant="h4">
                {manifestLabel}
              </Typography>
            </>
          )}

          {manifestDescription && (
            <Typography variant="body1">
              <SanitizedHtml htmlString={manifestDescription} ruleSet="iiif" />
            </Typography>
          )}

          {manifestMetadata.length > 0 && (
            <LabelValueMetadata labelValuePairs={manifestMetadata} />
          )}
        </div>

        <div className={classes.section}>
          <Typography variant="overline" id={`${id}-related`}>{t('related')}</Typography>
          <Typography aria-labelledby={`${id}-related`} variant="h4">
            {t('links')}
          </Typography>
          <dl className={ns('label-value-metadata')}>
            { manifestUrl && (
              <>
                <Typography variant="subtitle2" component="dt">{t('iiif_manifest')}</Typography>
                <Typography variant="body1" component="dd">
                  <a target="_blank" rel="noopener noreferrer" href={manifestUrl}>{manifestUrl}</a>
                </Typography>
              </>
            )}
          </dl>
        </div>
      </CompanionWindow>
    );
  }
}

WindowSideBarInfoPanel.propTypes = {
  canvasDescription: PropTypes.string,
  canvasLabel: PropTypes.string,
  canvasMetadata: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  classes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  id: PropTypes.string.isRequired,
  manifestDescription: PropTypes.string,
  manifestLabel: PropTypes.string,
  manifestMetadata: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  manifestUrl: PropTypes.string,
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired,
};

WindowSideBarInfoPanel.defaultProps = {
  canvasDescription: null,
  canvasLabel: null,
  canvasMetadata: [],
  classes: {},
  manifestDescription: null,
  manifestLabel: null,
  manifestMetadata: [],
  manifestUrl: null,
  t: key => key,
};

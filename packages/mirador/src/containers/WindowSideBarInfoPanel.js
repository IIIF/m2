import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import {
  getCompanionWindow,
  getManifestLocale,
  getMetadataLocales,
  getVisibleCanvasIds,
  getWindowConfig,
  getWindow,
} from '../state/selectors';
import { WindowSideBarInfoPanel } from '../components/WindowSideBarInfoPanel';

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowSideBarInfoPanel
 * @private
 */
const mapStateToProps = (state, { id, windowId }) => ({
  availableLocales: getMetadataLocales(state, { companionWindowId: id, windowId }),
  canvasIds: getVisibleCanvasIds(state, { windowId }),
  collectionPath: (getWindow(state, { windowId }) || {}).collectionPath,
  locale: getCompanionWindow(state, { companionWindowId: id }).locale
    || getManifestLocale(state, { windowId }),
  showLocalePicker: getWindowConfig(state, { windowId }).showLocalePicker,
});

/** */
const mapDispatchToProps = (dispatch, { windowId, id }) => ({
  setLocale: locale => dispatch(actions.updateCompanionWindow(windowId, id, { locale })),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('WindowSideBarInfoPanel'),
);

export default enhance(WindowSideBarInfoPanel);

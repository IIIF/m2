import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getManifestoInstance, getVisibleCanvasAudioResources, getVisibleCanvasTextResources,
  getVisibleCanvasVideoResources, getWindow,
} from '../state/selectors';
import { PrimaryWindow } from '../components/PrimaryWindow';

/** */
const mapStateToProps = (state, { windowId }) => {
  const manifestoInstance = getManifestoInstance(state, { windowId });
  return {
    audioResources: getVisibleCanvasAudioResources(state, { windowId }) || [],
    isCollection: manifestoInstance && manifestoInstance.isCollection(),
    isCollectionDialogVisible: getWindow(state, { windowId }).collectionDialogOn,
    textResources: getVisibleCanvasTextResources(state, { windowId }) || [],
    videoResources: getVisibleCanvasVideoResources(state, { windowId }) || [],
  };
};

const enhance = compose(
  connect(mapStateToProps, null),
  withPlugins('PrimaryWindow'),
);

export default enhance(PrimaryWindow);

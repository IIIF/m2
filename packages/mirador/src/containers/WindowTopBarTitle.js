import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { getManifestStatus, getManifestTitle, getWindowConfig } from '../state/selectors';
import { WindowTopBarTitle } from '../components/WindowTopBarTitle';

/** mapStateToProps */
const mapStateToProps = (state, { windowId }) => ({
  error: getManifestStatus(state, { windowId }).error,
  hideWindowTitle: getWindowConfig(state, { windowId }).hideWindowTitle,
  isFetching: getManifestStatus(state, { windowId }).isFetching,
  manifestTitle: getManifestTitle(state, { windowId }),
});

const enhance = compose(
  connect(mapStateToProps, null),
  withPlugins('WindowTopBarTitle'),
);

export default enhance(WindowTopBarTitle);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { SearchPanelControls } from '../components/SearchPanelControls';
import * as actions from '../state/actions';
import {
  getManifestAutocompleteService,
  getManifestSearchService,
  getSearchIsFetching,
  getSearchQuery,
} from '../state/selectors';

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SearchPanelControls
 * @private
 */
const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  autocompleteService: getManifestAutocompleteService(state, { windowId }),
  query: getSearchQuery(state, { companionWindowId, windowId }),
  searchIsFetching: getSearchIsFetching(state, { companionWindowId, windowId }),
  searchService: getManifestSearchService(state, { windowId }),
});

/**
 * mapDispatchToProps - to hook up connect
 * @memberof SearchPanelControls
 * @private
 */
const mapDispatchToProps = {
  fetchSearch: actions.fetchSearch,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SearchPanelControls'),
);

export default enhance(SearchPanelControls);

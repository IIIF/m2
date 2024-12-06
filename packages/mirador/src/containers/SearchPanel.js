import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../state/actions';
import { withPlugins } from '../extend/withPlugins';
import { SearchPanel } from '../components/SearchPanel';
import { getManifestSearchService, getSearchQuery, getWindow } from '../state/selectors';

/** */
const mapStateToProps = (state, { id, windowId }) => ({
  query: getSearchQuery(state, { companionWindowId: id, windowId }),
  searchService: getManifestSearchService(state, { windowId }),
  suggestedSearches: getWindow(state, { windowId }).suggestedSearches,
});

/** */
const mapDispatchToProps = (dispatch, props) => ({
  fetchSearch: (searchId, query) => dispatch(
    actions.fetchSearch(props.windowId, props.id, searchId, query),
  ),
  removeSearch: () => dispatch(actions.removeSearch(props.windowId, props.id)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SearchPanel'),
);

export default enhance(SearchPanel);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { SearchResults } from '../components/SearchResults';
import * as actions from '../state/actions';
import {
  getNextSearchId,
  getSearchQuery,
  getSearchIsFetching,
  getSearchNumTotal,
  getSortedSearchHitsForCompanionWindow,
  getSortedSearchAnnotationsForCompanionWindow,
} from '../state/selectors';

/**
 * mapStateToProps - used to hook up connect to state
 * @memberof SearchResult
 * @private
 */
const mapStateToProps = (state, { companionWindowId, windowId }) => ({
  isFetching: getSearchIsFetching(state, { companionWindowId, windowId }),
  nextSearch: getNextSearchId(state, { companionWindowId, windowId }),
  query: getSearchQuery(state, { companionWindowId, windowId }),
  searchAnnotations:
    getSortedSearchAnnotationsForCompanionWindow(state, { companionWindowId, windowId }),
  searchHits: getSortedSearchHitsForCompanionWindow(state, { companionWindowId, windowId }),
  searchNumTotal: getSearchNumTotal(state, { companionWindowId, windowId }),
});

const mapDispatchToProps = {
  fetchSearch: actions.fetchSearch,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SearchResults'),
);

export default enhance(SearchResults);

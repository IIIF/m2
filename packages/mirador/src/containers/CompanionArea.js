import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import {
  getCompanionWindowIdsForPosition, getCompanionAreaVisibility, getThemeDirection, getWindow,
} from '../state/selectors';
import * as actions from '../state/actions';
import { CompanionArea } from '../components/CompanionArea';

/** */
const mapStateToProps = (state, { windowId, position }) => ({
  companionAreaOpen: getCompanionAreaVisibility(state, { position, windowId }),
  companionWindowIds: getCompanionWindowIdsForPosition(state, { position, windowId }),
  direction: getThemeDirection(state),
  sideBarOpen: (getWindow(state, { windowId }) || {}).sideBarOpen,
});

const mapDispatchToProps = ({
  setCompanionAreaOpen: actions.setCompanionAreaOpen,
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('CompanionArea'),
);

export default enhance(CompanionArea);

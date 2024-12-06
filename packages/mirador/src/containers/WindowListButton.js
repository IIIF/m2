import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { getWindowIds, getWorkspace } from '../state/selectors';
import { WindowListButton } from '../components/WindowListButton';

/** */
const mapStateToProps = (state) => ({
  disabled: getWorkspace(state).isWorkspaceAddVisible,
  windowCount: getWindowIds(state).length,
});

const enhance = compose(
  connect(mapStateToProps, null),
  withPlugins('WindowListButton'),
);

export default enhance(WindowListButton);

import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceControlPanel } from '../components/WorkspaceControlPanel';

const enhance = compose(
  withPlugins('WorkspaceControlPanel'),
  // further HOC go here
);

export default enhance(WorkspaceControlPanel);

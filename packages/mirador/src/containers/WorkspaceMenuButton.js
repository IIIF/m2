import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceMenuButton } from '../components/WorkspaceMenuButton';

const enhance = compose(
  withPlugins('WorkspaceMenuButton'),
  // further HOC
);

export default enhance(WorkspaceMenuButton);

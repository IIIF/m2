import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WorkspaceOptionsButton } from '../components/WorkspaceOptionsButton';

const enhance = compose(
  withPlugins('WorkspaceOptionsButton'),
);

export default enhance(WorkspaceOptionsButton);

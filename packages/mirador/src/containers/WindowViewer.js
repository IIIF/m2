import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WindowViewer } from '../components/WindowViewer';

const enhance = compose(
  withPlugins('WindowViewer'),
  // further HOC go here
);

export default enhance(WindowViewer);

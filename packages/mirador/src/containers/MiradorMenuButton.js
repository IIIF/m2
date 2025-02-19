import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { MiradorMenuButton } from '../components/MiradorMenuButton';

const enhance = compose(
  withPlugins('MiradorMenuButton'),
);

export default enhance(MiradorMenuButton);

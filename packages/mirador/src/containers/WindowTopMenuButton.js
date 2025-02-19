import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WindowTopMenuButton } from '../components/WindowTopMenuButton';

const enhance = compose(
  withPlugins('WindowTopMenuButton'),
);

export default enhance(WindowTopMenuButton);

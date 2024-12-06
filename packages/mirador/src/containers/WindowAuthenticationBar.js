import { compose } from 'redux';
import { withPlugins } from '../extend/withPlugins';
import { WindowAuthenticationBar } from '../components/WindowAuthenticationBar';

const enhance = compose(
  withPlugins('WindowAuthenticationBar'),
);

export default enhance(WindowAuthenticationBar);

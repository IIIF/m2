import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { WindowTopBarPluginArea } from '../components/WindowTopBarPluginArea';

const enhance = compose(
  connect(null, null),
  withPlugins('WindowTopBarPluginArea'),
);

export default enhance(WindowTopBarPluginArea);

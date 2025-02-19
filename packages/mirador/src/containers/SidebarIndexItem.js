import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { SidebarIndexItem } from '../components/SidebarIndexItem';

const enhance = compose(
  connect(null, null),
  withPlugins('SidebarIndexItem'),
);

export default enhance(SidebarIndexItem);

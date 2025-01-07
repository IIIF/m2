import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { withPlugins } from '../extend/withPlugins';
import { WindowTopBarMenu } from '../components/WindowTopBarMenu';

const enhance = compose(
  withTranslation(),
  withPlugins('WindowTopBarMenu'),
);

export default enhance(WindowTopBarMenu);

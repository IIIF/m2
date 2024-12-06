import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getThemeIds, getConfig } from '../state/selectors';
import { ChangeThemeDialog } from '../components/ChangeThemeDialog';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ChangeThemeDialog
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  setSelectedTheme: theme => dispatch(actions.updateConfig({ selectedTheme: theme })),
});

/**
 * mapStateToProps - to hook up connect
 * @memberof ChangeThemeDialog
 * @private
 */
const mapStateToProps = state => ({
  selectedTheme: getConfig(state).selectedTheme,
  themeIds: getThemeIds(state),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('ChangeThemeDialog'),
);

export default enhance(ChangeThemeDialog);

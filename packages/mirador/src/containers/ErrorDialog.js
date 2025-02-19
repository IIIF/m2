import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { ErrorDialog } from '../components/ErrorDialog';
import * as actions from '../state/actions';
import { getLatestError } from '../state/selectors';

/**
 * mapStateToProps - to hook up connect
 * @memberof ErrorDialog
 * @private
 */
const mapStateToProps = state => ({
  error: getLatestError(state),
});

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof App
 * @private
 */
const mapDispatchToProps = {
  removeError: actions.removeError,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('ErrorDialog'),
);

export default enhance(ErrorDialog);

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import { getCompanionWindow } from '../state/selectors';
import { CompanionWindowFactory } from '../components/CompanionWindowFactory';

/**
 * mapStateToProps - to hook up connect
 * @memberof CompanionWindow
 * @private
 */
const mapStateToProps = (state, { id }) => {
  const companionWindow = getCompanionWindow(state, { companionWindowId: id });

  return {
    content: companionWindow.content,
    id,
  };
};

const enhance = compose(
  connect(mapStateToProps),
  withPlugins('CompanionWindowFactory'),
);

export default enhance(CompanionWindowFactory);

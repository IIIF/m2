import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getLanguagesFromConfigWithCurrent } from '../state/selectors';
import { LanguageSettings } from '../components/LanguageSettings';

/**
 * Map state to props for connect
 */
const mapStateToProps = state => ({
  languages: getLanguagesFromConfigWithCurrent(state),
});

/**
 * Map action dispatches to props for connect
 */
const mapDispatchToProps = (dispatch, { afterSelect }) => ({
  handleClick: (language) => {
    dispatch(actions.updateConfig({ language }));

    afterSelect && afterSelect();
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('LanguageSettings'),
)(LanguageSettings);

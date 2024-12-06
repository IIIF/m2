import { compose } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../state/actions';
import { withPlugins } from '../extend/withPlugins';
import {
  getWindow,
} from '../state/selectors';
import { SelectCollection } from '../components/SelectCollection';

/** */
const mapStateToProps = (state, { windowId }) => {
  const { collectionPath, manifestId } = (getWindow(state, { windowId }) || {});

  return {
    collectionPath,
    manifestId,
  };
};

const mapDispatchToProps = {
  showCollectionDialog: actions.showCollectionDialog,
};

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPlugins('SelectCollection'),
);

export default enhance(SelectCollection);

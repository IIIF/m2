import React from 'react';
import PropTypes from 'prop-types';
import Window from '../containers/Window';
import WorkspaceMosaic from '../containers/WorkspaceMosaic';
import { WorkspaceContext } from '../contexts';
import ns from '../config/css-ns';
/**
 * Represents a work area that contains any number of windows
 * @memberof Workspace
 * @private
 */
class Workspace extends React.Component {
  /**
   */
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  /**
   * Determine which workspace to render by configured type
   */
  workspaceByType() {
    const { workspaceType, windows } = this.props;
    switch (workspaceType) {
      case 'mosaic':
        return <WorkspaceMosaic windows={windows} />;
      default:
        return Object.values(windows).map(window => (
          <Window
            key={window.id}
            window={window}
          />
        ));
    }
  }

  /**
   * render
   */
  render() {
    return (
      <div className={ns('workspace')} ref={this.ref}>
        <WorkspaceContext.Provider value={this.ref}>
          {this.workspaceByType()}
        </WorkspaceContext.Provider>
      </div>
    );
  }
}

Workspace.propTypes = {
  windows: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  workspaceType: PropTypes.string.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Workspace;

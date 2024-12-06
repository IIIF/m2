import PropTypes from 'prop-types';
import { styled, lighten, darken } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import ErrorDialog from '../containers/ErrorDialog';
import WorkspaceControlPanel from '../containers/WorkspaceControlPanel';
import Workspace from '../containers/Workspace';
import WorkspaceAdd from '../containers/WorkspaceAdd';
import BackgroundPluginArea from '../containers/BackgroundPluginArea';
import ns from '../config/css-ns';

const Root = styled('div', { name: 'WorkspaceArea', slot: 'root' })(({ theme }) => {
  const getBackgroundColor = theme.palette.mode === 'light' ? darken : lighten;

  return {
    background: getBackgroundColor(theme.palette.shades.light, 0.1),
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  };
});

const ViewerArea = styled('main', { name: 'WorkspaceArea', slot: 'viewer' })(() => ({
  flexGrow: 1,
  position: 'relative',
}));

/**
 * This is the top level Mirador component.
 * @prop {Object} manifests
 */
export function WorkspaceArea({
  areaRef = null,
  controlPanelVariant = undefined,
  isWorkspaceAddVisible = false,
  isWorkspaceControlPanelVisible,
  lang = undefined,
}) {
  const { t } = useTranslation();
  const ownerState = arguments[0]; // eslint-disable-line prefer-rest-params

  return (
    <Root ownerState={ownerState}>
      {
        isWorkspaceControlPanelVisible
          && <WorkspaceControlPanel variant={controlPanelVariant} />
      }
      <ViewerArea
        className={ns('viewer')}
        lang={lang}
        aria-label={t('workspace')}
        {...(areaRef ? { ref: areaRef } : {})}
      >
        {
          isWorkspaceAddVisible
            ? <WorkspaceAdd />
            : <Workspace />
        }
        <ErrorDialog />
        <BackgroundPluginArea />
      </ViewerArea>
    </Root>
  );
}

WorkspaceArea.propTypes = {
  areaRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  controlPanelVariant: PropTypes.string,
  isWorkspaceAddVisible: PropTypes.bool,
  isWorkspaceControlPanelVisible: PropTypes.bool.isRequired,
  lang: PropTypes.string,
};

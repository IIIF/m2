import FullScreenButton from '../containers/FullScreenButton';
import WorkspaceMenuButton from '../containers/WorkspaceMenuButton';
import WorkspaceOptionsButton from '../containers/WorkspaceOptionsButton';
import WindowListButton from '../containers/WindowListButton';
import { PluginHook } from './PluginHook';

/**
 *
 */
export function WorkspaceControlPanelButtons({ ...rest }) {
  return (
    <>
      <WindowListButton />
      <WorkspaceMenuButton />
      <WorkspaceOptionsButton />
      <FullScreenButton />
      <PluginHook {...rest} />
    </>
  );
}

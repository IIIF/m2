import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { WindowSideBarButtons } from '../../../src/components/WindowSideBarButtons';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WindowSideBarButtons
      addCompanionWindow={() => {}}
      {...props}
      panels={{
        annotations: true,
        attribution: true,
        canvas: true,
        info: true,
        search: false,
        ...props.panels,
      }}
    />,
  );
}
/* eslint-disable testing-library/no-node-access */
describe('WindowSideBarButtons', () => {
  const windowId = 'test123';
  let user;
  let wrapper;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders without an error', () => {
    wrapper = createWrapper({ windowId });
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('triggers the addCompanionWindow prop on click', async () => {
    const addCompanionWindow = vi.fn();
    wrapper = createWrapper({ addCompanionWindow, windowId });

    await user.click(screen.getByRole('tab', { name: 'Information' }));

    expect(addCompanionWindow).toHaveBeenCalledTimes(1);
    expect(addCompanionWindow).toHaveBeenCalledWith('info');
  });

  it('has a badge indicating if the annotations panel has annotations', () => {
    let tab;
    wrapper = createWrapper({ hasAnnotations: true, windowId });

    tab = screen.getByRole('tab', { name: 'Annotations' });
    expect(tab).toBeInTheDocument();
    expect(tab.querySelector('.MuiBadge-dot:not(.MuiBadge-invisible)')).toBeInTheDocument();

    wrapper.unmount();

    wrapper = createWrapper({ hasAnnotations: false, hasAnyAnnotations: true, windowId });

    tab = screen.getByRole('tab', { name: 'Annotations' });
    expect(tab.querySelector('.MuiBadge-dot.MuiBadge-invisible')).toBeInTheDocument();
  });

  it('hides the annotation panel if there are no annotations', () => {
    wrapper = createWrapper({ hasAnyAnnotations: false, windowId });

    expect(screen.queryByRole('tab', { name: 'Annotations' })).not.toBeInTheDocument();
  });

  it('can hide annotation panel when configured to do so', () => {
    wrapper = createWrapper({ hasAnnotations: true, panels: { annotations: false }, windowId });

    expect(screen.queryByRole('tab', { name: 'Annotations' })).not.toBeInTheDocument();
  });

  describe('search', () => {
    it('by default is off', () => {
      expect(screen.queryByRole('tab', { name: 'Search' })).not.toBeInTheDocument();
    });

    it('can be configured to be on', () => {
      wrapper = createWrapper({ hasSearchService: true, panels: { search: true }, windowId });
      expect(screen.getByRole('tab', { name: 'Search' })).toBeInTheDocument();
    });

    it('has a badge indicating if the search panel has active annotations', () => {
      let tab;
      wrapper = createWrapper({
        hasSearchResults: true,
        hasSearchService: true,
        panels: {
          search: true,
        },
        windowId,
      });
      tab = screen.getByRole('tab', { name: 'Search' });
      expect(tab.querySelector('.MuiBadge-dot:not(.MuiBadge-invisible)')).toBeInTheDocument();

      wrapper.unmount();

      wrapper = createWrapper({
        hasSearchResults: false,
        hasSearchService: true,
        panels: {
          search: true,
        },
        windowId,
      });
      tab = screen.getByRole('tab', { name: 'Search' });

      expect(tab.querySelector('.MuiBadge-dot.MuiBadge-invisible')).toBeInTheDocument();
    });
  });

  describe('layers', () => {
    it('by default is off', () => {
      expect(screen.queryByRole('tab', { name: 'Layers' })).not.toBeInTheDocument();
    });

    it('can be configured to be on', () => {
      wrapper = createWrapper({ hasAnyLayers: true, panels: { layers: true }, windowId });
      expect(screen.getByRole('tab', { name: 'Layers' })).toBeInTheDocument();
    });

    it('has a badge indicating if there are currently any layers', () => {
      let tab;
      wrapper = createWrapper({
        hasAnyLayers: true,
        hasCurrentLayers: true,
        panels: {
          layers: true,
        },
        windowId,
      });
      tab = screen.getByRole('tab', { name: 'Layers' });
      expect(tab.querySelector('.MuiBadge-dot:not(.MuiBadge-invisible)')).toBeInTheDocument();

      wrapper.unmount();

      wrapper = createWrapper({
        hasAnyLayers: true,
        hasCurrentLayers: false,
        panels: {
          layers: true,
        },
        windowId,
      });
      tab = screen.getByRole('tab', { name: 'Layers' });

      expect(tab.querySelector('.MuiBadge-dot.MuiBadge-invisible')).toBeInTheDocument();
    });
  });
});

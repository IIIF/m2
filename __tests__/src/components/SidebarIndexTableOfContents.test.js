import { render, screen, waitFor } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';
import { act } from '@testing-library/react';
import { SidebarIndexTableOfContents } from '../../../src/components/SidebarIndexTableOfContents';
import ConnectedSidebarIndexTableOfContents from '../../../src/containers/SidebarIndexTableOfContents';
import manifestVersion2 from '../../fixtures/version-2/structures.json';
import manifestVersion3 from '../../fixtures/version-3/structures.json';

/**
 * Create wrapper for SidebarIndexTableOfContents component
 * @param {*} props
 */
function createWrapper(props) {
  const manifest = Utils.parseManifest(props.manifest ? props.manifest : manifestVersion2);
  return render(
    <SidebarIndexTableOfContents
      id="something"
      classes={{}}
      treeStructure={props.treeStructure ? props.treeStructure : manifest.getDefaultTree()}
      visibleNodeIds={props.visibleNodeIds ? props.visibleNodeIds : []}
      expandedNodeIds={props.expandedNodeIds ? props.expandedNodeIds : []}
      containerRef={props.containerRef}
      nodeIdToScrollTo={props.nodeIdToScrollTo}
      {...props}
    />,
  );
}

/**
 * Create an interactive wrapper for SidebarIndexTableOfContents component hooked up
 * to the redux store (because the controlled treeview really needs to be connected to
 * write a reasonable test for it)
 */
function createInteractiveWrapper({ manifest = manifestVersion3, ...props }) {
  return render(
    <ConnectedSidebarIndexTableOfContents
      id="something"
      windowId="a"
      {...props}
    />,
    {
      preloadedState: {
        companionWindows: {
          something: {
            id: 'something',
          },
        },
        manifests: {
          'http://example.com/manifest.json': {
            json: manifest,
          },
        },
        windows: {
          a: { manifestId: 'http://example.com/manifest.json' },
        },
      },
    },
  );
}

describe('SidebarIndexTableOfContents', () => {
  let setCanvas;

  beforeEach(() => {
    setCanvas = vi.fn();
  });

  it('does not render a TreeView if the tree structure is missing', () => {
    const { container } = createWrapper({
      treeStructure: undefined,
    });

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a tree item for every visible node', () => {
    const { unmount } = createWrapper({});
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);

    unmount();

    createWrapper({
      treeStructure: {
        nodes: [
          {
            id: '0',
            nodes: [
              {
                id: '0-0',
                nodes: [],
              },
              {
                id: '0-1',
                nodes: [],
              },
            ],
          },
        ],
      },
    });
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
  });

  it('accepts missing nodes property for tree structure and tree nodes', () => {
    const { unmount } = createWrapper({
      treeStructure: { nodes: undefined },
    });
    expect(screen.queryByRole('treeitem')).not.toBeInTheDocument();
    unmount();
    createWrapper({
      treeStructure: {
        nodes: [{ id: '0' }],
      },
    });
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
  });

  it('toggles branch nodes on click', async () => {
    const user = userEvent.setup();
    const { store } = createInteractiveWrapper({});
    expect(screen.getByRole('treeitem')).toBeInTheDocument();
    const root = screen.getByRole('treeitem');

    await user.click(root.querySelector('.MuiTreeItem-iconContainer')); // eslint-disable-line testing-library/no-node-access
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);

    await user.click(root.querySelector('.MuiTreeItem-iconContainer')); // eslint-disable-line testing-library/no-node-access

    await waitFor(() => {
      expect(screen.getByRole('treeitem')).toBeInTheDocument();
    });
    expect(store.getState().windows.a.canvasId).toBeUndefined();
  });

  it('toggles branch nodes with arrow keys', async () => {
    const user = userEvent.setup();

    const { store } = createInteractiveWrapper({});
    const root = screen.getByRole('treeitem');
    act(() => {
      root.focus();
    });
    await user.keyboard('{ArrowRight}');

    expect(screen.getAllByRole('treeitem')).toHaveLength(5);
    await user.keyboard('{ArrowLeft}');

    await waitFor(() => {
      expect(screen.getByRole('treeitem')).toBeInTheDocument();
    });

    expect(store.getState().windows.a.canvasId).toBeUndefined();
  });

  it('toggles branch nodes with Space or Enter key', async () => {
    const user = userEvent.setup();

    const { store } = createInteractiveWrapper({});
    const root = screen.getByRole('treeitem');

    act(() => {
      root.focus();
    });
    await user.keyboard('{Enter}');
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);
    await user.keyboard('{ArrowLeft}');
    await waitFor(() => {
      expect(screen.getByRole('treeitem')).toBeInTheDocument();
    });
    await user.keyboard(' ');
    expect(screen.getAllByRole('treeitem')).toHaveLength(5);

    expect(store.getState().windows.a.canvasId).toBeUndefined();
  });

  it('calls setCanvas only on click for leaf nodes', async () => {
    const user = userEvent.setup();

    const { store } = createInteractiveWrapper({});
    const root = screen.getByRole('treeitem');

    act(() => {
      root.focus();
    });
    await user.keyboard('{Enter}');

    const leafNode = screen.getAllByRole('treeitem')[1];

    act(() => {
      leafNode.focus();
    });
    await user.keyboard('{Enter}');

    expect(store.getState().windows.a.canvasId).toEqual('http://foo.test/1/canvas/c2');
  });

  it('sets the canvas to a start canvas if present (IIIF v2)', async () => {
    const user = userEvent.setup();
    createWrapper({
      expandItems: () => { },
      manifest: manifestVersion2,
      setCanvas,
      windowId: 'a',
    });

    const leafNode = screen.getAllByRole('treeitem')[3];
    act(() => {
      leafNode.focus();
    });
    await user.keyboard('{Enter}');

    expect(setCanvas).toHaveBeenLastCalledWith('a', 'http://foo.test/1/canvas/c11');
  });

  it('sets the canvas to a start canvas if present (IIIF v3)', async () => {
    const user = userEvent.setup();

    const { store } = createInteractiveWrapper({
      manifest: manifestVersion3,
    });

    const root = screen.getByRole('treeitem');
    act(() => {
      root.focus();
    });
    await user.keyboard('{Enter}');

    const leafNode1 = screen.getAllByRole('treeitem')[2];
    act(() => {
      leafNode1.focus();
    });
    await user.keyboard('{Enter}');
    expect(store.getState().windows.a.canvasId).toEqual('http://foo.test/1/canvas/c7');

    const leafNode2 = screen.getAllByRole('treeitem')[3];
    act(() => {
      leafNode2.focus();
    });
    await user.keyboard('{Enter}');
    expect(store.getState().windows.a.canvasId).toEqual('http://foo.test/1/canvas/c9');

    const leafNode3 = screen.getAllByRole('treeitem')[4];
    act(() => {
      leafNode3.focus();
    });
    await user.keyboard('{Enter}');
    expect(store.getState().windows.a.canvasId).toEqual('http://foo.test/1/canvas/c10');
  });
});

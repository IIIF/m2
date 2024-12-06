import { render, screen, within } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Utils } from 'manifesto.js';

import { WindowSideBarCanvasPanel } from '../../../src/components/WindowSideBarCanvasPanel';
import manifestJson from '../../fixtures/version-2/019.json';

/**
 * Helper function to create a shallow wrapper around WindowSideBarCanvasPanel
 */
function createWrapper(props) {
  const canvases = Utils.parseManifest(manifestJson).getSequences()[0].getCanvases();
  let sequences;

  if (props.multipleSequences) {
    sequences = [{ getLabel: () => ({ getValue: () => undefined }), id: 'a', label: 'seq1' },
      { getLabel: () => ({ getValue: () => undefined }), id: 'b', label: 'seq2' }];
  } else {
    sequences = Utils.parseManifest(manifestJson).getSequences();
  }

  return render(
    <WindowSideBarCanvasPanel
      id="asdf"
      canvases={canvases}
      classes={{}}
      windowId="xyz"
      setCanvas={() => {}}
      config={{ canvasNavigation: { height: 100 } }}
      updateVariant={() => {}}
      selectedCanvases={[canvases[1]]}
      sequences={sequences}
      sequenceId={sequences[0].id}
      variant="item"
      {...props}
    />,
    { preloadedState: { companionWindows: { asdf: { content: 'canvases' } } } },
  );
}

describe('WindowSideBarCanvasPanel', () => {
  it('renders SidebarIndexList', () => {
    createWrapper({ multipleSequences: false });

    expect(screen.getByRole('heading', { name: 'Index' })).toBeInTheDocument();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('without a treeStructure will not render the table of contents tab', () => {
    createWrapper({ multipleSequences: false });

    expect(screen.queryByRole('tab', { name: 'Table of contents' })).not.toBeInTheDocument();
  });

  it('renders form control when multiple sequences present', () => {
    createWrapper({ multipleSequences: true, showToc: true });

    expect(screen.getByRole('tab', { name: 'Table of contents' })).toBeInTheDocument();
  });

  it('renders correct number of sequences in form control', async () => {
    const user = userEvent.setup();
    const updateSequence = vi.fn();
    createWrapper({ multipleSequences: true, updateSequence });

    expect(screen.getByTestId('sequence-select')).toHaveTextContent('a');
    await user.click(within(screen.getByTestId('sequence-select')).getByRole('combobox'));

    const listbox = within(screen.getByRole('listbox'));
    expect(listbox.getAllByRole('option')).toHaveLength(2);

    await user.click(listbox.getByRole('option', { name: 'b' }));
    expect(updateSequence).toHaveBeenCalledWith('b');
  });

  describe('handleVariantChange', () => {
    it('updates the variant', async () => {
      const user = userEvent.setup();
      const updateVariant = vi.fn();
      createWrapper({ multipleSequences: false, updateVariant });

      await user.click(screen.getByRole('tab', { name: 'Thumbnail list' }));
      expect(updateVariant).toHaveBeenCalledWith('thumbnail');
    });
  });
});

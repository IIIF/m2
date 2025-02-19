import {
  render, screen, fireEvent, waitFor,
} from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { WorkspaceAdd } from '../../../src/components/WorkspaceAdd';
import manifestFixture001 from '../../fixtures/version-2/001.json';
import manifestFixture002 from '../../fixtures/version-2/002.json';

/** create wrapper */
function createWrapper(props) {
  return render(
    <DndProvider backend={HTML5Backend}>
      <WorkspaceAdd
        setWorkspaceAddVisibility={() => {}}
        catalog={[
          { manifestId: 'bar' },
          { manifestId: 'foo' },
        ]}
        classes={{}}
        {...props}
      />
    </DndProvider>,
    { preloadedState: { manifests: { bar: { id: 'bar', isFetching: false, json: manifestFixture001 }, foo: { id: 'foo', isFetching: false, json: manifestFixture002 } } } },
  );
}

describe('WorkspaceAdd', () => {
  it('renders a list item for each manifest in the state', () => {
    createWrapper();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('focuses on the first manifest item', () => {
    createWrapper();

    expect(screen.getByRole('button', { name: 'Bodleian Library Human Freaks 2 (33)' })).toHaveFocus();
  });

  it('without manifests, renders an empty message', () => {
    createWrapper({ catalog: [] });

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(screen.getByText('Your resource list is empty')).toBeInTheDocument();
  });

  it('toggles the workspace visibility', async () => {
    const user = userEvent.setup();
    const setWorkspaceAddVisibility = vi.fn();
    createWrapper({ setWorkspaceAddVisibility });

    await user.click(screen.getByRole('button', { name: 'Bodleian Library Human Freaks 2 (33)' }));

    expect(setWorkspaceAddVisibility).toHaveBeenCalledWith(false);
  });

  it('has a button to add new resources', async () => {
    const user = userEvent.setup();
    createWrapper();

    const fab = screen.getByRole('button', { name: 'Add resource' });

    expect(fab).toBeInTheDocument();
    await user.click(fab);

    expect(fab).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close form' }));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('hides the form on submit', async () => {
    const user = userEvent.setup();
    createWrapper();

    await user.click(screen.getByRole('button', { name: 'Add resource' }));

    await user.type(screen.getByRole('textbox'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('scrolls to the top after an item is added', async () => {
    const user = userEvent.setup();
    const { container } = createWrapper();

    const scrollTo = vi.fn();

    vi.spyOn(container.querySelector('.mirador-workspace-add'), 'scrollTo').mockImplementation(scrollTo); // eslint-disable-line testing-library/no-node-access, testing-library/no-container

    await user.click(screen.getByRole('button', { name: 'Add resource' }));

    await user.type(screen.getByRole('textbox'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 0 });
  });

  it('hides the form on cancel action', async () => {
    const user = userEvent.setup();
    createWrapper();

    await user.click(screen.getByRole('button', { name: 'Add resource' }));

    await user.type(screen.getByRole('textbox'), 'abc');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  describe('drag and drop', () => {
    it('adds a new catalog entry from a manifest', async () => {
      const manifestJson = '{ "data": "123" }';

      const addResource = vi.fn();

      createWrapper({ addResource });
      const dropTarget = screen.getByRole('list');

      const file = new File([manifestJson], 'manifest.json', { type: 'application/json' });
      const dataTransfer = {
        files: [file],
        types: ['Files'],
      };

      fireEvent.dragStart(dropTarget, { dataTransfer });
      fireEvent.dragEnter(dropTarget, { dataTransfer });
      fireEvent.dragOver(dropTarget, { dataTransfer });
      fireEvent.drop(dropTarget, { dataTransfer });

      await waitFor(() => expect(addResource).toHaveBeenCalledWith(expect.stringMatching(/^[0-9a-f-]+$/), manifestJson, { provider: 'file' }));
    });

    it('adds a new catalog entry from a IIIF drag and drop icon', () => {
      const manifestId = 'manifest.json';

      const addResource = vi.fn();

      createWrapper({ addResource });
      const dropTarget = screen.getByRole('list');

      const dataTransfer = {
        getData: () => 'https://iiif.io/?manifest=manifest.json',
        types: ['Url'],
      };

      fireEvent.dragStart(dropTarget, { dataTransfer });
      fireEvent.dragEnter(dropTarget, { dataTransfer });
      fireEvent.dragOver(dropTarget, { dataTransfer });
      fireEvent.drop(dropTarget, { dataTransfer });

      expect(addResource).toHaveBeenCalledWith(manifestId);
    });
  });
});

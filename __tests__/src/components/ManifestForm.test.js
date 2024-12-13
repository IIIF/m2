import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ManifestForm } from '../../../src/components/ManifestForm';

/** create wrapper */
function createWrapper(props) {
  return render(
    <ManifestForm
      addResource={() => {}}
      t={str => str}
      {...props}
    />,
  );
}

describe('ManifestForm', () => {
  it('renders nothing if it is not open', () => {
    createWrapper({ addResourcesOpen: false });

    expect(screen.queryByRole('textbox', { name: 'addManifestUrl' })).not.toBeInTheDocument();
  });

  it('renders the form fields', () => {
    createWrapper({ addResourcesOpen: true });

    expect(screen.getByRole('textbox', { name: 'addManifestUrl' })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('has a cancel button when a cancel action is provided', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    createWrapper({ addResourcesOpen: true, onCancel });

    await user.type(screen.getByRole('textbox', { name: 'addManifestUrl' }), 'asdf');

    await user.click(screen.getByRole('button', { name: 'cancel' }));

    expect(onCancel).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('triggers an action when the form is submitted', async () => {
    const user = userEvent.setup();
    const addResource = vi.fn();
    const onSubmit = vi.fn();
    createWrapper({ addResource, addResourcesOpen: true, onSubmit });
    await user.type(screen.getByRole('textbox', { name: 'addManifestUrl' }), 'http://example.com/iiif');
    await user.click(screen.getByRole('button', { name: 'fetchManifest' }));

    expect(addResource).toHaveBeenCalledWith('http://example.com/iiif');
    expect(onSubmit).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

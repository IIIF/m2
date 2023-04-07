import { render, screen } from 'test-utils';
import userEvent from '@testing-library/user-event';

import { ManifestListItem } from '../../../src/components/ManifestListItem';

/** */
function createWrapper(props) {
  return render(
    <ManifestListItem
      manifestId="http://example.com"
      title="xyz"
      ready
      addWindow={() => {}}
      fetchManifest={() => {}}
      t={t => t}
      {...props}
    />,
  );
}

describe('ManifestListItem', () => {
  it('renders without an error', () => {
    createWrapper({ buttonRef: 'ref' });

    expect(screen.getByRole('listitem')).toHaveAttribute('data-manifestid', 'http://example.com');
    expect(screen.getByRole('button')).toHaveTextContent('xyz');
  });
  it('adds a class when the item is active', () => {
    createWrapper({ active: true, classes: { active: 'active' } });

    expect(screen.getByRole('listitem')).toHaveClass('active');
  });
  it('renders a placeholder element until real data is available', () => {
    const { container } = createWrapper({ ready: false });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.MuiSkeleton-rect').length).toBeGreaterThan(0); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });
  it('renders an error message if fetching the manifest failed', () => {
    createWrapper({ error: 'This is an error message' });

    expect(screen.getByText('manifestError')).toBeInTheDocument();
    expect(screen.getByText('http://example.com')).toBeInTheDocument();
  });
  it('updates and adds window when button clicked', async () => {
    const user = userEvent.setup();
    const addWindow = jest.fn();
    createWrapper({ addWindow });

    await user.click(screen.getByRole('button'));
    expect(addWindow).toHaveBeenCalledTimes(1);
  });
  it('uses the manifest id if the title is not available', () => {
    createWrapper({ ready: true, title: null });
    expect(screen.getByRole('button')).toHaveTextContent('http://example.com');
  });

  it('displays the provider information', () => {
    createWrapper({ provider: 'ACME' });
    expect(screen.getByText('ACME', { container: '.mirador-manifest-list-item-provider' })).toHaveTextContent('ACME');
  });

  it('displays a collection label for collections', () => {
    createWrapper({ isCollection: true });

    expect(screen.getByText('xyz', { container: '.MuiTypography-h6' })).toBeInTheDocument();
  });
});

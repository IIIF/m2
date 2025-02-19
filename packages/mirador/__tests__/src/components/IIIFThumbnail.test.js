import { render, screen, act } from '@tests/utils/test-utils';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { IIIFThumbnail } from '../../../src/components/IIIFThumbnail';

/**
 * Helper function to create a shallow wrapper around IIIFThumbnail
 */
function createWrapper(props) {
  return render(
    <IIIFThumbnail
      {...props}
    />,
  );
}

/* eslint-disable testing-library/no-node-access, testing-library/no-container */
describe('IIIFThumbnail', () => {
  const url = 'http://example.com/iiif/image';
  const thumbnail = { height: 120, url, width: 100 };
  it('renders properly', () => {
    const { container } = createWrapper({ thumbnail });
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).not.toHaveAccessibleName();
    expect(img).toHaveAttribute('src', expect.stringContaining('data:image'));
  });

  it('renders a placeholder if there is no image', () => {
    const { container } = createWrapper({ thumbnail });
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('data:image'));
  });

  it('when handleIntersection is called, loads the image', async () => {
    const { container } = createWrapper({ thumbnail });
    const img = container.querySelector('img');

    act(() => {
      mockAllIsIntersecting(true);
    });

    expect(img).toHaveAttribute('src', url);
  });

  it('can be constrained by maxHeight', () => {
    const { container } = createWrapper({ maxHeight: 100, thumbnail });
    const img = container.querySelector('img');

    expect(img).toHaveStyle({ height: '100px', width: 'auto' });
  });

  it('can be constrained by maxWidth', () => {
    const { container } = createWrapper({ maxWidth: 80, thumbnail });
    const img = container.querySelector('img');

    expect(img).toHaveStyle({ height: 'auto', width: '80px' });
  });

  it('can be constrained by maxWidth and maxHeight', () => {
    const { container } = createWrapper({ maxHeight: 90, maxWidth: 50, thumbnail });
    const img = container.querySelector('img');

    expect(img).toHaveStyle({ height: '60px', width: '50px' });
  });

  it('constrains what it can when the image dimensions are unknown', () => {
    const { container } = createWrapper({ maxHeight: 90, thumbnail: { height: 120, url } });
    const img = container.querySelector('img');

    expect(img).toHaveStyle({ height: '90px', width: 'auto' });
  });

  it('renders a provided label', () => {
    createWrapper({
      classes: { label: 'label' }, label: 'Some label', labelled: true, thumbnail,
    });

    expect(screen.getByText('Some label')).toBeInTheDocument();
  });

  it('renders children', () => {
    createWrapper({ children: <span data-testid="hi" />, thumbnail });

    expect(screen.getByTestId('hi')).toBeInTheDocument();
  });
});

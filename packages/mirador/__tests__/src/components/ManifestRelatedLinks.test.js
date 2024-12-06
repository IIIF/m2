import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ManifestRelatedLinks } from '../../../src/components/ManifestRelatedLinks';

describe('ManifestRelatedLinks', () => {
  describe('when metadata is present', () => {
    beforeEach(() => {
      render(
        <ManifestRelatedLinks
          classes={{}}
          id="xyz"
          homepage={[
            {
              label: 'Home page',
              value: 'http://example.com/',
            },
          ]}
          manifestUrl="http://example.com/"
          related={[
            {
              value: 'http://example.com/related',
            },
            {
              format: 'video/ogg',
              label: 'Video',
              value: 'http://example.com/video',
            },
          ]}
          renderings={[
            {
              label: 'PDF Version',
              value: 'http://example.com/pdf',
            },
          ]}
          seeAlso={[
            {
              format: 'text/html',
              label: 'A',
              value: 'http://example.com/a',
            },
            {
              label: null,
              value: 'http://example.com/b',
            },
          ]}
        />,
      );
    });

    it('renders the content in a CollapsibleSection', async () => {
      const user = userEvent.setup();
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Related');
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/Links/);

      await user.click(screen.getByRole('button', { name: 'Collapse "Related" section' }));

      expect(screen.queryByRole('heading', { level: 5 })).not.toBeInTheDocument();
    });

    it('renders manifest homepage information', () => {
      expect(screen.getByText('About this resource').tagName).toEqual('DT');

      expect(screen.getByRole('link', { name: 'Home page' })).toHaveAttribute('href', 'http://example.com/');
    });

    it('renders manifest renderings information', () => {
      expect(screen.getByText('Alternate formats').tagName).toEqual('DT');
      expect(screen.getByRole('link', { name: 'PDF Version' })).toHaveAttribute('href', 'http://example.com/pdf');
    });

    it('renders related information', () => {
      expect(screen.getAllByText('Related')[1].tagName).toEqual('DT');
      expect(screen.getByRole('link', { name: 'http://example.com/related' })).toHaveAttribute('href', 'http://example.com/related');
      expect(screen.getByRole('link', { name: 'Video' })).toHaveAttribute('href', 'http://example.com/video');
      expect(screen.getByText('(video/ogg)')).toBeInTheDocument();
    });

    it('renders manifest seeAlso information', () => {
      expect(screen.getByText('See also').tagName).toEqual('DT');
      expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('href', 'http://example.com/a');
      expect(screen.getByText('(text/html)')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'http://example.com/b' })).toHaveAttribute('href', 'http://example.com/b');
    });

    it('renders manifest links', () => {
      expect(screen.getByText('IIIF manifest').tagName).toEqual('DT');
      expect(screen.getByRole('link', { name: 'http://example.com/' })).toHaveAttribute('href', 'http://example.com/');
    });
  });
});

import { render, screen } from '@tests/utils/test-utils';
import { ErrorContent } from '../../../src/components/ErrorContent';

describe('ErrorContent', () => {
  it('should render everything when showJsError is true', async () => {
    render(
      <ErrorContent
        error={new Error('Invalid JSON')}
        windowId="xyz"
        manifestId="foo"
        classes={{}}
      />,
      {
        preloadedState: {
          config: {
            window: {
              showJsError: true,
            },
          },
          windows: {
            xyz: {
              collectionDialogOn: false,
              companionWindowIds: [],
            },
          },
        },
      },
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
    expect(screen.getByText('Technical details')).toBeInTheDocument();
    expect(document.querySelector('pre')).toHaveTextContent('Invalid JSON'); // eslint-disable-line testing-library/no-node-access
  });
  it('does not render the alert when showJsError is false ', async () => {
    render(
      <ErrorContent
        error={new Error('Invalid JSON')}
        windowId="xyz"
        manifestId="foo"
        showJsError={false}
        classes={{}}
      />,
      {
        preloadedState: {
          config: {
            window: {
              showJsError: false,
            },
          },
          windows: {
            xyz: {
              collectionDialogOn: false,
              companionWindowIds: [],
            },
          },
        },
      },
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

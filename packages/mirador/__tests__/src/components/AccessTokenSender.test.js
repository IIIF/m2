import { render } from '@tests/utils/test-utils';
import { AccessTokenSender } from '../../../src/components/AccessTokenSender';

/**
 * Helper function to create a shallow wrapper around ErrorDialog
 */
function createWrapper(props) {
  return render(
    <AccessTokenSender
      handleAccessTokenMessage={() => {}}
      {...props}
    />,
  );
}

describe('AccessTokenSender', () => {
  it('renders nothing if there is no url', () => {
    const { container } = createWrapper({});
    expect(container).toBeEmptyDOMElement();
  });

  it('renders properly', () => {
    const { container } = createWrapper({ url: 'http://example.com' });

    expect(container.querySelector('iframe')).toHaveAttribute('src', 'http://example.com/?origin=http%3A%2F%2Flocalhost&messageId=http%3A%2F%2Fexample.com'); // eslint-disable-line testing-library/no-node-access, testing-library/no-container
  });

  it('triggers an action when the iframe sends a message', () => {
    const handleAccessTokenMessage = vi.fn();
    createWrapper({ handleAccessTokenMessage, url: 'http://example.com' });
    window.dispatchEvent(new MessageEvent('message', { data: { messageId: 'http://example.com' } }));
    expect(handleAccessTokenMessage).toHaveBeenCalledWith({ messageId: 'http://example.com' });
  });

  it('ignores iframe messages with the wrong messageId', () => {
    const handleAccessTokenMessage = vi.fn();
    createWrapper({ handleAccessTokenMessage, url: 'http://example.com' });
    window.dispatchEvent(new MessageEvent('message', { data: { messageId: 'http://example.com/123' } }));
    expect(handleAccessTokenMessage).not.toHaveBeenCalled();
  });
});

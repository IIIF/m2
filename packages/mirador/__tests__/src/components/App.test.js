import { render, screen } from '@tests/utils/test-utils';

import { App } from '../../../src/components/App';

/** */
function createWrapper(props) {
  return render(
    <App
      {...props}
    />,
  );
}

describe('App', () => {
  it('should asynchronously render all needed elements', async () => {
    createWrapper();

    expect(screen.queryByRole('main')).not.toBeInTheDocument();
    expect(await screen.findByRole('main')).toBeInTheDocument();
  });
});

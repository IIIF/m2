import { render, screen } from '@tests/utils/test-utils';

import { WindowTopBarTitle } from '../../../src/components/WindowTopBarTitle';

/** create wrapper */
function createWrapper(props) {
  return render(
    <WindowTopBarTitle
      manifestTitle="awesome manifest"
      windowId="xyz"
      classes={{}}
      {...props}
    />,
  );
}

describe('WindowTopBarTitle', () => {
  it('renders all needed elements with correct props', () => {
    createWrapper();
    expect(screen.getByRole('heading')).toHaveTextContent('awesome manifest');
  });

  it('renders a Skeleton when loading', () => {
    createWrapper({ isFetching: true });
    expect(screen.getByRole('heading')).not.toHaveTextContent('awesome manifest');
  });

  it('renders an error', () => {
    createWrapper({ error: 'some error message' });
    expect(screen.getByRole('heading')).toHaveTextContent('some error message');
  });

  it('title is configurable', () => {
    createWrapper({ hideWindowTitle: true });
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

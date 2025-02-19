import { render, screen } from '@tests/utils/test-utils';
import { ViewerInfo } from '../../../src/components/ViewerInfo';

/** create wrapper */
function createWrapper(props) {
  return render(
    <ViewerInfo
      classes={{}}
      canvasCount={8}
      canvasIndex={2}
      canvasLabel="testLabel"
      {...props}
    />,
  );
}

describe('ViewerNavigation', () => {
  it('renders the component', () => {
    createWrapper();
    expect(screen.getByText('3 of 8', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText(/testLabel/i, { selector: 'span' })).toBeInTheDocument();
  });
});

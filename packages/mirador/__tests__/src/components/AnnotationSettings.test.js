import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { AnnotationSettings } from '../../../src/components/AnnotationSettings';

/** */
function createWrapper(props) {
  return render(
    <AnnotationSettings
      displayAll={false}
      displayAllDisabled={false}
      toggleAnnotationDisplay={() => {}}
      windowId="abc123"
      {...props}
    />,
  );
}

describe('AnnotationSettings', () => {
  const toggleAnnotationDisplayMock = vi.fn();

  it('renders a MiradorMenuButton', () => {
    createWrapper();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls the toggleAnnotationDisplay prop function on click', async () => {
    const user = userEvent.setup();

    createWrapper({ toggleAnnotationDisplay: toggleAnnotationDisplayMock });
    await user.click(screen.getByRole('button'));

    expect(toggleAnnotationDisplayMock).toHaveBeenCalledTimes(1);
  });
});

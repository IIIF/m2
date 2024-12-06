import { screen, render } from '@tests/utils/test-utils';
import { WorkspaceImport } from '../../../src/components/WorkspaceImport';

describe('WorkspaceImport', () => {
  let handleClose;

  beforeEach(() => {
    handleClose = vi.fn();

    render(
      <WorkspaceImport
        open
        handleClose={handleClose}
      />,
    );
  });

  it('renders without an error', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  it('renders sizing props', () => {
    expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthSm');
  });
  it('renders TextField props', () => {
    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});

import { render, screen } from '@tests/utils/test-utils';
import { SidebarIndexItem } from '../../../src/components/SidebarIndexItem';

/** */
function createWrapper(props) {
  return render(
    <SidebarIndexItem
      label="yolo"
      classes={{}}
      {...props}
    />,
  );
}

describe('SidebarIndexItem', () => {
  it('creates Typography with a canvas label', () => {
    createWrapper();
    expect(screen.getByText('yolo')).toBeInTheDocument();
  });
});

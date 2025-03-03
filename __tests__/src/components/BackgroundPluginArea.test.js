import { render, screen } from '@tests/utils/test-utils';
import { BackgroundPluginArea } from '../../../src/components/BackgroundPluginArea';
import { usePlugins } from '../../../src/extend/usePlugins';

vi.mock('../../../src/extend/usePlugins');

/** */
const mockComponent = () => (
  <div data-testid="test" />
);

describe('BackgroundPluginArea', () => {
  it('renders the component', () => {
    vi.mocked(usePlugins).mockReturnValue({ PluginComponents: [mockComponent] });
    render(<BackgroundPluginArea />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});

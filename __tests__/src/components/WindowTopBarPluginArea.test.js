import { render, screen } from '@tests/utils/test-utils';
import { WindowTopBarPluginArea } from '../../../src/components/WindowTopBarPluginArea';
import { usePlugins } from '../../../src/extend/usePlugins';

vi.mock('../../../src/extend/usePlugins');

/** */
const mockComponent = () => (
  <div data-testid="test" />
);

describe('WindowTopBarPluginArea', () => {
  it('renders the component', () => {
    vi.mocked(usePlugins).mockReturnValue({ PluginComponents: [mockComponent] });
    render(<WindowTopBarPluginArea />);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });
});

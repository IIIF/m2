import { render, screen, within } from '@tests/utils/test-utils';
import { Branding } from '../../../src/components/Branding';

describe('Branding', () => {
  it('renders', () => {
    render(<Branding />);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://projectmirador.org');
    expect(within(screen.getByRole('link')).getByRole('img')).toBeInTheDocument();
  });

  it('renders additional items for the wide variant', () => {
    render(<Branding variant="wide" />);

    expect(screen.getByText('Mirador')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});

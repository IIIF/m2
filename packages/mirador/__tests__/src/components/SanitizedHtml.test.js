import { render, screen } from '@tests/utils/test-utils';
import { SanitizedHtml } from '../../../src/components/SanitizedHtml';

describe('SanitizedHtml', () => {
  beforeEach(() => {
    render(
      <SanitizedHtml
        data-testid="subject"
        htmlString="
          <b>Don't worry!</b>
          <a>Some link</a>
          <script type='module'>doBadThings()</script>"
        ruleSet="iiif"
      />,
    );
  });

  it('should render needed elements', () => {
    expect(screen.getByTestId('subject')).toHaveProperty('tagName', 'SPAN');
  });

  it('should pass correct class name to root element', () => {
    expect(screen.getByTestId('subject')).toHaveClass('mirador-third-party-html');
  });

  it('should pass sanitized html string to dangerouslySetInnerHTML attribute', () => {
    expect(screen.getByTestId('subject').querySelector('script')).not.toBeInTheDocument(); // eslint-disable-line testing-library/no-node-access, testing-library/prefer-presence-queries
    expect(screen.getByText('Don\'t worry!')).toBeInTheDocument();
    expect(screen.getByText('Some link')).toHaveAttribute('target', '_blank');
    expect(screen.getByText('Some link')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

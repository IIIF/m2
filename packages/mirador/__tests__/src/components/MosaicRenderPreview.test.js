import { render, screen } from '@tests/utils/test-utils';

import { MosaicRenderPreview } from '../../../src/components/MosaicRenderPreview';

describe('MosaicRenderPreview', () => {
  it('it renders the given title prop passed through the t prop function', () => {
    render(
      <MosaicRenderPreview
        title="The Title Prop"
        windowId="abc123"
      />,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('The Title Prop');
  });
});

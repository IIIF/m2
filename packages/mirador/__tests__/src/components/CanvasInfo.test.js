import { render, screen } from '@tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { CanvasInfo } from '../../../src/components/CanvasInfo';

describe('CanvasInfo', () => {
  const metadata = [{ label: 'some label', values: ['some value'] }];
  let user;

  describe('when metadata is present', () => {
    beforeEach(() => {
      user = userEvent.setup();
      render(
        <CanvasInfo
          canvasLabel="The Canvas Label"
          canvasDescription="The Canvas Description"
          canvasMetadata={metadata}
        />,
      );
    });

    it('renders the content in a CollapsibleSection', async () => {
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Current item');
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/The Canvas Label/);

      await user.click(screen.getByRole('button'));

      expect(screen.queryByRole('heading', { level: 5 })).not.toBeInTheDocument();
    });

    it('renders canvas label', () => {
      expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/The Canvas Label/);
    });

    it('renders canvas description', () => {
      expect(screen.getByText('The Canvas Description')).toBeInTheDocument();
    });

    it('renders canvas metadata in LabelValueMetadata component', () => {
      expect(screen.getByText('some label')).toBeInTheDocument();
      expect(screen.getByText('some value')).toBeInTheDocument();
    });
  });

  describe('when metadata is not present', () => {
    beforeEach(() => {
      render(
        <CanvasInfo />,
      );
    });

    it('does not render empty elements elements', () => {
      expect(screen.queryByRole('heading', { level: 5 })).not.toBeInTheDocument();
    });
  });
});

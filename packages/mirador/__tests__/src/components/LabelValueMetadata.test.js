import { render, screen } from '@tests/utils/test-utils';
import { LabelValueMetadata } from '../../../src/components/LabelValueMetadata';

/* eslint-disable testing-library/no-node-access */
describe('LabelValueMetadata', () => {
  let wrapper;
  let labelValuePair;

  describe('when the labelValuePair has content', () => {
    beforeEach(() => {
      labelValuePair = [
        {
          label: 'Label 1',
          values: ['Value 1'],
        },
        {
          label: 'Label 2',
          values: ['Value 2'],
        },
      ];
      wrapper = render(
        <LabelValueMetadata labelValuePairs={labelValuePair} />,
      );
    });

    it('renders a dt/dd for each label/value pair', () => {
      expect(wrapper.container.querySelector('dl')).toBeInTheDocument();
      expect(wrapper.container.querySelectorAll('dt').length).toEqual(2);
      expect(wrapper.container.querySelectorAll('dd').length).toEqual(2);
    });

    it('renders correct labels in dt', () => {
      expect(screen.getByText('Label 1')).toBeInTheDocument();
      expect(screen.getByText('Label 2')).toBeInTheDocument();
    });

    it('renders SanitizedHtml component in dd for each value', () => {
      expect(screen.getByText('Value 1')).toBeInTheDocument();
      expect(screen.getByText('Value 2')).toBeInTheDocument();
    });
  });

  describe('when the labelValuePair has no content', () => {
    beforeEach(() => {
      labelValuePair = [];
      wrapper = render(
        <LabelValueMetadata labelValuePairs={labelValuePair} />,
      );
    });

    it('renders an empty fragment instead of an empty dl', () => {
      expect(wrapper.container).toBeEmptyDOMElement();
    });
  });

  describe('when the labelValuePair has a default label', () => {
    beforeEach(() => {
      labelValuePair = [
        {
          values: ['Value 1'],
        },
        {
          label: 'Label 2',
          values: ['Value 2'],
        },
      ];
      wrapper = render(
        <LabelValueMetadata labelValuePairs={labelValuePair} defaultLabel="Default label" />,
      );
    });

    it('renders correct labels in dt', () => {
      expect(screen.getByText('Default label')).toBeInTheDocument();
      expect(screen.getByText('Label 2')).toBeInTheDocument();
    });
  });
});

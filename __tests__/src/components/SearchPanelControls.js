import React from 'react';
import { shallow } from 'enzyme';
import { SearchPanelControls } from '../../../src/components/SearchPanelControls';


/**
 * Helper function to create a shallow wrapper around AttributionPanel
 */
function createWrapper(props) {
  return shallow(
    <SearchPanelControls
      cwId="cw"
      windowId="window"
      {...props}
    />,
  );
}

describe('SearchPanelControls', () => {
  it('renders a text input', () => {
    const wrapper = createWrapper();
    const label = wrapper.find('WithStyles(WithFormControlContext(ForwardRef(InputLabel)))');
    const input = wrapper.find('WithStyles(ForwardRef(Input))');
    expect(label.props()).toMatchObject({ htmlFor: 'search-cw' });
    expect(label.text()).toEqual('searchInputLabel');
    expect(input.props()).toMatchObject({ id: 'search-cw' });
  });
  it('endAdornment is a SearchIcon', () => {
    const wrapper = createWrapper();
    const divedInput = wrapper.find('WithStyles(ForwardRef(Input))')
      .dive().dive().dive()
      .dive();
    expect(divedInput.find('SearchSharpIcon').length).toEqual(1);
  });
  it('form and form submit is available', () => {
    const wrapper = createWrapper();
    const divedInput = wrapper.find('WithStyles(ForwardRef(Input))')
      .dive().dive().dive()
      .dive();
    expect(wrapper.find('form').length).toEqual(1);
    expect(divedInput.find('WithStyles(ForwardRef(IconButton))[type="submit"]').length).toEqual(1);
  });
  it('form change and submission triggers an action', () => {
    const fetchSearch = jest.fn();
    const searchService = {
      id: 'http://www.example.com/search',
      options: { resource: { id: 'example.com/manifest' } },
    };
    const wrapper = createWrapper({ fetchSearch, searchService });
    wrapper.setState({ search: 'asdf' });

    wrapper.setState({ search: 'yolo' });

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });
    expect(fetchSearch).toHaveBeenCalledWith('example.com/manifest', 'http://www.example.com/search?q=yolo');
    expect(wrapper.state().search).toBe('yolo');
  });
});

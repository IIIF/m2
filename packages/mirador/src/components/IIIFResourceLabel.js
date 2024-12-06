import { useContext } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getLocale,
} from '../state/selectors';
import LocaleContext from '../contexts/LocaleContext';

/**
 * Render the contextually appropriate label for the resource
 */
export function IIIFResourceLabel({ fallback, resource }) {
  const contextLocale = useContext(LocaleContext);
  const fallbackLocale = useSelector(state => getLocale(state, {}));

  if (!resource) return fallback;

  const label = resource.getLabel();

  if (!label) return fallback;

  return label.getValue(contextLocale || fallbackLocale || '') ?? (fallback || resource.id);
}

IIIFResourceLabel.propTypes = {
  fallback: PropTypes.string,
  resource: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

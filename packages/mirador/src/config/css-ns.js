import settings from './settings'
import flatten from 'lodash/flatten';
/**
 * export ns - sets up css namespacing for everything to be `mirador-`
 */
const ns = classNames => flatten([classNames]).map(
  className => [
    settings.createGenerateClassNameOptions.productionPrefix,
    className,
  ].join('-')
).join(' ');

export default ns;

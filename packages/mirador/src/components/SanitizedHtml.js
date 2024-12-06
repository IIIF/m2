import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DOMPurify from 'dompurify';
import ns from '../config/css-ns';
import htmlRules from '../lib/htmlRules';

const Root = styled('span', { name: 'IIIFHtmlContent', slot: 'root' })({});

// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
*/
export function SanitizedHtml({
  classes = {}, htmlString, ruleSet, ...rest
}) {
  return (
    <Root
      className={[ns('third-party-html'), classes.root].join(' ')}
      dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: DOMPurify.sanitize(htmlString, htmlRules[ruleSet]),
      }}
      {...rest}
    />
  );
}

SanitizedHtml.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  htmlString: PropTypes.string.isRequired,
  ruleSet: PropTypes.string.isRequired,
};

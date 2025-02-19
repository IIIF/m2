import { cloneElement, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ns from '../config/css-ns';

/**  */
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

/**
 * ScrollTo ~
*/
export function ScrollTo({
  children, containerRef, offsetTop = 0, scrollTo, ...otherProps
}) {
  const scrollToRef = useRef();
  const prevScrollTo = usePrevious(scrollTo);

  useEffect(() => {
    if (!scrollTo || scrollTo === prevScrollTo) return;

    const elementToScrollTo = scrollToRef?.current;
    if (!elementToScrollTo) return;

    const scrollableContainer = containerRef?.current?.querySelector(`.${ns('scrollto-scrollable')}`);
    if (!scrollableContainer) return;

    const containerBoundingRect = containerRef?.current?.getBoundingClientRect() || {};
    const scrollToBoundingRect = elementToScrollTo?.getBoundingClientRect() || {};
    const elementIsVisible = (() => {
      if (scrollToBoundingRect.top < (containerBoundingRect.top + offsetTop)) {
        return false;
      } if (scrollToBoundingRect.bottom > containerBoundingRect.bottom) {
        return false;
      }

      return true;
    })();

    if (elementIsVisible) return;

    const scrollBy = elementToScrollTo.offsetTop - (containerBoundingRect.height / 2) + offsetTop;

    scrollableContainer.scrollTo(0, scrollBy);
  }, [containerRef, scrollToRef, scrollTo, prevScrollTo, offsetTop]);

  if (!scrollTo && isEmpty(otherProps)) return children;

  return cloneElement(children, { ref: scrollToRef, ...otherProps });
}

ScrollTo.propTypes = {
  children: PropTypes.node.isRequired,
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  offsetTop: PropTypes.number,
  scrollTo: PropTypes.bool.isRequired,
};

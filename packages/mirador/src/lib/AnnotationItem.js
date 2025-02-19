import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import { v4 as uuid } from 'uuid';

/**
 * A modeled WebAnnotation item
 */
export default class AnnotationItem {
  /** */
  constructor(resource = {}) {
    this.resource = resource;
  }

  /** */
  isOnlyTag() {
    return (this.motivations.length === 1 && this.motivations[0] === 'tagging');
  }

  /** */
  get id() {
    this._id = this._id || this.resource.id || uuid(); // eslint-disable-line no-underscore-dangle
    return this._id; // eslint-disable-line no-underscore-dangle
  }

  /** */
  get targetId() {
    const target = this.target[0];
    switch (typeof target) {
      case 'string':
        return target.replace(/#?xywh=(.*)$/, '');
      case 'object':
        return (target.source && target.source.id) || target.source || target.id;
      default:
        return null;
    }
  }

  /**
   * @return {[Array]}
   */
  get motivations() {
    return flatten(compact(new Array(this.resource.motivation)));
  }

  /** */
  get body() {
    return flatten(compact(new Array(this.resource.body)));
  }

  /** */
  get resources() {
    return this.body;
  }

  /** */
  get tags() {
    if (this.isOnlyTag()) {
      return this.body.map(r => r.value);
    }
    return this.body.filter(r => r.purpose === 'tagging').map(r => r.value);
  }

  /** */
  get target() {
    return flatten(compact(new Array(this.resource.target)));
  }

  /** */
  get chars() {
    if (this.isOnlyTag()) return null;
    return this.body.filter(r => r.purpose !== 'tagging').map(r => r.value).join(' ');
  }

  /** */
  get selector() {
    const target = this.target[0];
    switch (typeof target) {
      case 'string':
        return target;
      case 'object':
        return flatten(compact(new Array(target.selector)));
      default:
        return null;
    }
  }

  /** */
  get svgSelector() {
    const { selector } = this;
    switch (typeof selector) {
      case 'string':
        return null;
      case 'object':
        return selector.find(s => s.type && s.type === 'SvgSelector');
      default:
        return null;
    }
  }

  /** */
  get fragmentSelector() {
    const { selector } = this;

    let match;
    let fragmentSelector;

    switch (typeof selector) {
      case 'string':
        match = selector.match(/xywh=(.*)$/);
        break;
      case 'object':
        fragmentSelector = selector.find(s => s.type && s.type === 'FragmentSelector');
        match = fragmentSelector && fragmentSelector.value.match(/xywh=(.*)$/);
        break;
      default:
        return null;
    }

    return match && match[1].split(',').map(str => parseInt(str, 10));
  }
}

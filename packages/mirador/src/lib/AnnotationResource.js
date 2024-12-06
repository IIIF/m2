import compact from 'lodash/compact';
import flatten from 'lodash/flatten';
import { v4 as uuid } from 'uuid';

/** */
export default class AnnotationResource {
  /** */
  constructor(resource = {}) {
    this.resource = resource;
  }

  /** */
  isOnlyTag() {
    return (this.motivations.length === 1 && this.motivations[0] === 'oa:tagging');
  }

  /** */
  get id() {
    this._id = this._id
      || this.resource['@id']
      || (this.resources[0] && this.resources[0]['@id'])
      || uuid();
    return this._id; // eslint-disable-line no-underscore-dangle
  }

  /** */
  get targetId() {
    const on = this.on[0];
    switch (typeof on) {
      case 'string':
        return on.replace(/#?xywh=(.*)$/, '');
      case 'object':
        return on.full.replace(/#?xywh=(.*)$/, '');
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
  get resources() {
    return flatten(compact(new Array(this.resource.resource)));
  }

  /** */
  get on() {
    return flatten(compact(new Array(this.resource.on)));
  }

  /** */
  get tags() {
    if (this.isOnlyTag()) {
      return this.resources.map(r => r.chars);
    }
    return this.resources.filter(r => r['@type'] === 'oa:Tag').map(r => r.chars);
  }

  /** */
  get chars() {
    return this.resources.filter(r => r['@type'] !== 'oa:Tag').map(r => r.chars).join(' ');
  }

  /** */
  get selector() {
    const on = this.on[0];
    switch (typeof on) {
      case 'string':
        return on;
      case 'object':
        // For choices, just return the default for now. FIXME: enhance for SVG
        // selectors
        if (on.selector['@type'] === 'oa:Choice') {
          return on.selector.default;
        }
        return on.selector;
      default:
        return null;
    }
  }

  /** */
  get svgSelector() {
    const on = this.on[0];

    switch (typeof on) {
      case 'string':
        return null;
      case 'object':
        if (on.selector && on.selector.item && on.selector.item['@type'] === 'oa:SvgSelector') {
          return on.selector.item;
        }
        return null;
      default:
        return null;
    }
  }

  /** */
  get fragmentSelector() {
    const { selector } = this;

    let match;

    switch (typeof selector) {
      case 'string':
        match = selector.match(/xywh=(.*)$/);
        break;
      case 'object':
        match = selector.value.match(/xywh=(.*)$/);
        break;
      default:
        return null;
    }

    return match && match[1].split(',').map(str => parseInt(str, 10));
  }
}

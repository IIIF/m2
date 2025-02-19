/** */
export default class TruncatedHit {
  /** */
  constructor(hit, annotation = undefined, { maxChars = 200, minimum = 20 } = {}) {
    this.hit = hit;
    this.annotation = annotation;
    this.maxChars = maxChars || 200;
    this.minimum = minimum || 20;
  }

  /** */
  get match() {
    return this.hit.match
      || (this.annotation && this.annotation.resource.resource.chars)
      || '-';
  }

  /** */
  get charsOnSide() {
    const resultingChars = (this.maxChars - this.match.length) / 2;
    const measured = [(this.hit.before || '').length, (this.hit.after || '').length].filter(length => length > 0);
    return Math.max(Math.min(resultingChars, ...measured), this.minimum);
  }

  /** */
  get before() {
    if (!this.hit.before) return '';
    return this.hit.before.substring(this.hit.before.length - this.charsOnSide, this.hit.before.length);
  }

  /** */
  get after() {
    if (!this.hit.after) return '';
    return this.hit.after.substring(0, Math.min(this.hit.after.length, this.charsOnSide));
  }
}

import TruncatedHit from '../../../src/lib/TruncatedHit';

describe('TruncatedHit', () => {
  const annotation = { resource: { resource: { chars: 'xyz' } } };
  const th = new TruncatedHit({
    after: 'aaaaa', before: 'bbbbb', match: 'four',
  }, annotation, { maxChars: 10, minimum: 1 });
  const matchOnly = new TruncatedHit({ match: 'four' }, annotation, { maxChars: 10 });

  describe('charsOnSide', () => {
    it('returns a balanced number of chars to put on each side of match', () => {
      expect(th.charsOnSide).toEqual(3);
    });
    it('uses a minimum value for each side to account for beginning/end', () => {
      const min = new TruncatedHit({
        after: 'aaaaa', before: 'bbbbb', match: 'four',
      }, undefined, { maxChars: 10, minimum: 10 });
      expect(min.charsOnSide).toEqual(10);
    });
    it('with only a match', () => {
      expect(matchOnly.charsOnSide).toEqual(20);
    });
  });
  describe('before', () => {
    it('returns substring of before chars', () => {
      expect(th.before).toEqual('bbb');
    });
    it('with only a match', () => {
      expect(matchOnly.before).toEqual('');
    });
  });
  describe('after', () => {
    it('returns substring of after chars', () => {
      expect(th.after).toEqual('aaa');
    });
    it('with only a match', () => {
      expect(matchOnly.after).toEqual('');
    });
  });
  describe('match', () => {
    it('returns match', () => {
      expect(th.match).toEqual('four');
    });

    describe('without match data', () => {
      const noMatch = new TruncatedHit({}, annotation, { maxChars: 10 });

      it('returns the resource chars', () => {
        expect(noMatch.match).toEqual('xyz');
      });
    });
  });
});

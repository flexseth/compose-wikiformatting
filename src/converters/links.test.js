import { convertLinks } from './links';

describe('convertLinks - External Links', () => {
  test('converts simple Markdown link to WikiFormatting', () => {
    expect(convertLinks('[Click here](http://example.com)'))
      .toBe('[http://example.com Click here]');
  });

  test('converts link with https URL', () => {
    expect(convertLinks('[Secure site](https://example.com)'))
      .toBe('[https://example.com Secure site]');
  });

  test('converts link with path', () => {
    expect(convertLinks('[Documentation](/docs/guide)'))
      .toBe('[/docs/guide Documentation]');
  });

  test('converts link with query parameters', () => {
    expect(convertLinks('[Search](https://google.com?q=test)'))
      .toBe('[https://google.com?q=test Search]');
  });

  test('converts link with fragment', () => {
    expect(convertLinks('[Jump to section](#section)'))
      .toBe('[#section Jump to section]');
  });

  test('converts multiple links in same line', () => {
    expect(convertLinks('Check [Google](https://google.com) and [GitHub](https://github.com)'))
      .toBe('Check [https://google.com Google] and [https://github.com GitHub]');
  });

  test('converts link in middle of sentence', () => {
    expect(convertLinks('Visit the [WordPress](https://wordpress.org) website for more info'))
      .toBe('Visit the [https://wordpress.org WordPress] website for more info');
  });

  test('converts link with special characters in text', () => {
    expect(convertLinks('[Text with "quotes" & ampersands](http://example.com)'))
      .toBe('[http://example.com Text with "quotes" & ampersands]');
  });

  test('converts link with Unicode in text', () => {
    expect(convertLinks('[日本語](http://example.jp)'))
      .toBe('[http://example.jp 日本語]');
  });

  test('converts link with emoji in text', () => {
    expect(convertLinks('[Click 👉 here](http://example.com)'))
      .toBe('[http://example.com Click 👉 here]');
  });
});

describe('convertLinks - Wiki Links', () => {
  test('preserves WikiFormatting wiki links (no conversion)', () => {
    expect(convertLinks('See [[WikiPage]] for details'))
      .toBe('See [[WikiPage]] for details');
  });

  test('preserves wiki links with spaces', () => {
    expect(convertLinks('Check [[Wiki Page With Spaces]]'))
      .toBe('Check [[Wiki Page With Spaces]]');
  });

  test('preserves wiki links with paths', () => {
    expect(convertLinks('See [[wiki:WikiFormatting]]'))
      .toBe('See [[wiki:WikiFormatting]]');
  });

  test('preserves multiple wiki links', () => {
    expect(convertLinks('[[PageOne]] and [[PageTwo]]'))
      .toBe('[[PageOne]] and [[PageTwo]]');
  });

  test('handles mix of Markdown and wiki links', () => {
    const input = 'External [link](http://example.com) and [[WikiPage]]';
    const expected = 'External [http://example.com link] and [[WikiPage]]';
    expect(convertLinks(input)).toBe(expected);
  });
});

describe('convertLinks - Automatic URLs', () => {
  test('preserves standalone HTTP URL', () => {
    expect(convertLinks('Visit http://example.com for more'))
      .toBe('Visit http://example.com for more');
  });

  test('preserves standalone HTTPS URL', () => {
    expect(convertLinks('See https://example.com'))
      .toBe('See https://example.com');
  });

  test('preserves URLs with paths and queries', () => {
    expect(convertLinks('Check https://example.com/path?query=value'))
      .toBe('Check https://example.com/path?query=value');
  });

  test('handles mix of automatic URLs and Markdown links', () => {
    const input = 'Visit http://example.com or [click here](http://other.com)';
    const expected = 'Visit http://example.com or [http://other.com click here]';
    expect(convertLinks(input)).toBe(expected);
  });
});

describe('convertLinks - Edge Cases', () => {
  test('handles empty string', () => {
    expect(convertLinks('')).toBe('');
  });

  test('handles text with no links', () => {
    expect(convertLinks('plain text')).toBe('plain text');
  });

  test('handles link with empty text (leaves as-is)', () => {
    // Edge case: regex requires non-empty content, leaves malformed link unchanged
    expect(convertLinks('[](http://example.com)'))
      .toBe('[](http://example.com)');
  });

  test('handles link with empty URL (leaves as-is)', () => {
    // Edge case: regex requires non-empty content, leaves malformed link unchanged
    expect(convertLinks('[text]()'))
      .toBe('[text]()');
  });

  test('handles malformed links (no closing bracket)', () => {
    // Should not match, leave as-is
    expect(convertLinks('[text](http://example.com'))
      .toBe('[text](http://example.com');
  });

  test('handles malformed links (no closing paren)', () => {
    // Should not match, leave as-is
    expect(convertLinks('[text](http://example.com'))
      .toBe('[text](http://example.com');
  });

  test('handles nested brackets in link text (limitation)', () => {
    // Known limitation: regex doesn't handle nested brackets, leaves as-is
    // This is an acceptable trade-off for simplicity
    expect(convertLinks('[Text [with] brackets](http://example.com)'))
      .toBe('[Text [with] brackets](http://example.com)');
  });

  test('handles brackets in URL (edge case)', () => {
    // URLs with brackets are uncommon but valid in some contexts
    expect(convertLinks('[Link](http://example.com/path[0])'))
      .toBe('[http://example.com/path[0] Link]');
  });
});

describe('convertLinks - Special Characters in URLs', () => {
  test('preserves URLs with underscores', () => {
    expect(convertLinks('[Link](http://example.com/my_page)'))
      .toBe('[http://example.com/my_page Link]');
  });

  test('preserves URLs with dashes', () => {
    expect(convertLinks('[Link](http://example.com/my-page)'))
      .toBe('[http://example.com/my-page Link]');
  });

  test('preserves URLs with percent encoding', () => {
    expect(convertLinks('[Link](http://example.com/%20space)'))
      .toBe('[http://example.com/%20space Link]');
  });

  test('preserves URLs with ampersands', () => {
    expect(convertLinks('[Link](http://example.com?a=1&b=2)'))
      .toBe('[http://example.com?a=1&b=2 Link]');
  });

  test('preserves URLs with equals signs', () => {
    expect(convertLinks('[Link](http://example.com?key=value)'))
      .toBe('[http://example.com?key=value Link]');
  });
});

describe('convertLinks - Type Safety', () => {
  test('throws TypeError for number', () => {
    expect(() => convertLinks(123)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => convertLinks(null)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => convertLinks(undefined)).toThrow(TypeError);
  });

  test('throws TypeError for object', () => {
    expect(() => convertLinks({})).toThrow(TypeError);
  });

  test('throws TypeError for array', () => {
    expect(() => convertLinks([])).toThrow(TypeError);
  });
});

describe('convertLinks - Real-world Examples', () => {
  test('converts documentation reference', () => {
    const input = 'See the [WikiFormatting guide](https://trac.ffmpeg.org/wiki/WikiFormatting) for syntax';
    const expected = 'See the [https://trac.ffmpeg.org/wiki/WikiFormatting WikiFormatting guide] for syntax';
    expect(convertLinks(input)).toBe(expected);
  });

  test('converts GitHub issue link', () => {
    const input = 'Fixed in [PR #5](https://github.com/user/repo/pull/5)';
    const expected = 'Fixed in [https://github.com/user/repo/pull/5 PR #5]';
    expect(convertLinks(input)).toBe(expected);
  });

  test('converts multiple documentation links', () => {
    const input = 'Check [React docs](https://react.dev) and [Jest docs](https://jestjs.io)';
    const expected = 'Check [https://react.dev React docs] and [https://jestjs.io Jest docs]';
    expect(convertLinks(input)).toBe(expected);
  });

  test('converts Trac ticket reference with wiki link', () => {
    const input = 'See [[TicketWorkflow]] and [submit](https://core.trac.wordpress.org/newticket)';
    const expected = 'See [[TicketWorkflow]] and [https://core.trac.wordpress.org/newticket submit]';
    expect(convertLinks(input)).toBe(expected);
  });

  test('converts complex sentence with mixed links', () => {
    const input = 'Visit [WordPress](https://wordpress.org), check [[Documentation]], or go to https://core.trac.wordpress.org directly';
    const expected = 'Visit [https://wordpress.org WordPress], check [[Documentation]], or go to https://core.trac.wordpress.org directly';
    expect(convertLinks(input)).toBe(expected);
  });
});

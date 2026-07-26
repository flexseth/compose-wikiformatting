/**
 * Tests for WikiFormatting to HTML renderer
 *
 * @jest-environment jsdom
 */

import { convertWikiToHtml } from './wikiToHtml';

describe('convertWikiToHtml - Headers', () => {
  describe('Basic headers with matching equals', () => {
    test('converts level 1 header', () => {
      const result = convertWikiToHtml('= Heading =');
      expect(result).toContain('<h1 class="section"');
      expect(result).toContain('id="Heading"');
      expect(result).toContain('>Heading<');
      expect(result).toContain('href="#Heading"');
      expect(result).toContain('> ¶</a>');
    });

    test('converts level 2 header', () => {
      const result = convertWikiToHtml('== Subheading ==');
      expect(result).toContain('<h2 class="section"');
      expect(result).toContain('id="Subheading"');
    });

    test('converts level 3 header', () => {
      const result = convertWikiToHtml('=== Level 3 ===');
      expect(result).toContain('<h3 class="section"');
      expect(result).toContain('id="Level3"');
    });

    test('converts level 4 header', () => {
      const result = convertWikiToHtml('==== Level 4 ====');
      expect(result).toContain('<h4 class="section"');
      expect(result).toContain('id="Level4"');
    });

    test('converts level 5 header', () => {
      const result = convertWikiToHtml('===== Level 5 =====');
      expect(result).toContain('<h5 class="section"');
      expect(result).toContain('id="Level5"');
    });

    test('converts level 6 header', () => {
      const result = convertWikiToHtml('====== Level 6 ======');
      expect(result).toContain('<h6 class="section"');
      expect(result).toContain('id="Level6"');
    });
  });

  describe('Headers without trailing equals', () => {
    test('converts header without trailing equals', () => {
      const result = convertWikiToHtml('== Subheading');
      expect(result).toContain('<h2 class="section"');
      expect(result).toContain('id="Subheading"');
      expect(result).toContain('>Subheading<');
    });

    test('converts level 1 without trailing', () => {
      const result = convertWikiToHtml('= Title');
      expect(result).toContain('<h1 class="section"');
      expect(result).toContain('id="Title"');
    });

    test('converts level 3 without trailing', () => {
      const result = convertWikiToHtml('=== Section');
      expect(result).toContain('<h3 class="section"');
      expect(result).toContain('id="Section"');
    });
  });

  describe('Headers with inline formatting', () => {
    test('converts header with italic text', () => {
      const result = convertWikiToHtml("=== About ''this'' ===");
      expect(result).toContain('<h3 class="section"');
      expect(result).toContain('id="Aboutthis"');
      expect(result).toContain('About <em>this</em>');
    });

    test('converts header with italic without trailing equals', () => {
      const result = convertWikiToHtml("== Test ''italic''");
      expect(result).toContain('<h2 class="section"');
      expect(result).toContain('id="Testitalic"');
      expect(result).toContain('Test <em>italic</em>');
    });
  });

  describe('Headers with explicit IDs', () => {
    test('converts header with explicit ID and trailing equals', () => {
      const result = convertWikiToHtml('=== Explicit id === #using-explicit-id-in-heading');
      expect(result).toContain('<h3 class="section"');
      expect(result).toContain('id="using-explicit-id-in-heading"');
      expect(result).toContain('>Explicit id<');
      expect(result).toContain('href="#using-explicit-id-in-heading"');
    });

    test('converts header with explicit ID without trailing equals', () => {
      const result = convertWikiToHtml('== Subheading #sub2');
      expect(result).toContain('<h2 class="section"');
      expect(result).toContain('id="sub2"');
      expect(result).toContain('>Subheading<');
      expect(result).toContain('href="#sub2"');
    });

    test('uses explicit ID over auto-generated', () => {
      const result = convertWikiToHtml('= Custom Title = #my-custom-id');
      expect(result).toContain('id="my-custom-id"');
      expect(result).not.toContain('id="CustomTitle"');
    });

    test('handles explicit ID with hyphens', () => {
      const result = convertWikiToHtml('== Test == #test-with-hyphens');
      expect(result).toContain('id="test-with-hyphens"');
    });

    test('handles explicit ID with underscores', () => {
      const result = convertWikiToHtml('== Test == #test_with_underscores');
      expect(result).toContain('id="test_with_underscores"');
    });
  });

  describe('Auto-generated IDs', () => {
    test('generates ID by removing spaces', () => {
      const result = convertWikiToHtml('= Hello World =');
      expect(result).toContain('id="HelloWorld"');
    });

    test('generates ID with multiple words', () => {
      const result = convertWikiToHtml('== This Is A Test ==');
      expect(result).toContain('id="ThisIsATest"');
    });

    test('removes special characters from ID', () => {
      const result = convertWikiToHtml('= Test (note) =');
      expect(result).toContain('id="Testnote"');
    });

    test('handles text with punctuation', () => {
      const result = convertWikiToHtml("= Don't Stop! =");
      expect(result).toContain('id="DontStop"');
    });
  });

  describe('Anchor links', () => {
    test('includes paragraph anchor symbol', () => {
      const result = convertWikiToHtml('= Test =');
      expect(result).toContain('> ¶</a>');
    });

    test('anchor links to correct ID', () => {
      const result = convertWikiToHtml('== Section #custom');
      expect(result).toContain('href="#custom"> ¶</a>');
    });

    test('anchor has correct class', () => {
      const result = convertWikiToHtml('= Test =');
      expect(result).toContain('class="anchor"');
    });
  });

  describe('Invalid headers', () => {
    test('rejects header with mismatched equals', () => {
      const result = convertWikiToHtml('== Text ===');
      // Should be escaped as plain text, not converted to header
      expect(result).not.toContain('<h');
      expect(result).toContain('==');
    });

    test('rejects header without space after equals', () => {
      const result = convertWikiToHtml('==NoSpace');
      expect(result).not.toContain('<h');
    });

    test('rejects 7+ equals (max is 6)', () => {
      const result = convertWikiToHtml('======= Too many =======');
      expect(result).not.toContain('<h7');
      expect(result).not.toContain('<h');
    });

    test('rejects zero equals', () => {
      const result = convertWikiToHtml('Just text');
      expect(result).not.toContain('<h');
      expect(result).toContain('Just text');
    });
  });

  describe('Edge cases', () => {
    test('handles empty header text', () => {
      const result = convertWikiToHtml('=  =');
      expect(result).toContain('<h1');
    });

    test('handles header with extra whitespace', () => {
      const result = convertWikiToHtml('==   Title   ==');
      expect(result).toContain('<h2');
      expect(result).toContain('>Title<');
    });

    test('handles Unicode in headers', () => {
      const result = convertWikiToHtml('= 你好 世界 =');
      expect(result).toContain('<h1');
      expect(result).toContain('你好 世界');
    });

    test('handles emoji in headers', () => {
      const result = convertWikiToHtml('= Test 🎉 =');
      expect(result).toContain('<h1');
      expect(result).toContain('🎉');
    });
  });
});

describe('convertWikiToHtml - Security', () => {
  test('escapes HTML in non-header text', () => {
    const result = convertWikiToHtml('<script>alert("XSS")</script>');
    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });

  test('escapes HTML entities in plain text', () => {
    const result = convertWikiToHtml('Test & <test>');
    expect(result).toContain('&amp;');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  test('does not double-escape header text', () => {
    const result = convertWikiToHtml('= Test &amp; Title =');
    expect(result).toContain('Test &amp; Title');
    expect(result).not.toContain('&amp;amp;');
  });

  test('prevents XSS in explicit IDs', () => {
    // IDs should only allow word characters and hyphens
    const result = convertWikiToHtml('= Test = #<script>');
    // The regex should not match this as a valid ID
    expect(result).not.toContain('id="<script>"');
  });
});

describe('convertWikiToHtml - Integration', () => {
  test('converts multi-line WikiFormatting', () => {
    const wiki = `= Main Title =

Some text

== Subtitle ==`;
    const result = convertWikiToHtml(wiki);
    expect(result).toContain('<h1');
    expect(result).toContain('<h2');
    expect(result).toContain('Some text');
  });

  test('preserves empty lines', () => {
    const wiki = `= Title =


== Section ==`;
    const result = convertWikiToHtml(wiki);
    const lines = result.split('\n');
    expect(lines).toContain('');
  });

  test('handles mixed content', () => {
    const wiki = `= Header =
Normal text
== Subheader ==
More text`;
    const result = convertWikiToHtml(wiki);
    expect(result).toContain('<h1');
    expect(result).toContain('<h2');
    expect(result).toContain('Normal text');
    expect(result).toContain('More text');
  });
});

describe('convertWikiToHtml - Type Safety', () => {
  test('throws TypeError for non-string input', () => {
    expect(() => convertWikiToHtml(123)).toThrow(TypeError);
    expect(() => convertWikiToHtml(null)).toThrow(TypeError);
    expect(() => convertWikiToHtml(undefined)).toThrow(TypeError);
    expect(() => convertWikiToHtml({})).toThrow(TypeError);
    expect(() => convertWikiToHtml([])).toThrow(TypeError);
  });

  test('handles empty string', () => {
    const result = convertWikiToHtml('');
    expect(result).toBe('');
  });

  test('handles string with only whitespace', () => {
    const result = convertWikiToHtml('   ');
    expect(result).toBe('');
  });
});

describe('convertWikiToHtml - Options', () => {
  test('accepts options object', () => {
    const result = convertWikiToHtml('= Test =', { preserveNewlines: true });
    expect(result).toContain('<h1');
  });

  test('works with empty options', () => {
    const result = convertWikiToHtml('= Test =', {});
    expect(result).toContain('<h1');
  });

  test('works without options parameter', () => {
    const result = convertWikiToHtml('= Test =');
    expect(result).toContain('<h1');
  });
});

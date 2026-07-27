import { convertTextFormatting } from './textFormatting';

describe('convertTextFormatting - Bold Conversion', () => {
  test('converts double asterisk bold to WikiFormatting', () => {
    expect(convertTextFormatting('**bold**')).toBe("'''bold'''");
  });

  test('converts double underscore bold to WikiFormatting', () => {
    expect(convertTextFormatting('__bold__')).toBe("'''bold'''");
  });

  test('converts bold in middle of text', () => {
    expect(convertTextFormatting('This is **bold** text')).toBe("This is '''bold''' text");
  });

  test('converts multiple bold sections', () => {
    expect(convertTextFormatting('**First** and **second**'))
      .toBe("'''First''' and '''second'''");
  });

  test('converts bold with spaces', () => {
    expect(convertTextFormatting('**bold with spaces**'))
      .toBe("'''bold with spaces'''");
  });
});

describe('convertTextFormatting - Italic Conversion', () => {
  test('converts single asterisk italic to WikiFormatting', () => {
    expect(convertTextFormatting('*italic*')).toBe("''italic''");
  });

  test('converts single underscore italic to WikiFormatting', () => {
    expect(convertTextFormatting('_italic_')).toBe("''italic''");
  });

  test('converts italic in middle of text', () => {
    expect(convertTextFormatting('This is *italic* text')).toBe("This is ''italic'' text");
  });

  test('converts multiple italic sections', () => {
    expect(convertTextFormatting('*First* and *second*'))
      .toBe("''First'' and ''second''");
  });

  test('converts italic with spaces', () => {
    expect(convertTextFormatting('*italic with spaces*'))
      .toBe("''italic with spaces''");
  });
});

describe('convertTextFormatting - Bold + Italic Combination', () => {
  test('converts triple asterisk to WikiFormatting bold+italic', () => {
    expect(convertTextFormatting('***bold and italic***'))
      .toBe("'''''bold and italic'''''");
  });

  test('converts triple underscore to WikiFormatting bold+italic', () => {
    expect(convertTextFormatting('___bold and italic___'))
      .toBe("'''''bold and italic'''''");
  });

  test('converts bold+italic in middle of text', () => {
    expect(convertTextFormatting('This is ***important*** text'))
      .toBe("This is '''''important''''' text");
  });
});

describe('convertTextFormatting - Mixed Formatting', () => {
  test('converts both bold and italic in same line', () => {
    expect(convertTextFormatting('**bold** and *italic*'))
      .toBe("'''bold''' and ''italic''");
  });

  test('converts nested formatting', () => {
    expect(convertTextFormatting('**bold with *italic* inside**'))
      .toBe("'''bold with ''italic'' inside'''");
  });

  test('converts all three types in one line', () => {
    expect(convertTextFormatting('**bold** *italic* ***both***'))
      .toBe("'''bold''' ''italic'' '''''both'''''");
  });
});

describe('convertTextFormatting - Edge Cases', () => {
  test('handles empty string', () => {
    expect(convertTextFormatting('')).toBe('');
  });

  test('handles text with no formatting', () => {
    expect(convertTextFormatting('plain text')).toBe('plain text');
  });

  test('handles single asterisk without pair', () => {
    expect(convertTextFormatting('text * with * asterisks')).toBe('text * with * asterisks');
  });

  test('handles single underscore without pair', () => {
    expect(convertTextFormatting('text _ with _ underscores')).toBe('text _ with _ underscores');
  });

  test('handles consecutive asterisks (ambiguous case)', () => {
    // **** is matched as *(**)*  → ''**''
    expect(convertTextFormatting('****')).toBe("''**''");
  });

  test('handles double asterisks without content', () => {
    // ** alone is not valid Markdown - leave as-is
    expect(convertTextFormatting('**')).toBe('**');
  });
});

describe('convertTextFormatting - Special Characters', () => {
  test('preserves special characters in bold', () => {
    expect(convertTextFormatting('**<tag>**')).toBe("'''<tag>'''");
  });

  test('preserves ampersands in italic', () => {
    expect(convertTextFormatting('*Tom & Jerry*')).toBe("''Tom & Jerry''");
  });

  test('preserves quotes in formatted text', () => {
    expect(convertTextFormatting('**Say "Hello"**')).toBe("'''Say \"Hello\"'''");
  });

  test('preserves numbers in formatted text', () => {
    expect(convertTextFormatting('**123** and *456*')).toBe("'''123''' and ''456''");
  });
});

describe('convertTextFormatting - Unicode Support', () => {
  test('handles Unicode in bold', () => {
    expect(convertTextFormatting('**你好**')).toBe("'''你好'''");
  });

  test('handles Unicode in italic', () => {
    expect(convertTextFormatting('*Café*')).toBe("''Café''");
  });

  test('handles emojis in formatting', () => {
    expect(convertTextFormatting('**Hello 👋**')).toBe("'''Hello 👋'''");
  });
});

describe('convertTextFormatting - Type Safety', () => {
  test('throws TypeError for number', () => {
    expect(() => convertTextFormatting(123)).toThrow(TypeError);
  });

  test('throws TypeError for null', () => {
    expect(() => convertTextFormatting(null)).toThrow(TypeError);
  });

  test('throws TypeError for undefined', () => {
    expect(() => convertTextFormatting(undefined)).toThrow(TypeError);
  });

  test('throws TypeError for object', () => {
    expect(() => convertTextFormatting({})).toThrow(TypeError);
  });

  test('throws TypeError for array', () => {
    expect(() => convertTextFormatting([])).toThrow(TypeError);
  });
});

describe('convertTextFormatting - Inline Code and Strikethrough', () => {
  test('preserves inline code (no conversion needed)', () => {
    expect(convertTextFormatting('Use `console.log()`')).toBe('Use `console.log()`');
  });

  test('preserves strikethrough (no conversion needed)', () => {
    expect(convertTextFormatting('~~strikethrough~~')).toBe('~~strikethrough~~');
  });

  test('handles code with bold', () => {
    expect(convertTextFormatting('**bold** and `code`'))
      .toBe("'''bold''' and `code`");
  });
});

describe('convertTextFormatting - Real-world Examples', () => {
  test('converts typical documentation text', () => {
    const input = 'The **API** returns *JSON* data.';
    const expected = "The '''API''' returns ''JSON'' data.";
    expect(convertTextFormatting(input)).toBe(expected);
  });

  test('converts bug report emphasis', () => {
    const input = 'This is **critical** and needs *immediate* attention.';
    const expected = "This is '''critical''' and needs ''immediate'' attention.";
    expect(convertTextFormatting(input)).toBe(expected);
  });

  test('converts mixed formatting in sentence', () => {
    const input = 'Use the ***new API*** with **caution** because *it might change*.';
    const expected = "Use the '''''new API''''' with '''caution''' because ''it might change''.";
    expect(convertTextFormatting(input)).toBe(expected);
  });
});

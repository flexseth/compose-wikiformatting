/**
 * Tests for localStorage utility
 *
 * @jest-environment jsdom
 */

import {
  saveToStorage,
  loadFromStorage,
  getStorageData,
  clearStorage,
  isStorageAvailable
} from './storage';

const STORAGE_KEY = 'compose-wikiformatting-v1';

describe('storage utility', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('saveToStorage', () => {
    test('saves content to localStorage', () => {
      const content = '# Test Content';
      const result = saveToStorage(content);

      expect(result).toBe(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeTruthy();

      const data = JSON.parse(stored);
      expect(data.editorContent).toBe(content);
      expect(typeof data.timestamp).toBe('number');
    });

    test('saves empty string', () => {
      const result = saveToStorage('');

      expect(result).toBe(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = JSON.parse(stored);
      expect(data.editorContent).toBe('');
    });

    test('saves multiline content', () => {
      const content = '# Title\n\nSome content\n\n## Subtitle';
      saveToStorage(content);

      const stored = localStorage.getItem(STORAGE_KEY);
      const data = JSON.parse(stored);
      expect(data.editorContent).toBe(content);
    });

    test('updates timestamp on each save', () => {
      const now = Date.now();
      const dateSpy = jest.spyOn(Date, 'now')
        .mockReturnValueOnce(now)
        .mockReturnValueOnce(now + 1000);

      saveToStorage('First');
      const firstData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const firstTimestamp = firstData.timestamp;

      saveToStorage('Second');
      const secondData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const secondTimestamp = secondData.timestamp;

      expect(secondTimestamp).toBeGreaterThan(firstTimestamp);
      expect(secondTimestamp).toBe(now + 1000);

      dateSpy.mockRestore();
    });

    test('throws TypeError for non-string content', () => {
      expect(() => saveToStorage(123)).toThrow(TypeError);
      expect(() => saveToStorage(null)).toThrow(TypeError);
      expect(() => saveToStorage(undefined)).toThrow(TypeError);
      expect(() => saveToStorage({})).toThrow(TypeError);
    });

    test('handles localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      const result = saveToStorage('test');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('loadFromStorage', () => {
    test('loads saved content', () => {
      const content = '# Saved Content';
      saveToStorage(content);

      const loaded = loadFromStorage();
      expect(loaded).toBe(content);
    });

    test('returns empty string when no data exists', () => {
      const loaded = loadFromStorage();
      expect(loaded).toBe('');
    });

    test('returns empty string for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');

      const loaded = loadFromStorage();
      expect(loaded).toBe('');
    });

    test('returns empty string for invalid data structure', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ wrong: 'structure' }));

      const loaded = loadFromStorage();
      expect(loaded).toBe('');
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const loaded = loadFromStorage();

      expect(loaded).toBe('');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('getStorageData', () => {
    test('returns full storage data', () => {
      const content = '# Test';
      saveToStorage(content);

      const data = getStorageData();

      expect(data).toBeTruthy();
      expect(data.editorContent).toBe(content);
      expect(typeof data.timestamp).toBe('number');
    });

    test('returns null when no data exists', () => {
      const data = getStorageData();
      expect(data).toBeNull();
    });

    test('returns null for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid');

      const data = getStorageData();
      expect(data).toBeNull();
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const data = getStorageData();

      expect(data).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      getItemSpy.mockRestore();
    });
  });

  describe('clearStorage', () => {
    test('clears stored content', () => {
      saveToStorage('# Some content');
      expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();

      const result = clearStorage();

      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    test('succeeds even when no data exists', () => {
      const result = clearStorage();
      expect(result).toBe(true);
    });

    test('handles localStorage errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = clearStorage();

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      removeItemSpy.mockRestore();
    });
  });

  describe('isStorageAvailable', () => {
    test('returns true when localStorage is available', () => {
      const available = isStorageAvailable();
      expect(available).toBe(true);
    });

    test('returns false when localStorage throws error', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage disabled');
      });

      const available = isStorageAvailable();
      expect(available).toBe(false);

      setItemSpy.mockRestore();
    });

    test('cleans up test item', () => {
      isStorageAvailable();

      const testItem = localStorage.getItem('__storage_test__');
      expect(testItem).toBeNull();
    });
  });

  describe('WordPress attribute compatibility', () => {
    test('storage format matches WordPress block attributes', () => {
      const content = '# WordPress Content';
      saveToStorage(content);

      const data = getStorageData();

      // WordPress block attribute structure
      expect(data).toHaveProperty('editorContent');
      expect(data).toHaveProperty('timestamp');
      expect(typeof data.editorContent).toBe('string');
      expect(typeof data.timestamp).toBe('number');
    });

    test('can extract editorContent like WordPress attribute', () => {
      const content = '# Block Content';
      saveToStorage(content);

      const { editorContent } = getStorageData();

      // This pattern will work as WordPress block attribute
      expect(editorContent).toBe(content);
    });
  });
});

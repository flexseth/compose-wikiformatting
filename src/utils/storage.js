/**
 * LocalStorage utility for persisting editor content
 *
 * Uses WordPress block attribute-like structure for easy conversion
 * when migrating to WordPress plugin.
 *
 * Storage format matches WordPress block attribute pattern:
 * {
 *   editorContent: string,
 *   timestamp: number
 * }
 *
 * @module utils/storage
 */

const STORAGE_KEY = 'compose-wikiformatting-v1';

/**
 * Storage data structure (WordPress-ready)
 *
 * @typedef {Object} StorageData
 * @property {string} editorContent - The editor content (maps to WP block attribute)
 * @property {number} timestamp - Unix timestamp of last save
 */

/**
 * Save editor content to localStorage
 *
 * Uses attribute-like structure for easy WordPress conversion:
 * localStorage → WordPress block attributes
 *
 * @param {string} content - Editor content to save
 * @returns {boolean} Success status
 *
 * @example
 * saveToStorage('# My Document');
 * // Saves: { editorContent: '# My Document', timestamp: 1234567890 }
 *
 * @security Content is not sanitized here - sanitization happens in converters
 */
export function saveToStorage(content) {
  // Type check first (throw before try/catch)
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  try {
    const data = {
      editorContent: content,
      timestamp: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

/**
 * Load editor content from localStorage
 *
 * @returns {string} Saved content or empty string if none exists
 *
 * @example
 * const content = loadFromStorage();
 * // Returns: '# My Document' or ''
 *
 * @security Returns empty string on error to prevent application crash
 */
export function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return '';
    }

    const data = JSON.parse(stored);

    // Validate structure (WordPress attribute pattern)
    if (typeof data?.editorContent === 'string') {
      return data.editorContent;
    }

    return '';
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return '';
  }
}

/**
 * Get full storage data including timestamp
 *
 * @returns {StorageData|null} Storage data or null if none exists
 *
 * @example
 * const data = getStorageData();
 * // Returns: { editorContent: '...', timestamp: 1234567890 }
 */
export function getStorageData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get storage data:', error);
    return null;
  }
}

/**
 * Clear all stored content
 *
 * @returns {boolean} Success status
 *
 * @example
 * clearStorage();
 * // Removes all saved editor content
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Check if storage is available
 *
 * @returns {boolean} True if localStorage is available
 *
 * @example
 * if (isStorageAvailable()) {
 *   saveToStorage(content);
 * }
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

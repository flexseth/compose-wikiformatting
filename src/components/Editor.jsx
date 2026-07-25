import React, { useState, useRef } from 'react';
import './Editor.css';

/**
 * Editor Component
 *
 * A controlled textarea for composing Markdown content that will be
 * converted to WikiFormatting. Includes character/word counts and
 * keyboard navigation support.
 *
 * @param {Object} props
 * @param {string} props.value - Current editor content
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.placeholder - Placeholder text for empty editor
 */
const Editor = ({ value = '', onChange, placeholder = 'Type or paste Markdown here...' }) => {
  const textareaRef = useRef(null);

  /**
   * Handle textarea change events
   */
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  /**
   * Handle keyboard events for special key combinations
   */
  const handleKeyDown = (e) => {
    // Escape: Remove focus from textarea
    if (e.key === 'Escape') {
      e.preventDefault();
      textareaRef.current?.blur();
    }

    // Tab: Allow default behavior (focus navigation)
    // No need to handle Tab specially here - it will naturally
    // move to the next focusable element
  };

  /**
   * Calculate word count
   * Counts non-whitespace sequences as words
   */
  const getWordCount = () => {
    const trimmed = value?.trim() || '';
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).filter(word => word.length > 0).length;
  };

  /**
   * Calculate character count
   */
  const getCharCount = () => {
    return value.length;
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3>Editor</h3>
        <div className="editor-stats">
          <span className="stat">
            <span className="stat-label">Words:</span>
            <span className="stat-value">{getWordCount()}</span>
          </span>
          <span className="stat">
            <span className="stat-label">Characters:</span>
            <span className="stat-value">{getCharCount()}</span>
          </span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Markdown editor"
        spellCheck="true"
      />

      <div className="editor-footer">
        <p className="editor-hint">
          Press <kbd>Esc</kbd> to unfocus • <kbd>Tab</kbd> to navigate
        </p>
      </div>
    </div>
  );
};

export default Editor;

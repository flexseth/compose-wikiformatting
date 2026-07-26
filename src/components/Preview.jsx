import React from 'react';
import './Preview.css';

/**
 * Preview Component
 *
 * Displays the converted WikiFormatting output in a read-only textarea.
 * Shows the result of converting Markdown to WikiFormatting syntax.
 *
 * @param {Object} props
 * @param {string} props.value - WikiFormatting text to display
 * @param {string} props.title - Title for the preview section
 */
const Preview = ({ value = '', title = 'WikiFormatting Output' }) => {
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h3>{title}</h3>
        <div className="preview-label">
          <span className="label-text">Read-only preview</span>
        </div>
      </div>

      <textarea
        className="preview-textarea"
        value={value}
        readOnly
        aria-label="WikiFormatting preview"
        spellCheck="false"
        placeholder="WikiFormatting output will appear here..."
      />

      <div className="preview-footer">
        <p className="preview-hint">
          Preview of WikiFormatting syntax for WordPress Trac
        </p>
      </div>
    </div>
  );
};

export default Preview;

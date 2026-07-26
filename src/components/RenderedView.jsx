import React from 'react';
import './RenderedView.css';

/**
 * RenderedView Component
 *
 * Displays WikiFormatting rendered as React components, showing what
 * the content will look like on WordPress Trac.
 *
 * SECURITY: Uses native React rendering (no dangerouslySetInnerHTML).
 * All content is rendered as React elements/text nodes, which are
 * automatically escaped by React.
 *
 * @param {Object} props
 * @param {Array<React.Element>} props.elements - React elements from wikiToReact converter
 * @param {string} props.title - Title for the rendered section
 */
const RenderedView = ({ elements = [], title = 'Rendered Output' }) => {
  const hasContent = elements && elements.length > 0;

  return (
    <div className="rendered-container">
      <div className="rendered-header">
        <h3>{title}</h3>
        <div className="rendered-label">
          <span className="label-text">Live Preview</span>
        </div>
      </div>

      <div className="rendered-content">
        {hasContent ? (
          <div className="rendered-elements">
            {elements}
          </div>
        ) : (
          <div className="rendered-placeholder">
            <p>Rendered WikiFormatting will appear here...</p>
            <p className="placeholder-hint">
              Type WikiFormatting in the editor to see it rendered as HTML
            </p>
          </div>
        )}
      </div>

      <div className="rendered-footer">
        <p className="rendered-hint">
          Trac message preview
        </p>
      </div>
    </div>
  );
};

export default RenderedView;

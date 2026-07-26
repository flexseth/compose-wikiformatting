import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import RenderedView from './components/RenderedView';
import { convertMarkdownToWiki } from './converters';
import { convertWikiToReact } from './renderers';
import { loadFromStorage, saveToStorage, clearStorage } from './utils/storage';
import { useDebounce } from './utils/useDebounce';

/**
 * Main Application Component
 *
 * Provides a WikiFormatting editor with live preview, Markdown conversion,
 * WikiFormatting rendering, and localStorage persistence.
 *
 * Three-column layout:
 * 1. Editor (Markdown input)
 * 2. Preview (WikiFormatting syntax)
 * 3. RenderedView (HTML preview)
 *
 * Features:
 * - Auto-save to localStorage (debounced 500ms)
 * - Auto-restore on page load
 * - WordPress-ready storage format
 */
function App() {
  const [editorContent, setEditorContent] = useState('');
  const [wikiOutput, setWikiOutput] = useState('');
  const [renderedElements, setRenderedElements] = useState([]);

  // Debounce editor content for localStorage (500ms delay)
  const debouncedContent = useDebounce(editorContent, 500);

  // Load saved content on mount
  useEffect(() => {
    const savedContent = loadFromStorage();
    if (savedContent) {
      setEditorContent(savedContent);

      // Convert and render the loaded content
      const converted = convertMarkdownToWiki(savedContent);
      setWikiOutput(converted);
      const elements = convertWikiToReact(converted);
      setRenderedElements(elements);
    }
  }, []); // Run once on mount

  // Save debounced content to localStorage
  useEffect(() => {
    if (debouncedContent !== '') {
      saveToStorage(debouncedContent);
    }
  }, [debouncedContent]);

  const handleEditorChange = (value) => {
    setEditorContent(value);

    // Convert Markdown to WikiFormatting
    const converted = convertMarkdownToWiki(value);
    setWikiOutput(converted);

    // Convert WikiFormatting to React elements for rendering
    const elements = convertWikiToReact(converted);
    setRenderedElements(elements);
  };

  const handleClearStorage = () => {
    if (window.confirm('Clear all saved content? This cannot be undone.')) {
      clearStorage();
      setEditorContent('');
      setWikiOutput('');
      setRenderedElements([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Compose WikiFormatting</h1>
        <p>Convert Markdown to WikiFormatting for WordPress Trac</p>
      </header>
      <main className="App-main">
        <div className="content-area">
          <div className="editor-preview-rendered-container">
            <div className="editor-column">
              <Editor
                value={editorContent}
                onChange={handleEditorChange}
              />
            </div>
            <div className="preview-column">
              <Preview
                value={wikiOutput}
                title="WikiFormatting Syntax"
              />
            </div>
            <div className="rendered-column">
              <RenderedView
                elements={renderedElements}
                title="Rendered Preview"
              />
            </div>
          </div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
}

export default App;

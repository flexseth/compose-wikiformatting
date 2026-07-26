import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import RenderedView from './components/RenderedView';
import { convertMarkdownToWiki } from './converters';
import { convertWikiToReact } from './renderers';

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
 */
function App() {
  const [editorContent, setEditorContent] = useState('');
  const [wikiOutput, setWikiOutput] = useState('');
  const [renderedElements, setRenderedElements] = useState([]);

  const handleEditorChange = (value) => {
    setEditorContent(value);

    // Convert Markdown to WikiFormatting
    const converted = convertMarkdownToWiki(value);
    setWikiOutput(converted);

    // Convert WikiFormatting to React elements for rendering
    const elements = convertWikiToReact(converted);
    setRenderedElements(elements);
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

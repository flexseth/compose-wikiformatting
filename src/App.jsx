import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { convertMarkdownToWiki } from './converters';

/**
 * Main Application Component
 *
 * Provides a WikiFormatting editor with live preview, Markdown conversion,
 * and localStorage persistence.
 */
function App() {
  const [editorContent, setEditorContent] = useState('');
  const [wikiOutput, setWikiOutput] = useState('');

  const handleEditorChange = (value) => {
    setEditorContent(value);

    // Convert Markdown to WikiFormatting
    const converted = convertMarkdownToWiki(value);
    setWikiOutput(converted);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Compose WikiFormatting</h1>
        <p>Convert Markdown to WikiFormatting for WordPress Trac</p>
      </header>
      <main className="App-main">
        <div className="content-area">
          <div className="editor-preview-container">
            <div className="editor-column">
              <Editor
                value={editorContent}
                onChange={handleEditorChange}
              />
            </div>
            <div className="preview-column">
              <Preview
                value={wikiOutput}
                title="WikiFormatting Output"
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

import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';

/**
 * Main Application Component
 *
 * Provides a WikiFormatting editor with live preview, Markdown conversion,
 * and localStorage persistence.
 */
function App() {
  const [editorContent, setEditorContent] = useState('');

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Compose WikiFormatting</h1>
        <p>Convert Markdown to WikiFormatting for WordPress Trac</p>
      </header>
      <main className="App-main">
        <div className="content-area">
          <div className="editor-section">
            <Editor
              value={editorContent}
              onChange={handleEditorChange}
            />
          </div>
        </div>
      </main>
      <Sidebar />
    </div>
  );
}

export default App;

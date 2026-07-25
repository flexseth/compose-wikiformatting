import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

/**
 * Main Application Component
 *
 * Provides a WikiFormatting editor with live preview, Markdown conversion,
 * and localStorage persistence.
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Compose WikiFormatting</h1>
        <p>Convert Markdown to WikiFormatting for WordPress Trac</p>
      </header>
      <main className="App-main">
        <div className="content-area">
          <p>Editor and preview components will be added here.</p>
        </div>
      </main>
      <Sidebar />
    </div>
  );
}

export default App;

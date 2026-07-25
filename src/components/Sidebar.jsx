import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import './Sidebar.css';

/**
 * Collapsible Sidebar Component
 *
 * Displays quick links to WikiFormatting documentation sections
 * on https://trac.ffmpeg.org/wiki/WikiFormatting
 */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const BASE_URL = 'https://trac.ffmpeg.org/wiki/WikiFormatting';

  // WikiFormatting documentation sections with their anchor IDs
  const sections = [
    {
      id: 'basics',
      title: 'Basics',
      links: [
        { label: 'Common Wiki Markup', anchor: '#Commonwikimarkup' },
        { label: 'Font Styles', anchor: '#FontStyles' },
        { label: 'Headings', anchor: '#Headings' },
        { label: 'Paragraphs', anchor: '#Paragraphs' },
      ]
    },
    {
      id: 'lists',
      title: 'Lists & Structure',
      links: [
        { label: 'Lists', anchor: '#Lists' },
        { label: 'Definition Lists', anchor: '#DefinitionLists' },
        { label: 'Tables', anchor: '#Tables' },
        { label: 'Simple Tables', anchor: '#SimpleTables' },
        { label: 'Complex Tables', anchor: '#ComplexTables' },
      ]
    },
    {
      id: 'text',
      title: 'Text Formatting',
      links: [
        { label: 'Preformatted Text', anchor: '#PreformattedText' },
        { label: 'Blockquotes', anchor: '#Blockquotes' },
        { label: 'Discussion Citations', anchor: '#DiscussionCitations' },
        { label: 'Escaping Markup', anchor: '#Escaping' },
      ]
    },
    {
      id: 'links',
      title: 'Links & References',
      links: [
        { label: 'Links', anchor: '#Links' },
        { label: 'Trac Links', anchor: '#TracLinks' },
        { label: 'Setting Anchors', anchor: '#SettingAnchors' },
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      links: [
        { label: 'Images', anchor: '#Images' },
        { label: 'Macros', anchor: '#Macros' },
        { label: 'Processors', anchor: '#Processors' },
        { label: 'Comments', anchor: '#Comments' },
        { label: 'Miscellaneous', anchor: '#Miscellaneous' },
      ]
    }
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3>WikiFormatting Docs</h3>
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <FiChevronRight /> : <FiChevronDown />}
        </button>
      </div>

      {isOpen && (
        <div className="sidebar-content">
          <p className="sidebar-description">
            Quick reference for Trac WikiFormatting syntax
          </p>

          <div className="sections">
            {sections.map(section => (
              <div key={section.id} className="section">
                <button
                  className="section-header"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={expandedSections[section.id] || false}
                >
                  <span className="section-icon">
                    {expandedSections[section.id] ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                  <span className="section-title">{section.title}</span>
                </button>

                {expandedSections[section.id] && (
                  <ul className="section-links">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={`${BASE_URL}${link.anchor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doc-link"
                        >
                          <span>{link.label}</span>
                          <FiExternalLink className="external-icon" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <a
              href={BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="full-docs-link"
            >
              View Full Documentation <FiExternalLink />
            </a>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

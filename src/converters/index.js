/**
 * Markdown to WikiFormatting Converters
 *
 * Entry point for all conversion functionality.
 * Import the main converter from this module for clean dependencies.
 *
 * @module converters
 *
 * @example
 * import { convertMarkdownToWiki } from './converters';
 *
 * const wiki = convertMarkdownToWiki('# Hello World');
 * console.log(wiki); // '= Hello World ='
 */

export { convertMarkdownToWiki } from './markdownToWiki.js';
export { convertHeader, convertHeaders } from './headers.js';
export { convertTextFormatting } from './textFormatting.js';

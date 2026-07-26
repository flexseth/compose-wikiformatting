/**
 * WikiFormatting Renderers
 *
 * Entry point for all rendering functionality.
 * Import renderers from this module for clean dependencies.
 *
 * @module renderers
 *
 * @example
 * import { convertWikiToReact } from './renderers';
 *
 * const elements = convertWikiToReact('= Hello World =');
 * // Returns: [<h1 className="section" id="HelloWorld">Hello World<a...>¶</a></h1>]
 *
 * @example
 * import { convertWikiToHtml } from './renderers';
 *
 * const html = convertWikiToHtml('= Hello World =');
 * // Returns: '<h1 class="section" id="HelloWorld">Hello World<a class="anchor" href="#HelloWorld"> ¶</a></h1>'
 */

export { convertWikiToHtml } from './wikiToHtml.js';
export { convertWikiToReact } from './wikiToReact.js';

# TODO - WikiFormatting Converter

## Documentation

- [Security Guidelines](./SECURITY.md) - Security practices, reviews, and production recommendations
- [Project Plan](./PLAN.md) - Overall project roadmap and phase details
- [Changelog](./CHANGELOG.md) - Version history and changes

---

## Current Status

**Branch:** feature/blockquotes  
**Phase:** 6 (Blockquotes) - ✅ COMPLETE  
**Next Phase:** Phase 7 (Lists)  
**Version:** 1.0.0-alpha

---

## Active Tasks

### Phase 6: Blockquotes (Discussion Citations Only) ✅
- [x] Phase 6a: Markdown → WikiFormatting conversion (pass-through)
- [x] Phase 6b: WikiFormatting → React rendering
- [x] Security review completed
- [ ] Merge to trunk
- [ ] Create release tag

**Note**: Phase 6 implements **Discussion Citations** (`>` markers) only.  
Standard blockquotes (2-space indent) are tracked separately below.

#### Trac Rendering Bug Discovery

**Issue:** Possible rendering bug in WordPress Trac's blockquote implementation.

**Test Case:**
```
> # Blockquote H1 - 1st level quote
>> Here's a nested blockquote
>>> 3rd level nested
>>>> 4th level nested
> simple blockquote
```

**Expected Behavior:**
- First 4 lines: nested blockquotes (levels 1-4)
- Last line `> simple blockquote`: separate level 1 blockquote (sibling to first blockquote)

**Observed in Trac:**
The final `> simple blockquote` line appears to render wrapped/nested with the previous blockquotes, even though it's level 1.

**HTML Markup from Trac:**
```html
<blockquote class="citation">
  <p># Blockquote H1 - 1st level quote<br></p>
  <blockquote class="citation">
    <p>Here's anested blockquote<br></p>
    <blockquote class="citation">
      <p>3rd level nested<br></p>
      <blockquote class="citation">
        <p>4th level nested<br></p>
      </blockquote>
    </blockquote>
  </blockquote>
  <p>simple blockquote<br></p>  <!-- ← Should be outside parent blockquote? -->
</blockquote>
```

**Code References:**
- Rendering: `src/renderers/wikiToReact.js` - `buildNestedBlockquotes()` function (lines 71-116)
- Styling: `src/components/RenderedView.css` - blockquote.citation rules (lines 253-305)

**Action Items:**
- [ ] Test rendering in actual WordPress Trac environment
- [ ] Compare our implementation vs Trac's parser
- [ ] Verify if this is a Trac bug or expected behavior
- [ ] Document differences between our rendering and Trac's
- [ ] Decide: match Trac's behavior or implement "correct" behavior

---

## Upcoming Phases

### Phase 6c: Standard Blockquotes (2-Space Indent) 
**NOT YET IMPLEMENTED** - Different from Phase 6 Discussion Citations

**Syntax:**
- Markdown: 2-space indent at line start
- WikiFormatting: Same (2-space indent)
- Renders as: `<blockquote>` (no citation class)

**Example:**
```
Paragraph
  This text is a quote from someone else.
```

**Tasks:**
- [ ] Markdown → WikiFormatting conversion (preserve 2-space indent)
- [ ] WikiFormatting → React rendering (`<blockquote>` without citation class)
- [ ] Distinguish from Discussion Citations (different styling)
- [ ] Security review
- [ ] Tests

**References:**
- Trac docs: https://trac.ffmpeg.org/wiki/WikiFormatting#Blockquotes
- Saved HTML: WikiFormatting – FFmpeg.html (Blockquotes section)

### Phase 7: Lists
- [ ] Ordered lists conversion
- [ ] Unordered lists conversion
- [ ] Nested lists support
- [ ] List rendering as React components

### Phase 8: Tables
- [ ] Table syntax conversion
- [ ] Table rendering
- [ ] Column alignment support

### Phase 9: Images & Attachments
- [ ] Image syntax conversion
- [ ] Attachment links
- [ ] Alt text support

### Phase 10: Advanced Features
- [ ] Horizontal rules
- [ ] Definition lists
- [ ] Macros (if applicable)

---

## Technical Debt

### High Priority
- [ ] Add end-to-end tests (Playwright/Cypress)
- [ ] Performance profiling for large documents
- [ ] Accessibility audit (WCAG 2.1 AA compliance)

### Medium Priority
- [ ] Add TypeScript types (optional)
- [ ] Bundle size optimization
- [ ] Error boundary for React components

### Low Priority
- [ ] Dark mode toggle (currently auto-detects)
- [ ] Export to PDF feature
- [ ] Keyboard shortcuts documentation

---

## Quality Assurance

### Before Each Release
- [ ] All tests passing (100%)
- [ ] Test coverage >= 80%
- [ ] Security review completed
- [ ] Manual testing on all features
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Accessibility testing
- [ ] Performance testing

### Production Deployment Checklist
See [SECURITY.md](./SECURITY.md#production-security-recommendations) for complete security requirements:
- [ ] CSP headers configured
- [ ] Security headers configured (X-Frame-Options, etc.)
- [ ] HTTPS enforced with HSTS
- [ ] SSL/TLS certificate valid
- [ ] Error pages configured (404, 500)
- [ ] Analytics configured (if applicable)
- [ ] Monitoring/alerting configured

---

## Known Issues

### Blockers
*None*

### Non-Blockers
- Editor: 3-second delay before auto-update (by design, but consider making configurable)
- Mobile: Touch keyboard may cover editor on small screens (investigate viewport units)

---

## Feature Requests

### User-Requested
- [ ] Copy button success feedback (visual confirmation)
- [ ] Save button with custom filename
- [ ] Import from file (drag-and-drop)
- [ ] Export to Markdown (reverse conversion)

### Internal
- [ ] LocalStorage quota exceeded handling
- [ ] Offline mode indicator
- [ ] Version history (undo/redo beyond browser default)

---

## Documentation Tasks

### Code Documentation
- [x] JSDoc comments on all functions
- [x] README.md with usage instructions
- [ ] API documentation (if exposing functions)
- [ ] Architecture decision records (ADRs)

### User Documentation
- [ ] User guide with screenshots
- [ ] Video tutorial (optional)
- [ ] FAQ section
- [ ] Troubleshooting guide

---

## WordPress Plugin (Phase 1.0.1)

### Requirements
- [ ] Convert Gutenberg blocks to WikiFormatting
- [ ] Add WordPress admin menu
- [ ] Settings page for preferences
- [ ] WordPress VIP coding standards compliance
- [ ] Plugin Check Plugin (PCP) compliance
- [ ] WordPress.org plugin repository submission

### Security (WordPress-Specific)
See [SECURITY.md](./SECURITY.md#phase-101-wordpress-plugin) for complete requirements:
- [ ] Nonce verification on AJAX
- [ ] Capability checks
- [ ] WordPress sanitization (`sanitize_text_field`, etc.)
- [ ] WordPress escaping (`esc_html`, `esc_url`, etc.)
- [ ] SQL prepared statements

---

## Website Deployment (Phase 2.0.0)

### Infrastructure
- [ ] Domain registration
- [ ] Hosting provider selection
- [ ] CDN setup (Cloudflare recommended)
- [ ] SSL/TLS certificate (Let's Encrypt)
- [ ] DNS configuration

### Features
- [ ] Landing page design
- [ ] Demo/sandbox environment
- [ ] Contact form
- [ ] Google AdWords integration (revenue)
- [ ] Analytics (Google Analytics / Plausible)

### Performance
- [ ] Minification (CSS, JS)
- [ ] Gzip/Brotli compression
- [ ] Cache headers
- [ ] Lazy loading for images
- [ ] Performance budget enforcement

---

## Research & Exploration

### Investigate
- [ ] WebAssembly for performance-critical parsing
- [ ] Service worker for offline support
- [ ] PWA (Progressive Web App) features
- [ ] Trac API integration for direct posting
- [ ] Multi-language support (i18n)

### Competitive Analysis
- [ ] Review other Markdown editors
- [ ] Review Trac syntax highlighters
- [ ] Review conversion tools (Pandoc, etc.)

---

## Community & Marketing

### Open Source
- [ ] LICENSE file (MIT recommended)
- [ ] CONTRIBUTING.md guidelines
- [ ] CODE_OF_CONDUCT.md
- [ ] Issue templates (bug report, feature request)
- [ ] PR template

### Promotion
- [ ] WordPress.org plugin directory listing
- [ ] Blog post announcement
- [ ] Social media posts (Twitter, LinkedIn)
- [ ] WordPress Slack community announcement
- [ ] Submit to Awesome WordPress lists

---

## Notes

### Development Guidelines
- Follow [CLAUDE.md](./CLAUDE.md) for all development
- Use test-driven development (TDD) for new features
- Maintain 100% coverage on converters and renderers
- Security review required for each phase
- Git commit messages follow conventional commits

### Testing Strategy
- Unit tests: All converter/renderer functions
- Integration tests: Pipeline and component interactions
- Security tests: XSS, injection, URL validation
- E2E tests (future): User workflows
- Performance tests (future): Large document handling

---

**Last Updated:** 2026-08-01  
**Maintainer:** Seth Miller (seth@flexperception.com)

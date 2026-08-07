# Security Guidelines

## Overview

This document outlines security practices, findings, and recommendations for the WikiFormatting Converter project.

## Security Reviews

All phases undergo security review before merge. Security review reports are stored in `DECISIONS_phase*_security.md` files.

### Latest Review: Phase 6 (Blockquotes)

**Status:** ✅ APPROVED  
**Date:** 2026-08-01  
**Findings:** 0 vulnerabilities  
**Branch:** feature/blockquotes

---

## Current Security Posture

### XSS Protection ✅

**Implementation:**
- All user content rendered via React children (automatic escaping)
- Zero usage of `dangerouslySetInnerHTML` throughout the codebase
- Comprehensive XSS test coverage (15+ dedicated security tests)

**Verified Safe:**
- HTML tags escaped: `<div>HTML</div>` → displayed as text, not rendered
- Script tags blocked: `<script>alert("XSS")</script>` → escaped
- Event handlers neutralized: `onclick="..."` → escaped
- Image/iframe tags blocked: `<img onerror="...">` → escaped

### URL Validation ✅

**Implementation:**
- Dangerous protocols blocked in `src/renderers/links.js`
- Allowlist-based approach (explicit approval required)

**Blocked Protocols:**
- `javascript:` - Code execution
- `data:` - Data URIs (potential XSS vector)
- `vbscript:` - VBScript execution
- `file:` - Local file access

**Allowed Protocols:**
- `http:`, `https:` - Standard web protocols
- `mailto:` - Email links
- `wiki:`, `ticket:`, `comment:`, `changeset:`, `source:`, `attachment:` - Trac-specific schemes
- `//` - Protocol-relative URLs (by design, documented)

### Input Validation ✅

**Type Safety:**
- All converter functions validate string input
- `TypeError` thrown for non-string inputs
- Prevents null/undefined edge cases

**Content Safety:**
- Text-to-text transformations only (no code execution)
- Integer calculations for nesting levels (no injection)
- React keys generated from loop indices (deterministic, safe)

### No Injection Vectors ✅

**Architecture:**
- Pure client-side application (no backend)
- No SQL, NoSQL, or database operations
- No command execution or system calls
- No server-side templating
- No eval, Function constructor, or dynamic code execution

---

## Production Security Recommendations

### Essential: Deployment-Level Security

When deploying to production, implement the following security headers and policies:

#### 1. Content Security Policy (CSP)

**Priority:** HIGH  
**Implementation:** Add CSP headers to production web server configuration

**Recommended Policy:**
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  font-src 'self';
  connect-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
```

**Rationale:**
- Prevents loading of external scripts (XSS mitigation)
- Restricts where resources can be loaded from
- `style-src 'unsafe-inline'` required for React inline styles
- `img-src data:` allows base64-encoded images if needed
- `frame-ancestors 'none'` prevents clickjacking

**Testing:**
```bash
# Test CSP headers are set
curl -I https://your-domain.com | grep -i content-security-policy
```

#### 2. Subresource Integrity (SRI)

**Priority:** MEDIUM  
**Implementation:** Add integrity attributes to external scripts/stylesheets

**Example:**
```html
<!-- If using external CDN resources -->
<script 
  src="https://cdn.example.com/react.js"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous">
</script>
```

**Rationale:**
- Ensures external resources haven't been tampered with
- Protects against CDN compromises
- Verifies resource integrity before execution

**Note:** Currently not applicable (no external dependencies in production build), but required if CDN resources added in future.

#### 3. Security Headers

**Priority:** HIGH  
**Implementation:** Configure web server to send security headers

**Required Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Header Explanations:**

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks |
| `X-Frame-Options` | `DENY` | Prevents clickjacking (no iframe embedding) |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter (defense-in-depth) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer information leakage |
| `Permissions-Policy` | `geolocation=(), ...` | Disables unused browser APIs |

**Nginx Example:**
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

**Apache Example:**
```apache
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

#### 4. HTTPS Enforcement

**Priority:** CRITICAL  
**Implementation:** Enforce HTTPS in production

**Required:**
- TLS 1.2 or higher (TLS 1.3 recommended)
- Valid SSL/TLS certificate (Let's Encrypt, commercial CA)
- HSTS (HTTP Strict Transport Security) header

**HSTS Header:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Nginx HTTPS Redirect:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # ... rest of config
}
```

---

## Testing Security Controls

### Automated Security Testing

**Run security tests:**
```bash
# Run full test suite (includes 15+ security tests)
npm test

# Run with coverage to verify security-critical code
npm run test:coverage

# Security test files
npm test -- blockquotes.test.js  # XSS prevention tests
npm test -- links.test.js        # URL validation tests
npm test -- wikiToReact.test.js  # Integration security tests
```

**Required Coverage:**
- All converter functions: 100% coverage
- All renderer functions: 100% coverage
- Security test suites: 100% passing

### Manual Security Testing

**XSS Prevention Testing:**
1. Paste into Editor: `> <script>alert('XSS')</script>`
2. Verify: Script tag appears as text in Rendered View
3. Verify: No JavaScript execution occurs
4. Verify: Browser DevTools shows escaped `&lt;script&gt;`

**URL Validation Testing:**
1. Paste into Editor: `> [Click](javascript:alert(1))`
2. Verify: Link renders as plain text (not clickable)
3. Verify: No "javascript:" in href attribute

**HTML Injection Testing:**
1. Paste into Editor: `> <img src=x onerror="alert(1)">`
2. Verify: Displays as text, no image rendered
3. Verify: No error event fires

---

## Security Incident Response

### Reporting Security Vulnerabilities

**DO NOT** open public GitHub issues for security vulnerabilities.

**Contact:**
- Email: seth@flexperception.com
- Subject: `[SECURITY] WikiFormatting Vulnerability Report`

**Include:**
1. Description of the vulnerability
2. Steps to reproduce
3. Affected versions
4. Suggested fix (if available)

**Response Time:**
- Acknowledgment: Within 48 hours
- Initial assessment: Within 1 week
- Fix timeline: Based on severity

### Severity Classification

| Severity | Impact | Response Time |
|----------|--------|---------------|
| **CRITICAL** | RCE, authentication bypass, data breach | 24 hours |
| **HIGH** | XSS, injection, privilege escalation | 1 week |
| **MEDIUM** | Defense-in-depth bypass, information disclosure | 2 weeks |
| **LOW** | Theoretical issues, minimal impact | 1 month |

---

## Security Audit History

### Phase 6: Blockquotes (2026-08-01)
- **Status:** ✅ APPROVED
- **Commits Reviewed:** 3
- **Vulnerabilities Found:** 0
- **Test Coverage:** 591 tests passing, 15 security tests
- **Details:** See security review report above

### Phase 5: Code Blocks (2026-07-30)
- **Status:** ✅ APPROVED
- **Security Decision:** `DECISIONS_phase4b_security.md`
- **Key Findings:** XSS prevention via React auto-escaping verified
- **Test Coverage:** 100% on security-critical paths

### Phase 4: Links (2026-07-29)
- **Status:** ✅ APPROVED
- **Security Controls:** URL protocol validation, XSS prevention
- **Blocked Protocols:** `javascript:`, `data:`, `vbscript:`, `file:`
- **Test Coverage:** URL validation suite (20+ tests)

### Phase 3: Text Formatting (2026-07-28)
- **Status:** ✅ APPROVED
- **Security Review:** Text-to-text transformation, no HTML generation
- **XSS Risk:** None (React rendering layer provides escaping)

---

## Compliance

### OWASP Top 10 (2021) Compliance

| Risk | Status | Notes |
|------|--------|-------|
| A01: Broken Access Control | ✅ N/A | Client-side only, no authentication |
| A02: Cryptographic Failures | ✅ N/A | No cryptographic operations |
| A03: Injection | ✅ PASS | React auto-escaping, URL validation |
| A04: Insecure Design | ✅ PASS | Secure design patterns followed |
| A05: Security Misconfiguration | ✅ PASS | Minimal config, secure defaults |
| A06: Vulnerable Components | ✅ PASS | Dependencies security-reviewed |
| A07: Auth Failures | ✅ N/A | No authentication system |
| A08: Data Integrity Failures | ✅ PASS | Client-side validation only |
| A09: Logging Failures | ✅ N/A | No sensitive data logging |
| A10: SSRF | ✅ N/A | No server-side requests |

---

## Security Best Practices (Development)

### Code Review Checklist

Before merging any PR, verify:

- [ ] No usage of `dangerouslySetInnerHTML`
- [ ] No usage of `eval()` or `Function()` constructor
- [ ] All user input rendered via React children (auto-escaped)
- [ ] URL validation for all link rendering
- [ ] Type validation on all converter functions
- [ ] Security tests added for new features
- [ ] Test coverage >= 80% overall, 100% on converters/renderers
- [ ] Security review completed (if applicable)

### Dependency Management

**Review new dependencies for:**
- Known CVEs (check npm audit)
- Maintainer reputation
- Update frequency
- License compatibility
- Bundle size impact

**Run security audit:**
```bash
npm audit
npm audit fix  # For non-breaking fixes
```

### Git Commit Guidelines

**Never commit:**
- API keys, tokens, secrets
- .env files with sensitive data
- Private keys or certificates
- User data or PII

**Use .gitignore:**
```
.env
.env.local
*.key
*.pem
*.p12
secrets/
```

---

## Future Security Enhancements

### Phase 1.0.1 (WordPress Plugin)

**Additional Security Requirements:**
- WordPress nonce verification for AJAX requests
- Capability checks for admin features
- Sanitization with `sanitize_text_field()`, `wp_kses_post()`
- Escaping with `esc_html()`, `esc_url()`, `esc_js()`
- SQL injection prevention via `$wpdb->prepare()`
- CSRF protection on form submissions

**WordPress Security Standards:**
- Follow WordPress VIP coding standards
- Pass Plugin Check Plugin (PCP) security review
- Implement WordPress Security Whitepaper guidelines

### Future Phases

**Phase 1.1.0 (File Upload):**
- File type validation (allowlist: .txt, .md, .doc only)
- File size limits (max 5MB)
- Malware scanning (ClamAV integration)
- Filename sanitization (prevent path traversal)

**Phase 1.3.0 (Trac Integration):**
- OAuth 2.0 for Trac authentication
- Token storage security (HttpOnly cookies)
- CSRF tokens for state-changing operations
- Rate limiting on API calls

**Phase 2.0.0 (Production Website):**
- All deployment security headers (see above)
- DDoS protection (Cloudflare, AWS Shield)
- WAF (Web Application Firewall)
- Monitoring and alerting (SIEM integration)

---

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [React Security Best Practices](https://react.dev/learn/security)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [WordPress Security Whitepaper](https://wordpress.org/about/security/)

---

**Last Updated:** 2026-08-01  
**Maintainer:** Seth Miller (seth@flexperception.com)  
**Review Cycle:** After each major phase implementation

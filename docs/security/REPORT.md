# Security Scan Report — AJYN / controlled-commerce-hub

**Date:** 2026-09-10  
**Targets:** local codebase (SAST) + https://www.ajynworld.com (DAST)  
**Artifacts:** `docs/security/`

## Summary

| Scan | Result |
|------|--------|
| SAST – npm audit | 23 vulnerabilities (1 critical, 10 high) — mostly build/dev tooling |
| SAST – ESLint | 1 error fixed (`prefer-const`); remaining are non-security warnings |
| SAST – Semgrep secrets | **0 findings** (276 files) |
| SAST – Semgrep OWASP Top Ten | **0 findings** (276 files, 76 rules) |
| DAST – OWASP ZAP baseline | **0 FAIL**, 10 WARN, 57 PASS |
| DAST – Security headers probe | Missing headers remediated in `vercel.json` |
| DAST – Sensitive path probe | SPA catch-all returns `200` HTML for `/.env`, `/.git/config`, etc. (not secret leakage) |

No critical exploitable production findings from ZAP or Semgrep. Main follow-ups: dependency upgrades and verifying headers after deploy.

---

## SAST

### npm audit
- **Critical:** `tar` (via `supabase` CLI) — CLI tooling, not runtime storefront.
- **High:** `vite`, `browserslist`, `brace-expansion`, `@xmldom/xmldom`, `undici`, `ws`, and related transitive packages — primarily **dev/build** risk.
- **Action:** Run `npm audit fix` in a dedicated dependency PR; verify build + Paystack/Supabase flows after upgrades.

### ESLint
- Fixed: `let` → `const` in `AdminOrders.tsx`.
- Remaining warnings: react-refresh export patterns, hook dependency notes — quality only.

### Semgrep
- Secrets pack: **0 findings**
- OWASP Top Ten pack: **0 findings**

---

## DAST (OWASP ZAP baseline)

**FAIL:** 0  
**WARN:** 10 (headers / cache / CSP / clickjacking / Permissions-Policy / COEP)  
**PASS:** 57

### Warnings addressed in this change
Added production headers in `vercel.json`:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- Content-Security-Policy tuned for Paystack, Supabase, Mapbox, CDN assets

### Notes
- `/.env` → `200` is the SPA rewrite serving `index.html`, not an exposed env file.
- Cache-control / COEP warnings are lower priority for a public storefront SPA.

---

## Remediation status

| Item | Status |
|------|--------|
| Upgrade AJYN transactional + auth email templates | Done |
| Add security response headers | Done (`vercel.json`) |
| Fix ESLint prefer-const | Done |
| npm dependency upgrades | Recommended follow-up |
| Re-run ZAP after deploy | Recommended |

Production URL: https://www.ajynworld.com  
Vercel app: https://controlled-commerce-hub.vercel.app

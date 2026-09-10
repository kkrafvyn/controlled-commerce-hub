import { AJYN_EMAIL_STYLES } from './ajyn-email-styles.ts'
import { getSupportWhatsAppUrl, SUPPORT_PHONE_DISPLAY } from './support-contact.ts'

const BRAND_NAME = 'AJYN'
const COPYRIGHT_YEAR = '2026'
const SUPPORT_EMAIL = Deno.env.get('SUPPORT_EMAIL') || 'support@ajynworld.com'
const APP_URL = Deno.env.get('APP_URL') || 'https://www.ajynworld.com'
const AJYN_EMAIL_LOGO_URL = 'https://www.ajynworld.com/ajyn-wordmark.svg'
const AJYN_EMAIL_LOGO_DARK_URL = 'https://www.ajynworld.com/ajyn-wordmark-dark.svg'

export type AjynEmailInput = {
  eyebrow?: string
  reference?: string
  icon?: string
  title: string
  greetingName?: string
  intro?: string
  bodyHtml?: string
  statusTitle?: string
  statusText?: string
  ctaLabel?: string
  ctaUrl?: string
  closing?: string
  preheaderAction?: {
    label: string
    url: string
  }
}

export function buildAjynEmailHtml(input: {
  eyebrow?: string
  reference?: string
  icon?: string
  title: string
  greetingName?: string
  intro?: string
  bodyHtml?: string
  statusTitle?: string
  statusText?: string
  ctaLabel?: string
  ctaUrl?: string
  closing?: string
  preheaderAction?: {
    label: string
    url: string
  }
}) {
  const preview = input.intro || input.statusText || input.title
  const referenceChip = input.reference
    ? `<span class="ajyn-ref-chip ajyn-text-dark">${input.eyebrow ? escapeHtml(input.eyebrow.toUpperCase()) : 'REFERENCE'} <span class="ajyn-text-brand">${escapeHtml(input.reference)}</span></span>`
    : input.eyebrow
      ? `<span class="ajyn-ref-chip ajyn-text-dark">${escapeHtml(input.eyebrow.toUpperCase())}</span>`
      : ''
  const closingMessage = input.closing ?? 'We will keep you updated every step of the way.'
  const safeCtaUrl = input.ctaUrl ? sanitizeEmailUrl(input.ctaUrl) : null
  const safePreheaderUrl = input.preheaderAction?.url ? sanitizeEmailUrl(input.preheaderAction.url) : safeCtaUrl
  const preheaderLabel = input.preheaderAction?.label || 'View order'
  const shopUrl = sanitizeEmailUrl(`${APP_URL}/products`) || APP_URL
  const trackUrl = sanitizeEmailUrl(`${APP_URL}/my-orders`) || APP_URL
  const helpUrl = sanitizeEmailUrl(`${APP_URL}/help`) || APP_URL

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${escapeHtml(input.title)}</title>
    <style>
${AJYN_EMAIL_STYLES}
    </style>
  </head>
  <body class="body ajyn-body-bg ajyn-font-sans" style="margin:0;padding:0;background:#f3eee8;color-scheme:light dark;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ajyn-body-bg" bgcolor="#f3eee8" style="background:#f3eee8;border-collapse:collapse;">
      <tr>
        <td align="center" class="ajyn-shell" bgcolor="#f3eee8" style="padding:28px 12px;background:#f3eee8;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="ajyn-card ajyn-light-bg" bgcolor="#ffffff" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e8dfd6;border-radius:16px;overflow:hidden;">
            <tr>
              <td class="ajyn-accent-bar" bgcolor="#111111" style="background:#111111;padding:0;height:6px;font-size:0;line-height:0;">
                <div class="ajyn-accent-line" style="height:3px;background:#c18c5d;font-size:0;line-height:0;">&nbsp;</div>
              </td>
            </tr>
            ${
              safePreheaderUrl
                ? `<tr class="ajyn-preheader">
              <td class="ajyn-preheader-cell ajyn-light-bg ajyn-font-sans" bgcolor="#ffffff" style="padding:14px 40px 0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left" class="ajyn-preheader-left ajyn-text-muted ajyn-font-sans" style="font-size:11px;line-height:1.4;">Thank you for shopping with AJYN.</td>
                    <td align="right" class="ajyn-font-sans" style="font-size:11px;line-height:1.4;white-space:nowrap;">
                      <a href="${escapeHtml(safePreheaderUrl)}" class="ajyn-preheader-link">${escapeHtml(preheaderLabel)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
                : ''
            }
            <tr>
              <td class="ajyn-container ajyn-light-bg" bgcolor="#ffffff" style="padding:32px 40px 0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ajyn-header-row">
                  <tr>
                    <td class="ajyn-logo-cell ajyn-light-bg" align="left" valign="middle" bgcolor="#ffffff" style="background:#ffffff;">
                      <div class="ajyn-logo-lockup" style="display:inline-block;text-align:left;">
                        ${getLogoMarkHtml()}
                      </div>
                    </td>
                    <td class="ajyn-ref-cell ajyn-text-dark ajyn-light-bg ajyn-font-sans" align="right" valign="middle" bgcolor="#ffffff" style="background:#ffffff;">
                      ${referenceChip}
                    </td>
                  </tr>
                </table>
                <div class="ajyn-desktop-divider" style="border-top:1px solid #eadfd4;font-size:0;line-height:0;">&nbsp;</div>
              </td>
            </tr>
            <tr>
              <td align="center" class="ajyn-hero-wrap ajyn-light-bg" bgcolor="#ffffff" style="padding:24px 40px 12px;background:#ffffff;">
                <div class="ajyn-hero-icon ajyn-hero-bg" style="width:68px;height:68px;border-radius:50%;border:1px solid #eadfd4;background:#f4ebe3;display:inline-block;text-align:center;">
                  ${getPackageIconHtml()}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" class="ajyn-title ajyn-text-dark ajyn-light-bg ajyn-font-serif" bgcolor="#ffffff" style="padding:0 40px 18px;background:#ffffff;font-size:24px;line-height:1.3;font-weight:700;">
                <span class="ajyn-gmail-text">${escapeHtml(input.title)}</span>
              </td>
            </tr>
            <tr>
              <td class="ajyn-body ajyn-light-bg ajyn-font-sans" bgcolor="#ffffff" style="padding:0 48px 0;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="ajyn-copy ajyn-text-dark ajyn-font-sans" style="font-size:14px;line-height:1.65;padding-bottom:12px;">
                      <span class="ajyn-gmail-text">Hello ${escapeHtml(input.greetingName || 'there')},</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="ajyn-copy ajyn-text-dark ajyn-font-sans" style="font-size:14px;line-height:1.65;padding-bottom:12px;">
                      <span class="ajyn-gmail-text">${input.intro ? escapeHtml(input.intro) : 'Thank you for shopping with AJYN.'}</span>
                    </td>
                  </tr>
                  ${
                    input.bodyHtml
                      ? `<tr>
                    <td class="ajyn-copy ajyn-text-dark ajyn-font-sans" style="font-size:14px;line-height:1.65;padding-bottom:20px;">
                      <div class="ajyn-gmail-text">${input.bodyHtml || ''}</div>
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    input.statusTitle || input.statusText
                      ? `<tr>
                    <td class="ajyn-status-row" style="padding-bottom:20px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ajyn-status-card ajyn-soft-bg" bgcolor="#f8f3ee" style="background:#f8f3ee;border:1px solid #eadfd4;border-radius:12px;padding:18px 20px;border-collapse:separate;">
                        <tr>
                          <td width="64" valign="middle" class="ajyn-status-icon-cell">
                            <div class="ajyn-status-check" style="width:48px;height:48px;border:2px solid #c18c5d;border-radius:50%;text-align:center;line-height:46px;font-size:24px;color:#c18c5d;">&#10003;</div>
                          </td>
                          <td valign="middle" class="ajyn-status-copy ajyn-text-dark ajyn-font-sans">
                            ${input.statusTitle ? `<div class="ajyn-status-title ajyn-text-dark ajyn-gmail-text ajyn-font-sans" style="font-size:15px;line-height:1.3;font-weight:700;padding-bottom:4px;">${escapeHtml(input.statusTitle)}</div>` : ''}
                            ${input.statusText ? `<div class="ajyn-status-text ajyn-text-dark ajyn-gmail-text ajyn-font-sans" style="font-size:12px;line-height:1.5;">${escapeHtml(input.statusText)}</div>` : ''}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    closingMessage
                      ? `<tr>
                    <td class="ajyn-copy ajyn-closing ajyn-text-dark ajyn-font-sans" style="font-size:14px;line-height:1.65;padding-bottom:20px;">
                      <span class="ajyn-gmail-text">${escapeHtml(closingMessage)}</span>
                    </td>
                  </tr>`
                      : ''
                  }
                  ${
                    input.ctaLabel && safeCtaUrl
                      ? `<tr>
                    <td align="center" class="ajyn-cta-cell" style="padding-bottom:28px;">
                      <a href="${escapeHtml(safeCtaUrl)}" class="ajyn-cta ajyn-black-bg ajyn-text-orange ajyn-font-sans" style="display:inline-block;min-width:240px;max-width:100%;box-sizing:border-box;background:#111111;color:#c18c5d;font-weight:700;letter-spacing:1.8px;padding:16px 28px;border-radius:8px;font-size:12px;line-height:1;text-transform:uppercase;text-align:center;">${escapeHtml(input.ctaLabel)}</a>
                    </td>
                  </tr>`
                      : ''
                  }
                </table>
              </td>
            </tr>
            <tr>
              <td class="ajyn-divider-cell ajyn-light-bg" bgcolor="#ffffff" style="padding:0 40px;background:#ffffff;">
                <hr style="border:none;border-top:1px solid #eadfd4;margin:0;">
              </td>
            </tr>
            <tr>
              <td align="center" class="ajyn-help ajyn-light-bg" bgcolor="#ffffff" style="padding:22px 40px 20px;background:#ffffff;">
                <div class="ajyn-help-icon" style="padding-bottom:6px;color:#c18c5d;font-size:22px;line-height:1;">${getSupportIconHtml()}</div>
                <div class="ajyn-help-title ajyn-text-dark ajyn-gmail-text ajyn-font-serif" style="font-size:16px;line-height:1.3;font-weight:700;">Need help?</div>
                <div class="ajyn-help-subtitle ajyn-text-dark ajyn-gmail-text ajyn-font-sans" style="font-size:12px;line-height:1.4;padding-bottom:14px;">Our team is ready to assist with your order.</div>
                <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="border-collapse:collapse;">
                  <tr>
                    <td class="ajyn-contact ajyn-text-dark ajyn-font-sans" style="font-size:12px;line-height:1.4;">${getEmailIconHtml()}&nbsp; <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}" class="ajyn-gmail-text">${escapeHtml(SUPPORT_EMAIL)}</a></td>
                    <td class="ajyn-contact-divider" width="28" style="font-size:0;line-height:0;">&nbsp;</td>
                    <td class="ajyn-contact ajyn-text-dark ajyn-font-sans" style="font-size:12px;line-height:1.4;">${getWhatsAppIconHtml()}&nbsp; <a href="${escapeHtml(getSupportWhatsAppUrl())}" class="ajyn-gmail-text">${escapeHtml(SUPPORT_PHONE_DISPLAY)}</a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="ajyn-footer ajyn-footer-bg" bgcolor="#111111" style="padding:28px 36px 26px;background:#111111;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td align="center" style="padding-bottom:16px;">
                      ${getFooterBrandMarkHtml()}
                    </td>
                  </tr>
                  <tr>
                    <td align="center" class="ajyn-footer-links ajyn-font-sans" style="font-size:12px;line-height:1.6;padding-bottom:14px;">
                      <a href="${escapeHtml(shopUrl)}" class="ajyn-footer-link">Shop</a>
                      <span class="ajyn-text-on-dark-muted" style="padding:0 10px;">&middot;</span>
                      <a href="${escapeHtml(trackUrl)}" class="ajyn-footer-link">Orders</a>
                      <span class="ajyn-text-on-dark-muted" style="padding:0 10px;">&middot;</span>
                      <a href="${escapeHtml(helpUrl)}" class="ajyn-footer-link">Help</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" class="ajyn-footer-copy ajyn-text-on-dark-muted ajyn-font-sans" style="font-size:12px;line-height:1.5;padding-bottom:8px;">Thank you for shopping with AJYN.</td>
                  </tr>
                  <tr>
                    <td align="center" class="ajyn-footer-legal ajyn-text-on-dark-muted ajyn-font-sans" style="font-size:11px;line-height:1.5;">&copy; ${COPYRIGHT_YEAR} AJYN. All rights reserved.</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function escapeHtml(value: string) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeEmailUrl(url: string | null | undefined) {
  const trimmed = String(url || '').trim()
  if (!trimmed) {
    return null
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null
    }

    if (parsed.username || parsed.password) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

function getLogoMarkHtml() {
  return `
    <img class="ajyn-logo-mark ajyn-wordmark-light" src="${AJYN_EMAIL_LOGO_URL}" width="118" height="52" alt="AJYN" style="display:block;width:118px;height:52px;margin:0 auto;border:0;outline:none;text-decoration:none;object-fit:contain;">
    <img class="ajyn-logo-mark ajyn-wordmark-dark" src="${AJYN_EMAIL_LOGO_DARK_URL}" width="118" height="52" alt="AJYN" style="display:none;width:118px;height:52px;margin:0 auto;border:0;outline:none;text-decoration:none;object-fit:contain;">
  `
}

function getFooterBrandMarkHtml() {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="ajyn-footer-mark-wrap ajyn-footer-mark-bg ajyn-soft-bg" bgcolor="#f8f3ee" style="width:100%;max-width:280px;margin:0 auto;border-collapse:separate;border-radius:10px;background:#f8f3ee;background-color:#f8f3ee;">
      <tr>
        <td align="center" style="padding:16px 20px;">
          <img class="ajyn-footer-mark-img ajyn-wordmark-light" src="${AJYN_EMAIL_LOGO_URL}" width="100" height="44" alt="AJYN" style="display:block;width:100px;height:44px;margin:0 auto;border:0;outline:none;text-decoration:none;object-fit:contain;">
          <img class="ajyn-footer-mark-img ajyn-wordmark-dark" src="${AJYN_EMAIL_LOGO_DARK_URL}" width="100" height="44" alt="AJYN" style="display:none;width:100px;height:44px;margin:0 auto;border:0;outline:none;text-decoration:none;object-fit:contain;">
        </td>
      </tr>
    </table>
  `
}

function getPackageIconHtml() {
  return `
    <span class="ajyn-package-icon-text" aria-hidden="true" style="display:block;margin:16px auto 0;color:#B87432;-webkit-text-fill-color:#B87432;font-family:Arial,Helvetica,sans-serif;font-size:32px;line-height:34px;">&#9633;</span>
  `
}

function getSupportIconHtml() {
  return `
    <span class="ajyn-support-icon-text" aria-hidden="true" style="display:block;margin:0 auto;color:#B87432;-webkit-text-fill-color:#B87432;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:22px;">?</span>
  `
}

function getEmailIconHtml() {
  return `
    <span class="ajyn-contact-icon-text" aria-hidden="true" style="display:inline-block;vertical-align:0;color:#B87432;-webkit-text-fill-color:#B87432;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;line-height:1;">@</span>
  `
}

function getWhatsAppIconHtml() {
  return `
    <span class="ajyn-contact-icon-text" aria-hidden="true" style="display:inline-block;vertical-align:0;color:#B87432;-webkit-text-fill-color:#B87432;font-family:Arial,Helvetica,sans-serif;font-size:9px;font-weight:700;line-height:1;">WA</span>
  `
}

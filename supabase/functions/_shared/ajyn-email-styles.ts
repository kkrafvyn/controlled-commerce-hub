export const AJYN_EMAIL_STYLES = `
      :root { color-scheme:light dark;supported-color-schemes:light dark; }
      table { border-spacing:0;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0; }
      img { border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      a { color:inherit;text-decoration:none; }
      .ajyn-body-bg { color-scheme:light dark; }
      .ajyn-font-serif { font-family:Georgia,'Times New Roman',Times,serif !important; }
      .ajyn-font-sans { font-family:Arial,Helvetica,sans-serif !important; }
      .ajyn-light-bg { background:#ffffff !important;background-color:#ffffff !important; }
      .ajyn-soft-bg { background:#f8f3ee !important;background-color:#f8f3ee !important; }
      .ajyn-footer-mark-bg { background:#f8f3ee !important;background-color:#f8f3ee !important;border-radius:10px !important; }
      .ajyn-footer-mark-wrap { width:100% !important;max-width:100% !important; }
      .ajyn-footer-bg { background:#111111 !important;background-color:#111111 !important; }
      .ajyn-hero-bg { background:#f4ebe3 !important;background-color:#f4ebe3 !important; }
      .ajyn-black-bg, .ajyn-cta { background:#111111 !important;background-color:#111111 !important;background-image:linear-gradient(#111111,#111111) !important; }
      .ajyn-accent-bar { background:#111111 !important;background-color:#111111 !important; }
      .ajyn-accent-line { background:#c18c5d !important;background-color:#c18c5d !important; }
      .ajyn-text-dark, .ajyn-gmail-text { color:#161311 !important;-webkit-text-fill-color:#161311 !important; }
      .ajyn-text-muted { color:#6f655d !important;-webkit-text-fill-color:#6f655d !important; }
      .ajyn-text-brand { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
      .ajyn-text-orange, .ajyn-cta { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
      .ajyn-text-on-dark { color:#f5efe9 !important;-webkit-text-fill-color:#f5efe9 !important; }
      .ajyn-text-on-dark-muted { color:#b8aea4 !important;-webkit-text-fill-color:#b8aea4 !important; }
      .ajyn-preheader-link { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important;font-weight:700; }
      .ajyn-ref-chip { display:inline-block !important;padding:6px 10px !important;border:1px solid #eadfd4 !important;border-radius:999px !important;background:#fbf7f3 !important; }
      .ajyn-logo-mark { width:118px !important;height:52px !important; }
      .ajyn-footer-mark-img { width:100px !important;height:44px !important;margin:0 auto !important; }
      .ajyn-wordmark-light { display:block !important;max-height:none !important;overflow:visible !important; }
      .ajyn-wordmark-dark { display:none !important;max-height:0 !important;overflow:hidden !important; }
      .ajyn-header-row tr { display:table-row !important; }
      .ajyn-logo-cell { width:50% !important;text-align:left !important;vertical-align:middle !important;padding:0 !important; }
      .ajyn-ref-cell { width:50% !important;text-align:right !important;vertical-align:middle !important;border-top:none !important;padding:0 !important;font-size:10px !important;line-height:1.4 !important;letter-spacing:0.06em !important;text-transform:uppercase !important;white-space:nowrap !important; }
      .ajyn-desktop-divider { display:none !important; }
      .ajyn-preheader { display:none !important; }
      .ajyn-footer-link { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important;font-weight:600; }
      .ajyn-body .ajyn-copy p, .ajyn-body .ajyn-copy strong, .ajyn-body .ajyn-copy td { color:inherit !important;-webkit-text-fill-color:inherit !important; }
      @media (prefers-color-scheme: dark) {
        body, .ajyn-body-bg, .ajyn-shell { background:#09070d !important;background-color:#09070d !important;background-image:linear-gradient(#09070d,#09070d) !important; }
        .ajyn-card, .ajyn-container, .ajyn-header-row, .ajyn-logo-cell, .ajyn-ref-cell, .ajyn-hero-wrap, .ajyn-title, .ajyn-body, .ajyn-divider-cell, .ajyn-help, .ajyn-light-bg { background:#171514 !important;background-color:#171514 !important;background-image:linear-gradient(#171514,#171514) !important; }
        .ajyn-soft-bg, .ajyn-status-card { background:#24201d !important;background-color:#24201d !important;background-image:linear-gradient(#24201d,#24201d) !important; }
        .ajyn-footer-mark-bg { background:#302923 !important;background-color:#302923 !important;background-image:linear-gradient(#302923,#302923) !important; }
        .ajyn-footer-bg { background:#0d0b0a !important;background-color:#0d0b0a !important;background-image:linear-gradient(#0d0b0a,#0d0b0a) !important; }
        .ajyn-hero-bg, .ajyn-hero-icon { background:#302923 !important;background-color:#302923 !important;background-image:linear-gradient(#302923,#302923) !important; }
        .ajyn-ref-chip { background:#24201d !important;border-color:#3b332e !important; }
        .ajyn-text-dark, .ajyn-gmail-text, .ajyn-gmail-text p, .ajyn-gmail-text strong, .ajyn-gmail-text span, .ajyn-gmail-text div,
        .ajyn-copy, .ajyn-copy p, .ajyn-copy strong, .ajyn-copy span, .ajyn-copy div, .ajyn-copy td,
        .ajyn-title, .ajyn-title span, .ajyn-status-title, .ajyn-status-text, .ajyn-status-copy,
        .ajyn-help-title, .ajyn-help-subtitle, .ajyn-contact, .ajyn-contact a, .ajyn-ref-cell,
        .ajyn-body td, .ajyn-body p, .ajyn-body strong, .ajyn-body span, .ajyn-body div {
          color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;
        }
        .ajyn-text-muted, .ajyn-preheader-left { color:#d4ccc4 !important;-webkit-text-fill-color:#d4ccc4 !important; }
        .ajyn-text-on-dark { color:#f5efe9 !important;-webkit-text-fill-color:#f5efe9 !important; }
        .ajyn-text-on-dark-muted, .ajyn-footer-copy, .ajyn-footer-legal { color:#b8aea4 !important;-webkit-text-fill-color:#b8aea4 !important; }
        .ajyn-text-brand, .ajyn-text-brand span, span.ajyn-text-brand { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-preheader-link, .ajyn-footer-link { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-cta { background:#000000 !important;background-color:#000000 !important;background-image:linear-gradient(#000000,#000000) !important;color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-status-check { border-color:#c18c5d !important;color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-wordmark-light { display:none !important;max-height:0 !important;overflow:hidden !important; }
        .ajyn-wordmark-dark { display:block !important;max-height:none !important;overflow:visible !important; }
      }
      [data-ogsc] .ajyn-text-dark, [data-ogsc] .ajyn-gmail-text, [data-ogsc] .ajyn-copy, [data-ogsc] .ajyn-title,
      [data-ogsc] .ajyn-status-title, [data-ogsc] .ajyn-status-text, [data-ogsc] .ajyn-help-title, [data-ogsc] .ajyn-help-subtitle,
      [data-ogsc] .ajyn-contact, [data-ogsc] .ajyn-contact a, [data-ogsc] .ajyn-ref-cell,
      [data-ogsb] .ajyn-text-dark, [data-ogsb] .ajyn-gmail-text, [data-ogsb] .ajyn-copy, [data-ogsb] .ajyn-title {
        color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;
      }
      @media only screen and (max-width: 600px) {
        .ajyn-shell { padding:0 !important; }
        .ajyn-card { width:100% !important;max-width:100% !important;border-radius:0 !important;border:none !important; }
        .ajyn-container { padding:20px 24px 0 !important; }
        .ajyn-preheader { display:table-row !important; }
        .ajyn-preheader-cell { padding:12px 24px 0 !important; }
        .ajyn-preheader-left { font-size:10px !important;line-height:1.4 !important; }
        .ajyn-preheader-link { font-size:10px !important;line-height:1.4 !important; }
        .ajyn-header-row, .ajyn-header-row tbody, .ajyn-header-row tr, .ajyn-logo-cell, .ajyn-ref-cell { display:block !important;width:100% !important;box-sizing:border-box !important; }
        .ajyn-logo-cell { text-align:center !important;padding:0 0 14px !important; }
        .ajyn-logo-lockup { margin:0 auto !important; }
        .ajyn-logo-mark { width:104px !important;height:46px !important;margin:0 auto !important; }
        .ajyn-ref-cell { border-top:1px solid #eadfd4 !important;text-align:center !important;padding:12px 0 8px !important;font-size:9px !important;line-height:1.25 !important;letter-spacing:0.04em !important;white-space:normal !important; }
        .ajyn-ref-chip { padding:5px 9px !important; }
        .ajyn-hero-wrap { padding:12px 24px 8px !important; }
        .ajyn-hero-icon { width:56px !important;height:56px !important; }
        .ajyn-package-icon-text { font-size:26px !important;line-height:28px !important;margin:12px auto 0 !important; }
        .ajyn-title { font-size:20px !important;line-height:1.3 !important;padding:0 20px 12px !important;white-space:normal !important;overflow-wrap:break-word !important; }
        .ajyn-copy { font-size:13px !important;line-height:1.55 !important;padding-bottom:8px !important; }
        .ajyn-copy p { margin:0 0 8px !important; }
        .ajyn-body { padding:0 24px 6px !important; }
        .ajyn-status-row { padding-bottom:12px !important; }
        .ajyn-status-card { padding:12px 14px !important;border-radius:10px !important; }
        .ajyn-status-icon-cell { width:50px !important; }
        .ajyn-status-check { width:40px !important;height:40px !important;line-height:38px !important;font-size:20px !important; }
        .ajyn-status-title { font-size:14px !important;padding-bottom:3px !important; }
        .ajyn-status-text { font-size:11px !important;line-height:1.4 !important; }
        .ajyn-closing { padding-bottom:12px !important; }
        .ajyn-cta-cell { padding-bottom:16px !important; }
        .ajyn-cta { width:100% !important;box-sizing:border-box !important;padding:14px 16px !important;border-radius:8px !important;font-size:12px !important;letter-spacing:1.6px !important; }
        .ajyn-divider-cell { padding:0 24px !important; }
        .ajyn-help { padding:16px 24px 14px !important; }
        .ajyn-help-icon { padding-bottom:4px !important; }
        .ajyn-support-icon-text { font-size:20px !important;line-height:20px !important; }
        .ajyn-help-title { font-size:14px !important; }
        .ajyn-help-subtitle { font-size:11px !important;padding-bottom:10px !important; }
        .ajyn-contact { font-size:10px !important;white-space:nowrap !important; }
        .ajyn-contact-divider { width:14px !important; }
        .ajyn-footer { padding:20px 20px 22px !important; }
        .ajyn-footer-links { font-size:11px !important; }
        .ajyn-footer-mark-wrap { width:100% !important;max-width:100% !important; }
        .ajyn-footer-mark-bg td { padding:14px 20px !important; }
        .ajyn-footer-mark-img, .ajyn-logo-mark { width:92px !important;height:40px !important; }
        .ajyn-footer-copy { font-size:11px !important;padding-top:12px !important;padding-bottom:8px !important; }
        .ajyn-footer-legal { font-size:10px !important; }
      }
      @media only screen and (max-width: 600px) and (prefers-color-scheme: light) {
        body, .ajyn-body-bg, .ajyn-shell { background:#ffffff !important;background-color:#ffffff !important; }
      }
      @media only screen and (max-width: 600px) and (prefers-color-scheme: dark) {
        body, .ajyn-body-bg, .ajyn-shell { background:#09070d !important;background-color:#09070d !important;background-image:linear-gradient(#09070d,#09070d) !important; }
        .ajyn-card, .ajyn-container, .ajyn-preheader-cell, .ajyn-header-row, .ajyn-logo-cell, .ajyn-ref-cell, .ajyn-hero-wrap, .ajyn-title, .ajyn-body, .ajyn-divider-cell, .ajyn-help { background:#171514 !important;background-color:#171514 !important;background-image:linear-gradient(#171514,#171514) !important; }
        .ajyn-soft-bg, .ajyn-status-card { background:#24201d !important;background-color:#24201d !important;background-image:linear-gradient(#24201d,#24201d) !important; }
        .ajyn-footer, .ajyn-footer-bg { background:#0d0b0a !important;background-color:#0d0b0a !important;background-image:linear-gradient(#0d0b0a,#0d0b0a) !important; }
        .ajyn-footer-mark-bg { background:#302923 !important;background-color:#302923 !important;background-image:linear-gradient(#302923,#302923) !important; }
        .ajyn-hero-bg, .ajyn-hero-icon { background:#302923 !important;background-color:#302923 !important;background-image:linear-gradient(#302923,#302923) !important; }
        .ajyn-ref-cell { border-top-color:#3b332e !important; }
        .ajyn-text-dark, .ajyn-gmail-text, .ajyn-gmail-text p, .ajyn-gmail-text strong, .ajyn-gmail-text span, .ajyn-gmail-text div,
        .ajyn-copy, .ajyn-copy p, .ajyn-copy strong, .ajyn-copy span, .ajyn-copy div, .ajyn-copy td,
        .ajyn-title, .ajyn-title span, .ajyn-status-title, .ajyn-status-text, .ajyn-status-copy,
        .ajyn-help-title, .ajyn-help-subtitle, .ajyn-contact, .ajyn-contact a, .ajyn-ref-cell,
        .ajyn-body td, .ajyn-body p, .ajyn-body strong, .ajyn-body span, .ajyn-body div {
          color:#ffffff !important;-webkit-text-fill-color:#ffffff !important;
        }
        .ajyn-text-muted, .ajyn-preheader-left { color:#d4ccc4 !important;-webkit-text-fill-color:#d4ccc4 !important; }
        .ajyn-text-brand, span.ajyn-text-brand { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-preheader-link, .ajyn-footer-link { color:#c18c5d !important;-webkit-text-fill-color:#c18c5d !important; }
        .ajyn-wordmark-light { display:none !important;max-height:0 !important;overflow:hidden !important; }
        .ajyn-wordmark-dark { display:block !important;max-height:none !important;overflow:visible !important; }
      }
`;

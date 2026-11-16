(function () {
    'use strict';

    /* ------------------------------------------------------------------
       js/utils.js — helpers
       ------------------------------------------------------------------ */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESC_MAP[c]);

    /* Tagged template that escapes every interpolated value unless it is
       wrapped with raw()/html``. Protects against unsafe HTML injection. */
    class Raw { constructor(v) { this.v = v; } toString() { return this.v; } }
    const raw = (v) => new Raw(v);
    const render = (v) => (v == null || v === false) ? '' : v instanceof Raw ? v.v : Array.isArray(v) ? v.map(render).join('') : esc(v);
    const html = (strings, ...values) => new Raw(strings.reduce((acc, str, idx) => acc + render(values[idx - 1]) + str));
    const setHTML = (el, content) => { if (el) el.innerHTML = String(content); };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DATA = window.PORTFOLIO_DATA || {};
    const DEFAULT_CONFIG = {
      profile: { name: 'James Felix', title: 'Software Engineer', email: 'jamefelix1262002@gmail.com', image: null, location: null, availability: 'Open to opportunities', cvUrl: null },
      social: {}, emailjs: {}, contactForm: {}
    };
    if (!window.PORTFOLIO_CONFIG) console.warn('[portfolio] js/config.js was not found — using built-in defaults.');
    const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.PORTFOLIO_CONFIG || {});
    CONFIG.profile = Object.assign({}, DEFAULT_CONFIG.profile, CONFIG.profile || {});

    function safeUrl(url) {
      if (!url) return null;
      try {
        const u = new URL(url, window.location.href);
        return ['http:', 'https:', 'mailto:', window.location.protocol].includes(u.protocol) ? u.href : null;
      } catch (e) { return null; }
    }
    const DATE_FMT = {
      full: { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' },
      month: { month: 'short', year: 'numeric', timeZone: 'UTC' },
      year: { year: 'numeric', timeZone: 'UTC' }
    };
    function formatDate(value, fallback = 'Date pending') {
      if (!value) return fallback;
      const parts = String(value).split('-').map(Number);
      if (!parts[0] || Number.isNaN(parts[0])) return String(value);
      const date = new Date(Date.UTC(parts[0], (parts[1] || 1) - 1, parts[2] || 1));
      const fmt = parts.length >= 3 ? DATE_FMT.full : parts.length === 2 ? DATE_FMT.month : DATE_FMT.year;
      return new Intl.DateTimeFormat('en-GB', fmt).format(date);
    }
    const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '?';
    const prettyUrl = (url) => String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    const currentTheme = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    const isLocalPreview = () => ['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname) || window.location.protocol === 'file:';
    let liveTimer;
    function announce(message) {
      const region = $('#live-region'); if (!region) return;
      region.textContent = ''; clearTimeout(liveTimer);
      liveTimer = setTimeout(() => { region.textContent = message; }, 60);
    }

    /* ------------------------------------------------------------------
       js/components/icons.js — Lucide icon subset (ISC licence)
       ------------------------------------------------------------------ */
    const ICONS = {
      'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
      'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
      'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
      'chevron-left': '<path d="m15 18-6-6 6-6"/>',
      'chevron-right': '<path d="m9 18 6-6-6-6"/>',
      'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      'check': '<path d="M20 6 9 17l-5-5"/>',
      'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
      'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      'send': '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
      'instagram': '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r=".7"/>',
      'message-circle': '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
      'github': '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
      'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
      'x-logo': '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
      'badge-check': '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
      'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
      'award': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
      'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
      'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
      'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      'layers': '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
      'layout': '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>',
      'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
      'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      'lightbulb': '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
      'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
      'calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
      'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      'hash': '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
      'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
      'image': '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
      'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
      'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
      'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      'building': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
      'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
      'rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
      'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
      'quote': '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/>',
      'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
      'music': '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      'camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
      'compass': '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
      'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
      'cpu': '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
      'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
      'server': '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
      'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      'terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
      'smartphone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
      'accessibility': '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
      'palette': '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
      'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
      'list-checks': '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
      'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
      'flask': '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
      'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
      'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
      'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
    };
    const FILL_ICONS = new Set(['x-logo']);
    function icon(name, cls = '') {
      const body = ICONS[name];
      if (!body) return '';
      const classes = ['icon', FILL_ICONS.has(name) ? 'icon--fill' : '', cls].filter(Boolean).join(' ');
      return `<svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
    }
    const i = (name, cls) => raw(icon(name, cls));
    function hydrateIcons(root = document) {
      $$('[data-icon]', root).forEach((el) => {
        const markup = icon(el.dataset.icon, el.className);
        if (markup) el.insertAdjacentHTML('afterend', markup);
        el.remove();
      });
    }

    /* ------------------------------------------------------------------
       js/components/theme.js — dark (default) / light with persistence
       ------------------------------------------------------------------ */
    const THEME_KEY = 'jf-theme';
    const THEME_COLORS = { dark: '#080a09', light: '#f7f9f8' };
    function applyTheme(theme, persist = true) {
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ } }
      const toggle = $('#theme-toggle');
      if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      const meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', THEME_COLORS[theme]);
      $$('img[data-src-dark]').forEach((img) => {
        const next = theme === 'dark' ? img.dataset.srcDark : img.dataset.srcLight;
        if (next && img.getAttribute('src') !== next) img.setAttribute('src', next);
      });
    }
    function initTheme() {
      applyTheme(currentTheme(), false);
      $('#theme-toggle').addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        if (document.startViewTransition && !reducedMotion) document.startViewTransition(() => applyTheme(next));
        else applyTheme(next);
      });
    }

    /* ------------------------------------------------------------------
       js/components/navigation.js — header state, active links, mobile menu
       ------------------------------------------------------------------ */
    function initNavigation() {
      const header = $('#site-header'); const progress = $('#scroll-progress'); const backTop = $('#back-to-top');
      const toggle = $('#nav-toggle'); const mobileNav = $('#mobile-nav');
      const links = $$('.nav__link, .mobile-nav__link');
      const sections = ['home', 'certifications', 'skills', 'projects', 'about', 'contact'].map((id) => document.getElementById(id)).filter(Boolean);
      let ticking = false;

      function setActive(id) {
        links.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
      function onScroll() {
        if (ticking) return; ticking = true;
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          header.classList.toggle('is-scrolled', y > 8);
          progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
          backTop.classList.toggle('is-visible', y > 600);
          const probe = y + window.innerHeight * 0.35;
          let current = sections.length ? sections[0].id : 'home';
          sections.forEach((s) => { if (s.offsetTop <= probe) current = s.id; });
          if (max > 0 && y >= max - 2 && sections.length) current = sections[sections.length - 1].id;
          setActive(current);
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();

      function setNav(open) {
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (open) {
          mobileNav.removeAttribute('inert');
          const first = $('a', mobileNav); if (first) first.focus({ preventScroll: true });
        } else {
          const hadFocus = mobileNav.contains(document.activeElement);
          mobileNav.setAttribute('inert', '');
          if (hadFocus) toggle.focus({ preventScroll: true });
        }
      }
      toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
      mobileNav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setNav(false); });
      window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
    }

    /* Graceful fallback for any image flagged with data-fallback (logos, avatars, brand icons). */
    function initImageFallbacks() {
      document.addEventListener('error', (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || !img.hasAttribute('data-fallback')) return;
        const span = document.createElement('span');
        span.className = img.dataset.fallbackClass || 'img-fallback';
        span.textContent = img.dataset.fallbackText || '';
        img.replaceWith(span);
      }, true);
    }

    /* ------------------------------------------------------------------
       Shared data accessors
       ------------------------------------------------------------------ */
    const providers = DATA.providers || [];
    const certifications = DATA.certifications || [];
    const projects = DATA.projects || [];
    const categories = DATA.projectCategories || [];
    const skillCategories = DATA.skillCategories || [];
    const allSkills = skillCategories.flatMap((c) => c.skills || []);
    const providerById = (id) => providers.find((p) => p.id === id) || { id, name: 'Unknown institution', shortName: '?' };
    const categoryById = (id) => categories.find((c) => c.id === id) || { id, name: 'Uncategorised', icon: 'layers' };
    const sortedCerts = [...certifications].sort((a, b) => String(b.issued || '').localeCompare(String(a.issued || '')));

    /* ------------------------------------------------------------------
       Placeholder graphics — rendered inline so they follow the theme
       ------------------------------------------------------------------ */
    function certPlaceholder(provider) {
      return raw(`<svg class="cert-placeholder" viewBox="0 0 400 300" role="img" aria-label="Certificate image placeholder — ${esc(provider.name)}" preserveAspectRatio="xMidYMid meet">
        <rect class="ph-bg" width="400" height="300"/>
        <rect class="ph-stroke" x="18" y="18" width="364" height="264" rx="8"/>
        <rect class="ph-stroke" x="28" y="28" width="344" height="244" rx="6" stroke-dasharray="4 5"/>
        <text class="ph-mono" x="200" y="80" text-anchor="middle" font-size="10">CERTIFICATE OF COMPLETION</text>
        <text class="ph-text" x="200" y="130" text-anchor="middle" font-size="22">${esc(provider.name)}</text>
        <rect class="ph-line" x="120" y="150" width="160" height="1.5"/>
        <rect class="ph-line" x="110" y="170" width="180" height="6" rx="3"/>
        <rect class="ph-line" x="140" y="184" width="120" height="6" rx="3"/>
        <circle class="ph-accent-soft" cx="322" cy="226" r="24"/>
        <circle class="ph-accent" cx="322" cy="226" r="13"/>
        <text class="ph-mono" x="200" y="254" text-anchor="middle" font-size="8.5">ADD IMAGE · assets/images/certificates/</text>
      </svg>`);
    }
    function projectPlaceholder(project) {
      return raw(`<svg class="project-placeholder" viewBox="0 0 480 300" role="img" aria-label="Screenshot placeholder — ${esc(project.title)}" preserveAspectRatio="xMidYMid slice">
        <rect class="ph-bg" width="480" height="300"/>
        <rect class="ph-window" x="40" y="36" width="400" height="300" rx="12"/>
        <rect class="ph-bar" x="40" y="36" width="400" height="30" rx="12"/>
        <rect class="ph-bar" x="40" y="54" width="400" height="12"/>
        <circle class="ph-line" cx="60" cy="51" r="4"/><circle class="ph-line" cx="74" cy="51" r="4"/><circle class="ph-line" cx="88" cy="51" r="4"/>
        <rect class="ph-line" x="150" y="45" width="180" height="12" rx="6"/>
        <rect class="ph-accent-soft" x="64" y="92" width="150" height="14" rx="7"/>
        <rect class="ph-line" x="64" y="116" width="230" height="8" rx="4"/>
        <rect class="ph-line" x="64" y="132" width="190" height="8" rx="4"/>
        <rect class="ph-accent" x="64" y="154" width="84" height="26" rx="8"/>
        <rect class="ph-stroke" x="316" y="92" width="100" height="88" rx="10"/>
        <rect class="ph-stroke" x="64" y="204" width="108" height="64" rx="10"/>
        <rect class="ph-stroke" x="186" y="204" width="108" height="64" rx="10"/>
        <rect class="ph-stroke" x="308" y="204" width="108" height="64" rx="10"/>
        <text class="ph-mono" x="240" y="290" text-anchor="middle" font-size="8.5">SCREENSHOT PENDING · assets/images/projects/</text>
      </svg>`);
    }
    const avatar = (person) => person.image
      ? html`<span class="avatar"><img src="${person.image}" alt="" width="48" height="48" loading="lazy" decoding="async" data-fallback data-fallback-text="${initials(person.name)}"></span>`
      : html`<span class="avatar" aria-hidden="true">${initials(person.name)}</span>`;

    function brandIconSrc(slug, color, theme) {
      const c = color && typeof color === 'object' ? color[theme] : color;
      return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}${c ? '/' + encodeURIComponent(String(c).replace('#', '')) : ''}`;
    }
    function skillLogo(skill) {
      const mono = skill.mono || initials(skill.name);
      if (skill.icon) {
        const dark = brandIconSrc(skill.icon, skill.iconColor, 'dark');
        const light = brandIconSrc(skill.icon, skill.iconColor, 'light');
        return html`<img src="${currentTheme() === 'dark' ? dark : light}" data-src-dark="${dark}" data-src-light="${light}" alt="" width="22" height="22" loading="lazy" decoding="async" data-fallback data-fallback-text="${mono}" data-fallback-class="skill__mono">`;
      }
      if (skill.lucide && ICONS[skill.lucide]) return i(skill.lucide);
      return html`<span class="skill__mono">${mono}</span>`;
    }

    /* ------------------------------------------------------------------
       js/pages/home.js — social rows, profile, stats, partners, highlights
       ------------------------------------------------------------------ */
    function socialLinks() {
      const s = CONFIG.social || {};
      return [
        { key: 'facebook', label: 'Facebook', icon: 'facebook', url: s.facebook },
        { key: 'instagram', label: 'Instagram', icon: 'instagram', url: s.instagram },
        { key: 'whatsapp', label: 'WhatsApp', icon: 'message-circle', url: s.whatsapp },
        { key: 'email', label: 'Email', icon: 'mail', url: CONFIG.profile.email ? `mailto:${CONFIG.profile.email}` : null }
      ].filter((item) => safeUrl(item.url));
    }
    function renderSocialRows() {
      const items = socialLinks();
      $$('[data-social-row]').forEach((row) => setHTML(row, items.map((item) => html`<a class="btn btn--icon" href="${safeUrl(item.url)}" ${item.key === 'email' ? '' : raw('target="_blank" rel="noopener noreferrer"')} aria-label="${item.label}" title="${item.label}">${i(item.icon)}</a>`)));
    }
    function renderProfile() {
      const p = CONFIG.profile;
      const status = $('#hero-status');
      if (status) { if (p.availability) $('#hero-status-text').textContent = p.availability; else status.remove(); }
      if (p.image) setHTML($('#hero-profile'), html`<img src="${p.image}" alt="Portrait of ${p.name}" width="400" height="500" decoding="async" fetchpriority="high">`);
      const ctaEmail = $('#cta-email'); if (ctaEmail && p.email) ctaEmail.setAttribute('href', `mailto:${p.email}`);
    }
    function renderStats() {
      const stats = [
        { value: certifications.length, label: 'Certifications' },
        { value: providers.length, label: 'Issuing institutions' },
        { value: projects.length, label: 'Projects showcased' },
        { value: allSkills.length, label: 'Skills & tools' }
      ];
      setHTML($('#stats-grid'), stats.map((s) => html`<div class="stat"><div class="stat__value" data-count="${s.value}">0</div><div class="stat__label">${s.label}</div></div>`));
    }
    function renderPartners() {
      const track = $('#marquee-track'); if (!track || !providers.length) return;
      const REPEAT = 4; // enough copies for a seamless loop on ultra-wide screens
      const items = [];
      for (let copy = 0; copy < 2; copy += 1) {
        for (let r = 0; r < REPEAT; r += 1) providers.forEach((p) => items.push({ p, dup: copy > 0 || r > 0 }));
      }
      track.style.setProperty('--marquee-items', String(REPEAT * providers.length));
      setHTML(track, items.map(({ p, dup }) => html`<a class="partner" href="${safeUrl(p.website) || '#institutions'}" target="_blank" rel="noopener noreferrer" data-dup="${String(dup)}" ${dup ? raw('aria-hidden="true" tabindex="-1"') : ''}>${p.logo
        ? html`<img class="partner__logo" src="${p.logo}" alt="" width="120" height="30" loading="lazy" decoding="async" data-fallback data-fallback-text="${p.shortName || p.name}" data-fallback-class="partner__wordmark">`
        : html`<span class="partner__icon">${i('graduation-cap')}</span>`}<span class="partner__name">${p.name}</span></a>`));
    }
    function renderCoreSkills() {
      setHTML($('#core-skills'), allSkills.filter((s) => s.core).map((s) => html`<span class="skill-pill">${skillLogo(s)}${s.name}</span>`));
    }
    function renderHighlights() {
      const featuredCerts = sortedCerts.filter((c) => c.featured).slice(0, 3);
      const certList = featuredCerts.length ? featuredCerts : sortedCerts.slice(0, 3);
      setHTML($('#featured-certs'), certList.map((c) => {
        const p = providerById(c.providerId);
        return html`<li><button class="hl-row" type="button" data-cert-preview="${c.id}"><span class="hl-row__thumb">${c.image ? html`<img src="${c.image}" alt="" loading="lazy" decoding="async">` : i('award')}</span><span class="hl-row__text"><span class="hl-row__title">${c.title}</span><span class="hl-row__meta">${p.name} · ${formatDate(c.issued)}</span></span>${i('arrow-up-right', 'icon--up-right')}</button></li>`;
      }));
      const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
      const projectList = featuredProjects.length ? featuredProjects : projects.slice(0, 3);
      setHTML($('#featured-projects'), projectList.map((p) => {
        const cat = categoryById(p.categoryId);
        return html`<li><button class="hl-row" type="button" data-project-detail="${p.id}"><span class="hl-row__thumb">${p.image ? html`<img src="${p.image}" alt="" loading="lazy" decoding="async">` : i(cat.icon || 'layers')}</span><span class="hl-row__text"><span class="hl-row__title">${p.title}</span><span class="hl-row__meta">${cat.name}${p.year ? ` · ${p.year}` : ''}</span></span>${i('arrow-up-right', 'icon--up-right')}</button></li>`;
      }));
    }

    /* ------------------------------------------------------------------
       js/pages/certifications.js — filters, gallery, preview modal content
       ------------------------------------------------------------------ */
    let certFilter = 'all';
    let visibleCerts = sortedCerts;
    const statusBadge = (c) => (c.verified && c.credentialUrl)
      ? html`<span class="badge badge--verified">${i('badge-check')}Verified</span>`
      : html`<span class="badge badge--pending">${i('clock')}Pending verification</span>`;

    function renderCertFilters() {
      const buttons = [
        { id: 'all', label: 'All Certifications', count: certifications.length },
        ...providers.map((p) => ({ id: p.id, label: p.name, count: certifications.filter((c) => c.providerId === p.id).length }))
      ];
      setHTML($('#cert-filters'), html`${buttons.map((b) => html`<button type="button" class="filter-btn" data-filter="${b.id}" aria-pressed="${String(b.id === certFilter)}">${b.label}<span class="count">${b.count}</span></button>`)}<span class="filter-result" id="cert-result" aria-hidden="true"></span>`);
    }
    function certCard(c, idx) {
      const p = providerById(c.providerId);
      const verifyUrl = safeUrl(c.credentialUrl);
      return html`<article class="card cert-card is-entering" style="--i:${idx}">
        <div class="cert-card__media">
          ${c.image ? html`<img src="${c.image}" alt="${c.title} — certificate issued by ${p.name}" loading="lazy" decoding="async">` : certPlaceholder(p)}
          <span class="chip cert-card__provider">${i('building')}${p.shortName || p.name}</span>
          <span class="cert-card__status">${statusBadge(c)}</span>
        </div>
        <div class="cert-card__body">
          <h3 class="cert-card__title">${c.title}${c.placeholder ? html` <span class="chip chip--placeholder">Placeholder</span>` : ''}</h3>
          <div class="cert-card__meta">
            <div>${i('building')}<span>${p.name}</span></div>
            <div>${i('calendar')}<span>Issued ${formatDate(c.issued)}</span></div>
            <div>${i('hash')}${c.credentialId ? html`<code title="${c.credentialId}">${c.credentialId}</code>` : html`<span>Credential ID not provided</span>`}</div>
          </div>
          <div class="cert-card__actions">
            <button class="btn btn--secondary btn--sm" type="button" data-cert-preview="${c.id}">${i('eye')}Preview</button>
            ${verifyUrl
              ? html`<a class="btn btn--primary btn--sm" href="${verifyUrl}" target="_blank" rel="noopener noreferrer">${i('shield-check')}Verify${i('arrow-up-right', 'icon--up-right')}</a>`
              : html`<button class="btn btn--primary btn--sm" type="button" disabled title="Verification link not added yet">${i('shield-check')}Verify</button>`}
          </div>
        </div>
      </article>`;
    }
    function renderCertGrid(shouldAnnounce = true) {
      visibleCerts = certFilter === 'all' ? sortedCerts : sortedCerts.filter((c) => c.providerId === certFilter);
      const grid = $('#cert-grid');
      if (!visibleCerts.length) {
        setHTML(grid, html`<div class="empty-state">${i('info')}<p>No certifications from ${providerById(certFilter).name} have been added yet.</p></div>`);
      } else {
        setHTML(grid, visibleCerts.map((c, idx) => certCard(c, idx)));
      }
      const result = $('#cert-result'); if (result) result.textContent = `${visibleCerts.length} of ${certifications.length} shown`;
      if (shouldAnnounce) {
        const label = certFilter === 'all' ? 'all institutions' : providerById(certFilter).name;
        announce(`Showing ${visibleCerts.length} certification${visibleCerts.length === 1 ? '' : 's'} from ${label}.`);
      }
    }
    function initCertifications() {
      renderCertFilters(); renderCertGrid(false);
      const bar = $('#cert-filters');
      bar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn || btn.dataset.filter === certFilter) return;
        certFilter = btn.dataset.filter;
        $$('[data-filter]', bar).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderCertGrid();
      });
    }
    function renderCertModal(c, index, total) {
      const p = providerById(c.providerId);
      const verifyUrl = safeUrl(c.credentialUrl);
      return html`
        <button class="btn btn--icon modal__close" type="button" data-action="close" aria-label="Close certificate preview">${i('x')}</button>
        <div class="modal__media">${c.image ? html`<img src="${c.image}" alt="${c.title} — certificate issued by ${p.name}" decoding="async">` : certPlaceholder(p)}</div>
        <div class="modal__body">
          <div class="chip-list"><span class="chip">${i('building')}${p.name}</span>${c.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</div>
          <h2 class="modal__title" id="modal-title">${c.title}</h2>
          <dl class="modal__meta">
            <div class="meta-item"><dt>Issuing institution</dt><dd>${p.name}</dd></div>
            <div class="meta-item"><dt>Issue date</dt><dd>${formatDate(c.issued)}</dd></div>
            <div class="meta-item"><dt>Expiration</dt><dd>${c.expires ? formatDate(c.expires) : 'Not applicable'}</dd></div>
            <div class="meta-item"><dt>Credential ID</dt><dd>${c.credentialId ? html`<code>${c.credentialId}</code><button class="copy-btn" type="button" data-copy="${c.credentialId}" aria-label="Copy credential ID">${i('copy')}</button>` : 'Not provided yet'}</dd></div>
            <div class="meta-item"><dt>Status</dt><dd>${statusBadge(c)}</dd></div>
          </dl>
          ${(c.skills || []).length ? html`<div class="modal__section"><h4>Skills &amp; competencies</h4><div class="chip-list">${c.skills.map((s) => html`<span class="chip chip--accent">${s}</span>`)}</div></div>` : ''}
          <div class="modal__section"><h4>About this certification</h4><p>${c.description}</p></div>
          <div class="modal__actions">
            ${verifyUrl
              ? html`<a class="btn btn--primary" href="${verifyUrl}" target="_blank" rel="noopener noreferrer">${i('shield-check')}Verify Credential${i('arrow-up-right', 'icon--up-right')}</a>`
              : html`<button class="btn btn--primary" type="button" disabled title="Verification link not added yet">${i('shield-check')}Verify Credential</button>`}
            ${c.image ? html`<a class="btn btn--secondary" href="${c.image}" target="_blank" rel="noopener noreferrer">${i('image')}Open full image</a>` : ''}
            ${c.document ? html`<a class="btn btn--secondary" href="${c.document}" target="_blank" rel="noopener noreferrer">${i('file-text')}View original PDF</a>` : ''}
          </div>
          <div class="modal__nav">
            <button class="btn btn--secondary" type="button" data-action="prev" ${total < 2 ? 'disabled' : ''}>${i('chevron-left')}Previous</button>
            <span>Certificate ${index + 1} of ${total}</span>
            <button class="btn btn--secondary" type="button" data-action="next" ${total < 2 ? 'disabled' : ''}>Next${i('chevron-right')}</button>
          </div>
        </div>`;
    }
    function openCert(id) {
      const list = visibleCerts.some((c) => c.id === id) ? visibleCerts : sortedCerts;
      const index = list.findIndex((c) => c.id === id);
      if (index >= 0) modal.open(list, index, renderCertModal);
    }

    /* ------------------------------------------------------------------
       js/pages/skills.js
       ------------------------------------------------------------------ */
    function skillItem(s) {
      const levels = DATA.skillLevels || {};
      const levelLabel = s.level && levels[s.level];
      return html`<li class="skill${s.placeholder ? ' skill--placeholder' : ''}">
        <span class="skill__logo">${skillLogo(s)}</span>
        <div class="skill__main">
          <div class="skill__name">${s.name}${s.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</div>
          ${s.description ? html`<p class="skill__desc">${s.description}</p>` : ''}
          ${(s.source || s.link) ? html`<div class="skill__source">${i('graduation-cap')}<span>${s.source || 'Reference'}</span>${s.link ? html`<a href="${safeUrl(s.link)}" target="_blank" rel="noopener noreferrer">View${i('arrow-up-right')}</a>` : ''}</div>` : ''}
        </div>
        ${levelLabel ? html`<span class="level level--${s.level}">${levelLabel}</span>` : ''}
      </li>`;
    }
    function initSkills() {
      const levels = DATA.skillLevels || {};
      setHTML($('#skills-legend'), html`<span class="skills-legend__label">${i('info')}Proficiency key</span>${Object.keys(levels).map((k) => html`<span class="level level--${k}">${levels[k]}</span>`)}`);
      setHTML($('#skills-grid'), skillCategories.map((cat, idx) => html`<article class="card skill-group reveal" style="--delay:${(idx % 2) * 0.08}s">
        <div class="skill-group__head"><span class="skill-group__icon">${i(cat.icon || 'code')}</span><div><h3>${cat.title}</h3>${cat.description ? html`<p>${cat.description}</p>` : ''}</div></div>
        <ul class="skill-list">${(cat.skills || []).map(skillItem)}</ul>
      </article>`));
    }

    /* ------------------------------------------------------------------
       js/pages/projects.js — filters, grid, detail modal content
       ------------------------------------------------------------------ */
    let projectFilter = 'all';
    let visibleProjects = projects;
    function renderProjectFilters() {
      const present = categories.filter((cat) => projects.some((p) => p.categoryId === cat.id));
      const buttons = [
        { id: 'all', label: 'All Projects', count: projects.length },
        ...present.map((cat) => ({ id: cat.id, label: cat.name, count: projects.filter((p) => p.categoryId === cat.id).length }))
      ];
      setHTML($('#project-filters'), html`${buttons.map((b) => html`<button type="button" class="filter-btn" data-filter="${b.id}" aria-pressed="${String(b.id === projectFilter)}">${b.label}<span class="count">${b.count}</span></button>`)}<span class="filter-result" id="project-result" aria-hidden="true"></span>`);
    }
    function projectLinks(p, size) {
      const live = safeUrl(p.liveUrl); const source = safeUrl(p.sourceUrl);
      const sm = size === 'sm' ? ' btn--sm' : '';
      return html`${live
        ? html`<a class="btn btn--primary${sm}" href="${live}" target="_blank" rel="noopener noreferrer">${i('external-link')}View Project</a>`
        : html`<button class="btn btn--primary${sm}" type="button" disabled title="Live link not added yet">${i('external-link')}View Project</button>`}${source
        ? html`<a class="btn btn--secondary${sm}" href="${source}" target="_blank" rel="noopener noreferrer">${i('github')}Source Code</a>`
        : ''}`;
    }
    function projectCard(p, idx) {
      const cat = categoryById(p.categoryId);
      return html`<article class="card project-card is-entering" style="--i:${idx}">
        <div class="project-card__media" data-project-detail="${p.id}">
          ${p.image ? html`<img src="${p.image}" alt="Screenshot of ${p.title}" loading="lazy" decoding="async">` : projectPlaceholder(p)}
          <span class="chip project-card__category">${i(cat.icon || 'layers')}${cat.name}</span>
          <div class="project-card__overlay"><span class="project-card__hint">${i('eye')}View details</span></div>
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${p.title}${p.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</h3>
          <p class="project-card__desc">${p.description}</p>
          <div class="chip-list">${(p.tech || []).map((t) => html`<span class="chip">${t}</span>`)}</div>
          <div class="project-card__actions">
            ${projectLinks(p, 'sm')}
            <button class="btn btn--ghost btn--sm" type="button" data-project-detail="${p.id}">Details${i('arrow-right', 'icon--arrow')}</button>
          </div>
        </div>
      </article>`;
    }
    function renderProjectGrid(shouldAnnounce = true) {
      visibleProjects = projectFilter === 'all' ? projects : projects.filter((p) => p.categoryId === projectFilter);
      const grid = $('#project-grid');
      if (!visibleProjects.length) {
        setHTML(grid, html`<div class="empty-state">${i('info')}<p>No projects in ${categoryById(projectFilter).name} yet.</p></div>`);
      } else {
        setHTML(grid, visibleProjects.map((p, idx) => projectCard(p, idx)));
      }
      const result = $('#project-result'); if (result) result.textContent = `${visibleProjects.length} of ${projects.length} shown`;
      if (shouldAnnounce) {
        const label = projectFilter === 'all' ? 'all categories' : categoryById(projectFilter).name;
        announce(`Showing ${visibleProjects.length} project${visibleProjects.length === 1 ? '' : 's'} in ${label}.`);
      }
    }
    function initProjects() {
      renderProjectFilters(); renderProjectGrid(false);
      const bar = $('#project-filters');
      bar.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn || btn.dataset.filter === projectFilter) return;
        projectFilter = btn.dataset.filter;
        $$('[data-filter]', bar).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        renderProjectGrid();
      });
    }
    function renderProjectModal(p, index, total) {
      const cat = categoryById(p.categoryId);
      return html`
        <button class="btn btn--icon modal__close" type="button" data-action="close" aria-label="Close project details">${i('x')}</button>
        <div class="modal__media">${p.image ? html`<img src="${p.image}" alt="Screenshot of ${p.title}" decoding="async">` : projectPlaceholder(p)}</div>
        <div class="modal__body">
          <div class="chip-list"><span class="chip chip--accent">${i(cat.icon || 'layers')}${cat.name}</span>${p.year ? html`<span class="chip">${i('calendar')}${p.year}</span>` : ''}${p.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</div>
          <h2 class="modal__title" id="modal-title">${p.title}</h2>
          <div class="modal__section"><h4>Overview</h4><p>${p.longDescription || p.description}</p></div>
          ${(p.features || []).length ? html`<div class="modal__section"><h4>Key features</h4><ul class="feature-list">${p.features.map((f) => html`<li>${i('check')}<span>${f}</span></li>`)}</ul></div>` : ''}
          <div class="modal__section"><h4>Technologies</h4><div class="chip-list">${(p.tech || []).map((t) => html`<span class="chip">${t}</span>`)}</div></div>
          <div class="modal__actions">${projectLinks(p)}</div>
          <div class="modal__nav">
            <button class="btn btn--secondary" type="button" data-action="prev" ${total < 2 ? 'disabled' : ''}>${i('chevron-left')}Previous</button>
            <span>Project ${index + 1} of ${total}</span>
            <button class="btn btn--secondary" type="button" data-action="next" ${total < 2 ? 'disabled' : ''}>Next${i('chevron-right')}</button>
          </div>
        </div>`;
    }
    function openProject(id) {
      const list = visibleProjects.some((p) => p.id === id) ? visibleProjects : projects;
      const index = list.findIndex((p) => p.id === id);
      if (index >= 0) modal.open(list, index, renderProjectModal);
    }

    /* ------------------------------------------------------------------
       js/pages/about.js
       ------------------------------------------------------------------ */
    const TL_ICONS = { education: 'graduation-cap', development: 'book-open', certification: 'award', project: 'rocket', milestone: 'flag' };
    const TL_LABELS = { education: 'Education', development: 'Professional development', certification: 'Certification', project: 'Project', milestone: 'Milestone' };
    function renderAbout() {
      const a = DATA.about || {};
      const p = CONFIG.profile;
      const facts = [
        p.location && { icon: 'map-pin', text: p.location },
        p.email && { icon: 'mail', text: p.email },
        p.availability && { icon: 'zap', text: p.availability },
        { icon: 'award', text: `${certifications.length} certification${certifications.length === 1 ? '' : 's'} · ${providers.length} institutions` }
      ].filter(Boolean);
      const cv = safeUrl(p.cvUrl);
      setHTML($('#about-aside'), html`<div class="card profile-card">
        <div class="profile-card__img">${p.image
          ? html`<img src="${p.image}" alt="Portrait of ${p.name}" width="120" height="120" loading="lazy" decoding="async">`
          : html`<div class="profile-placeholder" aria-hidden="true"><span class="profile-placeholder__mono grad">${initials(p.name)}</span></div>`}</div>
        <h3>${p.name}</h3>
        <p class="role">${p.title}</p>
        <div class="facts">${facts.map((f) => html`<div class="fact">${i(f.icon)}<span>${f.text}</span></div>`)}</div>
        <div class="profile-card__actions">
          ${cv ? html`<a class="btn btn--primary btn--sm" href="${cv}" target="_blank" rel="noopener noreferrer">${i('download')}Download CV</a>` : ''}
          <a class="btn btn--secondary btn--sm" href="#contact">${i('send')}Get in touch</a>
        </div>
      </div>`);

      setHTML($('#about-blocks'), html`
        <article class="card about-block about-block--wide reveal"><h3>${i('user')}Professional profile</h3>${(a.introduction || []).map((t) => html`<p>${t}</p>`)}</article>
        <article class="card about-block reveal"><h3>${i('cpu')}Technical interests</h3><div class="chip-list">${(a.interests || []).map((t) => html`<span class="chip chip--accent">${t}</span>`)}</div></article>
        <article class="card about-block reveal" style="--delay:.06s"><h3>${i('target')}Career objectives</h3><p>${a.objectives}</p></article>
        <article class="card about-block reveal"><h3>${i('lightbulb')}Professional philosophy</h3><p>${a.philosophy}</p></article>
        <article class="card about-block reveal" style="--delay:.06s"><h3>${i('compass')}How I solve problems</h3><p>${a.approach}</p></article>
        <article class="card about-block about-block--wide reveal"><h3>${i('book-open')}Currently learning</h3><div class="chip-list">${(a.learning || []).map((t) => html`<span class="chip">${i('sparkles')}${t}</span>`)}</div></article>`);

      setHTML($('#education-grid'), (a.education || []).map((e) => html`<article class="card edu-card reveal">
        <div class="edu-card__icon">${i('graduation-cap')}</div>
        <div>
          <h4>${e.institution}${e.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</h4>
          <p class="edu-card__programme">${e.programme}</p>
          <p class="edu-card__qual">${e.qualification}</p>
          <p class="edu-card__dates">${formatDate(e.start, 'Start date')} — ${e.end ? formatDate(e.end) : (e.start ? 'Present' : 'End date')}</p>
          ${(e.achievements || []).length ? html`<div class="chip-list">${e.achievements.map((t) => html`<span class="chip">${i('award')}${t}</span>`)}</div>` : ''}
        </div>
      </article>`));

      setHTML($('#timeline'), (a.timeline || []).map((t, idx) => html`<li class="card tl-item reveal${t.placeholder ? ' tl-item--placeholder' : ''}" style="--delay:${Math.min(idx, 5) * 0.05}s">
        <div class="tl-item__top"><span class="tl-item__date">${t.date}</span><span class="chip">${i(TL_ICONS[t.type] || 'flag')}${TL_LABELS[t.type] || 'Milestone'}</span>${t.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</div>
        <h4>${t.title}</h4><p>${t.text}</p>
      </li>`));

      setHTML($('#recognition-grid'), (DATA.recognitions || []).map((r) => html`<article class="card recog reveal">
        <div class="recog__img">${r.image ? html`<img src="${r.image}" alt="${r.title}" loading="lazy" decoding="async">` : i('award')}</div>
        <div>
          <h4>${r.title}${r.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</h4>
          <p class="recog__issuer">${r.issuer}</p>
          <p class="recog__date">${formatDate(r.date)}</p>
          <p>${r.description}</p>
          ${safeUrl(r.link) ? html`<a class="text-link" href="${safeUrl(r.link)}" target="_blank" rel="noopener noreferrer">Verify${i('arrow-up-right')}</a>` : ''}
        </div>
      </article>`));

      const track = $('#testimonials-track');
      setHTML(track, (DATA.testimonials || []).map((t) => html`<article class="card testimonial">
        <span class="testimonial__quote">${i('quote')}</span>
        <blockquote class="testimonial__text">${t.quote}</blockquote>
        <div class="testimonial__author">${avatar(t)}<div><div class="testimonial__name">${t.name}${t.placeholder ? html`<span class="chip chip--placeholder">Placeholder</span>` : ''}</div><div class="testimonial__role">${[t.role, t.organisation].filter(Boolean).join(' · ')}</div></div></div>
      </article>`));
      const scrollByCard = (dir) => {
        const card = $('.testimonial', track);
        const amount = card ? card.getBoundingClientRect().width + 20 : track.clientWidth;
        track.scrollBy({ left: dir * amount, behavior: reducedMotion ? 'auto' : 'smooth' });
      };
      $('#t-prev').addEventListener('click', () => scrollByCard(-1));
      $('#t-next').addEventListener('click', () => scrollByCard(1));

      setHTML($('#hobbies'), (a.hobbies || []).map((h) => html`<span class="hobby${h.placeholder ? ' hobby--placeholder' : ''}">${i(h.icon || 'heart')}${h.label}</span>`));
    }

    /* ------------------------------------------------------------------
       js/pages/contact.js — contact details + EmailJS form
       ------------------------------------------------------------------ */
    function renderContact() {
      const p = CONFIG.profile; const s = CONFIG.social || {};
      const items = [
        p.email && { label: 'Email', value: p.email, href: `mailto:${p.email}`, icon: 'mail', copy: p.email },
        s.facebook && { label: 'Facebook', value: 'Facebook profile', href: s.facebook, icon: 'facebook', external: true },
        s.instagram && { label: 'Instagram', value: '@jalixtech', href: s.instagram, icon: 'instagram', external: true },
        s.whatsapp && { label: 'WhatsApp', value: '+234 815 514 1240', href: s.whatsapp, icon: 'message-circle', external: true },
        p.location && { label: 'Location', value: p.location, icon: 'map-pin' }
      ].filter(Boolean);
      setHTML($('#contact-list'), items.map((item) => {
        const href = safeUrl(item.href);
        const body = html`<span class="contact-item__icon">${i(item.icon)}</span><span class="contact-item__text"><span class="contact-item__label">${item.label}</span><span class="contact-item__value">${item.value}</span></span>${href ? i('arrow-up-right', 'icon--up-right') : ''}`;
        return html`<li class="contact-item">${href
          ? html`<a class="contact-item__link" href="${href}" ${item.external ? raw('target="_blank" rel="noopener noreferrer"') : ''}>${body}</a>`
          : html`<div class="contact-item__link">${body}</div>`}${item.copy ? html`<button class="copy-btn" type="button" data-copy="${item.copy}" aria-label="Copy ${item.label.toLowerCase()}">${i('copy')}</button>` : ''}</li>`;
      }));
    }

    function initContactForm() {
      const form = $('#contact-form'); if (!form) return;
      const status = $('#form-status'); const submit = $('#form-submit'); const label = $('.btn__label', submit);
      const cfg = CONFIG.emailjs || {};
      const opts = Object.assign({ minSecondsBeforeSubmit: 3, duplicateWindowSeconds: 60 }, CONFIG.contactForm || {});
      const configured = ['publicKey', 'serviceId', 'templateId'].every((k) => typeof cfg[k] === 'string' && cfg[k].trim() && !/^YOUR_/i.test(cfg[k]));
      const recipient = CONFIG.profile.email;
      const mailtoLink = html`<a href="mailto:${recipient}">${recipient}</a>`;
      const renderedAt = Date.now();
      let sending = false; let attempted = false; let lastHash = ''; let lastSentAt = 0;

      if (!configured && isLocalPreview()) {
        const notice = $('#dev-notice'); notice.classList.add('is-visible');
        $('#dev-notice-close').addEventListener('click', () => notice.classList.remove('is-visible'));
      }

      const rules = {
        name: (v) => (v.length < 2 ? 'Please enter your full name.' : v.length > 100 ? 'Name is too long.' : ''),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.'),
        subject: (v) => (v.length < 3 ? 'Please enter a subject (at least 3 characters).' : v.length > 150 ? 'Subject is too long.' : ''),
        message: (v) => (v.length < 10 ? 'Please write a message of at least 10 characters.' : v.length > 3000 ? 'Message is too long (maximum 3000 characters).' : '')
      };
      function validateField(name) {
        const field = form.elements[name]; const error = rules[name](field.value.trim());
        field.setAttribute('aria-invalid', error ? 'true' : 'false');
        const errEl = $(`#err-${name}`); if (errEl) errEl.textContent = error;
        return !error;
      }
      Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        field.addEventListener('blur', () => { if (attempted || field.value) validateField(name); });
        field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(name); });
      });
      function showStatus(type, content) {
        status.className = `form-status form-status--${type} is-visible`;
        setHTML(status, html`${i(type === 'success' ? 'circle-check' : type === 'error' ? 'alert-circle' : 'info')}<span>${content}</span>`);
      }
      function setLoading(on) {
        sending = on; submit.classList.toggle('is-loading', on); submit.disabled = on;
        submit.setAttribute('aria-busy', String(on)); label.textContent = on ? 'Sending…' : 'Send Message';
      }

      /* EmailJS browser SDK is loaded lazily — only when the visitor interacts with the form. */
      let sdkPromise = null;
      function loadSdk() {
        if (sdkPromise) return sdkPromise;
        sdkPromise = new Promise((resolve, reject) => {
          const init = () => {
            try {
              window.emailjs.init({ publicKey: cfg.publicKey, blockHeadless: true, limitRate: { id: 'jf-portfolio-contact', throttle: 10000 } });
              resolve(window.emailjs);
            } catch (err) { reject(err); }
          };
          if (window.emailjs) { init(); return; }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
          script.async = true; script.crossOrigin = 'anonymous';
          script.onload = init;
          script.onerror = () => { sdkPromise = null; reject(new Error('the email service could not be loaded — please check your connection')); };
          document.head.appendChild(script);
        });
        return sdkPromise;
      }
      if (configured) form.addEventListener('focusin', () => { loadSdk().catch(() => {}); }, { once: true });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (sending) return;
        attempted = true;
        const invalid = Object.keys(rules).filter((name) => !validateField(name));
        if (invalid.length) { form.elements[invalid[0]].focus(); showStatus('error', 'Please check the highlighted fields and try again.'); return; }
        if (form.elements.website.value) { form.reset(); showStatus('success', 'Thank you! Your message has been sent.'); return; } // honeypot — silently drop
        if (Date.now() - renderedAt < opts.minSecondsBeforeSubmit * 1000) { showStatus('error', 'That was quick — please take a moment to review your message, then send again.'); return; }
        const payload = {
          from_name: form.elements.name.value.trim(),
          from_email: form.elements.email.value.trim(),
          subject: form.elements.subject.value.trim(),
          message: form.elements.message.value.trim()
        };
        const hash = JSON.stringify(payload);
        if (hash === lastHash && Date.now() - lastSentAt < opts.duplicateWindowSeconds * 1000) { showStatus('info', 'This message has already been sent. Please wait a moment before sending it again.'); return; }
        if (!configured) { showStatus('error', html`The contact form hasn't been connected to an email service yet. Please email me directly at ${mailtoLink}.`); return; }

        setLoading(true);
        try {
          const emailjs = await loadSdk();
          await emailjs.send(cfg.serviceId, cfg.templateId, Object.assign({}, payload, {
            reply_to: payload.from_email, to_email: recipient, sent_at: new Date().toISOString(), page_url: window.location.href
          }));
          lastHash = hash; lastSentAt = Date.now();
          form.reset();
          Object.keys(rules).forEach((name) => form.elements[name].removeAttribute('aria-invalid'));
          showStatus('success', 'Thank you! Your message has been sent — I\'ll get back to you as soon as I can.');
        } catch (err) {
          console.error('[contact form]', err);
          const detail = err && (err.text || err.message) ? ` (${err.text || err.message})` : '';
          showStatus('error', html`Sorry, your message could not be sent${detail}. Please try again later or email me directly at ${mailtoLink}.`);
        } finally {
          setLoading(false);
        }
      });
    }

    /* ------------------------------------------------------------------
       js/components/modal.js — shared <dialog> controller
       ------------------------------------------------------------------ */
    const modal = {
      el: $('#detail-modal'), panel: $('#modal-panel'), items: [], index: 0, renderer: null, closing: false, closeTimer: null,
      open(items, index, renderer) {
        this.items = items; this.index = Math.max(0, index); this.renderer = renderer;
        this.draw();
        if (!this.el.open) { this.el.showModal(); document.body.classList.add('has-modal'); }
      },
      draw() {
        setHTML(this.panel, this.renderer(this.items[this.index], this.index, this.items.length));
        this.panel.scrollTop = 0;
        const body = $('.modal__body', this.panel); if (body) body.scrollTop = 0;
      },
      step(delta) {
        if (this.items.length < 2) return;
        this.index = (this.index + delta + this.items.length) % this.items.length;
        this.draw();
        const close = $('.modal__close', this.panel); if (close) close.focus();
        announce(`Showing item ${this.index + 1} of ${this.items.length}.`);
      },
      close() {
        if (this.closing || !this.el.open) return;
        this.closing = true;
        const finish = () => {
          if (!this.closing) return;
          this.closing = false; clearTimeout(this.closeTimer);
          this.el.classList.remove('is-closing');
          if (this.el.open) this.el.close();
          document.body.classList.remove('has-modal');
          this.panel.innerHTML = '';
        };
        if (reducedMotion) { finish(); return; }
        this.el.classList.add('is-closing');
        this.el.addEventListener('animationend', finish, { once: true });
        this.closeTimer = setTimeout(finish, 320);
      }
    };
    function initModal() {
      modal.el.addEventListener('cancel', (e) => { e.preventDefault(); modal.close(); }); // Escape key
      modal.el.addEventListener('close', () => { document.body.classList.remove('has-modal'); modal.closing = false; modal.el.classList.remove('is-closing'); });
      modal.el.addEventListener('click', (e) => {
        if (e.target === modal.el) { modal.close(); return; } // backdrop click
        const btn = e.target.closest('[data-action]'); if (!btn) return;
        if (btn.dataset.action === 'close') modal.close();
        else if (btn.dataset.action === 'prev') modal.step(-1);
        else if (btn.dataset.action === 'next') modal.step(1);
      });
      modal.el.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') modal.step(-1);
        else if (e.key === 'ArrowRight') modal.step(1);
      });
    }

    /* Global delegated actions: previews, details, copy-to-clipboard */
    function initDelegatedActions() {
      document.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('[data-copy]');
        if (copyBtn) { e.preventDefault(); copyText(copyBtn.dataset.copy, copyBtn); return; }
        const certBtn = e.target.closest('[data-cert-preview]');
        if (certBtn) { openCert(certBtn.dataset.certPreview); return; }
        const projBtn = e.target.closest('[data-project-detail]');
        if (projBtn) openProject(projBtn.dataset.projectDetail);
      });
    }
    function copyText(text, btn) {
      if (!navigator.clipboard) { announce('Copying is not supported in this browser.'); return; }
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.classList.add('is-copied'); btn.innerHTML = icon('check'); announce('Copied to clipboard.');
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('is-copied'); }, 1600);
      }).catch(() => announce('Copy failed.'));
    }

    /* ------------------------------------------------------------------
       js/components/animations.js — scroll reveals & counters
       ------------------------------------------------------------------ */
    function initReveal() {
      const els = $$('.reveal:not(.is-visible)');
      if (reducedMotion || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-visible')); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      els.forEach((el) => io.observe(el));
    }
    function initCounters() {
      const els = $$('[data-count]'); if (!els.length) return;
      const run = (el) => {
        const target = Number(el.dataset.count) || 0;
        if (reducedMotion) { el.textContent = String(target); return; }
        const duration = 1200; const start = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); } });
      }, { threshold: 0.5 });
      els.forEach((el) => io.observe(el));
    }

    /* ------------------------------------------------------------------
       Bootstrap
       ------------------------------------------------------------------ */
    function init() {
      hydrateIcons();
      initTheme();
      initImageFallbacks();
      renderSocialRows();
      renderProfile();
      renderStats();
      renderPartners();
      renderCoreSkills();
      initCertifications();
      initSkills();
      initProjects();
      renderHighlights();
      renderAbout();
      renderContact();
      initModal();
      initDelegatedActions();
      initContactForm();
      initNavigation();
      initReveal();
      initCounters();
      const year = $('#year'); if (year) year.textContent = String(new Date().getFullYear());
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  })();

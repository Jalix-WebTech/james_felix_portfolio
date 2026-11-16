# Architecture

This document explains how the codebase is organised, how the pieces communicate and how to evolve it.

## 1. Guiding principles

1. **Content ≠ presentation.** All portfolio content lives in data modules (`PORTFOLIO_DATA.*`) and configuration (`PORTFOLIO_CONFIG`). HTML holds structure and static copy only; JavaScript turns data into DOM.
2. **Progressive enhancement.** Core structure and styling never depend on JS. Dynamic sections render immediately on load; JS-only features (modals, filters) degrade gracefully (`<noscript>` notices).
3. **Security by default.** Every interpolated value passes through an escaping template tag; URLs pass through `safeUrl()` (only `http:`, `https:`, `mailto:` and same-protocol relative URLs are allowed). No inline event handlers; no secrets client-side.
4. **Lightweight.** No frameworks, no bundler, one request for the page, lazy-loaded images, lazily injected EmailJS SDK.

## 2. File layout

The project uses real, separate files while retaining the requested HTML5, CSS3 and vanilla JavaScript stack.

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic page structure, metadata and ordered script/style references |
| `css/main.css` | Design tokens, themes, components, page layouts, responsive rules and animations |
| `js/config.js` | Public profile, social and EmailJS configuration |
| `js/data/*.js` | Content data for certifications, skills, projects, testimonials, recognitions and About |
| `js/main.js` | Rendering, interactions, navigation, modals, form handling and initialisation |

The data files are classic scripts loaded in dependency order and attach their data to `window.PORTFOLIO_DATA`. This avoids a build step and keeps the project easy to run on static hosting. `js/config.js` contains public values only; never put private keys or secrets in it.

### Why the scripts are not ES modules yet

The current implementation intentionally uses ordered classic scripts to support simple static hosting and direct browser execution without a bundler. The code is already separated by responsibility. If the project later adopts ES modules, serve it over HTTP and convert the shared data object to explicit exports/imports as a deliberate refactor.

## 3. Runtime flow

```
index.html loads
 ├─ <head> inline script  → applies persisted theme before first paint
 ├─ js/config.js          → window.PORTFOLIO_CONFIG
 ├─ js/data/*.js          → window.PORTFOLIO_DATA.{providers, certifications, skillCategories, projects, …}
 └─ main IIFE → init()
      ├─ hydrateIcons()           replaces <span data-icon> with inline SVG (Lucide subset)
      ├─ initTheme()              toggle, persistence, theme-aware images, View Transitions crossfade
      ├─ initImageFallbacks()     capture-phase error handler → monogram/wordmark fallback
      ├─ render*()                social rows, profile, stats, partners, core skills, highlights, about, contact
      ├─ initCertifications()     filters + grid (state: certFilter, visibleCerts)
      ├─ initSkills()
      ├─ initProjects()           filters + grid (state: projectFilter, visibleProjects)
      ├─ initModal()              <dialog> controller (open/draw/step/close)
      ├─ initDelegatedActions()   one document click listener for [data-cert-preview], [data-project-detail], [data-copy]
      ├─ initContactForm()        validation, spam checks, lazy EmailJS SDK, status messages
      ├─ initNavigation()         rAF-throttled scroll handler: header state, progress bar, active link, back-to-top; mobile drawer
      ├─ initReveal()             IntersectionObserver → .reveal.is-visible
      └─ initCounters()           IntersectionObserver → animated statistics
```

### Rendering helper

```js
html`<h3>${cert.title}</h3>`   // → Raw object; interpolations are escaped
raw('<svg …>')                 // opt-out for trusted markup (icons, placeholder SVGs)
setHTML(el, html`…`)           // assigns innerHTML
```

Arrays of `Raw`/strings are joined automatically, `null`/`false` render as empty strings, so conditionals read naturally: `${cond ? html`…` : ''}`.

### Component communication

- **Data → view:** renderers read the module-level accessors (`providers`, `sortedCerts`, `projects`, …) and write to DOM containers by id (`#cert-grid`, `#project-grid`, …).
- **View → behaviour:** interactive elements carry `data-*` attributes (`data-filter`, `data-cert-preview`, `data-project-detail`, `data-action`, `data-copy`). Handlers are delegated, so re-rendering a grid never requires re-binding.
- **Modal:** `modal.open(items, index, renderer)` is the single entry point; the renderer (`renderCertModal` or `renderProjectModal`) returns markup for one item and the controller handles prev/next (wrapping), Escape (via the dialog `cancel` event), backdrop click, focus return and the `has-modal` scroll lock. Navigation respects the **currently filtered** list.
- **Theme:** `applyTheme()` sets `data-theme` on `<html>`; CSS custom properties do the rest. Brand icons that need different colours per theme carry `data-src-dark`/`data-src-light` and are swapped in the same call.
- **Announcements:** `announce(text)` writes to a visually hidden `aria-live` region (filter results, modal navigation, clipboard feedback).

## 4. Theming

Tokens are defined on `:root` (dark, default) and overridden under `[data-theme="light"]`. Components only reference tokens (`var(--surface)`, `var(--accent-text)`…), which guarantees every card, modal, form, icon and badge adapts. Contrast targets: body text ≥ 7:1, secondary text ≥ 4.5:1, accent text uses `--accent-text` (lighter emerald on dark, deeper emerald on light) rather than the raw brand green.

## 5. Accessibility decisions

- Native `<dialog>` + `showModal()` provides focus trapping, `inert` background and Escape handling; the first focusable element is the close button.
- Mobile menu uses the `inert` attribute when closed and returns focus to the toggle.
- Filters use `aria-pressed`; active nav links use `aria-current`.
- All icons are `aria-hidden`; icon-only buttons have `aria-label`s.
- `prefers-reduced-motion` disables marquee, reveals, counters' easing, hero motion and smooth scrolling.

## 6. Performance notes

- One HTML document, no JS framework; brand icons and certificate images are `loading="lazy"`.
- Scroll work is throttled with `requestAnimationFrame`; observers replace scroll-based reveal logic.
- The EmailJS SDK (~30 KB) is injected only after the visitor focuses the form and only if the service is configured.
- `scrollbar-gutter: stable` prevents layout shift when the modal locks scrolling; media containers have fixed aspect ratios to prevent CLS.

## 7. Security notes

- Escaped rendering + URL allow-listing; external links use `rel="noopener noreferrer"`.
- Contact form: honeypot, minimum-time check, duplicate suppression, EmailJS `blockHeadless` + `limitRate`, and the public key is the only credential in the client.
- Recommended HTTP security headers (including a Content-Security-Policy that allows exactly the external hosts this site uses) are listed in `docs/DEPLOYMENT.md`. CSP is delivered via headers rather than a `<meta>` tag so that the file still works when opened locally.

## 8. Extending

- **New institution:** add to `PORTFOLIO_DATA.providers` — filter chips, counts and the carousel pick it up.
- **New project category:** add to `PORTFOLIO_DATA.projectCategories` with a Lucide icon name from the `ICONS` map.
- **New icon:** add its Lucide path data to `ICONS` (24×24 viewBox, stroke-based) or to `FILL_ICONS` for filled logos.
- **Headless CMS / API later:** replace the local data source with a `fetch()` that resolves to the same shapes, then call the initialisation function. No renderer needs to change.

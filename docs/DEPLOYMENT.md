# Deployment

The site is static — any host that serves files works. Three recommended options are below, followed by security headers and a post-deployment checklist.

## Before you deploy

1. Replace every `YOUR-DOMAIN.example` in `index.html` (`og:url`, `og:image`, `twitter:image`, structured data), `robots.txt` and `sitemap.xml` with the real URL.
2. Fill in `js/config.js` (profile, social links, EmailJS keys) and replace placeholder content (see `docs/CONTENT_GUIDE.md`).
3. Add `assets/images/profile/og-image.jpg` (1200×630px) for rich link previews.

## GitHub Pages

1. Create a repository (e.g. `james-felix-portfolio`) and push the project with `index.html` at the root.
2. **Settings → Pages → Build and deployment:** Source *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
3. The site is published at `https://<username>.github.io/<repo>/` within a minute or two.
4. Custom domain: add it under **Settings → Pages → Custom domain**, create the DNS records GitHub shows (`CNAME` for `www`, `A`/`AAAA` for the apex) and tick **Enforce HTTPS**.

GitHub Pages does not support custom response headers; the CSP below can still be added as a `<meta http-equiv="Content-Security-Policy">` tag in `<head>` once the site is served over HTTP(S) — do this only on the deployed copy, because a meta CSP blocks local `file://` previews.

## Netlify

1. Drag-and-drop the folder onto the Netlify dashboard, **or** connect the Git repository (no build command, publish directory `/`).
2. Add a `_headers` file at the project root with the headers from the next section.
3. **Domain management → Add custom domain**, then enable HTTPS (automatic Let's Encrypt certificate).

## Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git**, pick the repository, leave the build command empty and set the output directory to `/`.
2. Add the same `_headers` file (Cloudflare Pages uses the identical format as Netlify).
3. Attach a custom domain under **Custom domains**; DNS and TLS are handled automatically when the domain is on Cloudflare.

## Recommended security headers (`_headers`)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY
  Cache-Control: public, max-age=0, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Why each CSP source exists: `cdn.jsdelivr.net` (EmailJS SDK), `fonts.googleapis.com`/`fonts.gstatic.com` (web fonts), `https:` images (Simple Icons CDN and the current externally hosted institution logos — tighten to specific hosts once all logos are local), and `api.emailjs.com` (form delivery). `script-src 'unsafe-inline'` is currently needed only for the tiny theme-bootstrap script in the document head; the application and data scripts are external files. `style-src 'unsafe-inline'` is retained for a few component-level custom properties used by the markup.

## EmailJS on the live domain

- In the EmailJS dashboard add your production domain to the **allowed origins** list so the public key cannot be reused elsewhere.
- Send a real test message from the deployed site and confirm it lands in `jamefelix1262002@gmail.com`.
- Keep an eye on the monthly quota (free tier: 200 emails).

## Post-deployment checklist

- [ ] All six navigation links scroll to the correct section; active indicator follows the scroll
- [ ] Dark mode renders correctly; light mode renders correctly; choice persists after refresh
- [ ] Certification filters show the right cards and counts; empty state appears for providers without entries
- [ ] Certificate preview opens, Previous/Next and ←/→ keys work, Escape and backdrop click close it, focus returns to the trigger
- [ ] Project filters and detail modal work
- [ ] All external links open in a new tab and point to the right place
- [ ] Contact form: empty submit shows errors, invalid email is flagged, a real message is delivered, duplicate submission is blocked
- [ ] Mobile menu opens/closes, closes on link tap and Escape, is unreachable by keyboard when closed
- [ ] No broken images (check DevTools → Network for 404s) and no console errors
- [ ] No horizontal scrolling at 320px, 375px, 768px, 1024px, 1440px and 1920px widths
- [ ] Keyboard-only pass: every control reachable with visible focus
- [ ] `prefers-reduced-motion` honoured (marquee static, no reveal animation)
- [ ] Lighthouse: Performance, Accessibility, Best Practices, SEO all ≥ 90
- [ ] `robots.txt` and `sitemap.xml` reachable at the site root; rich preview looks right in a social debugger

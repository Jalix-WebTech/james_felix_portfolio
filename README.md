# James Felix — Software Engineer Portfolio

A premium, fully responsive personal portfolio built with **HTML5, CSS3 and vanilla JavaScript (ES6+)** — no frameworks, no build step. Dark mode by default, light mode on demand, a data-driven certification gallery with an accessible preview modal, a filterable project showcase, and a contact form that delivers messages directly to `jamefelix1262002@gmail.com` through EmailJS.

> **Honesty first.** Nothing in the shipped content invents qualifications, employers or achievements. Every item that still needs real information is flagged with a dashed **Placeholder** chip in the UI and `placeholder: true` in the data. Replace them and the chips disappear.

---

## Contents

1. [Project overview](#project-overview)
2. [Technology stack](#technology-stack)
3. [Folder structure](#folder-structure)
4. [Running locally](#running-locally)
5. [Updating personal information](#updating-personal-information)
6. [Adding certifications](#adding-certifications)
7. [Adding projects](#adding-projects)
8. [Adding skills](#adding-skills)
9. [Updating testimonials, recognitions and About content](#updating-testimonials-recognitions-and-about-content)
10. [Contact form (EmailJS)](#contact-form-emailjs)
11. [Deployment](#deployment)
12. [Quality checklist](#quality-checklist)

---

## Project overview

| Section | What it contains |
| --- | --- |
| **Home** | Hero (name, title, intro, CTAs, social links), data-derived statistics, institution logo carousel, "What I do", core technologies, featured certifications & selected projects, contact CTA |
| **Certifications** | Filter by institution (IBM, Microsoft, Cisco Networking Academy, Saylor Academy), cards with status/credential ID, wide preview modal with prev/next, keyboard support and verification links |
| **Skills** | Categorised skill cards with honest levels — Proficient / Working Knowledge / Currently Learning (no percentages) |
| **Projects** | Category filters, cards with tech chips, live/source links and a detail modal |
| **About** | Profile card, professional profile blocks, education, journey timeline, recognition, testimonials carousel, hobbies |
| **Contact** | Contact details with copy-to-clipboard, social links and the EmailJS form |

Both themes persist via `localStorage` (`jf-theme`). Reduced-motion preferences are respected everywhere.

## Technology stack

- **HTML5** — semantic landmarks, `<dialog>` for modals, correct heading hierarchy
- **CSS3** — custom properties (design tokens), Grid/Flexbox, `clamp()` fluid type, `prefers-reduced-motion`
- **JavaScript (ES6+)** — small focused functions, template-literal rendering with automatic escaping, IntersectionObserver, View Transitions API (progressive enhancement)
- **External services** — Google Fonts (Sora, Inter, JetBrains Mono), EmailJS browser SDK (loaded lazily on first form interaction), Simple Icons CDN for brand logos (with automatic monogram fallback)

No React, Vue, Angular, TypeScript, Tailwind, Bootstrap or jQuery.

## Folder structure

```
portfolio/
├── index.html
├── README.md
├── robots.txt
├── sitemap.xml
├── css/
│   └── main.css          ← design tokens, components and responsive layouts
├── js/
│   ├── config.js         ← PUBLIC configuration (profile, social links, EmailJS IDs)
│   ├── main.js           ← application logic
│   └── data/             ← editable portfolio content
│       ├── certifications.js
│       ├── skills.js
│       ├── projects.js
│       ├── testimonials.js
│       ├── recognitions.js
│       └── about.js
├── assets/images/        ← profile, certificates, projects, logos, etc.
└── docs/
    ├── ARCHITECTURE.md
    ├── CONTENT_GUIDE.md
    └── DEPLOYMENT.md
```

The code is separated into real HTML, CSS, configuration, data and application files. This keeps the project easier to maintain and extend. Run it through a local HTTP server (recommended) so all files load consistently.

## Running locally

**Run with a local server (recommended):**

```bash
# Python 3
python -m http.server 8080
# or Node
npx serve .
```

Then visit `http://localhost:8080`. On local previews a small developer notice appears bottom-left until EmailJS is configured; visitors on the deployed site never see it.

## Updating personal information

Edit `js/config.js`:

| Key | Purpose |
| --- | --- |
| `profile.name`, `profile.title`, `profile.email` | Identity used across the site |
| `profile.image` | Path to your photo (`assets/images/profile/…`). `null` shows a monogram placeholder |
| `profile.location` | Optional — hidden when `null` |
| `profile.availability` | Hero status pill text — `null` hides it |
| `profile.cvUrl` | Optional PDF — shows a "Download CV" button |
| `social.github`, `social.linkedin`, `social.x` | Social links (currently placeholders) |

Hero copy, the "What I do" cards and meta tags live directly in `index.html` (search for `hero__intro`, `feature-grid`, `og:`). Update the `YOUR-DOMAIN.example` URLs in the `<head>`, `robots.txt` and `sitemap.xml` once deployed.

## Adding certifications

Open `js/data/certifications.js`.

1. Put the certificate image in `assets/images/certificates/` (JPG/PNG/WebP, ≥1600px wide, original aspect ratio).
2. Add an object to `PORTFOLIO_DATA.certifications`:

```js
{
  id: 'ibm-ai-fundamentals',          // unique
  providerId: 'ibm',                  // ibm | microsoft | cisco | saylor
  title: 'Artificial Intelligence Fundamentals',
  issued: '2025-03-14',               // 'YYYY-MM-DD', 'YYYY-MM' or 'YYYY'
  expires: null,                      // or a date
  credentialId: 'ABC123',             // or null
  credentialUrl: 'https://www.credly.com/badges/…', // or null → Verify button disabled
  verified: true,                     // only after you have checked the link yourself
  image: 'assets/images/certificates/ibm-ai-fundamentals.jpg',
  skills: ['Machine learning basics', 'AI ethics'],
  description: 'What the programme covered and what you took away.',
  featured: true                      // appears in the homepage highlights
}
```

3. Delete the placeholder entries for that provider. Filters, counts, statistics and modal navigation update automatically. To add a new institution, add it to `PORTFOLIO_DATA.providers` first.

## Adding projects

Open `js/data/projects.js`. Add a screenshot to `assets/images/projects/` (16:10, e.g. 1600×1000px) and an object to `PORTFOLIO_DATA.projects`:

```js
{
  id: 'study-planner', title: 'Study Planner', categoryId: 'productivity', year: '2025',
  description: 'One or two sentences for the card.',
  longDescription: 'Fuller overview shown in the detail modal.',
  features: ['Offline-first', 'Keyboard shortcuts'],
  tech: ['JavaScript', 'IndexedDB', 'CSS Grid'],
  liveUrl: 'https://…', sourceUrl: 'https://github.com/…',   // null disables/hides the button
  image: 'assets/images/projects/study-planner.png', featured: true
}
```

Categories are defined in `PORTFOLIO_DATA.projectCategories`; only categories that contain projects appear as filters.

## Adding skills

Open `js/data/skills.js`. Each category has a `skills` array:

```js
{ name: 'Node.js', icon: 'nodedotjs', iconColor: '5FA04E', mono: 'Node', level: 'working',
  description: 'REST APIs with Express.', source: 'Saylor Academy — CS course', link: 'https://…', core: false }
```

- `icon` is a [Simple Icons](https://simpleicons.org) slug; `iconColor` can be a hex or `{ dark: 'ffffff', light: '181717' }` for theme-aware colouring. Without a network connection the `mono` monogram is shown instead.
- `lucide` can be used instead of `icon` for concept skills (e.g. `'accessibility'`).
- `level` must be `'proficient'`, `'working'`, `'learning'` or `null` (badge hidden). Assess honestly — there are intentionally no progress bars or percentages.

## Updating testimonials, recognitions and About content

- **Testimonials** — `js/data/testimonials.js`: `name`, `role`, `organisation`, `image` (`assets/images/testimonials/…`, square), `quote`. Only publish genuine quotes with permission.
- **Recognitions** — `js/data/recognitions.js`: awards only; certifications belong in the certifications module.
- **About** — `js/data/about.js`: introduction paragraphs, interests, objectives, philosophy, approach, current learning, education, timeline (`type`: `education | development | certification | project | milestone`), hobbies.

Remove `placeholder: true` from any entry you have replaced.

## Contact form (EmailJS)

The form validates input, blocks spam and sends mail **without opening the visitor's email client**. Until configured, submitting shows a clear message with a direct email link — the form never pretends to work.

### Setup

1. Create a free account at [emailjs.com](https://www.emailjs.com) and add an **Email Service** connected to `jamefelix1262002@gmail.com` (Gmail). Copy the **Service ID**.
2. Create an **Email Template** with (at minimum) these variables:

   | Template field | Value |
   | --- | --- |
   | To email | `{{to_email}}` |
   | From name | `{{from_name}}` |
   | Reply-To | `{{reply_to}}` |
   | Subject | `Portfolio contact: {{subject}}` |
   | Content | `From: {{from_name}} <{{from_email}}>`<br>`Sent: {{sent_at}} via {{page_url}}`<br><br>`{{message}}` |

   Copy the **Template ID**.
3. In **Account → General**, copy the **Public Key**. (Leave the private key alone — it must never be used in the browser.)
4. Paste the three values into `js/config.js → emailjs`.
5. Recommended hardening in the EmailJS dashboard: **Allowed origins / domain whitelist** (your production domain), the **reCAPTCHA** option if you want an extra layer, and the monthly quota alert.
6. **Test it**: send yourself a message from the deployed site and confirm it arrives in Gmail (check Spam the first time). Only then consider the feature complete.

### Built-in protection

- Required-field and email-format validation with inline, accessible error messages
- Honeypot field, minimum time-before-submit check and duplicate-message suppression
- EmailJS `blockHeadless` and client-side `limitRate` throttling
- Button locks while sending (`aria-busy`), clear success/error states, and the SDK is only loaded when the visitor focuses the form

## Deployment

See `docs/DEPLOYMENT.md` for step-by-step guides for **GitHub Pages**, **Netlify** and **Cloudflare Pages**, custom domains, recommended security headers (CSP) and the post-deploy checklist.

## Quality checklist

Before publishing, walk through the list in `docs/DEPLOYMENT.md → Post-deployment checklist` (navigation, both themes, theme persistence, filters, modals, external links, form delivery, mobile menu, images, console errors, horizontal overflow, keyboard access, reduced motion).

---

Built with care — HTML, CSS and JavaScript only.


## Certificate assets added

Sixteen supplied certificate PDFs have been added to `assets/images/certificates/`, together with PNG previews used by the certificate gallery. The original PDFs can be opened from each certificate's preview modal. Certificate metadata is maintained in `js/data/certifications.js`. Verification links are only enabled where an actual link was supplied.

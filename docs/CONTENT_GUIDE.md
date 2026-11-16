# Content Guide

Where every piece of content lives and how to replace images. Portfolio content lives in separate files under `js/data/`; configuration is in `js/config.js`.

Anything shown with a dashed **Placeholder** chip in the UI has `placeholder: true` in its data. Remove that flag (or the entry) once real information is in place.

## Quick map

| I want to change… | Edit |
| --- | --- |
| Name, title, email, location, availability pill, CV link, photo path | `js/config.js → profile` |
| GitHub / LinkedIn / X links | `js/config.js → social` |
| EmailJS keys | `js/config.js → emailjs` |
| Hero tagline, intro paragraph, focus line | `index.html` → `<section id="home">` (`.hero__tagline`, `.hero__intro`, `.hero__focus`) |
| "What I do" cards | `index.html` → `.feature-grid` |
| Page title, meta description, Open Graph, structured data | `index.html` → `<head>` |
| Institutions (names, logos, websites) | `js/data/certifications.js` → `PORTFOLIO_DATA.providers` |
| Certifications | `js/data/certifications.js` → `PORTFOLIO_DATA.certifications` |
| Skill categories, skills, levels | `js/data/skills.js` |
| Project categories and projects | `js/data/projects.js` |
| Testimonials | `js/data/testimonials.js` |
| Recognition & achievements | `js/data/recognitions.js` |
| About text, interests, objectives, education, timeline, hobbies | `js/data/about.js` |
| Footer tagline | `index.html` → `.footer-brand p` |
| Section headings and lead paragraphs | `index.html` → each `.section-head` |

## Images

Put files in the folder indicated and reference them with a relative path (e.g. `assets/images/certificates/ibm-01.jpg`). Keep file names lowercase with hyphens.

| Folder | Used for | Recommended |
| --- | --- | --- |
| `assets/images/profile/` | Hero and About photo, `og-image.jpg` for social sharing | Photo: 4:5 portrait, 800×1000px, JPG/WebP ≤ 200 KB. OG image: 1200×630px JPG |
| `assets/images/certificates/` | Certificate images (cards + modal) | Original aspect ratio preserved automatically (`object-fit: contain`). ≥ 1600px on the long edge, JPG/PNG/WebP ≤ 400 KB. Export from the PDF at 150–200 dpi |
| `assets/images/projects/` | Project screenshots | 16:10, 1600×1000px, PNG/WebP ≤ 300 KB. Capture the real product — no stock imagery |
| `assets/images/testimonials/` | Headshots | Square, 200×200px |
| `assets/images/recognition/` | Award badges / photos | Square, ≥ 300×300px |
| `assets/images/logos/` | Institution logos | SVG preferred (keeps original proportions). Download from the official brand portal and follow its usage guidelines; then set `logo: 'assets/images/logos/ibm.svg'` on the provider |

Until an image path is set (`image: null`) the site renders a themed inline placeholder, so there are never broken images. If an external image fails to load (e.g. a hot-linked logo), it falls back to a typographic wordmark automatically.

Optimise before committing: [Squoosh](https://squoosh.app) for raster images, [SVGOMG](https://jakearchibald.github.io/svgomg/) for SVG.

## Writing guidance

- **Certifications:** use the exact title printed on the certificate; set `verified: true` only after opening the verification URL yourself. Leave `credentialId` `null` rather than inventing one.
- **Projects:** the card description answers *what problem it solves and for whom* in ≤ 2 sentences; the modal `longDescription` covers context, your role, decisions and outcome.
- **Skills:** choose the level you could defend in an interview. `null` hides the badge entirely.
- **Testimonials:** real people, real words, with permission. Prefer quotes that describe *how* you work.
- **Recognition:** awards, scholarships, hackathon placements, published work — not courses (those are certifications).
- **Timeline:** newest first. Keep entries to one line of title plus one or two sentences.
- **Tone:** British English, first person, confident but concrete. Avoid superlatives you cannot evidence.

## Statistics

The four numbers under the hero are **computed** from the data (number of certifications, institutions, projects and skills). They are never typed by hand, so they stay truthful as content grows.

## Removing a whole section

Each section is self-contained: delete the `<section id="…">` in `index.html`, remove the matching link from the header, mobile menu and footer, and remove its `init*`/`render*` call from `init()` in the application script.


## Certificates currently supplied

The `assets/images/certificates/` directory now contains the original PDF files and first-page PNG previews for 16 certificates supplied by the portfolio owner.

The matching records are maintained in `js/data/certifications.js`:
- IBM SkillsBuild: 1 certificate
- Microsoft: 12 completion certificates
- Saylor Academy: 3 course certificates
- Cisco Networking Academy: no certificate was included in this upload yet

Each record uses `image` for the gallery/modal preview and `document` for the original PDF. Only the IBM record currently has a verification URL because that is the only verification URL present in the supplied PDFs. Saylor credential IDs are included as printed on the supplied certificates, but no verification URL was supplied for them. Microsoft completion certificates do not show credential IDs or verification URLs in the supplied files.

The provider is labelled **Saylor Academy**, matching the supplied certificates, rather than Saylor University.


## Personal profile assets and social links

- Profile photograph: `assets/images/profile/james-felix-profile.jpeg` (configured in `js/config.js`).
- Social profiles and WhatsApp contact link: update the `social` object in `js/config.js`.
- Only Facebook, Instagram and WhatsApp are currently configured as public social/contact handles.

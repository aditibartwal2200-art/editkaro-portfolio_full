# Editkaro.in — Website

Multi-page static site for Editkaro.in, a social video editing studio.

## Pages
- `index.html` — Home: hero, filmstrip category preview, services, process, email subscribe form, contact CTA.
- `portfolio.html` — Portfolio: all client work, filterable by category (Short-Form, Long-Form, Gaming, Football, eCommerce Ads, Documentary, Color Grade, Anime, Ads), with a video lightbox.
- `about.html` — About Us: mission, vision, values, stats, and a team section (currently placeholder names/roles/photos — swap in real ones any time, see below).
- `contact.html` — Contact Us: validated form (name, email, phone, message) that writes to Google Sheets.
- `404.html` — not-found page for hosting platforms that support custom 404s.

## File structure
```
editkaro/
  index.html
  portfolio.html
  about.html
  contact.html
  404.html
  robots.txt
  sitemap.xml
  css/style.css
  js/common.js      (nav toggle, footer year, toast — every page)
  js/home.js         (filmstrip preview — home page only)
  js/portfolio.js     (filter + lightbox — portfolio page only)
  js/forms.js         (newsletter + contact form logic — home & contact)
  google-apps-script.gs (backend script to paste into Google Apps Script)
  videos/             (put your .mp4 clips here — see "Adding real videos")
```

## Adding real videos
Open `js/portfolio.js` (and, if you want them in the homepage preview strip too, `js/home.js`) and edit the `projects` / `sampleVideo` arrays. Each entry needs:
```js
{ cat: 'shortform', title: 'Reel — Streetwear Drop', ratio: '9:16', time: '00:00:28', video: 'videos/v1.mp4' }
```
`cat` must be one of: `shortform`, `longform`, `gaming`, `football`, `ecommerce`, `documentary`, `colorgrade`, `anime`, `ads`. Drop the actual `.mp4` files into `videos/`.

## Wiring up the Email Collector + Contact Form (Google Sheets)
Both forms post to the **same** Google Apps Script Web App, which writes into two tabs of one Google Sheet (`Newsletter` and `Contact`).

1. Create a new Google Sheet.
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in the contents of `google-apps-script.gs` from this repo.
4. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize the script when prompted, and copy the **Web app URL** it gives you (looks like `https://script.google.com/macros/s/XXXX/exec`).
6. Open `js/forms.js` and paste that URL into the `SCRIPT_URL` constant near the top of the file.
7. Reload the site — both the homepage newsletter form and the Contact page form now write rows into your Sheet (`Newsletter` tab and `Contact` tab respectively) with a timestamp and the page the submission came from.

Until step 6 is done, both forms run in a safe **demo mode**: they still validate input and show a success message, but log the payload to the browser console instead of sending it anywhere, so the site is fully clickable/testable before the Sheet is wired up.

### Alternative: a small backend API instead of Apps Script
If you'd rather not use Apps Script, replace the `submitToSheet()` function in `js/forms.js` with a `fetch()` call to your own API endpoint, and have that endpoint write to Google Sheets via the [Sheets API](https://developers.google.com/sheets/api) (service account) or to any database/Excel export you prefer. The form validation and UI code doesn't need to change.

## Team placeholders
`about.html` currently ships with four placeholder team members (name, role, one-line bio, and an initials avatar built from the site's own color palette — no broken image links). Replace the `<h3>` names, `.role` text, and bio `<p>` with real people, and swap the `.avatar` gradient for an `<img>` tag once you have real photos.

## SEO & performance notes
- Every page has a unique `<title>`, meta description, canonical URL, and Open Graph tags.
- `robots.txt` and `sitemap.xml` are included — update the domain if it's not `editkaro.in`.
- Videos use `preload="metadata"` and only start playing on hover/tap, so the initial page load stays light.
- Google Fonts are loaded with `preconnect` for faster first paint.
- All interactive elements are keyboard accessible (`tabindex`, `aria-*`, visible focus states) and the site respects `prefers-reduced-motion`.
- Before shipping, run the site through [PageSpeed Insights](https://pagespeed.web.dev/) and compress any `.mp4` files (H.264, reasonable bitrate) — video weight is the biggest lever on this site.

## Deployment
This is a static site — no build step required.

### Netlify
1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: *(leave blank)*. Publish directory: `/` (repo root, or wherever `index.html` lives).
4. Deploy. Netlify auto-detects `404.html`.

### Vercel
1. Push to GitHub, then **Import Project** in Vercel.
2. Framework preset: **Other**. No build command needed.
3. Deploy.

### GitHub Pages
1. Push to a GitHub repo.
2. Repo **Settings → Pages → Source**: deploy from the `main` branch, root folder.
3. Site goes live at `https://<username>.github.io/<repo>/`. Update the canonical URLs and `sitemap.xml`/`robots.txt` if you're not on a custom domain.

## Known placeholders to replace before going live
- `SCRIPT_URL` in `js/forms.js` (Google Sheets integration).
- Team names/roles/photos in `about.html`.
- Studio phone number and address in `contact.html`.
- Social links (`instagram.com`, `youtube.com`, `linkedin.com` placeholders) across the footer and Contact page.
- Real client videos in `videos/` referenced from `js/portfolio.js` / `js/home.js`.
- `og:image` referenced in `index.html`.

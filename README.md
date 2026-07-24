# Editkaro.in — Social Video Editing Studio Website

A multi-page static website for **Editkaro.in**, a social video editing studio offering short-form, long-form, gaming, football, ecommerce, documentary, color grading, anime, and ad edits. Built with clean HTML, CSS, and vanilla JavaScript — no frameworks, no build step. The site features a filterable video portfolio, an animated filmstrip preview, and fully functional contact and newsletter forms backed by Google Sheets.

---
## 🚀 Live Demo
👉 **[View Live Site](https://6a633eeddaca1d6d4fa1aeab--editkaro-portfolio-full.netlify.app/)**
---

## 📄 Pages

| Page | Description |
|---|---|
| `index.html` | Home — hero section, filmstrip category preview, services, process steps, newsletter signup, contact CTA |
| `portfolio.html` | Portfolio — all client work, filterable by category, with a video lightbox |
| `about.html` | About Us — mission, vision, values, stats, and team section |
| `contact.html` | Contact — validated form (name, email, phone, message) that writes to Google Sheets |
| `404.html` | Custom not-found page |

---

## 📁 Project Structure

```
editkaro/
├── index.html
├── portfolio.html
├── about.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── google-apps-script.gs
├── README.md
├── .gitignore
├── css/
│   └── style.css
├── js/
│   ├── common.js       # nav toggle, footer year, toast — every page
│   ├── home.js          # filmstrip preview — home page only
│   ├── portfolio.js      # filter + lightbox — portfolio page only
│   └── forms.js          # newsletter + contact form logic
└── videos/               # NOT included in this repo — see below
```

> ⚠️ **Note:** The `videos/` folder and all `.mp4` files are intentionally excluded from this repository (see `.gitignore`) to keep the repo lightweight. Videos must be hosted externally — see [Adding Real Videos](#-adding-real-videos) below.

---

## 📬 Wiring Up the Forms (Google Sheets)

Both the newsletter signup and contact form post to a single Google Apps Script Web App, writing to two tabs (`Newsletter` and `Contact`) of one Google Sheet.

1. Create a new Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of `google-apps-script.gs`.
4. Click **Deploy → New deployment** → Type: **Web app** → Execute as: **Me** → Who has access: **Anyone**.
5. Click **Deploy**, authorize the script, and copy the **Web app URL**.
6. Paste that URL into the `SCRIPT_URL` constant near the top of `js/forms.js`.
7. Reload the site — both forms now write to your Sheet.

Until step 6 is complete, forms run in **demo mode**: inputs are validated and a success message shows, but data logs to the browser console instead of being sent anywhere.

---

## 👥 Team Placeholders

`about.html` currently ships with placeholder team members (name, role, bio, initials avatar). Replace with real names, roles, bios, and swap the `.avatar` gradient divs for `<img>` tags once real photos are available.

---

## 🔍 SEO & Performance

- Unique `<title>`, meta description, canonical URL, and Open Graph tags on every page
- `robots.txt` and `sitemap.xml` included — update the domain if not `editkaro.in`
- Videos use `preload="metadata"` and only play on hover/tap for fast initial load
- Google Fonts loaded with `preconnect` for faster first paint
- Fully keyboard accessible (`tabindex`, `aria-*`, visible focus states)
- Respects `prefers-reduced-motion`
- Run through [PageSpeed Insights](https://pagespeed.web.dev/) before shipping, and compress `.mp4` files (H.264, reasonable bitrate)

---

## ✅ Known Placeholders to Replace Before Going Live

- [ ] `SCRIPT_URL` in `js/forms.js` (Google Sheets integration)
- [ ] Team names, roles, and photos in `about.html`
- [ ] Studio phone number and address in `contact.html`
- [ ] Social links (Instagram, YouTube, LinkedIn) across footer and Contact page
- [ ] Real client videos hosted externally, referenced in `js/portfolio.js` / `js/home.js`
- [ ] `og:image` referenced in `index.html`
- [ ] Domain references in `sitemap.xml` / `robots.txt` if not `editkaro.in`

---

## 📝 License

Private project — all rights reserved by Editkaro.in.

# SACSA — Students Against Campus Sexual Assault

Website for SACSA, a recognized student organization at the University of Colorado Boulder.
Built as a static site (plain HTML/CSS/JS, no build step) and hosted with GitHub Pages.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Home — mission, what we do, signature events, calls to action |
| `about.html` | Our story, what to expect, values |
| `board.html` | Board officer bios |
| `events.html` | Take Back the Night, Stop the Spike, craft nights, tabling |
| `gallery.html` | Filterable photo gallery with lightbox |
| `resources.html` | Campus, community, and national support resources |
| `get-involved.html` | Interest form, newsletter signup, contact form |
| `thanks.html` | Contact-form confirmation page |
| `404.html` | Not-found page (self-contained) |

## How things work

- **Design**: mobile-first, no frameworks. Styles live in `assets/css/style.css`,
  scripts in `assets/js/main.js`. Fonts are Fraunces + Source Sans 3 from Google Fonts.
- **Contact form**: posts to [FormSubmit](https://formsubmit.co) and forwards to
  `sacsa@colorado.edu`. **Important:** the first submission triggers a one-time
  activation email to that inbox — click the link in it once and the form is live.
- **Newsletter / interest form buttons** link to the club's Google Forms.
  ⚠️ **Action needed:** the interest form currently requires a Google sign-in
  (anyone not logged in hits a Google login wall). In the form's settings, turn
  off "Restrict to users in University of Colorado Boulder" (and/or switch
  "Collect email addresses" away from *Verified*) so anyone can open it. The
  newsletter form is already public.
- **Quick Exit**: every page has a fixed "Quick Exit" button (and double-press of
  `Esc`) that immediately replaces the page with a neutral Google search — a common
  safety feature on survivor-support sites.
- **Photos** live in `assets/images/<event>/`, each as a full-size (`*-NN.jpg`,
  max 1600 px) and a thumbnail (`*-NN-thumb.jpg`, max 640 px) version, converted
  from the originals in `Website Template/` (kept out of the repo via `.gitignore`).

## Editing

Everything is plain HTML — edit the page you want and commit. Common tasks:

- **Update board members**: edit the `board-card` blocks in `board.html`.
- **Add gallery photos**: resize to ≤1600 px (plus a ≤640 px thumb), drop them in
  `assets/images/<event>/`, and add a `gallery-item` button in `gallery.html`.
- **Add a social media link**: add a list item in the footer "Connect" column
  (it appears on every page).
- **Change form destinations**: the Google Form URLs appear in `index.html`,
  `events.html`, `board.html`, and `get-involved.html`.

## Local preview

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Hosting note

This site is written with relative paths, so it works both as an organization site
(`https://sacsa.github.io/`) and as a project site under another account. The
`404.html` "Back to home" link assumes the site lives at the domain root.

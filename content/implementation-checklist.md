# CV-aligned implementation checklist

- [x] SEO title and subtitle aligned to requested wording (real `<title>`/`<meta>` in `index.html`, not just hero text)
- [x] Full six-paragraph professional profile from latest CV
- [x] Dedicated "25 anni di RFI" editorial section, now with the RFI video embedded (not just a card)
- [x] Competencies section
- [x] Areas of activity section
- [x] 12 quantitative key results
- [x] Dedicated Strait of Messina Bridge section, now with both bridge videos embedded
- [x] Zigzag project diary with local WebP imagery and bilingual captions
- [x] Video & Insights section restored as clickable video cards (YouTube thumbnail + click-to-play), sourced from `video-audit.md`
- [x] Dedicated August 2022 section, now with the video embedded (was a text link)
- [x] Teaching section, with the Master IIS lecture video embedded
- [x] Seven selected publications grouped 01 / 02 / 03
- [x] Awards corrected: SIG 2001; CIFI 1st 2005; CIFI 2nd 2008 and 2011
- [x] Testing & Technical Certifications
- [x] Languages
- [x] Professional experience split into CV-defined roles and dates
- [x] No Google Sites image hotlinks in application code
- [x] Project diary images use object-fit: contain and square corners
- [x] Typography switched to Sora (headings) / DM Sans (body) / JetBrains Mono (labels, kickers, nav)
- [x] Palette rebased on navy #1e2d3d so the first screen (incl. mobile) opens navy, never warm-dominant
- [x] Home page portrait slot added (hero), wired to `./images/ritratto.webp` with a labelled placeholder fallback until the file exists
- [x] Removed dead binary-upload artifacts (`.media/`, `image-data/`, orphaned `src/refinement.css`) left over from a previous failed image-import attempt

## Pending — blocked on files only the user can provide

- [ ] **35 optimised WebP images** (portrait + galleries/scavi, ponti/varo, demolizioni/sottovia, cantiere, documenti/premi) — the referenced source path (`C:\Users\GiorgioMicolitti\Downloads\immagini-sito-ottimizzate\`) is on the user's local Windows machine and is not reachable from this cloud session. `public/images/` currently still only has the 4 pre-existing 360px placeholder images. User is providing these as chat attachments.
- [ ] **Updated CV Word document** — referenced as an attachment in the task prompt but not actually received in this session; all CV-aligned copy currently in `App.tsx` matches the specific corrections listed in the prompt (7 publications, corrected awards, split 2011–2017 timeline, Testing/Certifications, Languages), so no text changes were made pending the actual file for a full line-by-line re-check.
- [ ] Magazine cover / book cover placeholders (Gallerie & Perforazioni, Fire in Tunnels, La Tecnica Professionale, "Standard di sicurezza nelle gallerie") — explicitly flagged by the user as not yet available in high resolution; not fabricated.

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
- [x] **35 real WebP images integrated** — uploaded by the user via GitHub web UI to `main` (not this branch); pulled the 35 valid files across from `origin/main`, verified every one with Pillow (real dimensions + integrity, not just file size), and excluded the one file not on the user's list that was still a corrupt text placeholder (`cover-gallerie-magazine.webp`, not a real image). `main` was not modified.
- [x] Home page portrait now renders the real `ritratto.webp` (829×763) — placeholder fallback stays in the code for resilience but is no longer triggered
- [x] Project diary rebuilt with 27 real construction-site photos (bridges/launch, demolitions, underpasses, tunnels, embankments/urban sites), replacing the 4 superseded 360px placeholders (`arco-sottovia.webp`, `ponte-zambra.webp`, `interno-galleria.webp`, `consolidamento-pendio.webp`, now removed)
- [x] New "documenti" image strip in the Publications/Awards section (diploma, award letters, ceremony photos, 2007 article) using the remaining 7 document-type images from the upload

## Pending — blocked on files only the user can provide

- [ ] **Updated CV Word document** — referenced as an attachment in the task prompt but not actually received in this session; all CV-aligned copy currently in `App.tsx` matches the specific corrections listed in the prompt (7 publications, corrected awards, split 2011–2017 timeline, Testing/Certifications, Languages), so no text changes were made pending the actual file for a full line-by-line re-check.
- [ ] Magazine cover / book cover placeholders (Gallerie & Perforazioni, Fire in Tunnels, La Tecnica Professionale, "Standard di sicurezza nelle gallerie") — explicitly flagged by the user as not yet available in high resolution; not fabricated.
- [ ] Document-to-award photo pairing (which ceremony photo belongs to which specific CIFI/SIG year) is based on filename evidence only, not confirmed against the CV — captions are deliberately generic where the exact year/event isn't certain from the file itself.

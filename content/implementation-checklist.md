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
- [x] **CV Word document (`Giorgio_Micolitti_CV - linkedin +pdf 3.docx`) received and reconciled line-by-line.** It had been uploaded to `main` (not this branch) alongside the images; pulled the file itself across into `content/` here, and extracted its full text with python-docx (not just skimmed) to check every section against `App.tsx`. Profile (6 paragraphs), 12 competencies, 12 key results, 7 publications, 4 awards, languages and the 2011–2017 timeline split were already verbatim/exact matches — no changes needed there. Real gaps found and fixed:
  - Added a full **"Formazione / Education"** section (kicker 11, between Docenza and Pubblicazioni, matching the CV's own order) — Executive Master LUISS (2006–2007), Laurea in Ingegneria Civile 110/110 e Lode (Sapienza, Premio di Laurea Ministro Lunardi), Abilitazione Ordine Ingegneri di Roma n. 31957 — previously absent from the site entirely.
  - Expanded "Collaudi e Certificazioni Tecniche" from a condensed summary to the CV's full detail (named lines: Roma–Grosseto, Roma–Formia, Aprilia, Roma Tiburtina, Roma Ostiense/NTV, Roma–Viterbo, Cava dei Tirreni).
  - Enriched three experience entries with specifics the CV names and the site had generalised: the 2014–2016 role now names the actual sidings (Overail, Piemonte, Interporto di Orte, Interporto della Marsica, Plasser e Mattia C.); the 2009–2011 role now names the FS Group real-estate companies (Grandi Stazioni, Cento Stazioni, Sistemi Urbani, Ferservizi); the 2002–2006 role now names the monitoring systems (Radiis, Domus).
  - Added the awarding body to the SIG 2001 award (Ministero delle Infrastrutture e dei Trasporti), per the CV.
  - **Not added**: the CV's header carries a personal mobile number (338 543 7775). Not published to the site — it's PII on a page that, `noindex` aside, is still publicly reachable by URL. Flagging for an explicit decision rather than adding it unilaterally.

- [x] **Personal mobile number decision**: user confirmed — do not publish it. Contact stays email + LinkedIn only (nothing to change, it was never added).
- [x] **Recovered the real "gallerie" n. 65 magazine cover.** It looked corrupt because a previous session had committed it as base64 *text* instead of decoding it to binary first (the `RIFF...` signature only appears after base64-decoding). Decoded it properly (129×167, genuine — not fabricated), saved to `public/images/cover-gallerie-magazine.webp`, and wired it as a `cover` thumbnail next to its matching publication ("Analisi ad elementi distinti...", Gallerie e Grandi Opere in Sotterraneo n. 65, 2001) via a new optional `PublicationItem.cover` field.

## Open questions for the user

- [ ] **Fire in Tunnels / La Tecnica Professionale standalone covers, and the book "Standard di sicurezza nelle gallerie"**: searched the entire git history (all branches, all commits) for any recoverable image data for these — found none, not even at low resolution (unlike the "gallerie" n. 65 cover, which existed as mis-saved base64 text and was recoverable). These need to come from the user directly; nothing to decode or recover for them. The book also isn't in the CV's publications list at all, so it has no entry yet on the site — need to know where it should appear if added.
- [ ] Document-to-award photo pairing (which ceremony photo belongs to which specific CIFI/SIG year) is based on filename evidence only, not confirmed against the CV — captions are deliberately generic where the exact year/event isn't certain from the file itself.

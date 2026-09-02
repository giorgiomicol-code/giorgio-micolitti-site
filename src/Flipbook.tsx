import { lazy, Suspense, useMemo, useState } from 'react'

const FlipbookModal = lazy(() => import('./FlipbookModal'))

type Lang = 'it' | 'en'

const modalFallback = <div className="flipbook-overlay flipbook-loading-overlay"><div className="flipbook-loading"><span className="flipbook-spinner"/></div></div>

export function PublicationLinks({ pdf, pdfEn, title, lang }: { pdf: string; pdfEn?: string; title: string; lang: Lang }) {
  const [open, setOpen] = useState(false)
  const [openEn, setOpenEn] = useState(false)
  const url = useMemo(() => `./publications/${pdf}`, [pdf])
  const urlEn = useMemo(() => (pdfEn ? `./publications/${pdfEn}` : ''), [pdfEn])
  return <div className="pub-actions">
    <button type="button" className="pub-flip-btn" onClick={() => setOpen(true)}>{lang === 'it' ? 'Sfoglia ↗' : 'Browse ↗'}</button>
    <a className="pub-open-link" href={url} target="_blank" rel="noreferrer">{lang === 'it' ? 'Apri PDF' : 'Open PDF'}</a>
    {pdfEn && <button type="button" className="pub-flip-btn pub-flip-btn-en" onClick={() => setOpenEn(true)}>{lang === 'it' ? 'Versione inglese ↗' : 'English version ↗'}</button>}
    {open && <Suspense fallback={modalFallback}>
      <FlipbookModal url={url} title={title} lang={lang} onClose={() => setOpen(false)}/>
    </Suspense>}
    {openEn && <Suspense fallback={modalFallback}>
      <FlipbookModal url={urlEn} title={`${title} (EN)`} lang="en" onClose={() => setOpenEn(false)}/>
    </Suspense>}
  </div>
}

import { lazy, Suspense, useMemo, useState } from 'react'

const FlipbookModal = lazy(() => import('./FlipbookModal'))

type Lang = 'it' | 'en'

export function PublicationLinks({ pdf, title, lang }: { pdf: string; title: string; lang: Lang }) {
  const [open, setOpen] = useState(false)
  const url = useMemo(() => `./publications/${pdf}`, [pdf])
  return <div className="pub-actions">
    <button type="button" className="pub-flip-btn" onClick={() => setOpen(true)}>{lang === 'it' ? 'Sfoglia ↗' : 'Browse ↗'}</button>
    <a className="pub-open-link" href={url} target="_blank" rel="noreferrer">{lang === 'it' ? 'Apri PDF' : 'Open PDF'}</a>
    {open && <Suspense fallback={<div className="flipbook-overlay flipbook-loading-overlay"><div className="flipbook-loading"><span className="flipbook-spinner"/></div></div>}>
      <FlipbookModal url={url} title={title} lang={lang} onClose={() => setOpen(false)}/>
    </Suspense>}
  </div>
}

import { useEffect, useRef, useState } from 'react'
import './VideoBento.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
export type BentoVideo = { id: string; title: Copy; caption: Copy }

const UI = {
  it: { close: 'Chiudi', prev: 'Video precedente', next: 'Video successivo', play: 'Riproduci', open: 'Video' },
  en: { close: 'Close', prev: 'Previous video', next: 'Next video', play: 'Play', open: 'Video' },
}

function Thumb({ id, alt }: { id: string; alt: string }) {
  const [src, setSrc] = useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
  return <img src={src} alt={alt} loading="lazy"
    onLoad={e => { if (e.currentTarget.naturalWidth <= 120) setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`) }}
    onError={() => setSrc(`https://img.youtube.com/vi/${id}/hqdefault.jpg`)}/>
}

/** Galleria video a mosaico (bento): tessere di dimensioni diverse, il video si apre in una finestra grande. */
export default function VideoBento({ items, codes, lang }: { items: BentoVideo[]; codes: Record<string, string>; lang: Lang }) {
  const ui = UI[lang]
  const n = items.length
  const [open, setOpen] = useState<number | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      else if (e.key === 'ArrowLeft') setOpen(o => (o === null ? o : (o + n - 1) % n))
      else if (e.key === 'ArrowRight') setOpen(o => (o === null ? o : (o + 1) % n))
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; lastFocus.current?.focus?.() }
  }, [open === null, n])

  const v = open === null ? null : items[open]
  return <div className="bento-wrap">
    <div className="bento">
      {items.map((it, i) => <button type="button" key={it.id} className={`bento-tile b${i + 1}`} aria-label={`${ui.play}: ${it.title[lang]}`}
        onClick={e => { lastFocus.current = e.currentTarget; setOpen(i) }}>
        <Thumb id={it.id} alt=""/>
        <span className="bento-shade"/>
        <span className="bento-code">{codes[it.id]}</span>
        <span className="bento-play"><span/></span>
        <span className="bento-title">{it.title[lang]}</span>
      </button>)}
    </div>
    {v && open !== null && <div className="bento-modal" role="dialog" aria-modal="true" aria-label={v.title[lang]} onClick={e => { if (e.target === e.currentTarget) setOpen(null) }}>
      <button type="button" ref={closeBtn} className="bento-x" aria-label={ui.close} onClick={() => setOpen(null)}>×</button>
      <button type="button" className="bento-nav bento-prev" aria-label={ui.prev} onClick={() => setOpen((open + n - 1) % n)}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>
      <button type="button" className="bento-nav bento-next" aria-label={ui.next} onClick={() => setOpen((open + 1) % n)}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>
      <figure>
        <div className="bento-frame"><iframe key={v.id} src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title[lang]} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>
        <figcaption><span className="bento-count">{ui.open} {open + 1}/{n} · {codes[v.id]}</span><b>{v.title[lang]}</b><span>{v.caption[lang]}</span></figcaption>
      </figure>
    </div>}
  </div>
}

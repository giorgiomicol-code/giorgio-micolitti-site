import { useCallback, useEffect, useRef, useState } from 'react'
import './VideoRings.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
export type RingVideo = { id: string; title: Copy; caption: Copy }

const UI = {
  it: { close: 'Chiudi', prev: 'Video precedente', next: 'Video successivo', video: 'Video', play: 'Apri il video', hint: 'Per ogni anello: frecce, trascinamento o tocco su un video laterale per ruotarlo. Tocca il video davanti per aprirlo in grande.' },
  en: { close: 'Close', prev: 'Previous video', next: 'Next video', video: 'Video', play: 'Open video', hint: 'On each ring: arrows, drag or tap a side video to rotate it. Tap the front video to open it large.' },
}

/** Tre anelli sovrapposti: gruppi di video per tema (gli id decidono dove va ogni video). */
const RINGS: { label: Copy; ids: string[] }[] = [
  { label: { it: 'Vari di ponti e cavalcavia', en: 'Bridge and overpass launches' }, ids: ['5TOuHte0nSo', '2ERIls-N5FA', 'mBXq7QyqAXU', 'v2K7CxV0buU'] },
  { label: { it: 'Realizzazioni e opere civili', en: 'New works and civil structures' }, ids: ['85ZxUrBjsJ4', 'y5gCqsuNTRI', '02Gk13v8u_Q', 'Qyi8eGPJpsE'] },
  { label: { it: 'Rimozioni e demolizioni', en: 'Removals and demolitions' }, ids: ['R-oy8_PSvvI', 'fKNXOBJ8XFk', 'PRV1iSJicgQ'] },
]

const mod = (a: number, n: number) => ((a % n) + n) % n

function Thumb({ id }: { id: string }) {
  const [src, setSrc] = useState(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
  const hq = `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  return <img src={src} alt="" loading="lazy" draggable={false}
    onLoad={e => { if (e.currentTarget.naturalWidth <= 120) setSrc(hq) }} onError={() => setSrc(hq)}/>
}

function Ring({ index, label, items, codes, lang, W, onOpen }: { index: number; label: Copy; items: RingVideo[]; codes: Record<string, string>; lang: Lang; W: number; onOpen: (i: number) => void }) {
  const n = items.length
  const ui = UI[lang]
  const [cur, setCur] = useState(0)
  const [jump, setJump] = useState<number[]>([])
  const curRef = useRef(0)
  const drag = useRef({ on: false, sx: 0, acc: 0, moved: false })
  const root = useRef<HTMLDivElement>(null)

  const offsetOf = useCallback((i: number, c: number) => { const d = mod(i - c, n); return d > n / 2 ? d - n : d }, [n])
  const goTo = useCallback((next: number) => {
    const target = mod(next, n)
    const old = curRef.current
    const flips: number[] = []
    for (let i = 0; i < n; i++) if (offsetOf(i, old) * offsetOf(i, target) < 0) flips.push(i)
    curRef.current = target
    setJump(flips)
    setCur(target)
  }, [n, offsetOf])
  const step = (d: number) => goTo(curRef.current + d)

  useEffect(() => {
    if (!jump.length) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setJump([])))
    return () => cancelAnimationFrame(id)
  }, [jump])

  const small = W < 640
  const pw = Math.round(small ? Math.min(W * 0.66, 300) : Math.min(W * 0.34, 400))
  const ph = Math.round(pw * 9 / 16)
  const theta = small ? 44 : 36
  const r = Math.round((pw * 0.56) / Math.tan((theta / 2) * Math.PI / 180))

  const onDown = (e: React.PointerEvent) => { drag.current = { on: true, sx: e.clientX, acc: 0, moved: false } }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on) return
    const dx = e.clientX - d.sx
    if (Math.abs(dx) > 8) d.moved = true
    const unit = pw * 0.55
    while (dx - d.acc > unit) { step(-1); d.acc += unit }
    while (dx - d.acc < -unit) { step(1); d.acc -= unit }
  }
  const onUp = () => { const d = drag.current; d.on = false; setTimeout(() => { d.moved = false }, 0) }

  const v = items[cur]
  return <section className="vr-ring" ref={root} aria-label={label[lang]}>
    <header className="vr-head"><span className="vr-num">{String(index + 1).padStart(2, '0')}</span><h3>{label[lang]}</h3><span className="vr-count">{n} {ui.video.toLowerCase()}</span></header>
    <div className="vr-stage" style={{ height: ph + 56 }} aria-roledescription="carousel"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
      <div className="vr-world" style={{ width: pw, height: ph, marginLeft: -pw / 2, transform: `translateZ(${-r}px)` }}>
        {items.map((it, i) => {
          const o = offsetOf(i, cur)
          const hidden = Math.abs(o) > 1
          const style: React.CSSProperties = { width: pw, height: ph, transform: `rotateY(${o * theta}deg) translateZ(${r}px)`, zIndex: 10 - Math.abs(o) }
          if (jump.includes(i)) { style.transition = 'none'; style.opacity = 0 }
          return <button type="button" key={it.id} style={style} className={'vr-panel' + (o === 0 ? ' active' : '') + (hidden ? ' hidden' : '')}
            tabIndex={o === 0 ? 0 : -1} aria-label={`${ui.play}: ${it.title[lang]}`} aria-current={o === 0 ? 'true' : undefined}
            onClick={() => { if (drag.current.moved) return; if (o === 0) onOpen(i); else goTo(i) }}>
            <Thumb id={it.id}/>
            <span className="vr-shade"/>
            <span className="vr-code">{codes[it.id]}</span>
            <span className="vr-play"><span/></span>
          </button>
        })}
      </div>
    </div>
    <div className="vr-cap" aria-live="polite">
      <div className="vr-nav">
        <button type="button" className="vr-circ" aria-label={ui.prev} onClick={() => step(-1)}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>
        <span>{cur + 1}/{n}</span>
        <button type="button" className="vr-circ" aria-label={ui.next} onClick={() => step(1)}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>
      </div>
      <h4>{v.title[lang]}</h4>
      <p>{v.caption[lang]}</p>
    </div>
  </section>
}

export default function VideoRings({ items, codes, lang }: { items: RingVideo[]; codes: Record<string, string>; lang: Lang }) {
  const ui = UI[lang]
  const rings = RINGS.map(r => r.ids.map(id => items.find(v => v.id === id)).filter((v): v is RingVideo => !!v))
  // eventuali video nuovi non assegnati a nessun anello vanno in coda all'ultimo
  const placed = new Set(RINGS.flatMap(r => r.ids))
  const extra = items.filter(v => !placed.has(v.id))
  if (extra.length) rings[rings.length - 1] = [...rings[rings.length - 1], ...extra]

  const [W, setW] = useState(1000)
  const wrap = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<{ ring: number; i: number } | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const upd = () => setW(el.clientWidth || 1000)
    upd()
    const ro = new ResizeObserver(upd)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isOpen = open !== null
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      else if (e.key === 'ArrowLeft') setOpen(o => o && { ring: o.ring, i: mod(o.i - 1, rings[o.ring].length) })
      else if (e.key === 'ArrowRight') setOpen(o => o && { ring: o.ring, i: mod(o.i + 1, rings[o.ring].length) })
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const lf = lastFocus.current
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; lf?.focus?.() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const cur = open ? rings[open.ring][open.i] : null
  const nOpen = open ? rings[open.ring].length : 0
  return <div className="vr" ref={wrap}>
    {RINGS.map((r, k) => rings[k].length > 0 && <Ring key={k} index={k} label={r.label} items={rings[k]} codes={codes} lang={lang} W={W}
      onOpen={i => { lastFocus.current = document.activeElement as HTMLElement; setOpen({ ring: k, i }) }}/>)}
    <p className="vr-hint">{ui.hint}</p>
    {open && cur && <div className="vr-modal" role="dialog" aria-modal="true" aria-label={cur.title[lang]} onClick={e => { if (e.target === e.currentTarget) setOpen(null) }}>
      <button type="button" ref={closeBtn} className="vr-x" aria-label={ui.close} onClick={() => setOpen(null)}>×</button>
      {nOpen > 1 && <button type="button" className="vr-mnav vr-mprev" aria-label={ui.prev} onClick={() => setOpen({ ring: open.ring, i: mod(open.i - 1, nOpen) })}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>}
      {nOpen > 1 && <button type="button" className="vr-mnav vr-mnext" aria-label={ui.next} onClick={() => setOpen({ ring: open.ring, i: mod(open.i + 1, nOpen) })}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>}
      <figure>
        <div className="vr-frame"><iframe key={cur.id} src={`https://www.youtube-nocookie.com/embed/${cur.id}?autoplay=1&rel=0`} title={cur.title[lang]} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/></div>
        <figcaption><span className="vr-mcount">{RINGS[open.ring].label[lang]} · {open.i + 1}/{nOpen} · {codes[cur.id]}</span><b>{cur.title[lang]}</b><span>{cur.caption[lang]}</span></figcaption>
      </figure>
    </div>}
  </div>
}

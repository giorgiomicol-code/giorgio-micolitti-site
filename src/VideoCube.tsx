import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './VideoCube.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
export type CubeVideo = { id: string; title: Copy; caption: Copy }

const UI = {
  it: { prev: 'Video precedente', next: 'Video successivo', video: 'Video', hint: 'Fai ruotare l’anello con le frecce, trascinando o con i numeri. Tocca un video laterale per portarlo davanti, poi toccalo per riprodurlo.' },
  en: { prev: 'Previous video', next: 'Next video', video: 'Video', hint: 'Turn the ring with the arrows, by dragging or with the numbers. Tap a side video to bring it to the front, then tap it to play.' },
}

const mod = (a: number, n: number) => ((a % n) + n) % n

/**
 * Anello 3D: tutti i video sono pannelli arrotondati disposti su un cilindro che ruota.
 * Davanti il video corrente (riproducibile), ai lati quelli vicini in prospettiva.
 */
export default function VideoCube({ items, codes, lang, renderPlayer }: { items: CubeVideo[]; codes: Record<string, string>; lang: Lang; renderPlayer: (v: CubeVideo, code?: string) => ReactNode }) {
  const n = items.length
  const ui = UI[lang]
  const [pos, setPos] = useState(0)
  const [off, setOff] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [W, setW] = useState(1000)
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, sx: 0, moved: false })

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const upd = () => setW(el.clientWidth || 1000)
    upd()
    const ro = new ResizeObserver(upd)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const cur = mod(pos, n)
  const step = 360 / n
  const small = W < 640
  const pw = Math.round(small ? Math.min(W * 0.74, 340) : Math.min(W * 0.44, 480))
  const ph = Math.round(pw * 9 / 16)
  // raggio: i pannelli vicini restano separati da un piccolo spazio
  const r = Math.round((pw / (2 * Math.tan(Math.PI / n))) * 1.12)

  const go = (d: number) => { if (n > 1) setPos(p => p + d) }
  const goTo = (i: number) => {
    let d = mod(i - cur, n)
    if (d > n / 2) d -= n
    if (d) setPos(p => p + d)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = stage.current?.parentElement
      if (!el || !el.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const unit = pw * 0.7
  const onDown = (e: React.PointerEvent) => { drag.current = { on: true, sx: e.clientX, moved: false } }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on) return
    const dx = e.clientX - d.sx
    if (!d.moved && Math.abs(dx) < 8) return
    d.moved = true
    setDragging(true)
    setOff(-dx / unit)
  }
  const onUp = () => {
    const d = drag.current
    if (!d.on) return
    d.on = false
    if (d.moved) { setPos(p => p + Math.round(off)); setOff(0); setDragging(false); setTimeout(() => { d.moved = false }, 0) }
  }

  const angle = -(pos + off) * step

  return <div className="vcube" lang={lang}>
    <div ref={stage} className="vcube-stage" style={{ height: ph + 90 }} aria-roledescription="carousel"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      onClickCapture={e => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }}>
      <div className={'vcube-ring' + (dragging ? ' dragging' : '')}
        style={{ width: pw, height: ph, marginLeft: -pw / 2, transform: `translateZ(${-r}px) rotateY(${angle}deg)` }}>
        {items.map((v, i) => {
          const active = i === cur
          return <article key={v.id} className={'vcube-panel' + (active ? ' active' : '')}
            style={{ width: pw, height: ph, transform: `rotateY(${i * step}deg) translateZ(${r}px)` }}
            aria-hidden={!active}
            onClickCapture={e => { if (!active) { e.preventDefault(); e.stopPropagation(); goTo(i) } }}>
            <div className="vcube-media" key={`${v.id}-${active ? 'f' : 's'}`}>{renderPlayer(v, codes[v.id])}</div>
            <span className="vcube-shade"/>
          </article>
        })}
      </div>
    </div>
    <div className="vcube-cap" aria-live="polite">
      <h3>{items[cur].title[lang]}</h3>
      <p>{items[cur].caption[lang]}</p>
    </div>
    <div className="vcube-controls">
      <button type="button" className="vcube-circ" aria-label={ui.prev} onClick={() => go(-1)}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>
      <span className="vcube-counter">{ui.video} {cur + 1}/{n}</span>
      <button type="button" className="vcube-circ" aria-label={ui.next} onClick={() => go(1)}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>
    </div>
    <div className="vcube-dots" role="group">
      {items.map((v, i) => <button type="button" key={v.id} className={i === cur ? 'on' : ''} aria-label={`${ui.video} ${i + 1}: ${v.title[lang]}`} aria-current={i === cur ? 'true' : undefined} onClick={() => goTo(i)}>{i + 1}</button>)}
    </div>
    <p className="vcube-hint">{ui.hint}</p>
  </div>
}

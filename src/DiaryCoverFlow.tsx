import { useCallback, useEffect, useRef, useState } from 'react'
import './DiaryCoverFlow.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
export type CoverFlowSlide = { image: string; title: Copy; text: Copy }

const UI = {
  it: { photo: 'Foto', prev: 'Foto precedente', next: 'Foto successiva', close: 'Chiudi', cover: 'Torna alla copertina', coverTag: 'copertina', track: 'Scorri le foto', hint: 'Trascina, usa le frecce o il binario. Dall’ultima foto si torna alla prima. Tocca la foto al centro per ingrandirla. Il segno bronzo indica la copertina.' },
  en: { photo: 'Photo', prev: 'Previous photo', next: 'Next photo', close: 'Close', cover: 'Back to cover', coverTag: 'cover', track: 'Browse photos', hint: 'Drag, use the arrows or the track. After the last photo it loops back to the first. Tap the centre photo to enlarge it. The bronze mark is the cover.' },
}

export default function DiaryCoverFlow({ slides, tag, sub, lang }: { slides: CoverFlowSlide[]; tag: string; sub: Copy; lang: Lang }) {
  const n = slides.length
  const ui = UI[lang]
  const [cur, setCur] = useState(0)
  const [jump, setJump] = useState<number[]>([])
  const [dims, setDims] = useState<Record<string, number>>({})
  const [W, setW] = useState(1000)
  const [lb, setLb] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, sx: 0, acc: 0, moved: false })
  const curRef = useRef(0)

  // proporzioni reali delle foto (fino al caricamento: 4/3)
  useEffect(() => {
    let alive = true
    slides.forEach(s => {
      const im = new Image()
      im.onload = () => { if (alive && im.naturalHeight) setDims(d => d[s.image] ? d : { ...d, [s.image]: im.naturalWidth / im.naturalHeight }) }
      im.src = `./images/${s.image}`
    })
    return () => { alive = false }
  }, [slides])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const upd = () => setW(el.clientWidth || 1000)
    upd()
    const ro = new ResizeObserver(upd)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!jump.length) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setJump([])))
    return () => cancelAnimationFrame(id)
  }, [jump])

  const offsetOf = useCallback((i: number, c: number) => { const d = ((i - c) % n + n) % n; return d > n / 2 ? d - n : d }, [n])
  const goTo = useCallback((next: number) => {
    if (n < 1) return
    const target = ((next % n) + n) % n
    const old = curRef.current
    const flips: number[] = []
    for (let i = 0; i < n; i++) if (offsetOf(i, old) * offsetOf(i, target) < 0) flips.push(i)
    curRef.current = target
    setJump(flips)
    setCur(target)
  }, [n, offsetOf])
  const step = useCallback((d: number) => { if (n > 1) goTo(curRef.current + d) }, [n, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lb) { if (e.key === 'Escape') setLb(false); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1); return }
      const el = stageRef.current?.parentElement
      if (!el || !el.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lb, step])

  useEffect(() => {
    if (!lb) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [lb])

  // geometria
  const small = W < 640
  const stageH = Math.max(400, Math.min(580, W * 0.6))
  const SH = small ? 54 : 66
  const ratio = (s: CoverFlowSlide) => dims[s.image] ?? 4 / 3
  const maxR = Math.max(...slides.map(ratio), 0.5)
  const photoH = Math.round(Math.min(stageH * (small ? 0.5 : 0.58), (W * (small ? 0.8 : 0.56)) / maxR))
  const widths = slides.map(s => Math.round(photoH * ratio(s)))
  const cw = widths[cur] ?? 0
  const gstep = small ? 24 : Math.max(34, W * 0.05)
  const gap = small ? 14 : 30
  const angle = small ? 60 : 54
  const V = Math.min(small ? 2 : 3, Math.floor(n / 2))

  const onDown = (e: React.PointerEvent) => { drag.current = { on: true, sx: e.clientX, acc: 0, moved: false } }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on) return
    const dx = e.clientX - d.sx
    if (Math.abs(dx) > 6) d.moved = true
    const unit = Math.max(60, W * 0.08)
    while (dx - d.acc > unit) { step(-1); d.acc += unit }
    while (dx - d.acc < -unit) { step(1); d.acc -= unit }
  }
  const onUp = () => { const d = drag.current; d.on = false; setTimeout(() => { d.moved = false }, 0) }

  const a = slides[cur]
  if (!a) return null
  const title = a.title[lang]
  const text = a.text[lang]

  return <div className="cf" lang={lang}>
    <div ref={stageRef} className="cf-stage" aria-roledescription="carousel" aria-label={tag}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
      <div className="cf-cards">
        {slides.map((s, i) => {
          const o = offsetOf(i, cur), ab = Math.abs(o), sg = Math.sign(o)
          const w = widths[i]
          const style: React.CSSProperties = {
            width: w, height: photoH + SH, marginLeft: -w / 2, marginTop: -(photoH + SH) / 2,
            zIndex: o === 0 ? 100 : 100 - ab,
            transform: o === 0 ? 'translate3d(0,0,60px)'
              : `translate3d(${sg * (cw / 2 + gap + w * Math.cos(angle * Math.PI / 180) * 0.5 + (ab - 1) * gstep)}px,0,${-140 - ab * 30}px) rotateY(${-sg * angle}deg)`,
          }
          if (jump.includes(i)) { style.transition = 'none'; style.opacity = 0 }
          return <button type="button" key={s.image} style={style}
            className={'cf-card' + (o !== 0 ? ' side' : '') + (ab > V ? ' far' : '')}
            tabIndex={o === 0 ? 0 : -1} aria-label={s.title[lang]} aria-current={o === 0 ? 'true' : undefined}
            onClick={() => { if (drag.current.moved) return; if (i === cur) setLb(true); else goTo(i) }}>
            <span className="cf-ph" style={{ height: photoH }}><img src={`./images/${s.image}`} alt={s.title[lang]} loading={ab <= 1 ? 'eager' : 'lazy'} draggable={false}/></span>
            <span className="cf-strip"><span>{sub[lang]}</span></span>
          </button>
        })}
      </div>
    </div>

    <div className="cf-controls">
      <button type="button" className="cf-circ" aria-label={ui.prev} disabled={n < 2} onClick={() => step(-1)}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>
      <span className="cf-counter" aria-live="polite">{ui.photo} {cur + 1}/{n}</span>
      <button type="button" className="cf-circ" aria-label={ui.next} disabled={n < 2} onClick={() => step(1)}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>
    </div>
    <div className="cf-tools"><button type="button" disabled={cur === 0} onClick={() => goTo(0)}>{ui.cover}</button></div>

    <div className="cf-cap" aria-live="polite">
      <span className="cf-tag">{tag}{cur === 0 ? ` · ${ui.coverTag}` : ''}</span>
      <h4>{title}</h4>
      {text && text !== title && <p>{text}</p>}
    </div>

    {n > 1 && <div className="cf-rail">
      <div className="cf-railbox">
        <div className="cf-line"/>
        {slides.map((s, i) => <div key={s.image} className={'cf-sleeper' + (i === 0 ? ' st' : '')} style={{ left: `${(i / (n - 1)) * 100}%` }}/>)}
        <input type="range" min={0} max={n - 1} step={1} value={cur} aria-label={ui.track} onChange={e => goTo(+e.target.value)}/>
      </div>
    </div>}
    <p className="cf-hint">{ui.hint}</p>

    {lb && <div className="cf-lb" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) setLb(false) }}>
      <button type="button" className="cf-x" aria-label={ui.close} onClick={() => setLb(false)}>×</button>
      <figure><img src={`./images/${a.image}`} alt={title}/><figcaption><b>{title}</b>{text && text !== title && <span>{text}</span>}</figcaption></figure>
    </div>}
  </div>
}

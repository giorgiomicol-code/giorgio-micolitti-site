import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './VideoCube.css'

type Lang = 'it' | 'en'
type Copy = { it: string; en: string }
export type CubeVideo = { id: string; title: Copy; caption: Copy }

const UI = {
  it: { prev: 'Video precedente', next: 'Video successivo', video: 'Video', hint: 'Fai ruotare il cubo con le frecce, trascinando o con i numeri. Tocca il video per riprodurlo.' },
  en: { prev: 'Previous video', next: 'Next video', video: 'Video', hint: 'Turn the cube with the arrows, by dragging or with the numbers. Tap the video to play it.' },
}

const mod = (a: number, n: number) => ((a % n) + n) % n

/**
 * Cubo 3D a 4 facce: davanti il video corrente, a destra il successivo, a sinistra il precedente.
 * La faccia dietro viene riempita *prima* della rotazione, così non si vede mai un cambio di contenuto.
 */
export default function VideoCube({ items, codes, lang, renderPlayer }: { items: CubeVideo[]; codes: Record<string, string>; lang: Lang; renderPlayer: (v: CubeVideo, code?: string) => ReactNode }) {
  const n = items.length
  const ui = UI[lang]
  const [rot, setRot] = useState(0)
  const [cur, setCur] = useState(0)
  // contenuto di ciascuna delle 4 facce: davanti 0, destra 1, dietro 2, sinistra n-1
  const [faces, setFaces] = useState<number[]>([0, 1, 2 % n, n - 1])
  const [W, setW] = useState(600)
  const stage = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const drag = useRef({ on: false, sx: 0, done: false })

  useEffect(() => {
    const el = stage.current
    if (!el) return
    const upd = () => setW(el.clientWidth || 600)
    upd()
    const ro = new ResizeObserver(upd)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const go = (d: 1 | -1) => {
    if (n < 2 || busy.current) return
    busy.current = true
    const back = mod(rot + 2, 4)
    setFaces(f => { const c = f.slice(); c[back] = mod(cur + 2 * d, n); return c })
    setRot(r => r + d)
    setCur(c => mod(c + d, n))
    window.setTimeout(() => { busy.current = false }, 900)
  }
  const goTo = (target: number) => {
    // salto breve: un passo avanti/indietro nella direzione più corta, poi si sistema
    if (target === cur || busy.current) return
    const fwd = mod(target - cur, n)
    if (fwd === 1) return go(1)
    if (fwd === n - 1) return go(-1)
    // salto lungo: prepara la faccia destra/sinistra con il video richiesto e ruota
    const d: 1 | -1 = fwd <= n / 2 ? 1 : -1
    busy.current = true
    const incoming = mod(rot + d, 4)
    const back = mod(rot + 2, 4)
    setFaces(f => { const c = f.slice(); c[incoming] = target; c[back] = mod(target + d, n); return c })
    setRot(r => r + d)
    setCur(target)
    window.setTimeout(() => { busy.current = false }, 900)
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

  const fw = Math.min(W, 640)
  const vh = Math.round(fw * 9 / 16)
  const capH = W < 640 ? 118 : 104
  const fh = vh + capH
  const front = mod(rot, 4)

  const onDown = (e: React.PointerEvent) => { drag.current = { on: true, sx: e.clientX, done: false } }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on || d.done) return
    const dx = e.clientX - d.sx
    if (Math.abs(dx) > 48) { d.done = true; go(dx < 0 ? 1 : -1) }
  }
  const onUp = () => { drag.current.on = false }

  return <div className="vcube" lang={lang}>
    <div ref={stage} className="vcube-stage" style={{ height: fh + 36 }} aria-roledescription="carousel"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="vcube-box" style={{ width: fw, height: fh, marginLeft: -fw / 2, transform: `translateZ(${-fw / 2}px) rotateY(${-rot * 90}deg)` }}>
        {faces.map((vi, k) => {
          const v = items[vi]
          const isFront = k === front
          return <article key={k} className={'vcube-face' + (isFront ? ' front' : '')} aria-hidden={!isFront}
            style={{ width: fw, height: fh, transform: `rotateY(${k * 90}deg) translateZ(${fw / 2}px)` }}>
            <div className="vcube-media" style={{ height: vh }} key={`${vi}-${isFront ? 'f' : 's'}`}>{renderPlayer(v, codes[v.id])}</div>
            <div className="vcube-cap" style={{ height: capH }}>
              <h3>{v.title[lang]}</h3>
              <p>{v.caption[lang]}</p>
            </div>
          </article>
        })}
      </div>
    </div>
    <div className="vcube-controls">
      <button type="button" className="vcube-circ" aria-label={ui.prev} onClick={() => go(-1)}><svg viewBox="0 0 16 16"><path d="M10 2 4 8l6 6"/></svg></button>
      <span className="vcube-counter" aria-live="polite">{ui.video} {cur + 1}/{n}</span>
      <button type="button" className="vcube-circ" aria-label={ui.next} onClick={() => go(1)}><svg viewBox="0 0 16 16"><path d="m6 2 6 6-6 6"/></svg></button>
    </div>
    <div className="vcube-dots" role="group">
      {items.map((v, i) => <button type="button" key={v.id} className={i === cur ? 'on' : ''} aria-label={`${ui.video} ${i + 1}: ${v.title[lang]}`} aria-current={i === cur ? 'true' : undefined} onClick={() => goTo(i)}>{i + 1}</button>)}
    </div>
    <p className="vcube-hint">{ui.hint}</p>
  </div>
}

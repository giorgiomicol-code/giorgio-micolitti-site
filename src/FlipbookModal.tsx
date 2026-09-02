import { useEffect, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

type Lang = 'it' | 'en'
type PageFlipController = { flipNext: () => void; flipPrev: () => void; flip: (page: number) => void }
type FlipBookRef = { pageFlip: () => PageFlipController }

const pageCache = new Map<string, { pages: string[]; ratio: number }>()

async function renderPdfPages(url: string, onProgress: (done: number, total: number) => void) {
  const cached = pageCache.get(url)
  if (cached) return cached
  const pdf = await pdfjsLib.getDocument({ url }).promise
  const total = pdf.numPages
  const first = await pdf.getPage(1)
  const nativeViewport = first.getViewport({ scale: 1 })
  const ratio = nativeViewport.width / nativeViewport.height
  const targetWidth = 1000
  const scale = targetWidth / nativeViewport.width
  const pages: string[] = []
  for (let i = 1; i <= total; i++) {
    const page = i === 1 ? first : await pdf.getPage(i)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
    await new Promise<void>(resolve => { const img = new Image(); img.onload = () => resolve(); img.onerror = () => resolve(); img.src = dataUrl })
    pages.push(dataUrl)
    onProgress(i, total)
  }
  const result = { pages, ratio }
  pageCache.set(url, result)
  return result
}

export default function FlipbookModal({ url, title, lang, onClose }: { url: string; title: string; lang: Lang; onClose: () => void }) {
  const [pages, setPages] = useState<string[]>([])
  const [ratio, setRatio] = useState(0.72)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [pageNum, setPageNum] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [showThumbs, setShowThumbs] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [viewportW, setViewportW] = useState(window.innerWidth)
  const bookRef = useRef<FlipBookRef>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    renderPdfPages(url, (done, total) => { if (!cancelled) setProgress({ done, total }) })
      .then(r => { if (!cancelled) { setPages(r.pages); setRatio(r.ratio) } })
    return () => { cancelled = true }
  }, [url])

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (pages.length === 0) return
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 60)
    return () => clearTimeout(t)
  }, [pages.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') bookRef.current?.pageFlip()?.flipNext()
      if (e.key === 'ArrowLeft') bookRef.current?.pageFlip()?.flipPrev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().then(() => setFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen?.().then(() => setFullscreen(false)).catch(() => {})
    }
  }

  const isMobile = viewportW < 760
  const bookHeight = Math.min(isMobile ? viewportW * 1.5 : window.innerHeight * 0.74, 900)
  const bookWidth = bookHeight * ratio

  const loading = pages.length === 0
  const total = progress.total || 0

  return <div className="flipbook-overlay" ref={rootRef} role="dialog" aria-modal="true">
    <div className="flipbook-toolbar">
      <h3>{title}</h3>
      <div className="flipbook-toolbar-actions">
        <a className="flipbook-open-link" href={url} target="_blank" rel="noreferrer">{lang === 'it' ? 'Apri PDF ↗' : 'Open PDF ↗'}</a>
        {!loading && <>
          <button type="button" onClick={() => setZoom(z => Math.max(1, z - 0.4))} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => setZoom(z => Math.min(2.2, z + 0.4))} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => setShowThumbs(s => !s)} aria-label="Miniature">▦</button>
        </>}
        <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen">{fullscreen ? '⤡' : '⤢'}</button>
        <button type="button" className="flipbook-close" onClick={onClose} aria-label="Chiudi">✕</button>
      </div>
    </div>

    <div className="flipbook-stage">
      {loading
        ? <div className="flipbook-loading"><span className="flipbook-spinner"/><p>{lang === 'it' ? 'Caricamento pagine' : 'Loading pages'}{total > 0 ? ` — ${progress.done}/${total}` : '…'}</p></div>
        : <div className="flipbook-zoom-wrap" style={{ overflow: 'auto' }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform .2s', display: 'inline-block' }}>
              <HTMLFlipBook
                ref={bookRef}
                width={bookWidth}
                height={bookHeight}
                size="fixed"
                minWidth={200}
                maxWidth={1400}
                minHeight={280}
                maxHeight={1600}
                showCover={true}
                usePortrait={isMobile}
                drawShadow={true}
                flippingTime={550}
                startPage={0}
                startZIndex={10}
                autoSize={false}
                maxShadowOpacity={0.5}
                mobileScrollSupport={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="flipbook-book"
                style={{}}
                onFlip={(e: { data?: number }) => setPageNum((e.data ?? 0) + 1)}
              >
                {pages.map((src, i) => <div className="flipbook-page" key={i}><img src={src} alt={`${title} — pagina ${i + 1}`} draggable={false}/></div>)}
              </HTMLFlipBook>
            </div>
          </div>}
    </div>

    {!loading && <div className="flipbook-controls">
      <button type="button" onClick={() => bookRef.current?.pageFlip()?.flipPrev()} aria-label="Pagina precedente">‹</button>
      <span>{pageNum} / {pages.length}</span>
      <button type="button" onClick={() => bookRef.current?.pageFlip()?.flipNext()} aria-label="Pagina successiva">›</button>
    </div>}

    {!loading && showThumbs && <div className="flipbook-thumbs">
      {pages.map((src, i) => <button type="button" key={i} className={i + 1 === pageNum ? 'active' : ''} onClick={() => bookRef.current?.pageFlip()?.flip(i)}>
        <img src={src} alt={`${lang === 'it' ? 'pagina' : 'page'} ${i + 1}`}/>
        <span>{i + 1}</span>
      </button>)}
    </div>}
  </div>
}

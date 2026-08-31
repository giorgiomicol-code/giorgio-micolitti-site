import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './refinement.css'

function proxyLegacyImages() {
  document.querySelectorAll<HTMLImageElement>('img[src*="lh3.googleusercontent.com/sitesv/"]').forEach((img) => {
    const original = img.dataset.originalSrc || img.src
    if (!img.dataset.originalSrc) img.dataset.originalSrc = original
    const proxied = `/api/image?url=${encodeURIComponent(original)}`
    if (img.src !== new URL(proxied, window.location.origin).href) img.src = proxied
  })
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

requestAnimationFrame(proxyLegacyImages)
const observer = new MutationObserver(proxyLegacyImages)
observer.observe(root, { childList: true, subtree: true })

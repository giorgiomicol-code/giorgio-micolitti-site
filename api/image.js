const ALLOWED_HOSTS = new Set(['lh3.googleusercontent.com'])

export default async function handler(req, res) {
  const raw = Array.isArray(req.query?.url) ? req.query.url[0] : req.query?.url
  if (!raw) return res.status(400).send('Missing image URL')

  let target
  try {
    target = new URL(raw)
  } catch {
    return res.status(400).send('Invalid image URL')
  }

  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return res.status(403).send('Image host not allowed')
  }

  try {
    const response = await fetch(target.toString(), {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; GiorgioMicolittiSite/1.0)',
        'referer': 'https://www.giorgiomicolitti.it/',
        'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    })

    if (!response.ok) return res.status(response.status).send('Image unavailable')

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000')
    return res.status(200).send(buffer)
  } catch {
    return res.status(502).send('Unable to load image')
  }
}

// Получение полной ссылки Google Maps и извлечение координат
// Модули: node.js fetch

async function expandMapsUrl(shortUrl) {
  const res = await fetch(shortUrl, { redirect: 'follow' })
  return res.url
}

function extractCoords(url) {
  let m = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (!m) {
    m = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  }
  if (m) {
    return { lat: Number(m[1]), lng: Number(m[2]) }
  }
  return null
}

// Формирует ссылку маршрута Google Maps из координат
// travelmode по умолчанию driving
function generateRouteLink(start, end, mode = 'driving') {
  if (!start || !end) return ''
  return `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=${mode}`
}

// Формирует ссылку маршрута Google Maps из последовательности точек (до 10)
// travelmode по умолчанию driving
function generateMultiRouteLink(points = [], mode = 'driving') {
  if (!Array.isArray(points) || points.length < 2) return ''
  const pts = points.slice(0, 10)
  const origin = pts[0]
  const destination = pts[pts.length - 1]
  const waypoints = pts.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|')
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=${mode}`
  if (waypoints) url += `&waypoints=${waypoints}`
  return url
}

module.exports = {
  expandMapsUrl,
  extractCoords,
  generateRouteLink,
  generateMultiRouteLink
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function formatDateTime(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function showError(el, msg) {
  el.textContent = msg
  el.classList.remove('hidden')
}

export function hideError(el) {
  el.textContent = ''
  el.classList.add('hidden')
}

export function estadoBadgeCita(estado) {
  const map = {
    'Programada': 'badge-programada',
    'Confirmada': 'badge-confirmada',
    'En espera': 'badge-espera',
    'En atención': 'badge-atencion',
    'Atendida': 'badge-atendida',
    'Cancelada': 'badge-cancelada'
  }
  const cls = map[estado] || ''
  return `<span class="badge ${cls}">${escapeHtml(estado)}</span>`
}

export function estadoBadgeSala(estado) {
  const map = {
    'Esperando': 'badge-esperando',
    'En atención': 'badge-atencion',
    'Atendido': 'badge-atendido',
    'Ausente': 'badge-ausente'
  }
  const cls = map[estado] || ''
  return `<span class="badge ${cls}">${escapeHtml(estado)}</span>`
}

export function truncate(str, maxLen = 50) {
  if (!str) return '—'
  return str.length > maxLen ? str.substring(0, maxLen) + '...' : str
}

export function todayISO() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

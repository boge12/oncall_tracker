export function generateId() {
  return crypto.randomUUID()
}

export function elapsedTime(dateStr) {
  const ms = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return '<1m'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  if (hrs < 24) return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d ${hrs % 24}h`
}

export const priorityOrder = { stat: 0, urgent: 1, routine: 2 }

export function sortPages(pages) {
  return [...pages].sort((a, b) => {
    const pd = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (pd !== 0) return pd
    return new Date(a.createdAt) - new Date(b.createdAt)
  })
}

export function formatBillingList(pages) {
  return pages
    .filter(p => p.billingCode)
    .map(p => `${p.patientName} - ${p.location || 'N/A'} - ${p.billingCode}`)
    .join('\n')
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

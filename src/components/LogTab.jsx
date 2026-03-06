import { useState } from 'react'
import { formatBillingList, formatTime } from '../utils'

export default function LogTab({ pages, dispatch }) {
  const [copied, setCopied] = useState(false)
  const done = pages
    .filter(p => p.status === 'done')
    .sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt))

  async function handleCopy() {
    const text = formatBillingList(done)
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClearAll() {
    if (window.confirm('Clear all logged pages? This cannot be undone.')) {
      dispatch({ type: 'DELETE_ALL_DONE' })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Log{done.length > 0 && ` (${done.length})`}
        </h2>
        <div className="flex items-center gap-2">
          {done.length > 0 && (
            <>
              <button
                onClick={handleCopy}
                className="min-h-[44px] px-3 text-sm text-accent font-medium active:opacity-70"
              >
                {copied ? 'Copied!' : 'Copy Billing'}
              </button>
              <button
                onClick={handleClearAll}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted active:text-stat"
                aria-label="Clear all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* List */}
      {done.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">No completed pages</p>
      ) : (
        <div className="space-y-2">
          {done.map(page => (
            <div
              key={page.id}
              className="bg-surface rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">{page.patientName}</p>
                <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                  {page.location && <span>{page.location}</span>}
                  {page.billingCode && (
                    <>
                      <span className="text-border">|</span>
                      <span>{page.billingCode}</span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-xs text-text-muted whitespace-nowrap ml-3">
                {formatTime(page.resolvedAt)}
              </span>
              <button
                onClick={() => dispatch({ type: 'SET_STATUS', payload: { id: page.id, status: 'active' } })}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-muted active:text-accent ml-1 shrink-0"
                aria-label="Move back to active"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

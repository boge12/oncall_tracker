import { useState, useEffect } from 'react'
import { elapsedTime } from '../utils'
import TodoList from './TodoList'

const sourceBadgeColors = {
  haiku: 'bg-purple-500/20 text-purple-300',
  text: 'bg-blue-500/20 text-blue-300',
  page: 'bg-emerald-500/20 text-emerald-300'
}

const priorityColors = {
  stat: 'border-stat',
  urgent: 'border-urgent',
  routine: 'border-routine'
}

export default function PageCard({ page, dispatch, isFollowUp }) {
  const [expanded, setExpanded] = useState(false)
  const [elapsed, setElapsed] = useState(elapsedTime(page.createdAt))

  useEffect(() => {
    const id = setInterval(() => setElapsed(elapsedTime(page.createdAt)), 60000)
    return () => clearInterval(id)
  }, [page.createdAt])

  function handleCallbackClick(e) {
    e.stopPropagation()
    if (!page.callbackLoggedAt) {
      dispatch({ type: 'LOG_CALLBACK', payload: { id: page.id } })
    }
  }

  function handleStatus(status) {
    dispatch({ type: 'SET_STATUS', payload: { id: page.id, status } })
  }

  const isStat = page.priority === 'stat'
  const borderClass = isFollowUp
    ? 'border-l-4 border-followup'
    : isStat
      ? 'border-l-4 animate-pulse-border'
      : `border-l-4 ${priorityColors[page.priority]}`

  return (
    <div
      className={`bg-surface rounded-lg overflow-hidden ${borderClass} transition-all`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Collapsed view */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${sourceBadgeColors[page.source]}`}>
              {page.source}
            </span>
            {isStat && (
              <span className="text-[10px] font-bold uppercase text-stat">STAT</span>
            )}
          </div>
          <span className="text-xs text-text-muted whitespace-nowrap">{elapsed}</span>
        </div>

        <p className="text-base font-semibold text-text mt-1.5 truncate">{page.patientName}</p>

        <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
          {page.location && <span>{page.location}</span>}
          {page.callbackNumber && (
            <a
              href={`tel:${page.callbackNumber}`}
              onClick={handleCallbackClick}
              className="text-accent underline min-h-[44px] min-w-[44px] flex items-center"
            >
              {page.callbackNumber}
              {page.callbackLoggedAt && (
                <span className="ml-1 text-done text-[10px]">&#10003;</span>
              )}
            </a>
          )}
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border" onClick={e => e.stopPropagation()}>
          {/* Todos */}
          {(page.todos.length > 0 || true) && (
            <div className="mt-3">
              <p className="text-xs font-medium text-text-muted uppercase mb-1">Todos</p>
              <TodoList todos={page.todos} pageId={page.id} dispatch={dispatch} />
            </div>
          )}

          {/* Notes */}
          <div className="mt-3">
            <p className="text-xs font-medium text-text-muted uppercase mb-1">Notes</p>
            <textarea
              value={page.notes}
              onChange={e => dispatch({ type: 'UPDATE_PAGE', payload: { id: page.id, updates: { notes: e.target.value } } })}
              placeholder="Add notes..."
              rows={2}
              className="w-full bg-bg rounded-md border border-border px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Billing */}
          <div className="mt-3">
            <p className="text-xs font-medium text-text-muted uppercase mb-1">Billing Code</p>
            <input
              type="text"
              value={page.billingCode}
              onChange={e => dispatch({ type: 'UPDATE_PAGE', payload: { id: page.id, updates: { billingCode: e.target.value } } })}
              placeholder="e.g. 99221"
              className="w-full bg-bg rounded-md border border-border px-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            {page.status === 'active' && (
              <button
                onClick={() => handleStatus('followup')}
                className="flex-1 min-h-[52px] rounded-lg bg-urgent/20 text-urgent font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Follow Up
              </button>
            )}
            <button
              onClick={() => handleStatus('done')}
              className="flex-1 min-h-[52px] rounded-lg bg-done/20 text-done font-semibold text-sm active:scale-[0.98] transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

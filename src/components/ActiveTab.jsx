import { sortPages } from '../utils'
import PageCard from './PageCard'

export default function ActiveTab({ pages, dispatch, type = 'page' }) {
  const filtered = pages.filter(p => (p.type || 'page') === type)
  const pending = sortPages(filtered.filter(p => p.status === 'active'))
  const followUp = filtered.filter(p => p.status === 'followup').sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  )

  const label = type === 'consult' ? 'consults' : 'pages'

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 pb-24">
      {/* Pending Section */}
      <section>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Pending{pending.length > 0 && ` (${pending.length})`}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-text-muted py-8 text-center">No pending {label}</p>
        ) : (
          <div className="space-y-3">
            {pending.map(page => (
              <PageCard key={page.id} page={page} dispatch={dispatch} />
            ))}
          </div>
        )}
      </section>

      {/* Follow Up Section */}
      {followUp.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Follow Up ({followUp.length})
          </h2>
          <div className="space-y-3">
            {followUp.map(page => (
              <PageCard key={page.id} page={page} dispatch={dispatch} isFollowUp />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

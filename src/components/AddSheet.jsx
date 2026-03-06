import { useState } from 'react'
import { generateId } from '../utils'

const sourceOptions = ['haiku', 'page']
const priorityOptions = ['stat', 'urgent', 'routine']

function ToggleGroup({ options, value, onChange, colorMap }) {
  return (
    <div className="flex rounded-lg bg-bg overflow-hidden border border-border">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 min-h-[44px] text-sm font-medium capitalize transition-colors
            ${value === opt
              ? `${colorMap?.[opt] || 'bg-accent/20 text-accent'}`
              : 'text-text-muted'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

const sourceColors = {
  haiku: 'bg-purple-500/20 text-purple-300',
  page: 'bg-emerald-500/20 text-emerald-300'
}

const priorityColors = {
  stat: 'bg-stat/20 text-stat',
  urgent: 'bg-urgent/20 text-urgent',
  routine: 'bg-routine/20 text-routine'
}

export default function AddSheet({ open, onClose, dispatch }) {
  const [closing, setClosing] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [form, setForm] = useState({
    source: 'haiku',
    priority: 'urgent',
    patientName: '',
    location: '',
    callbackNumber: '',
    mrn: '',
    notes: '',
    billingCode: '',
    todoText: ''
  })
  const [todos, setTodos] = useState([])

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 300)
  }

  function handleField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function addTodo() {
    const text = form.todoText.trim()
    if (!text) return
    setTodos(t => [...t, { id: generateId(), text, done: false }])
    setForm(f => ({ ...f, todoText: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.patientName.trim()) return

    dispatch({
      type: 'ADD_PAGE',
      payload: {
        source: form.source,
        priority: form.priority,
        patientName: form.patientName.trim(),
        location: form.location.trim(),
        callbackNumber: form.callbackNumber.trim(),
        mrn: form.mrn.trim(),
        notes: form.notes.trim(),
        billingCode: form.billingCode.trim(),
        todos
      }
    })

    // Reset
    setForm({
      source: 'haiku',
      priority: 'urgent',
      patientName: '',
      location: '',
      callbackNumber: '',
      mrn: '',
      notes: '',
      billingCode: '',
      todoText: ''
    })
    setTodos([])
    setShowMore(false)
    onClose()
  }

  if (!open && !closing) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`relative bg-surface rounded-t-2xl max-h-[85vh] overflow-y-auto ${closing ? 'animate-sheet-down' : 'animate-sheet-up'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-5">
          {/* Source toggle */}
          <div className="mb-4">
            <label className="text-xs font-medium text-text-muted uppercase mb-2 block">Source</label>
            <ToggleGroup
              options={sourceOptions}
              value={form.source}
              onChange={v => handleField('source', v)}
              colorMap={sourceColors}
            />
          </div>

          {/* Priority toggle */}
          <div className="mb-4">
            <label className="text-xs font-medium text-text-muted uppercase mb-2 block">Priority</label>
            <ToggleGroup
              options={priorityOptions}
              value={form.priority}
              onChange={v => handleField('priority', v)}
              colorMap={priorityColors}
            />
          </div>

          {/* Patient name */}
          <input
            type="text"
            value={form.patientName}
            onChange={e => handleField('patientName', e.target.value)}
            placeholder="Patient Name"
            autoCapitalize="words"
            className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-lg text-text placeholder-text-muted outline-none focus:border-accent mb-3"
          />

          {/* Location */}
          <input
            type="text"
            value={form.location}
            onChange={e => handleField('location', e.target.value)}
            placeholder="Location (e.g. 4N 412)"
            className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent mb-3"
          />

          {/* Callback */}
          <input
            type="text"
            inputMode="tel"
            value={form.callbackNumber}
            onChange={e => handleField('callbackNumber', e.target.value)}
            placeholder="Callback Number"
            className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent mb-3"
          />

          {/* More section */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="text-sm text-text-muted font-medium min-h-[44px] flex items-center gap-1 mb-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showMore ? 'rotate-90' : ''}`}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            More
          </button>

          {showMore && (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                value={form.mrn}
                onChange={e => handleField('mrn', e.target.value)}
                placeholder="MRN"
                className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
              />
              <textarea
                value={form.notes}
                onChange={e => handleField('notes', e.target.value)}
                placeholder="Notes"
                rows={2}
                className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent resize-none"
              />
              <input
                type="text"
                value={form.billingCode}
                onChange={e => handleField('billingCode', e.target.value)}
                placeholder="Billing Code (e.g. 99221)"
                className="w-full bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
              />
              {/* Inline todos */}
              <div>
                {todos.map(t => (
                  <div key={t.id} className="text-sm text-text py-1 pl-2 border-l-2 border-border">
                    {t.text}
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.todoText}
                    onChange={e => handleField('todoText', e.target.value)}
                    placeholder="Add a todo..."
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTodo() } }}
                    className="flex-1 bg-bg rounded-lg border border-border px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-accent"
                  />
                  {form.todoText.trim() && (
                    <button
                      type="button"
                      onClick={addTodo}
                      className="text-accent text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!form.patientName.trim()}
            className="w-full min-h-[52px] rounded-lg bg-accent text-white font-semibold text-base disabled:opacity-40 active:scale-[0.98] transition-transform"
          >
            LOG PAGE
          </button>
        </form>
      </div>
    </div>
  )
}

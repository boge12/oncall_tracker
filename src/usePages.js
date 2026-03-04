import { useReducer, useEffect } from 'react'
import { generateId } from './utils'

const STORAGE_KEY = 'oncall-pages'

function loadPages() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PAGE': {
      const page = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        source: action.payload.source || 'haiku',
        priority: action.payload.priority || 'urgent',
        patientName: action.payload.patientName || '',
        mrn: action.payload.mrn || '',
        location: action.payload.location || '',
        callbackNumber: action.payload.callbackNumber || '',
        callbackLoggedAt: null,
        billingCode: action.payload.billingCode || '',
        notes: action.payload.notes || '',
        todos: action.payload.todos || [],
        status: 'active',
        resolvedAt: null
      }
      return [...state, page]
    }
    case 'UPDATE_PAGE': {
      return state.map(p =>
        p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
      )
    }
    case 'SET_STATUS': {
      return state.map(p => {
        if (p.id !== action.payload.id) return p
        const updates = { status: action.payload.status }
        if (action.payload.status === 'done') {
          updates.resolvedAt = new Date().toISOString()
        }
        return { ...p, ...updates }
      })
    }
    case 'LOG_CALLBACK': {
      return state.map(p =>
        p.id === action.payload.id
          ? { ...p, callbackLoggedAt: new Date().toISOString() }
          : p
      )
    }
    case 'TOGGLE_TODO': {
      return state.map(p => {
        if (p.id !== action.payload.pageId) return p
        const todos = p.todos.map(t =>
          t.id === action.payload.todoId ? { ...t, done: !t.done } : t
        )
        return { ...p, todos }
      })
    }
    case 'ADD_TODO': {
      return state.map(p => {
        if (p.id !== action.payload.pageId) return p
        const todo = { id: generateId(), text: action.payload.text, done: false }
        return { ...p, todos: [...p.todos, todo] }
      })
    }
    case 'DELETE_ALL_DONE': {
      return state.filter(p => p.status !== 'done')
    }
    default:
      return state
  }
}

export function usePages() {
  const [pages, dispatch] = useReducer(reducer, null, loadPages)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
  }, [pages])

  return [pages, dispatch]
}

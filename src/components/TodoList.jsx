import { useState } from 'react'

export default function TodoList({ todos, pageId, dispatch }) {
  const [newText, setNewText] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const text = newText.trim()
    if (!text) return
    dispatch({ type: 'ADD_TODO', payload: { pageId, text } })
    setNewText('')
  }

  return (
    <div className="space-y-1">
      {todos.map(todo => (
        <label
          key={todo.id}
          className="flex items-center gap-3 min-h-[44px] cursor-pointer"
        >
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: { pageId, todoId: todo.id } })}
            className="w-5 h-5 rounded border-border accent-accent shrink-0"
          />
          <span className={todo.done ? 'line-through text-text-muted' : 'text-text'}>
            {todo.text}
          </span>
        </label>
      ))}
      <form onSubmit={handleAdd} className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add todo..."
          className="flex-1 bg-transparent text-sm text-text placeholder-text-muted border-b border-border py-2 outline-none focus:border-accent"
        />
        {newText.trim() && (
          <button
            type="submit"
            className="text-accent text-sm font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            Add
          </button>
        )}
      </form>
    </div>
  )
}

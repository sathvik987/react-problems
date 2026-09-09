import { useState } from "react";
import { useUndoRedo } from "./useUndoRedo";

/**
 * The UI is complete — everything you need to change lives in
 * `useUndoRedo.ts`.
 *
 * Note that this component holds NO todo state of its own. The whole todo
 * array is the hook's `present`, and every mutation is a plain `set(nextArray)`
 * call. That's the point of the design: the component doesn't know history
 * exists, and the hook doesn't know what a todo is.
 *
 * The "past N / future N" readout under the buttons is your debugger. A
 * correct implementation can never show a non-zero future right after an edit.
 */

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export function TodoEditor() {
  const {
    state: todos,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    undoDepth,
    redoDepth,
  } = useUndoRedo<Todo[]>([]);
  const [draft, setDraft] = useState("");

  const addTodo = () => {
    const text = draft.trim();
    if (!text) return;
    set([...todos, { id: crypto.randomUUID(), text, done: false }]);
    setDraft("");
  };

  const toggleTodo = (id: string) => {
    set(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: string) => {
    set(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-editor">
      <form
        className="todo-form"
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a todo…"
          aria-label="New todo"
        />
        <button type="submit">Add</button>
      </form>

      <div className="todo-controls">
        <button onClick={undo} disabled={!canUndo}>
          ↩ Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          ↪ Redo
        </button>
      </div>

      <p className="todo-history">
        past {undoDepth} / future {redoDepth}
      </p>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? "done" : undefined}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete ${todo.text}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

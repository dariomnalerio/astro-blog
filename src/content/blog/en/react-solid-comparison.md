---
fileName: "react-solid-comparison"
otherLanguageFilename: "comparacion-react-solid"
title: "Comparing React and SolidJS"
description: 'React and SolidJS are popular JavaScript libraries for building user interfaces, but they differ significantly in their reactivity models. This post explores how these differences impact performance and developer experience, especially when managing state updates.'
pubDate: 2024-08-28
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://res.cloudinary.com/dhkyj5k4o/image/upload/v1724787533/astro-blog-page/Solid.js_cjeyyb.webp'
    alt: 'SolidJS Logo.'
tags: ["javascript", "react", "solid"]
---

## Understanding Reactivity in React and SolidJS

React and SolidJS are both popular JavaScript libraries for building user interfaces, but they handle reactivity and updates differently. To understand the differences, it’s important to grasp the underlying concepts of how each library manages changes and updates to the UI.

### React's Approach to Reactivity

React's architecture is based on a component-driven model where the user interface is divided into small, reusable pieces known as components. Each component can maintain its own state, which is an object that determines the rendering output of the component.

When a state within a React component changes, React triggers a re-render of that component and its children. This re-rendering process involves comparing the new virtual DOM (a lightweight copy of the actual DOM) with the previous one to determine what has changed. This is known as reconciliation. If React detects changes, it applies the necessary updates to the actual DOM to reflect those changes.

While this approach is very effective for ensuring consistency and correctness in UI updates, it can lead to performance overhead, particularly in scenarios where there are frequent state changes or complex component hierarchies. Each state change causes a re-render of the affected component and all of its descendants, even if only a small part of the UI actually needs to be updated.

### SolidJS and Fine-Grained Reactivity

SolidJS introduces a different model for reactivity known as fine-grained reactivity. Unlike React, which re-renders components based on state changes, SolidJS tracks individual reactive dependencies within the DOM. In SolidJS, components are compiled into real DOM nodes, and Solid manages updates directly at the DOM level.

#### What is Fine-Grained Reactivity?

Fine-grained reactivity means that instead of re-rendering entire components or traversing a virtual DOM to find changes, SolidJS only updates the exact pieces of the UI that depend on a reactive state. This is achieved through a mechanism that tracks which reactive state affects which part of the DOM. When a state changes, SolidJS directly updates only the relevant DOM nodes without involving the entire component or a virtual DOM.

The fundamental unit of reactivity is called a "signal." Signals are reactive primitives that store state. When you create a signal, SolidJS keeps track of where it is used in the DOM. If the value of a signal changes, SolidJS knows exactly which DOM nodes are affected and updates them directly.

One key difference between how state is managed in React and SolidJS is in how you access the state. In React, state variables are directly used in the component render method (e.g., *todos*), while in SolidJS, you access the current state value by calling the signal function (e.g., *todos()*).

Here's a brief example of a Todo list component in both React and SolidJS to illustrate the differences in managing state updates:

**SolidJS:**
```javascript
function TodoSection() {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [newTodo, setNewTodo] = createSignal<string>('');

  const addTodo = () => {
    const task = newTodo().trim();
    if (task === '') return;
    // Each item has its own signal for completion status, which is updated independently
    const [completed, setCompleted] = createSignal<boolean>(false);
    // createUniqueId is a utility function provided by Solid
    const id = createUniqueId();

    setTodos([...todos(), { id, task, completed, setCompleted }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const todo = todos().find((todo) => todo.id === id);
    if (todo) {
      // Only the completion status of the specific todo is updated, not the entire list
      todo.setCompleted(!todo.completed());
    }
  };

  const removeTodo = (id: string) => {
    setTodos(todos().filter((todo) => todo.id !== id));
  };

  createEffect(
    on(todos, () => {
      setCount((c) => c + 1);
    })
  );

  return (
    <>
      <TodoSectionHeader newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />
      <p>Todo array render count: {count()}</p>
      <ul>
        <For
          each={todos()}
          fallback={<p>There is nothing to do yet! Try adding some tasks</p>}
        >
          {(todo) => (
            <li>
              <div>
                <input id={todo.id} type='checkbox' checked={todo.completed()} onChange={() => toggleTodo(todo.id)} />
                <label for={todo.id}>{todo.task}</label>
              </div>
              <button onClick={() => removeTodo(todo.id)}>Remove</button>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}

  ```

**React:**
```javascript
function TodoSection() {
  const [count, setCount] = useState<number>(0);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  const addTodo = () => {
    const task = newTodo.trim();
    if (task === '') return;
    const id = crypto.randomUUID();

    setTodos([...todos, { id, task, completed: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  useEffect(() => {
    setCount((prev) => prev + 1);
  }, [todos]);

  return (
    <section>
      <TodoSectionHeader newTodo={newTodo} setNewTodo={setNewTodo} addTodo={addTodo} />

      <p>Todo array render count: {count}</p>

      <ul>
        {todos.length === 0 && (
          <p>There is nothing to do yet! Try adding some tasks</p>
        )}

        {todos.map((todo) => (
          <li key={todo.id}>
            <div>
              <input id={todo.id} type='checkbox' checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
              <label htmlFor={todo.id}>{todo.task}</label>
            </div>
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Performance and Reactivity

In our Todo list example, React and SolidJS handle state updates differently, impacting performance.

React updates the entire todo list whenever state changes. Marking a task as completed triggers a re-render of the entire list. To improve performance, you can use optimizations like useMemo, useCallback, and React.memo to minimize unnecessary re-renders, but these techniques still operate within the broader virtual DOM and reconciliation process.


When a task is marked as completed in SolidJS, only that task’s checkbox is updated, not the entire list. This prevents unnecessary re-renders and improves performance without additional optimization hooks.

<a href="https://react-todo-example.vercel.app/" target="_blank" >React Example</a>

<a href="https://solid-todo-example.vercel.app/" target="_blank" >SolidJS Example</a>

## Conclusion

While SolidJS offers a superior developer experience and performance benefits, React remains a strong choice due to its extensive ecosystem, and large community support and the fact that it is still performant enough. Both libraries have their strengths, and the best choice depends on your specific needs and priorities.
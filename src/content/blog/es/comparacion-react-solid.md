---
fileName: "comparacion-react-solid" 
otherLanguageFilename: "react-solid-comparison"
title: "Comparando React y SolidJS"
description: 'React y SolidJS son bibliotecas populares de JavaScript para construir interfaces de usuario, pero difieren significativamente en sus modelos de reactividad. Este artículo explora cómo estas diferencias impactan el rendimiento y la experiencia del desarrollador, especialmente al gestionar actualizaciones de estado.'
pubDate: 2024-08-28
author: Dario Nalerio
authorLink: https://www.linkedin.com/in/darionalerio/
image:
    url: 'https://res.cloudinary.com/dhkyj5k4o/image/upload/v1724787533/astro-blog-page/Solid.js_cjeyyb.webp'
    alt: 'SolidJS Logo.'
tags: ["javascript", "react", "solid"]

---

## Entendiendo la Reactividad en React y SolidJS

React y SolidJS son dos bibliotecas populares de JavaScript para construir interfaces de usuario, pero manejan la reactividad y las actualizaciones de manera diferente. Para entender las diferencias, es importante comprender los conceptos subyacentes de cómo cada biblioteca gestiona los cambios y las actualizaciones en la interfaz de usuario.

### Enfoque de React hacia la Reactividad

La arquitectura de React se basa en un modelo impulsado por componentes donde la interfaz de usuario se divide en piezas pequeñas y reutilizables conocidas como componentes. Cada componente puede mantener su propio estado, que es un objeto que determina la salida de renderizado del componente.

Cuando un estado dentro de un componente de React cambia, React desencadena una nueva renderización de ese componente y sus hijos. Este proceso de renderización implica comparar el nuevo DOM virtual (una copia ligera del DOM real) con el anterior para determinar qué ha cambiado. Esto se conoce como reconciliación. Si React detecta cambios, aplica las actualizaciones necesarias al DOM real para reflejar esos cambios.

Aunque este enfoque es muy efectivo para garantizar la consistencia y la corrección en las actualizaciones de la interfaz de usuario, puede llevar a una sobrecarga de rendimiento, particularmente en escenarios donde hay cambios de estado frecuentes o jerarquías de componentes complejas. Cada cambio de estado causa una renderización del componente afectado y todos sus descendientes, incluso si solo una pequeña parte de la interfaz necesita ser actualizada.

### SolidJS y la Reactividad de Grano Fino

SolidJS introduce un modelo diferente para la reactividad conocido como reactividad de grano fino (Fine-Grained Reactivity). A diferencia de React, que vuelve a renderizar componentes basados en cambios de estado, SolidJS rastrea dependencias reactivas individuales dentro del DOM. En SolidJS, los componentes se compilan en nodos DOM reales, y Solid gestiona las actualizaciones directamente a nivel del DOM.

#### ¿Qué es la Reactividad de Grano Fino?

La reactividad de grano fino significa que, en lugar de volver a renderizar componentes enteros o recorrer un DOM virtual para encontrar cambios, SolidJS solo actualiza las piezas exactas de la interfaz de usuario que dependen de un estado reactivo. Esto se logra mediante un mecanismo que rastrea qué estado reactivo afecta a qué parte del DOM. Cuando un estado cambia, SolidJS actualiza directamente solo los nodos del DOM relevantes sin involucrar el componente completo o un DOM virtual.

La unidad fundamental de reactividad se llama "signal" (señal). Las señales son primitivas reactivas que almacenan el estado. Al crear una señal, SolidJS rastrea dónde se usa en el DOM. Si el valor de una señal cambia, SolidJS sabe exactamente qué nodos del DOM se ven afectados y los actualiza directamente.

Una diferencia clave entre cómo se gestiona el estado en React y SolidJS es cómo acceder al estado. En React, las variables de estado se utilizan directamente en el método de renderizado del componente (por ejemplo, *todos*), mientras que en SolidJS, se accede al valor actual del estado llamando a la función de señal (por ejemplo, *todos()*).

Breve ejemplo de un componente de lista de tareas en React y SolidJS para ilustrar las diferencias en la gestión de actualizaciones de estado:

**SolidJS:**
```javascript
function TodoSection() {
  const [todos, setTodos] = createSignal<Todo[]>([]);
  const [newTodo, setNewTodo] = createSignal<string>('');

  const addTodo = () => {
    const task = newTodo().trim();
    if (task === '') return;
    // Cada ítem tiene su propia señal para el estado de completado, que se actualiza de manera independiente
    const [completed, setCompleted] = createSignal<boolean>(false);
    // createUniqueId es una función de utilidad proporcionada por Solid
    const id = createUniqueId();

    setTodos([...todos(), { id, task, completed, setCompleted }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    const todo = todos().find((todo) => todo.id === id);
    if (todo) {
      // Solo se actualiza el estado de completado del ítem específico, no toda la lista
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
      <p>Contador de renderizados de la lista de tareas: {count()}</p>
      <ul>
        <For
          each={todos()}
          fallback={<p>¡No hay nada por hacer todavía! Intenta agregar algunas tareas</p>}
        >
          {(todo) => (
            <li>
              <div>
                <input id={todo.id} type='checkbox' checked={todo.completed()} onChange={() => toggleTodo(todo.id)} />
                <label for={todo.id}>{todo.task}</label>
              </div>
              <button onClick={() => removeTodo(todo.id)}>Eliminar</button>
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

      <p>Contador de renderizados de la lista de tareas: {count}</p>

      <ul>
        {todos.length === 0 && (
          <p>¡No hay nada por hacer todavía! Intenta agregar algunas tareas</p>
        )}

        {todos.map((todo) => (
          <li key={todo.id}>
            <div>
              <input id={todo.id} type='checkbox' checked={todo.completed} onChange={() => toggleTodo(todo.id)} />
              <label htmlFor={todo.id}>{todo.task}</label>
            </div>
            <button onClick={() => removeTodo(todo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### Rendimiento y Reactividad

En nuestro ejemplo de lista de tareas, React y SolidJS manejan las actualizaciones de estado de manera diferente, lo que afecta el rendimiento.

React actualiza toda la lista de tareas cada vez que cambia el estado. Marcar una tarea como completada desencadena una nueva renderización de toda la lista. Para mejorar el rendimiento, se pueden usar optimizaciones como `useMemo`, `useCallback` y `React.memo` para minimizar las renderizaciones innecesarias, pero estas técnicas aún operan dentro del proceso de DOM virtual y reconciliación más amplio.


Cuando una tarea se marca como completada en SolidJS, solo se actualiza la casilla de verificación de esa tarea específica, no toda la lista. Esto evita renderizaciones innecesarias y mejora el rendimiento sin necesidad de hooks de optimización adicionales.

<a href="https://react-todo-example.vercel.app/" target="_blank" >Ejemplo en React</a>

<a href="https://solid-todo-example.vercel.app/" target="_blank" >Ejemplo en SolidJS</a>

## Conclusión

Mientras que SolidJS ofrece una experiencia de desarrollo superior y beneficios de rendimiento, React sigue siendo una opción sólida debido a su ecosistema extenso, su gran comunidad de soporte y el hecho de que sigue siendo lo suficientemente eficiente. Ambas bibliotecas tienen sus fortalezas, y la mejor elección depende de tus necesidades y prioridades.

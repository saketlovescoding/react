# React Notes - Padre Ginos

## Components

- **App** is a component — a reusable piece of UI that returns a description of what should appear on screen.
- A component can be thought of as a **class**, and `React.createElement()` creates an **instance** of that component.
- There are **two types** of components:
  - **Functional components** — plain JavaScript functions that return React elements (this is what we're using here).
  - **Class components** — ES6 classes that extend `React.Component` (older pattern).

## Props

- Props (short for "properties") are how you **pass data from a parent component to a child component**.
- They are passed as the **second argument** to `React.createElement()` as an object:
  ```js
  React.createElement(Pizza, { name: "Pepperoni Pizza", description: "Some Pepper" });
  ```
- The child component receives them as a `props` parameter:
  ```js
  const Pizza = (props) => {
      React.createElement("h1", {}, props.name);
  };
  ```
- Props are **read-only** — a component should never modify its own props.
- Every instance of a component can receive **different props**, making components reusable:
  ```js
  React.createElement(Pizza, { name: "Pepperoni Pizza", description: "Some Pepper" }),
  React.createElement(Pizza, { name: "The Havanaa Pizza", description: "hawaian toppings" }),
  ```
  Same `Pizza` component, two different outputs — that's the power of props.

## Rendering to the DOM

The rendering process has three steps:

1. **Grab a DOM element** — use `document.getElementById("root")` to find the `<div id="root">` in the HTML.
2. **Create a React root** — pass that container to `ReactDOM.createRoot(container)` to tell React where to render.
3. **Render the app** — call `root.render(React.createElement(App))` to mount the component tree.

## React vs ReactDOM

| Library    | Purpose                                                              |
| ---------- | -------------------------------------------------------------------- |
| **React**  | Describes the UI — components, elements, props, state                |
| **ReactDOM** | Connects React to the **browser's DOM** — renders the UI into actual HTML elements |

They are separate because React can also render to other targets (e.g., React Native for mobile).

## Project Setup (No Build Tools)

This project loads React directly via CDN scripts — no bundler needed:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="./src/App.js"></script>
```

The `<div id="root">not rendered</div>` acts as the mount point — its content gets replaced once React renders.

## Tooling — ESLint & Prettier

- **Prettier** handles code **formatting** (indentation, line length, semicolons, etc.).
- **ESLint** handles code **quality** (catching bugs, unused variables, bad patterns, etc.).
- They are kept separate because they serve different purposes, but `eslint-config-prettier` is used to **turn off ESLint rules that conflict with Prettier** so the two don't fight.
- **`eslint-plugin-react`** adds React-specific linting rules (e.g., checking JSX syntax, prop usage, hooks rules).
- ESLint uses the **flat config** format (`eslint.config.mjs`):
  ```js
  import js from "@eslint/js";
  import prettier from "eslint-config-prettier";
  import reactPlugin from "eslint-plugin-react";
  import globals from "globals";

  export default [
      js.configs.recommended,           // sensible default rules
      prettier,                         // disable formatting rules that clash with Prettier
      {
          ...reactPlugin.configs.flat.recommended,  // recommended React rules
          settings: { react: { version: "detect" } },  // auto-detect React version
      },
      reactPlugin.configs.flat["jsx-runtime"],  // disables rules requiring React import (not needed with new JSX transform)
      {
          files: ["**/*.js", "**/*.jsx", "**/*.tsx"],
          languageOptions: {
              globals: { ...globals.browser, ...globals.node },
              parserOptions: { ecmaFeatures: { jsx: true } },
          },
          rules: {
              "react/prop-types": "off",               // we're not using PropTypes
              "react/no-unescaped-entities": "off",     // allow ' and " in JSX text
          },
      },
  ];
  ```
- **`jsx-runtime`** config is important — it tells ESLint that we're using the **new JSX transform** (React 17+), so we don't need `import React from "react"` at the top of every file.
- npm scripts for tooling:
  - `npm run format` — runs Prettier on all source files
  - `npm run lint` — runs ESLint on the project

## React vs MVC

When React was created, the **MVC (Model-View-Controller)** pattern was dominant — logic, data, and presentation were kept in separate files/layers. React took a different approach: it **co-locates everything related to a component** (markup, logic, and eventually styling) in one place. The idea is that a component owns its entire UI concern, making it easier to reason about and maintain.

## Imports — Default vs Named

- **Default imports** (no curly braces) import the entire default export of a module:
  ```js
  import React from "react";
  ```
- **Named imports** (with curly braces) import specific exports from a module:
  ```js
  import { createRoot } from "react-dom/client";
  ```
- Vite handles resolving these imports — it connects the `import` statement to the actual library code at build time.

## Vite

- **Vite** is a modern build tool and dev server for frontend projects.
- By default, Vite looks for `index.html` in the project root. It crawls all linked HTML, CSS, and JS files from there to build the project.
- The **`@vitejs/plugin-react`** plugin adds React-specific support (Fast Refresh, JSX transform, etc.).
- Vite config (`vite.config.js`):
  ```js
  import react from "@vitejs/plugin-react";
  import { defineConfig } from "vite";

  export default defineConfig({
      server: {
          proxy: {
              "/api": {
                  target: "http://localhost:3000",
                  changeOrigin: true,
              },
              "/public": {
                  target: "http://localhost:3000",
                  changeOrigin: true,
              },
          },
      },
      plugins: [react()],
  });
  ```

### Vite Proxy

- A **proxy** is a middleman that forwards requests on your behalf.
- The Vite dev server acts as a proxy: when the browser makes a request to `/api` or `/public`, Vite intercepts it and **forwards it to the backend** at `http://localhost:3000`.
- This makes both frontend and backend appear to be on the **same origin** (same host and port), which avoids **CORS** (Cross-Origin Resource Sharing) issues.
- **CORS** is a browser security feature that blocks requests from one origin (e.g., `localhost:5173`) to a different origin (e.g., `localhost:3000`). The proxy sidesteps this entirely because, from the browser's perspective, all requests go to `localhost:5173`.
- `changeOrigin: true` updates the `Host` header in the proxied request to match the target, which some backend servers require.

### How `/public` Works in This Project

- The `/public` path here is **NOT** Vite's built-in `public/` directory. It's a route served by the **backend server** at `localhost:3000`.
- The backend has static assets (images, CSS) at its `/public` path — things like `/public/style.css` and `/public/pizzas/pepperoni.webp`.
- Because we configured Vite to proxy `/public` → `http://localhost:3000`, the browser requests these assets from the Vite dev server (`localhost:5173/public/...`), and Vite transparently forwards them to the backend.
- This means we can reference backend-hosted assets directly in our HTML and JSX:
  ```html
  <!-- in index.html -->
  <link rel="stylesheet" href="/public/style.css">
  ```
  ```jsx
  <!-- in JSX -->
  <img src={props.image} alt={props.name} />
  <!-- where props.image is something like "/public/pizzas/pepperoni.webp" -->
  ```
- In **production**, you'd configure your deployment so that `/public` and `/api` routes point to the real backend server (no Vite proxy needed).

## npm Scripts (package.json)

| Script          | Command         | Purpose                                                                 |
| --------------- | --------------- | ----------------------------------------------------------------------- |
| `npm run dev`   | `vite`          | Starts the development server (typically at `http://localhost:5173/`)    |
| `npm run build` | `vite build`    | Bundles static files for production deployment (GitHub Pages, Vercel, Netlify, AWS S3, etc.) |
| `npm run preview` | `vite preview` | Lets you preview the production build locally before deploying          |
| `npm run format` | `prettier --write "src/**/*.{js,jsx,css}"` | Formats all source files with Prettier |
| `npm run lint`  | `eslint`        | Runs ESLint on the project                                              |

## Dependencies vs Dev Dependencies

- **Dependencies** (`--save` / default) are packages needed at **runtime** — they ship with your app:
  ```
  react, react-dom
  ```
- **Dev dependencies** (`--save-dev` / `-D`) are only needed during **development** — build tools, linters, formatters:
  ```
  vite, eslint, prettier, @vitejs/plugin-react
  ```
- React is **not** installed with `-D` because it's required at runtime, not just during development.

## JSX

- **JSX** is HTML-like syntax written directly inside JavaScript. It's syntactic sugar over `React.createElement()` calls.
- Instead of writing:
  ```js
  React.createElement("div", {}, [
      React.createElement("h1", {}, props.name),
      React.createElement("p", {}, props.description),
  ]);
  ```
  You can write:
  ```jsx
  <div>
      <h1>{props.name}</h1>
      <p>{props.description}</p>
  </div>
  ```
- JSX uses `{}` (curly braces) to embed **JavaScript expressions** — variables, props, function calls, etc.
- JSX uses `className` instead of `class` (since `class` is a **reserved keyword** in JavaScript — it's used to define ES6 classes):
  ```jsx
  <div className="pizza">
  ```
- **All JSX tags must be closed** — unlike HTML where some tags are self-closing (e.g., `<img>`, `<br>`), in JSX you must explicitly close them (e.g., `<img />`, `<br />`).
- In modern development, you **don't need to import React** just to write JSX — build tools like Vite (via `@vitejs/plugin-react`) handle the transformation automatically.
- JSX files typically use the **`.jsx`** extension to signal that they contain JSX syntax.

## Separating Components into Files

- Each component should live in its **own file** — this keeps the codebase organized and components reusable.
- A component file exports the component so other files can import it:
  ```jsx
  // Pizza.jsx
  const Pizza = (props) => {
      return (
          <div className="pizza">
              <h1>{props.name}</h1>
              <p>{props.description}</p>
          </div>
      );
  };

  export default Pizza;
  ```
- The parent file imports and uses it:
  ```js
  // App.js
  import Pizza from "./Pizza";
  ```
- **Default export** (`export default Pizza`) means you import it **without** curly braces — one default export per file.
- **Named exports** (`export { Pizza }`) use curly braces on import — you can have **multiple** named exports per file.

## React Hooks

- **Hooks** are special functions that let you "hook into" React features like **state** and **side effects** from functional components.
- Before hooks (React 16.8), you needed class components to use state or lifecycle methods. Hooks make functional components fully capable.
- Common hooks:
  - **`useState`** — adds local state to a component
  - **`useEffect`** — runs side effects (data fetching, subscriptions, DOM manipulation) after render
  - **`useRef`** — holds a mutable value that persists across renders without triggering re-renders
  - **`useContext`** — accesses shared data without prop drilling
- **Rules of Hooks:**
  1. Only call hooks at the **top level** of a component (not inside loops, conditions, or nested functions).
  2. Only call hooks from **React function components** or **custom hooks**.

## Form State Management in React

- The common pattern for managing form state in React is using **state variables to track form input values** — this is called a **controlled component**.
- In a controlled component, the form input's value is driven by React state, and every change is handled by a state updater function. This gives React full control over the form data.
- Example:
  ```jsx
  import { useState } from "react";

  export default function OrderForm() {
      const [pizzaType, setPizzaType] = useState("pepperoni");
      const [pizzaSize, setPizzaSize] = useState("M");

      return (
          <form>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                  name="pizza-type"
                  value={pizzaType}
                  onChange={(e) => setPizzaType(e.target.value)}
              >
                  <option value="pepperoni">Pepperoni</option>
                  <option value="margherita">Margherita</option>
                  <option value="veggie-delight">Veggie Delight</option>
              </select>

              <label htmlFor="pizza-size">Pizza Size</label>
              <input
                  type="radio"
                  name="pizza-size"
                  value="S"
                  checked={pizzaSize === "S"}
                  onChange={(e) => setPizzaSize(e.target.value)}
              /> Small
              <input
                  type="radio"
                  name="pizza-size"
                  value="M"
                  checked={pizzaSize === "M"}
                  onChange={(e) => setPizzaSize(e.target.value)}
              /> Medium
              <input
                  type="radio"
                  name="pizza-size"
                  value="L"
                  checked={pizzaSize === "L"}
                  onChange={(e) => setPizzaSize(e.target.value)}
              /> Large
          </form>
      );
  }
  ```
- **Key points:**
  - `value={pizzaType}` binds the input to state — React is the **single source of truth**.
  - `onChange={(e) => setPizzaType(e.target.value)}` updates state on every keystroke/selection, which triggers a re-render with the new value.
  - Without `onChange`, the input becomes **read-only** because React won't let the DOM value diverge from state.
  - This pattern applies to all form elements: `<input>`, `<select>`, `<textarea>`, and radio buttons.

## The Event Object (`e`)

- When a user interacts with the DOM (clicks, types, selects, etc.), the browser creates an **event object** and passes it to any registered event handler.
- In React, event handlers receive a **SyntheticEvent** — a cross-browser wrapper around the native browser event. It has the same interface but works consistently across all browsers.
- The event object contains useful information about what happened:

| Property / Method      | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `e.target`             | The **DOM element** that triggered the event (e.g., the `<select>` or `<input>`) |
| `e.target.value`       | The **current value** of the input element — this is what you usually want for form handling |
| `e.target.name`        | The `name` attribute of the element                                         |
| `e.target.checked`     | For checkboxes/radios — whether the input is checked                        |
| `e.type`               | The type of event (`"change"`, `"click"`, `"submit"`, etc.)                 |
| `e.preventDefault()`   | Prevents the browser's default behavior (e.g., stops a form from submitting and reloading the page) |
| `e.stopPropagation()`  | Stops the event from bubbling up to parent elements                         |
| `e.currentTarget`      | The element the event handler is **attached to** (may differ from `e.target` if the event bubbled up) |

- Example — accessing `e.target.value` when a dropdown changes:
  ```jsx
  <select onChange={(e) => setPizzaType(e.target.value)}>
  ```
  Here `e` is the event object, `e.target` is the `<select>` element, and `e.target.value` is whichever `<option>` the user just selected.

- **`e.target` vs `e.currentTarget`**: If you click a `<span>` inside a `<button>`, then `e.target` is the `<span>` (what was actually clicked) and `e.currentTarget` is the `<button>` (where the handler is attached).

## Why Hooks Must Be Called at the Top Level

- React relies on the **order in which hooks are called** to correctly associate each hook with its state. Internally, React maintains a list of hooks for each component, and it matches them by position (first hook call → first slot, second → second, etc.).
- If you put a hook inside a condition, loop, or nested function, the hook might **not get called on every render** — or it might get called in a **different order**. This breaks React's ability to track which state belongs to which hook.
- **Bad example — hook inside a condition:**
  ```jsx
  function Order() {
      const [pizzaType, setPizzaType] = useState("Pepperoni");

      // DON'T DO THIS — hook inside a condition
      if (pizzaType === "Pepperoni") {
          const [extra, setExtra] = useState("cheese");
      }

      const [pizzaSize, setPizzaSize] = useState("M");

      return <div>...</div>;
  }
  ```
  On the first render (when `pizzaType` is `"Pepperoni"`), React sees 3 hook calls:
  1. `useState("Pepperoni")` → slot 0
  2. `useState("cheese")` → slot 1
  3. `useState("M")` → slot 2

  If the user changes `pizzaType` to `"Margherita"`, the condition is false and the second `useState` is skipped. Now React sees only 2 hook calls:
  1. `useState("Pepperoni")` → slot 0
  2. `useState("M")` → slot 1 ← **React thinks this is the `extra` state!**

  React now maps `pizzaSize` to the wrong slot. This causes **bugs, stale values, or crashes**.

- **The fix** — always declare all hooks at the top level, and use the state conditionally instead:
  ```jsx
  function Order() {
      const [pizzaType, setPizzaType] = useState("Pepperoni");
      const [extra, setExtra] = useState("cheese");       // always called
      const [pizzaSize, setPizzaSize] = useState("M");     // always called

      // Use the state conditionally, not the hook
      return (
          <div>
              {pizzaType === "Pepperoni" && <p>Extra: {extra}</p>}
          </div>
      );
  }
  ```
- The same rule applies to **loops** and **nested functions** — hooks must always execute in the same order on every render.

## `useState` vs `useEffect`

These are the two most fundamental React hooks, and they serve very different purposes:

| | `useState` | `useEffect` |
|---|---|---|
| **Purpose** | Manages **data** (state) inside a component | Manages **side effects** (things outside React's rendering) |
| **When it runs** | Returns the current state value on every render | Runs **after** the component renders to the DOM |
| **What it does** | Stores a value and gives you a function to update it — updating triggers a re-render | Runs code that has "effects" on the outside world — API calls, subscriptions, DOM manipulation, timers |
| **Returns** | `[currentValue, setterFunction]` | Nothing (or a cleanup function) |

- **`useState`** is for **what the component displays** — the data that drives the UI.
- **`useEffect`** is for **what the component does** — actions that happen as a consequence of rendering, not during it.

Think of it this way: `useState` answers "what should I show?" and `useEffect` answers "what should I do after showing it?"

### Example — using them together:
```jsx
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
    // useState: "I need to track this data"
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect: "After rendering, go fetch the data"
    useEffect(() => {
        async function fetchUser() {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();
            setUser(data);       // update state → triggers re-render
            setLoading(false);   // update state → triggers re-render
        }
        fetchUser();
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    return <h1>{user.name}</h1>;
}
```

The flow is:
1. Component renders with `user = null` and `loading = true` → shows "Loading..."
2. After render, `useEffect` fires → fetches data from API
3. When data arrives, `setUser` and `setLoading` update state → component re-renders
4. Now `loading` is `false` and `user` has data → shows the user's name

## Why `useEffect` Cannot Be an Async Function

You might think you could write:
```jsx
// ❌ DON'T DO THIS
useEffect(async () => {
    const res = await fetch("/api/pizzas");
    const data = await res.json();
    setPizzaTypes(data);
}, []);
```

This **does not work correctly** because:

1. **`useEffect` expects its callback to return either nothing or a cleanup function.** An `async` function always returns a **Promise**, not a cleanup function. React doesn't know what to do with a Promise as a return value.

2. **Cleanup functions** are how React handles teardown — for example, unsubscribing from a WebSocket or canceling a timer when the component unmounts. If `useEffect` receives a Promise instead of a function, it can't run cleanup properly.

### The fix — define the async function inside and call it:
```jsx
// ✅ CORRECT
useEffect(() => {
    async function fetchPizzaTypes() {
        const res = await fetch("/api/pizzas");
        const data = await res.json();
        setPizzaTypes(data);
    }
    fetchPizzaTypes();
}, []);
```

Or using an immediately invoked function expression (IIFE):
```jsx
// ✅ ALSO CORRECT
useEffect(() => {
    (async () => {
        const res = await fetch("/api/pizzas");
        const data = await res.json();
        setPizzaTypes(data);
    })();
}, []);
```

Both approaches keep the `useEffect` callback as a regular (non-async) function that returns `undefined`, which is what React expects.

## The `useEffect` Dependency Array

The **second argument** to `useEffect` is the **dependency array** — it controls **when** the effect runs. This is one of the most important concepts to understand about `useEffect`.

### The three cases:

#### 1. No dependency array — runs after **every** render
```jsx
useEffect(() => {
    console.log("I run after EVERY render");
});
```
- Runs on mount, and again after every single re-render.
- **Use case:** Rarely needed. Useful for debugging or effects that genuinely need to sync with every render.
- **Warning:** Can cause performance issues if the effect does expensive work.

#### 2. Empty dependency array `[]` — runs **once** on mount
```jsx
useEffect(() => {
    console.log("I run ONCE when the component first mounts");
    fetchPizzaTypes(); // fetch data once when the page loads
}, []);
```
- Runs only after the **first** render (when the component mounts).
- Does **not** run again on subsequent re-renders.
- **Use case:** Fetching initial data, setting up a one-time subscription, initializing a third-party library.
- This is what we use in `Order.jsx` — we only need to fetch the pizza types once, not every time the user changes a dropdown.

#### 3. Dependency array with values — runs when **dependencies change**
```jsx
useEffect(() => {
    console.log(`Fetching data for user ${userId}`);
    fetchUserData(userId);
}, [userId]);
```
- Runs after the first render, **and** again whenever any value in the array changes.
- React compares the current values to the previous values using `Object.is()` — if any dependency is different, the effect re-runs.
- **Use case:** Re-fetching data when a prop or state value changes.

### Full example — all three cases in one component:
```jsx
import { useState, useEffect } from "react";

function ProductPage({ productId }) {
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Case 1: No array — runs after every render (for debugging)
    useEffect(() => {
        console.log("Component rendered. Product:", product, "Cart:", cart);
    });

    // Case 2: Empty array [] — runs once on mount
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);

        // Cleanup function — runs when component unmounts
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Case 3: [productId] — runs when productId changes
    useEffect(() => {
        async function fetchProduct() {
            const res = await fetch(`/api/products/${productId}`);
            const data = await res.json();
            setProduct(data);
        }
        fetchProduct();
    }, [productId]);

    return <div>{product ? product.name : "Loading..."}</div>;
}
```

### Multiple dependencies:
```jsx
useEffect(() => {
    fetchFilteredResults(category, sortBy, page);
}, [category, sortBy, page]);
```
- The effect re-runs when **any** of the three values change — changing `category`, `sortBy`, or `page` will all trigger a re-fetch.

### Common mistake — forgetting dependencies:
```jsx
// ❌ Bug: stale closure — count will always be 0 inside the interval
useEffect(() => {
    const id = setInterval(() => {
        console.log(count); // always logs the initial value
    }, 1000);
    return () => clearInterval(id);
}, []); // count is missing from dependencies

// ✅ Fix: include count in dependencies
useEffect(() => {
    const id = setInterval(() => {
        console.log(count); // logs the current value
    }, 1000);
    return () => clearInterval(id);
}, [count]); // re-creates interval when count changes
```

### Cleanup functions:
When `useEffect` returns a function, React calls it **before re-running the effect** and **when the component unmounts**. This prevents memory leaks:
```jsx
useEffect(() => {
    const socket = new WebSocket("ws://example.com");
    socket.onmessage = (msg) => setMessages((prev) => [...prev, msg]);

    // Cleanup: close the socket when the component unmounts
    // or before the effect re-runs
    return () => socket.close();
}, []);
```

## Derived Values (Computing from State, Not Storing Separately)

A **derived value** is any value you can compute from existing state — you don't store it in its own state variable, you just calculate it during render.

### The core idea

React components are **functions**. Every time state changes, React calls your function again. This means any plain JavaScript expression in the function body **re-evaluates automatically** on every render. You get reactivity for free — no extra hooks, no extra state.

### Example from Order.jsx:

```jsx
const [pizzaSize, setPizzaSize] = useState("M");
const [pizzaType, setPizzaType] = useState("");

let price, selectedPizza;
if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(selectedPizza.sizes[pizzaSize]);
}
```

Here `price` is derived from `pizzaSize` + `selectedPizza`. It's **not** stored in state — it's just a local variable that gets recalculated every time the component re-renders.

### Why this works — the re-render cycle:

1. User clicks the "Large" radio button
2. `onChange` fires → `setPizzaSize("L")` is called
3. React sees state changed → calls `Order()` again (re-render)
4. Inside the function body, `pizzaSize` is now `"L"`
5. `price = intl.format(selectedPizza.sizes["L"])` — automatically uses the new size
6. React updates the DOM with the new price

No `useEffect` needed. No extra `useState` for price. The value is just **computed fresh** each render.

### The bug we fixed:

```jsx
// ❌ BEFORE — hardcoded to "M", ignores the pizzaSize state entirely
price = selectedPizza.sizes["M"];

// ✅ AFTER — derives the price from the actual selected size
price = intl.format(selectedPizza.sizes[pizzaSize]);
```

The hardcoded version broke the connection between state and UI. Even though `pizzaSize` updated correctly when the user clicked a radio button, the price never changed because it wasn't reading from `pizzaSize`.

### When to derive vs. when to store in state:

- **Derive it** if you can compute it from existing state/props. Examples: filtered lists, formatted values, totals, selected items.
- **Store it in state** if the value comes from **outside** React (user input, API response, timer) or can't be computed from other state.

**Rule of thumb:** If you can write `const x = someExpression(existingState)`, then `x` is derived and should **not** be in `useState`. Unnecessary state means unnecessary re-renders and more places for bugs to hide.

## Choosing the Right `useEffect` Dependencies

The dependency array tells React: **"re-run this effect when these values change."** Getting it wrong causes bugs that range from subtle to catastrophic.

### First principle: match dependencies to what the effect actually uses

Ask yourself: **"If this value changed, would the effect need to do something different?"**

- If **yes** → include it in the dependency array.
- If **no** → don't include it.

### Example — fetching pizza types:

```jsx
// ❌ BEFORE — pizzaSize in dependency array
useEffect(() => {
    fetchPizzaTypes();
}, [pizzaSize]);

// ✅ AFTER — empty array, fetch once on mount
useEffect(() => {
    fetchPizzaTypes();
}, []);
```

**Why `pizzaSize` was wrong:** The function `fetchPizzaTypes()` fetches the menu from `/api/pizzas`. The menu is the same whether the user picked Small, Medium, or Large — size has nothing to do with what pizzas exist. So `pizzaSize` is not a real dependency of this effect.

### What went wrong with `[pizzaSize]`:

1. User clicks "Large" radio button → `pizzaSize` changes to `"L"`
2. React sees a dependency changed → re-runs the effect
3. `fetchPizzaTypes()` fires → fetches the **same** pizza list from the API (wasted network request)
4. `setPizzaType(pizzaJson[0].id)` runs → **resets the selected pizza back to the first one**
5. User's pizza selection is lost — confusing UX bug

This is a cascade of problems from one wrong dependency. The API call is wasteful, and the state reset is a real bug the user would notice.

### Mental model for choosing dependencies:

| Scenario | Dependency array | Why |
|---|---|---|
| Fetch data once on mount | `[]` | Data doesn't depend on any state — load it once |
| Re-fetch when a specific filter changes | `[filter]` | New filter = new data needed |
| Re-fetch when the user ID changes | `[userId]` | Different user = different data |
| Log every render (debugging) | omit entirely | Want it to run every time |

### The key question to always ask:

> "Does `fetchPizzaTypes()` **behave differently** when `pizzaSize` changes?"

No — it fetches the same endpoint, gets the same data, sets the same state. So `pizzaSize` has no business being in that dependency array.

## Custom Hooks

A **custom hook** is just a regular JavaScript function that calls other hooks. It lets you **extract reusable logic** out of a component so multiple components can share the same behavior without duplicating code.

### The naming convention

Custom hooks **must** start with `use` — e.g., `usePizzaOfTheDay`, `useAuth`, `useFetch`. This isn't just a convention — React's linter uses the `use` prefix to enforce the Rules of Hooks inside your custom hook.

### Example — `usePizzaOfTheDay`:

```jsx
// usePizzaOfTheDay.jsx
import { useState, useEffect } from "react";

export const usePizzaOfTheDay = () => {
    const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);

    useEffect(() => {
        async function fetchPizzaOfTheDay() {
            const response = await fetch("/api/pizza-of-the-day");
            const data = await response.json();
            setPizzaOfTheDay(data);
        }
        fetchPizzaOfTheDay();
    }, []);

    return pizzaOfTheDay;
};
```

The component that uses it becomes very clean:

```jsx
// PizzaOfTheDay.jsx
import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

const PizzaOfTheDay = () => {
    const pizzaOfTheDay = usePizzaOfTheDay();

    if (!pizzaOfTheDay) return <div>Loading...</div>;

    return <h2>{pizzaOfTheDay.name}</h2>;
};
```

### Why we need `useState` and `useEffect` here — from first principles

Let's think about what happens if we **don't** use these hooks:

#### Why not just fetch directly?

```jsx
// ❌ DON'T DO THIS
const PizzaOfTheDay = () => {
    const response = fetch("/api/pizza-of-the-day"); // returns a Promise, not data
    const data = response.json(); // still a Promise

    return <h2>{data.name}</h2>; // undefined — crash
};
```

**Problem 1:** `fetch()` is **asynchronous** — it returns a Promise, not the actual data. You can't use `await` directly in a component body because components are synchronous functions that must return JSX immediately.

**Problem 2:** Even if you could somehow wait for it, React would call this function on **every re-render**, firing a new network request each time. If a parent re-renders, this component re-renders, and boom — another API call.

#### Why `useState`?

We need somewhere to **store the fetched data** so it survives across re-renders. Local variables (`let data = null`) get wiped out every time React calls the function again. `useState` gives you a value that **persists** between renders and a setter that **triggers a re-render** when updated.

```jsx
const [pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
// Render 1: pizzaOfTheDay = null (show "Loading...")
// Render 2: pizzaOfTheDay = { name: "Margherita", ... } (show the pizza)
```

Without `useState`, the component would have no way to remember the data after it's fetched.

#### Why `useEffect`?

We need a way to say **"run this code once after the component first renders, not during rendering."** That's exactly what `useEffect` with an empty dependency array does.

- **"After rendering"** — because we don't want to block the UI while waiting for the API. Show "Loading..." immediately, then update when data arrives.
- **"Once"** — because the pizza of the day doesn't change between re-renders. The empty `[]` dependency array ensures we fetch only on mount.
- **"Not during rendering"** — fetching data is a **side effect** (it reaches outside the component to talk to a server). React's rendering phase should be pure — just compute JSX from props and state. Side effects go in `useEffect`.

#### The full flow:

1. React calls `usePizzaOfTheDay()` → `useState(null)` returns `null` → component renders "Loading..."
2. After the DOM updates, `useEffect` fires → starts the `fetch()` call
3. API responds → `setPizzaOfTheDay(data)` updates state
4. React re-renders the component → `useState` now returns the fetched data → component shows the pizza
5. `useEffect` does **not** fire again (empty `[]` — no dependencies changed)

### Hooks must be called in the same order

This rule applies to custom hooks too. All hooks inside a custom hook must be called at the top level, not inside conditions or loops:

```jsx
// ❌ BAD — hook inside a condition
export const usePizzaOfTheDay = () => {
    const isWeekend = new Date().getDay() === 0;

    if (isWeekend) {
        const [pizza, setPizza] = useState(null); // breaks Rules of Hooks
    }
    // ...
};

// ✅ GOOD — hooks at the top, use state conditionally
export const usePizzaOfTheDay = () => {
    const [pizza, setPizza] = useState(null);
    const isWeekend = new Date().getDay() === 0;

    useEffect(() => {
        if (!isWeekend) fetchPizza(); // condition inside the effect, not wrapping the hook
    }, []);

    return pizza;
};
```

### Why custom hooks matter

- **Reuse** — if another component needs the pizza of the day, it just calls `usePizzaOfTheDay()`. No copy-pasting fetch logic.
- **Separation of concerns** — the component focuses on **what to render**, the hook focuses on **how to get the data**.
- **Testability** — you can test the hook's logic independently from the component's UI.
- **They're just functions** — no magic. A custom hook is a function that calls other hooks and returns values. That's it.

## StrictMode

`StrictMode` is a React development tool that helps you find bugs early. It doesn't render any visible UI — it just activates extra checks and warnings for the components inside it.

```jsx
import { StrictMode } from "react";

const App = () => {
    return (
        <StrictMode>
            <div>
                <h1>Padre Gino's</h1>
                <Order />
                <PizzaOfTheDay />
            </div>
        </StrictMode>
    );
};
```

### What it does:

- **Double-invokes** your component functions, effects, and state updaters during development to help you spot impure renders and side effects that shouldn't be there.
- Warns about **deprecated APIs** (like old lifecycle methods in class components).
- **No effect in production** — `StrictMode` checks are completely stripped out of production builds, so there's zero performance cost.

### Why the double rendering matters:

If your component fetches data or logs something inside the render body (not in `useEffect`), StrictMode will make it obvious by running it twice. This helps catch accidental side effects during rendering.

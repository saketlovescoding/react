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

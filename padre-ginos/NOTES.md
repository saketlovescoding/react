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
- ESLint uses the **flat config** format (`eslint.config.mjs`):
  ```js
  import js from "@eslint/js";
  import prettier from "eslint-config-prettier";
  import globals from "globals";

  export default [
      js.configs.recommended,  // sensible default rules
      prettier,                // disable formatting rules that clash with Prettier
      {
          files: ["**/*.js", "**/*.jsx"],
          languageOptions: {
              globals: { ...globals.browser, ...globals.node },
              parserOptions: { ecmaFeatures: { jsx: true } },
          },
      },
  ];
  ```
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
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";

  export default defineConfig({
      plugins: [react()],
  });
  ```

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
- JSX uses `className` instead of `class` (since `class` is a reserved word in JavaScript):
  ```jsx
  <div className="pizza">
  ```
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

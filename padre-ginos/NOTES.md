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

## React vs MVC

When React was created, the **MVC (Model-View-Controller)** pattern was dominant — logic, data, and presentation were kept in separate files/layers. React took a different approach: it **co-locates everything related to a component** (markup, logic, and eventually styling) in one place. The idea is that a component owns its entire UI concern, making it easier to reason about and maintain.

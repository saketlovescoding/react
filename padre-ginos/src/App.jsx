import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Order from "./Order";
import PizzaOfTheDay from "./PizzaOfTheDay";
// App is a component here

const App = () => {
    return (
        <StrictMode>
            <div>
                <h1>Padre Gino's - Order Now</h1>
                <Order />
                <PizzaOfTheDay />
            </div>
        </StrictMode>
    );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

// We can consider App as an component and .createElement
// makes an instance of the component.

// Component can be taken as a class

// There are two types of components, functional and class, this
// is functional component

// First we're using document.getElementById to grab an existing div out of the HTML document.
// Then we take that element (which we called container) and pass that into ReactDOM.createRoot.
// This is how we signal to React where we want it to render our app.

// ReactDOM is the library that connects React with the browser's DOM
// It takes the UI description from React and renders it into actual HTML elements in the browser.

// When react was born, MVC was very common. But React took everything and put it at the same place

// When we use curly braces to import something, it means we're not importing everything,
// When we dont use curly braces, it means we are imporitng everything at once

// Vite is doing the job of connecting our import of React to the actual code where we have used React.createElement.
// Default Imports -> Imports entire library
// Named Imports -> Imports specific functions

// COMMENTS FOR PACKAGE.JSON
//dev will start the development server, typically on http://localhost:5173/.
// build will prepare static files to be deployed (to somewhere like GitHub Pages, Vercel, Netlify, AWS S3, etc.)
// preview lets you preview your production build locally.

// Capitalized names are used for components, because they are treated as custom HTML tags.
// We pass propersites just like we do for HTML tags.

// COMMENTS FOR ESLINT.CONFIG.MJS
// jsx-runtime is used to resolve errors related to React import requirements

// COMMENTS FOR RUNNING BACKEND SERVER.
// We have a basic api in the citr-v9-project in the react repo, we want to run the backend and frontend on the
// same port, so we don't have to worry about CORS.
// We are going to ue VITE to proxy our requests to the backend server.

// COMMENTS FOR VITE.CONFIG.JS
// We have used /api and /public as the base path for our backend server, so we need to proxy those requests to the backend server.
// A proxy is a middleman that forwards requests on your behalf. In our case, the Vite dev server
// acts as a proxy: when the browser makes a request to /api or /public, Vite intercepts it and
// forwards it to the backend at http://localhost:3000. This way, both frontend and backend appear
// to be on the same origin (same host and port), which avoids CORS (Cross-Origin Resource Sharing)
// issues that browsers enforce when the frontend and backend are on different ports.

// COMMENTS FOR ESLINT-PLUGIN-REACT
// We installed eslint-plugin-react to add React-specific linting rules.
// In eslint.config.mjs we use the flat config format:
//   - reactPlugin.configs.flat.recommended enables recommended React rules
//   - reactPlugin.configs.flat["jsx-runtime"] disables rules that require importing React
//     (not needed with the new JSX transform)
//   - settings.react.version = "detect" auto-detects the React version from package.json
//   - "react/prop-types": "off" disables prop-types checking (we're not using PropTypes)
//   - "react/no-unescaped-entities": "off" allows characters like ' and " in JSX text

// COMMENTS FOR FILE RENAME
// App.js was renamed to App.jsx so the file extension matches the JSX syntax we're using.
// index.html was updated to point to the new App.jsx path.

// See NOTES.md -> "How /public Works in This Project" for full explanation.

// react hooks are used to introduce interactivity and side effects in react components

// In the context of form handling, what is a common pattern for managing form state in React? Ans -> Using state variables to track form input value.
// See NOTES.md -> "Form State Management in React" for full explanation with example.

// Let's think about how React works: when you interact with the inputs, React detects that a DOM event happens.
// When that happens, React thinks something may have changed so it runs a re-render. Providing your render functions are fast, this is a very quick operation.
// It then diffs what's currently there and what its render pass came up with.
// It then updates the minimum amount of DOM necessary.

// Two way data binding is not free in React.
// Everywhere we hear use, it means we are using a hook,

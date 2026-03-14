const Pizza = (props) => {
    return React.createElement("div", {}, [
        React.createElement("h1", {}, props.name),
        React.createElement("p", {}, props.description),
    ]);
};

// App is a component here

const App = () => {
    return React.createElement("div", {}, [
        React.createElement("h1", {}, "Pixel Perfect Pizzas"),
        React.createElement(Pizza, {
            name: "Pepperoni Pizza",
            description: "Some Pepper",
        }),
        React.createElement(Pizza, {
            name: "The Havanaa Pizza",
            description: "hawaian toppings",
        }),
    ]);
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(React.createElement(App));

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

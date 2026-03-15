
// const Pizza = (props) => {
//     return React.createElement("div", {}, [
//         React.createElement("h1", {}, props.name),
//         React.createElement("p", {}, props.description),
//     ]);
// };

const Pizza = (props) => {
    return (
        <div className="pizza">
            <h1>{props.name}</h1>
            <p>{props.description}</p>
            <img src={props.image} alt={props.name} />
        </div>
    )
}

// html inside javascript is jsx

export default Pizza

// default Pizza means we can now import it in App.js without using curly braces.
// This is default import

// Named exports, we can export more than one componetns from one file

// In modern development we don't need to import react to write jsx, tools do it for us


// class cannot be used in jsx because class is reserved in js.
// all the tags have to have closing tag


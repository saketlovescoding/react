import { useEffect, useState, useContext } from "react";
import Cart from "../Cart";
import Pizza from "../Pizza";
import { CartContext } from "../contexts";

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function Order() {
    // const pizzatype = "Pepperoni";
    // const pizzaSize = "M";
    const [pizzaTypes, setPizzaTypes] = useState([]);
    const [pizzaType, setPizzaType] = useState("");
    const [pizzaSize, setPizzaSize] = useState("M");
    // peeperromoi amd M are the deafult values od

    const [cart, setCart] = useContext(CartContext)

    const [loading, setLoading] = useState(true);

    async function checkout() {
        setLoading(true);

        // we load to true, because we don't want edits to occur while checking out

        await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cart }),
        });

        // checking out, we set cart to empty
        setCart([]);
        setLoading(false);
    }

    // we have to pass parent to child the checkout. via the props

    let price, selectedPizza;
    if (!loading) {
        selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
        console.log(selectedPizza);
        // price = selectedPizza.price
        price = intl.format(selectedPizza.sizes[pizzaSize]);
        console.log(price);
    }

    async function fetchPizzaTypes() {
        const pizzaRes = await fetch("/api/pizzas");
        const pizzaJson = await pizzaRes.json();
        setPizzaTypes(pizzaJson);
        setPizzaType(pizzaJson[0].id);
        setLoading(false);
    }

    // We cannot directly do async function in useEffect — see NOTES.md -> "Why useEffect Cannot Be an Async Function"
    useEffect(() => {
        fetchPizzaTypes();
    }, []);

    return (
        <div className="order">
            <h2>Create Order</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setCart([
                        ...cart,
                        { pizza: selectedPizza, size: pizzaSize, price },
                    ]);
                }}
            >
                <div>
                    <div>
                        <label htmlFor="pizza-type">Pizza Type</label>
                        <select
                            onChange={(e) => setPizzaType(e.target.value)}
                            name="pizza-type"
                            value={pizzaType}
                        >
                            {pizzaTypes.map((pizza) => (
                                <option key={pizza.id} value={pizza.id}>
                                    {pizza.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pizza-size">Pizza Size</label>
                        <div>
                            <span>
                                <input
                                    onChange={(e) =>
                                        setPizzaSize(e.target.value)
                                    }
                                    type="radio"
                                    checked={pizzaSize === "S"}
                                    name="pizza-size"
                                    value="S"
                                    id="pizza-s"
                                />
                                <label htmlFor="pizza-s">Small</label>
                            </span>
                            <span>
                                <input
                                    onChange={(e) =>
                                        setPizzaSize(e.target.value)
                                    }
                                    type="radio"
                                    checked={pizzaSize === "M"}
                                    name="pizza-size"
                                    value="M"
                                    id="pizza-m"
                                />
                                <label htmlFor="pizza-m">Medium</label>
                            </span>
                            <span>
                                <input
                                    onChange={(e) =>
                                        setPizzaSize(e.target.value)
                                    }
                                    type="radio"
                                    checked={pizzaSize === "L"}
                                    name="pizza-size"
                                    value="L"
                                    id="pizza-l"
                                />
                                <label htmlFor="pizza-l">Large</label>
                            </span>
                        </div>
                    </div>
                    <button type="submit">Add to cart</button>
                </div>
                <div className="order-pizza">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <Pizza
                            name={selectedPizza.name}
                            description={selectedPizza.description}
                            image={selectedPizza.image}
                        />
                    )}
                    <p>{price}</p>
                </div>
            </form>
            {loading ? (
                <h2>LOADING...</h2>
            ) : (
                <Cart checkout={checkout} cart={cart} />
            )}
        </div>
    );
}

// (e) means an event that is triggered when the user interacts with the dom.
// We are using the onChange event to detect when the user changes the value of the select or radio inputs.
// When that happens, we update the state variables pizzaType and pizzaSize with the new values.
// This is how we manage form state in React.
// See NOTES.md -> "The Event Object" for full details on what the event object contains.

// Hooks cannot be inside loops, conditions or nested functions.
//  They have to be at the top level of the component.
// See NOTES.md -> "Why Hooks Must Be Called at the Top Level" for full explanation with examples.

// const pizzaHook = useState(Pepperoni);
// const pizzaType = pizzaHook[0]
// const setPizzaType = pizzaHook[1];
// So useState is a function that returns an array with two elements: the current state value and a function to update that value.

// Second parameter in useEffect is the dependency array — see NOTES.md -> "The useEffect Dependency Array"

// Q. How can a child component affect its parent's state in React?
// by calling a function passed down from the parent as a prop

// Q. What is a key advantage of React's component encapsulation?
// Easir debugging by localising the potential issues,

// [CLAUDE explaint the above 2 questions using examle in detail in notes.md]

// Use useContext with a lot of care.
// useContext is like putting data into the portal and then usng that data somewhere else in the app

// prop drilling can get annoting if it is lot 
// unless we are using context/state in multiple places we should  use state

// but there are app level states which affect a lot of thing
// like when a user logins the app.
// so we can say taht there is an app level statee from where everyone can use that data



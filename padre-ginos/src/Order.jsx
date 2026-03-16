import { useEffect, useState } from "react";
import Pizza from "./Pizza";

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function Order() {
    // const pizzatype = "Pepperoni";
    // const pizzaSize = "M";
    const [pizzaTypes, setPizzaTypes] = useState([]);
    const [pizzaType, setPizzaType] = useState("Pepperoni");
    const [pizzaSize, setPizzaSize] = useState("M");
    // peeperromoi amd M are the deafult values od

    const [loading, setLoading] = useState(true);

    let price, selectedPizza;
    if (!loading) {
        selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    }

    async function fetchPizzaTypes() {
        const pizzaRes = await fetch("/api/pizzas");
        const pizzaJson = await pizzaRes.json();
        setPizzaTypes(pizzaJson);
        setLoading(false);
    }

    // We cannot directly do async function in useEffect — see NOTES.md -> "Why useEffect Cannot Be an Async Function"
    useEffect(() => {
        fetchPizzaTypes();
    }, []);

    return (
        <div className="order">
            <h2>Create Order</h2>
            <form action="">
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
                    <Pizza
                        name="Pepperoni"
                        description="A crowd favorite with tomato sauce, mozzarella cheese, and pepperoni slices."
                        image="/public/pizzas/pepperoni.webp"
                    />
                    <p>$13.99</p>
                </div>
            </form>
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


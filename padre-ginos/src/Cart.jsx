const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function Cart({ cart, checkout }) {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
        const current = cart[i];
        total += current.pizza.sizes[current.size];
    }

    return (
        <div className="cart">
            <h2>Cart</h2>
            <ul>
                {cart.map((item, index) => (
                    <li key={index}>
                        <span className="size">{item.size}</span>
                        <span className="type">{item.pizza.name}</span>
                        <span className="price">{item.price}</span>
                    </li>
                ))}
            </ul>
            <p>Total : {intl.format(total)}</p>
            <button onClick={checkout}>Checkout</button>
        </div>
    );
}

// Props and state are confusing with each other
// props are passed from parent to child
// Cart is immuatable, we cannot change cart.
// one way data flow, data never flows up in react.

// only way child can affect parent, we pass a function from parent to child
// a component can only modify its own state. these componets are self encapsulating


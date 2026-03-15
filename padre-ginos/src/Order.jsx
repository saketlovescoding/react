import Pizza from "./Pizza";

export default function Order() {
    const pizzatype = "Pepperoni";
    const pizzaSize = "M";
    return (
        <div className="order">
            <h2>Create Order</h2>
            <form action="">
                <div>
                    <div>
                        <label htmlFor="pizza-type">Pizza Type</label>
                        <select name="pizza-type" value={pizzatype}>
                            <option value="pepperoni">Pepperoni</option>
                            <option value="margherita">Margherita</option>
                            <option value="veggie-delight">
                                Veggie Delight
                            </option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="pizza-size">Pizza Size</label>
                        <div>
                            <span>
                                <input
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

import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

// we are creating a custom hook

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const PizzaOfTheDay = () => {
    const pizzaOfTheDay = usePizzaOfTheDay();

    if (!pizzaOfTheDay) {
        return <div>Loading...</div>;
    }

    return (
        <div className="pizza-of-the-day">
            <h2>Pizza Of the day</h2>
            <div>
                <div className="pizza-of-the-day-info">
                    <h3>{pizzaOfTheDay.name}</h3>
                    <p>{pizzaOfTheDay.description}</p>
                    <p className="pizza-of-the-day-price">
                        From: {intl.format(pizzaOfTheDay.sizes.S)}
                    </p>
                </div>
                <img
                    className="pizza-of-the-day-image"
                    src={pizzaOfTheDay.image}
                    alt={pizzaOfTheDay.name}
                />
            </div>
        </div>
    );
};

export default PizzaOfTheDay;

// See NOTES.md -> "Custom Hooks" for full explanation of custom hooks and why useState/useEffect are needed here.
// See NOTES.md -> "Custom Hooks" -> "Hooks must be called in the same order" for the hook ordering rule.

import { useState, useEffect } from "react";

export const usePizzaOfTheDay = () => {
    const[pizzaOfTheDay, setPizzaOfTheDay] = useState(null);

    useEffect(() => {
        async function fetchPizzaOfTheDay() {
            const response = await fetch("/api/pizza-of-the-day");
            const data = await response.json()
            setPizzaOfTheDay(data);
        }

        fetchPizzaOfTheDay();
    }, [])

    return pizzaOfTheDay
}

// Custom hooks are just functions which call other hooks.
// See NOTES.md -> "Custom Hooks" for full explanation of why useState and useEffect are needed here.



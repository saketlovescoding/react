import { useState, useEffect, useDebugValue } from "react";

export const usePizzaOfTheDay = () => {
    const[pizzaOfTheDay, setPizzaOfTheDay] = useState(null);
    // useDebugVlaue is used to debug things in the developer tool son the chrome
    useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.id} : ${pizzaOfTheDay.name}` : "loading...")

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


// For custom hooks we generlly use the "use" prefix for its name, so that 
// linting catches all the potential bugs


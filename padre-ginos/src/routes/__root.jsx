import {useState} from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import PizzaOfTheDay from "../PizzaOfTheDay"
import Header from "../Header"
import { CartContext } from '../contexts'

function RootComponent() {
    const cartHook = useState([]);
    return (
        <>
            <CartContext.Provider value={cartHook}>
                <div>
                    <Header />
                    <Outlet />
                    <PizzaOfTheDay />
                </div>
            </CartContext.Provider>
            <TanStackRouterDevtools />
        </>
    );
}

export const Route = createRootRoute({
    component: RootComponent,
});

// Q What does the <Outlet/> component do in TanStack Router?
// A -> Renders the matched route's component in parent layout

// We are going to lazy load the the Orders page that is why naming it order.lazy.jsx
// Q-> Use if the __root.jsx file/ 
// [CLAUDE explain the above statements in deails from first prinfcipas with code in the notes.md]

// [ Cluade update notes with new data in the code. Explain this tastack router thing in the notes. Explain from irst principles taking code examples and by telling all the steps done here. and lazy loading as well. basically everything new we deid here]
import {useState} from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import PizzaOfTheDay from "../PizzaOfTheDay"
import Header from "../Header"
import { CartContext } from '../contexts'

export const Route = createRootRoute({
    component: () => (
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
    ),
});

// Q What does the <Outlet/> component do in TanStack Router?
// A -> Renders the matched route's component in parent layout

// We are going to lazy load the the Orders page that is why naming it order.lazy.jsx
// Q-> Use if the __root.jsx file/ 
// [CLAUDE explain the above statements in deails from first prinfcipas with code in the notes.md]


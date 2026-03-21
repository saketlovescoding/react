import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
            "/public": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
    plugins: [TanStackRouterVite(), react()],
});

// By default, Vite looks for index.html in the root directory.
// itll crawl all the html, css and js files from there and create a project

// React is not a development tool, so we do not use -D to install it as a dev dependency

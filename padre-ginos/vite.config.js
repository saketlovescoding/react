import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
})

// By default, Vite looks for index.html in the root directory.
// itll crawl all the html, css and js files from there and create a project 

// React is not a development tool, so we do not use -D to install it as a dev dependency


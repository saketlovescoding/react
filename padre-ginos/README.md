# Padre Ginos

A simple React app that renders a pizza menu using React and ReactDOM via CDN (no build tools required).

## Prerequisites

- [Node.js](https://nodejs.org/) (for dev tooling like Prettier)
- A web browser

## Getting Started

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd padre-ginos
   ```

2. **Install dev dependencies**
   ```bash
   npm install
   ```

3. **Open in browser**

   Simply open `index.html` in your browser — no build step needed. You can do this by:
   - Double-clicking `index.html` in your file explorer, or
   - Using a local server like the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension

## Available Scripts

- `npm run format` — Format source files with Prettier

## Project Structure

```
padre-ginos/
├── index.html        # Entry point — loads React via CDN
├── src/
│   └── App.js        # React components (App, Pizza)
├── package.json
└── NOTES.md
```

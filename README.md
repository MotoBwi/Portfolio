# Bapan Portfolio (React + Vite)

React version of the portfolio. Same design and effects as the static `index.html`, split into components and hooks.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```
`dist/` is plain static files (base is `./`), so it can go on GitHub Pages, Nginx or S3.

## Structure
```
src/
  data.js                 all copy, projects, links (edit this first)
  App.jsx                 page shell + fixed visual layers
  components/
    Layer.jsx             <Layer> marks an element for the build engine; <Count>, <Chips>
    Nav / Hero / About / Flagships / Matrix / Contact / Footer
    StatusPill.jsx        bottom pill (agents, layers, Tour, speed, Replay)
  hooks/
    useBuildEngine.js     starts/stops the engine, exposes state + actions
    useScrollFx.js        red scroll rail, hero parallax, smooth anchors
  engine/engine.js        agent cursors, skeleton boxes, typing, sparkles, tour
  styles/global.css       all styling and design tokens
```

## How the effects work
- Anything wrapped in `<Layer>` is revealed by the engine as it scrolls into view (skeleton box, agent cursor, typing, sparkles).
- `<Layer type>` needs a plain string child, the engine types it out.
- Keep `className` static on layers: the engine adds a `built` class straight on the DOM node.
- Matrix cards stay mounted and use `hidden`, so filtering re-builds them.
- With `prefers-reduced-motion`, or if the engine fails, the page shows fully without effects.

## Common edits
- Email and links: `SITE` in `src/data.js`.
- Photo: `public/me.webp` (background-removed cutout, 4:5). Swap the file to change it; used in `components/Hero.jsx`.
- Auto tour on load: call `startTour()` at the end of `start()` in `engine/engine.js`.

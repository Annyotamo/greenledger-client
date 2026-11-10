# Watercolour landing

The public home page (`/`). The design file **`designs/watercolor-landing.html` is the source of truth**. This folder is its Next.js port.

| File | Edited how | What it is |
| --- | --- | --- |
| `WatercolorLanding.tsx` | by hand | Page markup as JSX. It also starts the effects after mount (Lenis smooth scroll, hero video, `run()`) and stops them on unmount. |
| `watercolor.css` | **generated** | The design's CSS. Every selector is scoped under `.wl`, so it can't affect the tenant app. |
| `runtime.js` | **generated** | The design's script: carousels, WebGL backgrounds, before/after diagrams, team pixel reveal, India map and so on. |
| `sandbox.ts` | by hand | Gives `runtime.js` stand-ins for `window`, `document`, timers and observers. Everything it starts is stopped on unmount. |
| `assets.ts` | by hand | Image imports, served as resized copies through Next's image optimiser. |
| `india.json` | data | India's outline for the map in Platform tab 04 (Natural Earth 1:110m via `world-atlas@2.0.2`). |

## Changing the landing

1. Edit `designs/watercolor-landing.html`, and check it by opening the file in a browser.
2. Run `pnpm port:landing`. This regenerates `watercolor.css` and `runtime.js`.
3. If you changed **markup** (HTML outside `<style>` and `<script>`), mirror it into `WatercolorLanding.tsx` by hand.
   - The port script fails if the script looks up an element id that the JSX doesn't have.
   - An image the script builds into markup needs an entry in `assets.ts`.
4. Run `pnpm dev` and check `/`.

Never edit `watercolor.css` or `runtime.js` directly: the next port overwrites them.
Changes the port applies on top of the design are listed and explained in `scripts/port-watercolor.mjs`. They cover asset paths, fonts, the India map data, CBAM background performance and the intro-loader fix.

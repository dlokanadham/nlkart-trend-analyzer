# nlkart-trend-analyzer — Analytics Dashboard

## Overview
Standalone HTML/JS/CSS dashboard that visualizes user behavior logs exported from the nlkart React app. No backend needed — runs entirely in the browser.

## Tech Stack
- Plain HTML + JavaScript + CSS (NO framework, NO build step, NO npm)
- Chart.js v4 via CDN for visualizations
- Opens directly in browser (file:// or served via any HTTP server)

## Files (only 4 files)
- `index.html` — Dashboard layout with sidebar navigation and 5 tabs
- `app.js` — All logic: import handlers, chart rendering, data processing (wrapped in IIFE)
- `styles.css` — Professional dashboard styling with sidebar layout
- `sample-data.js` — `generateSampleData()` function for demo purposes

## Do's and Don'ts
- NEVER add npm, webpack, or any build tools — this is intentionally plain HTML/JS/CSS
- NEVER use ES modules or import/export — all scripts loaded via script tags
- ALWAYS destroy chart instances before re-creating (prevents memory leaks)
- ALWAYS render charts lazily (only when tab is visible — Chart.js needs visible container for sizing)

## Conventions
- All code in `app.js` wrapped in IIFE `(function() { 'use strict'; ... })()`
- Chart instances tracked in `chartInstances` object, destroyed via `destroyChart(key)`
- DOM queries via `$` (querySelector) and `$$` (querySelectorAll) helpers
- Tab content rendered lazily via `renderedTabs` tracking object

## Dependency: nlkart (React App — Log Format)
This dashboard consumes logs exported from the nlkart React app's `logger.js`.

Expected JSON array format — each entry must have:
- `timestamp` (ISO string), `level` (flow/info/warn/error), `category` (navigation/product/cart/order/auth)
- `action` — must be one of: `page_view`, `product_view`, `product_list_view`, `add_to_cart`, `order_placed`, `search`
- `data` — object with fields like: `page` (/products, /cart, /checkout), `productId`, `name`, `category`, `total`
- `sessionId` — groups events into user sessions

If the nlkart React logger changes action names or data fields, this dashboard must be updated to match.

## Related Repos
- nlkart (React app — exports the logs this dashboard visualizes): `../nlkart`

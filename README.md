# nlkart-trend-analyzer - User Behavior Analytics Dashboard

A standalone HTML/JavaScript/CSS analytics dashboard that visualizes user behavior logs exported from the nlkart React app. Built with vanilla JS and Chart.js — no framework, no build step, just open in a browser.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Dashboard layout with 5 tabs |
| Vanilla JavaScript | All logic — no framework |
| CSS3 | Professional styling with grid, flexbox, responsive design |
| Chart.js 4 (CDN) | Line charts, doughnut charts, bar charts |

## Features

### Dashboard Tab
- **6 Metric Cards** — Total Sessions, Page Views, Unique Products Viewed, Cart Additions, Orders Placed, Errors
- **Activity Over Time** — Line chart showing logs per day
- **Actions by Category** — Doughnut chart of log distribution by category (auth, product, cart, navigation, order)

### Product Heatmap Tab
- **Category Heatmap** — Horizontal bar chart with gradient colors (click any category to drill down)
- **Drill-Down View** — Stacked bar chart showing Views / Add to Cart / Ordered per product in selected category
- **Conversion Funnel Table** — View→Cart% and Cart→Order% for each product with visual progress bars
- **Top 10 Products** — Horizontal bar chart of most viewed products
- **Product Funnel Overview** — Full table of all products with conversion metrics

### User Flow Tab
- **Conversion Funnel** — 6-step visualization with drop-off percentages:
  ```
  Home Page → Product List → Product Detail → Add to Cart → Checkout → Order Placed
  ```
- **Session Timeline** — Select any session to see chronological event timeline with color-coded dots (info=blue, flow=green, warn=orange, error=red)
- **Common Navigation Paths** — Top 8 three-page navigation sequences with frequency counts

### Log Viewer Tab
- **Filterable Table** — Filter by level, category, date range, text search
- **Color-Coded Rows** — Error (red), Warn (yellow), Info (white), Flow (green)
- **Pagination** — 50 entries per page with prev/next controls
- **Data Preview** — Hover over data column to see full JSON payload

### Import Tab (3 Methods)
1. **Load Sample Data** — Generates ~160 realistic log entries across 8 sessions, 7 days
2. **Upload File** — Drag & drop or click to select exported JSON file
3. **Paste JSON** — Paste JSON array directly and click "Parse & Load"

## Screenshots

### Dashboard
```
┌──────────────────────────────────────────────────┐
│  Sessions: 8  │  Page Views: 45  │  Products: 24 │
│  Cart Adds: 15│  Orders: 4       │  Errors: 3    │
├──────────────────────────────────────────────────┤
│  [Activity Over Time Line Chart]                  │
│  [Category Distribution Doughnut]                 │
└──────────────────────────────────────────────────┘
```

### Product Heatmap (Drill-Down)
```
┌──────────────────────────────────────────────────┐
│  Electronics  ████████████████████  12 views      │
│  Clothing     ██████████████       9 views        │
│  Books        ████████████         8 views        │  ← Click to drill down
│  Sports       ████████             6 views        │
│  Home&Kitchen ██████               5 views        │
├──────────────────────────────────────────────────┤
│  Products in Electronics:                         │
│  [Headphones] Views: 5  Cart: 3  Ordered: 2      │
│  [Keyboard]   Views: 4  Cart: 2  Ordered: 2      │
│  [Charger]    Views: 3  Cart: 0  Ordered: 0      │
└──────────────────────────────────────────────────┘
```

### Conversion Funnel
```
  Home Page          ████████████████████████  8 sessions
  Product List       ██████████████████████    8 sessions   0% drop
  Product Detail     ████████████████████      8 sessions   0% drop
  Add to Cart        ██████████████            6 sessions   25% drop
  Checkout           ████████                  4 sessions   33% drop
  Order Placed       ████████                  4 sessions   0% drop
```

## Project Structure

```
nlkart-trend-analyzer/
├── index.html          # Main HTML — sidebar, tabs, chart containers
├── app.js              # Core logic — imports, rendering, charts, filtering
├── styles.css          # Professional dashboard styling (responsive)
├── sample-data.js      # Generates ~160 realistic log entries
├── .gitignore          # Excludes .DS_Store, *.log
└── README.md
```

## Expected Log Format

The analyzer expects a **JSON array** of log entries:

```json
[
  {
    "timestamp": "2026-03-17T10:30:00.000Z",
    "level": "info",
    "category": "product",
    "action": "product_view",
    "data": {
      "productId": 1,
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price": 2499
    },
    "sessionId": "sess_abc123"
  }
]
```

### Required Fields

| Field | Type | Values |
|-------|------|--------|
| `timestamp` | ISO 8601 string | `"2026-03-17T10:30:00.000Z"` |
| `level` | string | `"info"`, `"warn"`, `"error"`, `"flow"` |
| `category` | string | `"auth"`, `"product"`, `"cart"`, `"order"`, `"navigation"`, `"network"` |
| `action` | string | See action names below |
| `sessionId` | string | Unique session identifier |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Auto-generated if missing |
| `data` | object | Action-specific payload (defaults to `{}`) |
| `userId` | string | User identifier |

### Action Names Used by Analyzer

| Action | Category | Data Fields | Used In |
|--------|----------|------------|---------|
| `page_view` | navigation | `{ page: "/", "/products", "/cart", "/checkout" }` | Dashboard, User Flow, Common Paths |
| `product_view` | product | `{ productId, name, category, price }` | Dashboard, Heatmap, Top Products |
| `product_list_view` | product | `{ category, count }` | User Flow funnel |
| `add_to_cart` | cart | `{ productId, name, price, quantity }` | Dashboard, Heatmap, User Flow |
| `order_placed` | order | `{ orderId, total, items }` | Dashboard, Heatmap, User Flow |
| `search` | product | `{ query }` | Log Viewer |
| `login_success` | auth | `{ userId, name }` | Log Viewer |
| `login_failed` | auth | `{ reason, email }` | Log Viewer |

## How to Use

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge)
- No server, no build step, no dependencies to install

### Step 1: Open the Dashboard
```
Open nlkart-trend-analyzer/index.html directly in your browser
```

### Step 2: Import Data (choose one method)

**Option A — Sample Data (quickest):**
1. Click "Load Sample Data" button
2. Generates ~160 log entries across 8 sessions

**Option B — Export from nlkart React App:**
1. Use the nlkart React app normally (browse, add to cart, place orders)
2. Click your username in the navbar → **Export Logs**
3. A JSON file downloads with all logged user actions
4. In the trend analyzer, drag & drop or upload the file

**Option C — Paste JSON:**
1. Paste a JSON array of log entries into the textarea
2. Click "Parse & Load"

### Step 3: Explore Tabs
- **Dashboard** — Overview metrics and charts
- **Product Heatmap** — Click categories to drill down into product-level data
- **User Flow** — See conversion funnel, browse session timelines, view common paths
- **Log Viewer** — Filter and search through raw log entries

## Sample Data Details

The `generateSampleData()` function creates realistic e-commerce behavior across:

### 8 User Sessions

| Session | User | Behavior | Outcome |
|---------|------|----------|---------|
| 0 | Rahul Sharma | Browse Electronics → Add 2 items → Checkout | Order placed (Rs.5,998) |
| 1 | Priya Patel | Browse Clothing → Add 2 items → View cart | Cart abandoned |
| 2 | Amit Kumar | Search "programming books" → Add 3 books → Checkout | Order placed (Rs.1,547) |
| 3 | Guest | Browse Electronics → Add item → Try login | Login failed (locked out) |
| 4 | Sneha Gupta | Browse Home & Sports → Add 2 items → Checkout | Order placed (Rs.1,998) |
| 5 | Vikram Singh | Search → Multi-category browsing → Remove item | Cart abandoned |
| 6 | Guest | Browse Clothing & Sports | Network errors encountered |
| 7 | Ananya Reddy | Search → Add 2 Electronics → Payment fails → Retry | Order placed (Rs.4,198) |

### 24 Products Across 5 Categories
- **Electronics** (6): Headphones, Charger, Keyboard, Speaker, Mouse, Smartwatch Band
- **Clothing** (5): T-Shirt, Jeans, Sweatshirt, Shirt, Track Pants
- **Books** (5): Clean Code, Pragmatic Programmer, Design Patterns, You Don't Know JS, Refactoring
- **Home & Kitchen** (4): Water Bottle, Frying Pan, Electric Kettle, Bedside Lamp
- **Sports** (4): Yoga Mat, Resistance Bands, Running Shoes, Cricket Bat

### Event Types Generated
- Navigation: `page_view` with path-style pages (`/`, `/products`, `/cart`, `/checkout`)
- Auth: `login_success`, `login_failed`, `account_locked_warning`
- Product: `product_view`, `product_list_view`, `search`
- Cart: `add_to_cart`, `cart_item_removed`
- Order: `order_placed`, `payment_failed`, `payment_retry`
- Network: `api_error`, `slow_response`

## Chart Types Used

| Visualization | Chart.js Type | Tab |
|--------------|---------------|-----|
| Activity Over Time | Line (filled) | Dashboard |
| Category Distribution | Doughnut | Dashboard |
| Category Heatmap | Horizontal Bar (clickable) | Product Heatmap |
| Product Drill-Down | Grouped Bar (Views/Cart/Ordered) | Product Heatmap |
| Top 10 Products | Horizontal Bar | Product Heatmap |
| Conversion Funnel | Custom HTML bars | User Flow |
| Session Timeline | Custom HTML timeline | User Flow |
| Common Paths | Custom HTML path boxes | User Flow |

## Lazy Rendering

Charts are rendered lazily — only when their tab becomes visible. This solves the Chart.js issue where canvases in `display: none` containers compute 0 dimensions. When you switch to a tab for the first time after loading data, charts render at that point.

## Responsive Design

- **Desktop** (>1024px): Full sidebar + 2-column chart grid
- **Tablet** (768-1024px): Full sidebar + 1-column charts
- **Mobile** (<768px): Collapsed 60px icon-only sidebar

## Related Repositories

| Repo | Description |
|------|-------------|
| [nlkart](https://github.com/dlokanadham/nlkart) | React frontend (exports logs for this analyzer) |
| [nlkart-api](https://github.com/dlokanadham/nlkart-api) | Flask REST API backend |
| [nlkart-database](https://github.com/dlokanadham/nlkart-database) | SQL Server DACPAC project |
| [nlkart-utils](https://github.com/dlokanadham/nlkart-utils) | Python utility scripts |

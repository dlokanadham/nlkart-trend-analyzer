---
name: compare-categories
description: Compare product categories and their product counts between the nlkart database and the trend-analyzer dashboard
user_invocable: true
---

# Compare Product Categories

Compare product categories and their product counts between the nlkart database and the trend-analyzer dashboard.

Follow these steps exactly in order:

## Step 1: Open the trend analyzer website
Use the Playwright MCP `browser_navigate` tool to open http://nlkart-trend-analyzer.com/

## Step 2: Load sample data
- Use Playwright MCP `browser_click` to click on the **Import** button/link in the left sidebar
- Wait for the import page to load
- Use Playwright MCP `browser_click` to click the **Load Sample Data** button
- Wait for the data to load successfully

## Step 3: View the Dashboard
- Use Playwright MCP `browser_click` to click on **Dashboard** in the left sidebar
- Wait for the charts to render
- Use Playwright MCP `browser_snapshot` to take a snapshot and show the user the analytics charts

## Step 4: View Product Heatmap
- Use Playwright MCP `browser_click` to click on **Product Heatmap** in the left sidebar
- Wait for the heatmap to render
- Use Playwright MCP `browser_snapshot` to take a snapshot to capture what the Product Heatmap chart is showing

## Step 5: Query the database
- Use the `nlkart-db` MCP to run this SQL query against the nlkart database:
```sql
SELECT c.CategoryName, COUNT(p.ProductId) AS ProductCount
FROM Categories c
LEFT JOIN Products p ON c.CategoryId = p.CategoryId
GROUP BY c.CategoryName
ORDER BY ProductCount DESC
```

## Step 6: Compare and report
- Compare the database query results with what the Product Heatmap is showing in the browser
- Present a clear comparison table showing:
  - Category name
  - Count from database
  - Count shown in the heatmap chart
- Highlight any differences or mismatches between the two data sources

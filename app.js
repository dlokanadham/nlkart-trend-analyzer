(function () {
  'use strict';

  // ───── State ─────
  let logs = [];
  let chartInstances = {};

  // ───── DOM refs ─────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ───── Tab navigation ─────
  const tabTitles = {
    dashboard: 'Dashboard',
    heatmap: 'Product Heatmap',
    userflow: 'User Flow',
    logviewer: 'Log Viewer',
    import: 'Import'
  };

  // Track which tabs have been rendered
  const renderedTabs = {};

  $$('.sidebar-nav button').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.sidebar-nav button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      $$('.tab-panel').forEach((p) => p.classList.remove('active'));
      $('#tab-' + tab).classList.add('active');
      $('#tabTitle').textContent = tabTitles[tab] || tab;
      // Lazy-render charts when tab becomes visible
      if (logs.length && !renderedTabs[tab]) {
        renderTab(tab);
      }
    });
  });

  // ───── Import handlers ─────
  $('#loadSampleBtn').addEventListener('click', () => {
    logs = generateSampleData();
    onDataLoaded('Sample data loaded: ' + logs.length + ' log entries.');
  });

  $('#fileUploadArea').addEventListener('click', () => $('#fileInput').click());
  $('#fileUploadArea').addEventListener('dragover', (e) => { e.preventDefault(); });
  $('#fileUploadArea').addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  });
  $('#fileInput').addEventListener('change', (e) => {
    if (e.target.files[0]) readFile(e.target.files[0]);
  });

  function readFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('JSON must be an array');
        logs = data;
        onDataLoaded('File loaded: ' + logs.length + ' log entries.');
      } catch (err) {
        showImportResult('Error parsing file: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  }

  $('#parsePasteBtn').addEventListener('click', () => {
    const text = $('#jsonPasteArea').value.trim();
    if (!text) return showImportResult('Please paste JSON data first.', true);
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error('JSON must be an array');
      logs = data;
      onDataLoaded('Parsed ' + logs.length + ' log entries from pasted JSON.');
    } catch (err) {
      showImportResult('Error parsing JSON: ' + err.message, true);
    }
  });

  function showImportResult(msg, isError) {
    const el = $('#importResult');
    el.textContent = msg;
    el.className = 'import-result ' + (isError ? 'error' : 'success');
  }

  function onDataLoaded(msg) {
    showImportResult(msg, false);
    $('#sidebarLogCount').textContent = logs.length;
    $('#statusText').textContent = logs.length + ' logs loaded';
    $('#statusText').classList.add('loaded');
    renderAll();
    // Switch to dashboard
    $$('.sidebar-nav button')[0].click();
  }

  // ───── Render everything ─────
  function renderTab(tab) {
    // Show content, hide no-data for this tab
    const noData = $('#' + tab + 'NoData');
    const content = $('#' + tab + 'Content');
    if (noData) noData.style.display = 'none';
    if (content) content.style.display = 'block';

    switch (tab) {
      case 'dashboard': renderDashboard(); break;
      case 'heatmap': renderHeatmap(); break;
      case 'userflow': renderUserFlow(); break;
      case 'logviewer': renderLogViewer(); break;
    }
    renderedTabs[tab] = true;
  }

  function renderAll() {
    if (!logs.length) return;
    // Reset rendered state so tabs re-render with new data
    Object.keys(renderedTabs).forEach((k) => delete renderedTabs[k]);
    // Only render the currently visible tab (dashboard on data load)
    renderTab('dashboard');
    // Hide no-data messages for all tabs (content shown on tab switch)
    ['heatmap', 'userflow', 'logviewer'].forEach((id) => {
      const noData = $('#' + id + 'NoData');
      const content = $('#' + id + 'Content');
      if (noData) noData.style.display = 'none';
      if (content) content.style.display = 'block';
    });
  }

  // ───── Helpers ─────
  function destroyChart(key) {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
      delete chartInstances[key];
    }
  }

  function getUniqueValues(arr, key) {
    return [...new Set(arr.map((l) => l[key]).filter(Boolean))];
  }

  function countBy(arr, fn) {
    const map = {};
    arr.forEach((item) => {
      const key = fn(item);
      if (key != null) map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function formatShortTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ───── Dashboard ─────
  function renderDashboard() {
    // Metrics
    const sessions = new Set(logs.map((l) => l.sessionId)).size;
    const pageViews = logs.filter((l) => l.action === 'page_view').length;
    const productViews = logs.filter((l) => l.action === 'product_view');
    const uniqueProducts = new Set(productViews.map((l) => l.data && l.data.productId)).size;
    const cartAdds = logs.filter((l) => l.action === 'add_to_cart').length;
    const orders = logs.filter((l) => l.action === 'order_placed').length;
    const errors = logs.filter((l) => l.level === 'error').length;

    const metricsData = [
      { label: 'Total Sessions', value: sessions, color: 'blue' },
      { label: 'Page Views', value: pageViews, color: 'teal' },
      { label: 'Unique Products Viewed', value: uniqueProducts, color: 'purple' },
      { label: 'Cart Additions', value: cartAdds, color: 'orange' },
      { label: 'Orders Placed', value: orders, color: 'green' },
      { label: 'Errors', value: errors, color: 'red' }
    ];

    $('#metricsGrid').innerHTML = metricsData
      .map(
        (m) => `
      <div class="metric-card">
        <div class="label">${m.label}</div>
        <div class="value ${m.color}">${m.value}</div>
      </div>`
      )
      .join('');

    // Activity over time chart
    renderActivityChart();
    // Category pie chart
    renderCategoryPie();
  }

  function renderActivityChart() {
    destroyChart('activity');

    // Group by day
    const dayMap = {};
    logs.forEach((l) => {
      const day = new Date(l.timestamp).toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    });

    const sortedDays = Object.keys(dayMap).sort();
    const ctx = $('#activityChart').getContext('2d');
    chartInstances.activity = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDays,
        datasets: [
          {
            label: 'Logs per Day',
            data: sortedDays.map((d) => dayMap[d]),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52,152,219,0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#3498db'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  function renderCategoryPie() {
    destroyChart('categoryPie');

    const catMap = countBy(logs, (l) => l.category);
    const labels = Object.keys(catMap);
    const data = labels.map((k) => catMap[k]);
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

    const ctx = $('#categoryPieChart').getContext('2d');
    chartInstances.categoryPie = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length)
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  // ───── Product Heatmap ─────
  let heatmapData = {};

  function buildHeatmapData() {
    const productViews = logs.filter((l) => l.action === 'product_view' && l.data && l.data.category);
    const cartAdds = logs.filter((l) => l.action === 'add_to_cart' && l.data);
    const orderLogs = logs.filter((l) => l.action === 'order_placed' && l.data);

    // Build set of ordered product IDs (from sessions that have order_placed)
    const orderedSessions = new Set(orderLogs.map((l) => l.sessionId));
    const orderedProductIds = new Set();
    logs
      .filter((l) => l.action === 'add_to_cart' && orderedSessions.has(l.sessionId))
      .forEach((l) => {
        if (l.data && l.data.productId) orderedProductIds.add(String(l.data.productId));
      });

    // Category-level
    const categories = {};
    productViews.forEach((l) => {
      const cat = l.data.category;
      if (!categories[cat]) categories[cat] = { views: 0, products: {} };
      categories[cat].views++;
      const pid = l.data.productId;
      const pname = l.data.name || pid;
      if (!categories[cat].products[pid]) {
        categories[cat].products[pid] = { name: pname, views: 0, cartAdds: 0, ordered: 0 };
      }
      categories[cat].products[pid].views++;
    });

    cartAdds.forEach((l) => {
      const pid = l.data.productId;
      // find which category this product belongs to
      for (const cat of Object.keys(categories)) {
        if (categories[cat].products[pid]) {
          categories[cat].products[pid].cartAdds++;
          break;
        }
      }
    });

    // Mark ordered
    for (const cat of Object.keys(categories)) {
      for (const pid of Object.keys(categories[cat].products)) {
        if (orderedProductIds.has(String(pid))) {
          categories[cat].products[pid].ordered++;
        }
      }
    }

    heatmapData = categories;
  }

  function renderHeatmap() {
    buildHeatmapData();
    renderCategoryHeatmapChart();
    renderTopProductsChart();
    renderProductFunnelTable();
    $('#drilldownPanel').style.display = 'none';
  }

  function renderCategoryHeatmapChart() {
    destroyChart('categoryHeatmap');

    const cats = Object.keys(heatmapData).sort((a, b) => heatmapData[b].views - heatmapData[a].views);
    const views = cats.map((c) => heatmapData[c].views);

    // Color gradient based on view count
    const maxViews = Math.max(...views, 1);
    const colors = views.map((v) => {
      const ratio = v / maxViews;
      const r = Math.round(231 + (52 - 231) * ratio);
      const g = Math.round(76 + (152 - 76) * ratio);
      const b = Math.round(60 + (219 - 60) * ratio);
      return `rgb(${r},${g},${b})`;
    });

    const ctx = $('#categoryHeatmapChart').getContext('2d');
    chartInstances.categoryHeatmap = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cats,
        datasets: [
          {
            label: 'Product Views',
            data: views,
            backgroundColor: colors,
            borderRadius: 6,
            barThickness: 50
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            showDrilldown(cats[idx]);
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: () => 'Click to drill down'
            }
          }
        },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Views' } },
          y: { ticks: { font: { weight: 'bold', size: 13 } } }
        }
      }
    });
  }

  function showDrilldown(category) {
    const panel = $('#drilldownPanel');
    panel.style.display = 'block';
    $('#drilldownTitle').textContent = 'Products in ' + category;

    const products = heatmapData[category].products;
    const pids = Object.keys(products).sort((a, b) => products[b].views - products[a].views);
    const names = pids.map((p) => products[p].name);
    const views = pids.map((p) => products[p].views);
    const carts = pids.map((p) => products[p].cartAdds);
    const ordered = pids.map((p) => products[p].ordered);

    destroyChart('drilldown');
    const ctx = $('#drilldownChart').getContext('2d');
    chartInstances.drilldown = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [
          {
            label: 'Views',
            data: views,
            backgroundColor: '#3498db',
            borderRadius: 4
          },
          {
            label: 'Add to Cart',
            data: carts,
            backgroundColor: '#e67e22',
            borderRadius: 4
          },
          {
            label: 'Ordered',
            data: ordered,
            backgroundColor: '#27ae60',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });

    // Funnel table
    const tbody = $('#drilldownFunnelTable tbody');
    tbody.innerHTML = pids
      .map((pid) => {
        const p = products[pid];
        const viewToCart = p.views > 0 ? ((p.cartAdds / p.views) * 100).toFixed(1) : '0.0';
        const cartToOrder = p.cartAdds > 0 ? ((p.ordered / p.cartAdds) * 100).toFixed(1) : '0.0';
        return `<tr>
          <td>${p.name}</td>
          <td>${p.views}</td>
          <td>${p.cartAdds}</td>
          <td>${p.ordered}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="conversion-bar"><div class="fill" style="width:${viewToCart}%;background:#e67e22;"></div></div>
              <span>${viewToCart}%</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="conversion-bar"><div class="fill" style="width:${cartToOrder}%;background:#27ae60;"></div></div>
              <span>${cartToOrder}%</span>
            </div>
          </td>
        </tr>`;
      })
      .join('');

    panel.scrollIntoView({ behavior: 'smooth' });
  }

  $('#drilldownBack').addEventListener('click', () => {
    $('#drilldownPanel').style.display = 'none';
  });

  function renderTopProductsChart() {
    destroyChart('topProducts');

    const allProducts = {};
    logs
      .filter((l) => l.action === 'product_view' && l.data && l.data.productId)
      .forEach((l) => {
        const pid = l.data.productId;
        if (!allProducts[pid]) allProducts[pid] = { name: l.data.name || pid, views: 0 };
        allProducts[pid].views++;
      });

    const sorted = Object.entries(allProducts)
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 10);

    const labels = sorted.map((s) => s[1].name);
    const data = sorted.map((s) => s[1].views);

    const ctx = $('#topProductsChart').getContext('2d');
    chartInstances.topProducts = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Views',
            data: data,
            backgroundColor: '#9b59b6',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  function renderProductFunnelTable() {
    const allProducts = {};
    const orderedSessions = new Set(
      logs.filter((l) => l.action === 'order_placed').map((l) => l.sessionId)
    );

    logs
      .filter((l) => l.action === 'product_view' && l.data && l.data.productId)
      .forEach((l) => {
        const pid = l.data.productId;
        if (!allProducts[pid])
          allProducts[pid] = { name: l.data.name || pid, views: 0, cartAdds: 0, ordered: 0 };
        allProducts[pid].views++;
      });

    logs
      .filter((l) => l.action === 'add_to_cart' && l.data && l.data.productId)
      .forEach((l) => {
        const pid = l.data.productId;
        if (allProducts[pid]) {
          allProducts[pid].cartAdds++;
          if (orderedSessions.has(l.sessionId)) allProducts[pid].ordered++;
        }
      });

    const sorted = Object.entries(allProducts).sort((a, b) => b[1].views - a[1].views);

    const tbody = $('#productFunnelTable tbody');
    tbody.innerHTML = sorted
      .map(([pid, p]) => {
        const viewToCart = p.views > 0 ? ((p.cartAdds / p.views) * 100).toFixed(1) : '0.0';
        const cartToOrder = p.cartAdds > 0 ? ((p.ordered / p.cartAdds) * 100).toFixed(1) : '0.0';
        return `<tr>
          <td>${p.name}</td>
          <td>${p.views}</td>
          <td>${p.cartAdds}</td>
          <td>${p.ordered}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="conversion-bar"><div class="fill" style="width:${viewToCart}%;background:#e67e22;"></div></div>
              <span>${viewToCart}%</span>
            </div>
          </td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="conversion-bar"><div class="fill" style="width:${cartToOrder}%;background:#27ae60;"></div></div>
              <span>${cartToOrder}%</span>
            </div>
          </td>
        </tr>`;
      })
      .join('');
  }

  // ───── User Flow ─────
  function renderUserFlow() {
    renderFunnel();
    renderSessionTimeline();
    renderCommonPaths();
  }

  function renderFunnel() {
    const sessionMap = {};
    logs.forEach((l) => {
      if (!sessionMap[l.sessionId]) sessionMap[l.sessionId] = [];
      sessionMap[l.sessionId].push(l);
    });

    let homeCount = 0;
    let listCount = 0;
    let detailCount = 0;
    let cartCount = 0;
    let checkoutCount = 0;
    let orderCount = 0;

    for (const sid of Object.keys(sessionMap)) {
      const sLogs = sessionMap[sid];
      const actions = sLogs.map((l) => l.action);
      const pages = sLogs.filter((l) => l.action === 'page_view').map((l) => l.data && l.data.page);

      if (pages.some((p) => p === '/')) homeCount++;
      if (sLogs.some((l) => l.action === 'product_list_view')) listCount++;
      if (sLogs.some((l) => l.action === 'product_view')) detailCount++;
      if (sLogs.some((l) => l.action === 'add_to_cart')) cartCount++;
      if (pages.some((p) => p === '/checkout')) checkoutCount++;
      if (sLogs.some((l) => l.action === 'order_placed')) orderCount++;
    }

    const steps = [
      { label: 'Home Page', count: homeCount, color: '#3498db' },
      { label: 'Product List', count: listCount, color: '#2980b9' },
      { label: 'Product Detail', count: detailCount, color: '#9b59b6' },
      { label: 'Add to Cart', count: cartCount, color: '#e67e22' },
      { label: 'Checkout', count: checkoutCount, color: '#f39c12' },
      { label: 'Order Placed', count: orderCount, color: '#27ae60' }
    ];

    const maxCount = Math.max(steps[0].count, 1);

    $('#funnelSteps').innerHTML = steps
      .map((step, i) => {
        const widthPct = Math.max((step.count / maxCount) * 100, 15);
        const dropoff =
          i > 0 && steps[i - 1].count > 0
            ? (((steps[i - 1].count - step.count) / steps[i - 1].count) * 100).toFixed(1)
            : null;
        return `
        <div class="funnel-step">
          <div class="funnel-bar-wrapper">
            <div class="funnel-bar" style="width:${widthPct}%;background:${step.color};">
              ${step.label}
            </div>
          </div>
          <div class="funnel-stats">
            <span class="count">${step.count} sessions</span>
            ${dropoff !== null ? `<br><span class="dropoff">${dropoff}% drop-off</span>` : ''}
          </div>
        </div>`;
      })
      .join('');
  }

  function renderSessionTimeline() {
    const sessionIds = getUniqueValues(logs, 'sessionId').sort();
    const select = $('#sessionSelect');
    select.innerHTML = sessionIds.map((s) => `<option value="${s}">${s}</option>`).join('');

    function showTimeline(sid) {
      const sLogs = logs.filter((l) => l.sessionId === sid).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      $('#sessionTimeline').innerHTML = sLogs
        .map(
          (l) => `
        <div class="timeline-item level-${l.level}">
          <div class="time">${formatTime(l.timestamp)}</div>
          <div class="action">${l.action}</div>
          <div class="details">${l.category} ${l.data ? '— ' + summarizeData(l.data) : ''}</div>
        </div>`
        )
        .join('');
    }

    select.addEventListener('change', () => showTimeline(select.value));
    if (sessionIds.length) showTimeline(sessionIds[0]);
  }

  function summarizeData(data) {
    if (!data) return '';
    const parts = [];
    if (data.page) parts.push('page: ' + data.page);
    if (data.name) parts.push(data.name);
    if (data.category) parts.push('cat: ' + data.category);
    if (data.query) parts.push('query: "' + data.query + '"');
    if (data.orderId) parts.push('order: ' + data.orderId);
    if (data.total) parts.push('total: Rs.' + data.total);
    if (data.reason) parts.push(data.reason);
    if (data.email) parts.push(data.email);
    if (data.endpoint) parts.push(data.endpoint);
    if (parts.length === 0) return JSON.stringify(data).slice(0, 80);
    return parts.join(', ');
  }

  function renderCommonPaths() {
    const sessionMap = {};
    logs
      .filter((l) => l.action === 'page_view' && l.data && l.data.page)
      .forEach((l) => {
        if (!sessionMap[l.sessionId]) sessionMap[l.sessionId] = [];
        sessionMap[l.sessionId].push(l.data.page);
      });

    // Extract 3-step subsequences
    const pathCounts = {};
    for (const sid of Object.keys(sessionMap)) {
      const pages = sessionMap[sid];
      for (let i = 0; i <= pages.length - 3; i++) {
        const path = pages.slice(i, i + 3).join(' -> ');
        pathCounts[path] = (pathCounts[path] || 0) + 1;
      }
    }

    const sorted = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    $('#commonPaths').innerHTML = sorted
      .map(([path, count]) => {
        const steps = path.split(' -> ');
        const stepsHtml = steps
          .map((s) => `<span class="path-step">${s}</span>`)
          .join('<span class="path-arrow">&#8594;</span>');
        return `<div class="path-item">${stepsHtml}<span class="path-count">${count}x</span></div>`;
      })
      .join('');
  }

  // ───── Log Viewer ─────
  let logPage = 1;
  const PAGE_SIZE = 50;
  let filteredLogs = [];

  function renderLogViewer() {
    // Populate category filter
    const categories = getUniqueValues(logs, 'category').sort();
    const catSelect = $('#filterCategory');
    catSelect.innerHTML =
      '<option value="">All Categories</option>' +
      categories.map((c) => `<option value="${c}">${c}</option>`).join('');

    // Bind filter events
    ['filterLevel', 'filterCategory', 'filterDateFrom', 'filterDateTo', 'filterSearch'].forEach((id) => {
      const el = $('#' + id);
      el.removeEventListener('input', applyLogFilters);
      el.removeEventListener('change', applyLogFilters);
      el.addEventListener('input', applyLogFilters);
      el.addEventListener('change', applyLogFilters);
    });

    applyLogFilters();
  }

  function applyLogFilters() {
    const level = $('#filterLevel').value;
    const category = $('#filterCategory').value;
    const dateFrom = $('#filterDateFrom').value;
    const dateTo = $('#filterDateTo').value;
    const search = $('#filterSearch').value.toLowerCase();

    filteredLogs = logs.filter((l) => {
      if (level && l.level !== level) return false;
      if (category && l.category !== category) return false;
      if (dateFrom) {
        const d = new Date(l.timestamp).toISOString().slice(0, 10);
        if (d < dateFrom) return false;
      }
      if (dateTo) {
        const d = new Date(l.timestamp).toISOString().slice(0, 10);
        if (d > dateTo) return false;
      }
      if (search) {
        const text = (l.action + ' ' + JSON.stringify(l.data)).toLowerCase();
        if (!text.includes(search)) return false;
      }
      return true;
    });

    logPage = 1;
    renderLogTable();
  }

  function renderLogTable() {
    const start = (logPage - 1) * PAGE_SIZE;
    const pageData = filteredLogs.slice(start, start + PAGE_SIZE);

    $('#logTableBody').innerHTML = pageData
      .map(
        (l) => `
      <tr class="level-${l.level}">
        <td>${formatTime(l.timestamp)}</td>
        <td><span class="level-badge ${l.level}">${l.level}</span></td>
        <td>${l.category || ''}</td>
        <td>${l.action || ''}</td>
        <td title="${escapeHtml(JSON.stringify(l.data || {}))}">${escapeHtml(summarizeData(l.data))}</td>
        <td>${l.sessionId || ''}</td>
      </tr>`
      )
      .join('');

    const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE) || 1;
    $('#logPagination').innerHTML = `
      <button id="logPrev" ${logPage <= 1 ? 'disabled' : ''}>Prev</button>
      <span class="page-info">Page ${logPage} of ${totalPages} (${filteredLogs.length} entries)</span>
      <button id="logNext" ${logPage >= totalPages ? 'disabled' : ''}>Next</button>
    `;

    const prevBtn = $('#logPrev');
    const nextBtn = $('#logNext');
    if (prevBtn)
      prevBtn.addEventListener('click', () => {
        if (logPage > 1) {
          logPage--;
          renderLogTable();
        }
      });
    if (nextBtn)
      nextBtn.addEventListener('click', () => {
        if (logPage < totalPages) {
          logPage++;
          renderLogTable();
        }
      });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();

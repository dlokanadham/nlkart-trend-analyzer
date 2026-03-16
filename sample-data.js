function generateSampleData() {
  const now = Date.now();
  const DAY = 86400000;
  const HOUR = 3600000;
  const MIN = 60000;

  const sessions = [
    'sess_a1b2c3', 'sess_d4e5f6', 'sess_g7h8i9',
    'sess_j0k1l2', 'sess_m3n4o5', 'sess_p6q7r8',
    'sess_s9t0u1', 'sess_v2w3x4'
  ];

  const users = [
    { id: 'user_101', name: 'Rahul Sharma' },
    { id: 'user_102', name: 'Priya Patel' },
    { id: 'user_103', name: 'Amit Kumar' },
    { id: 'user_104', name: 'Sneha Gupta' },
    { id: 'user_105', name: 'Vikram Singh' },
    { id: null, name: 'Guest' },
    { id: null, name: 'Guest' },
    { id: 'user_106', name: 'Ananya Reddy' }
  ];

  const products = {
    Electronics: [
      { id: 'prod_e1', name: 'Wireless Bluetooth Headphones', price: 2499 },
      { id: 'prod_e2', name: 'USB-C Fast Charger', price: 899 },
      { id: 'prod_e3', name: 'Mechanical Gaming Keyboard', price: 3499 },
      { id: 'prod_e4', name: 'Portable Bluetooth Speaker', price: 1999 },
      { id: 'prod_e5', name: 'Wireless Mouse', price: 699 },
      { id: 'prod_e6', name: 'Smartwatch Band', price: 4999 }
    ],
    Clothing: [
      { id: 'prod_c1', name: 'Cotton Casual T-Shirt', price: 599 },
      { id: 'prod_c2', name: 'Denim Slim Fit Jeans', price: 1299 },
      { id: 'prod_c3', name: 'Hooded Sweatshirt', price: 999 },
      { id: 'prod_c4', name: 'Formal Cotton Shirt', price: 1499 },
      { id: 'prod_c5', name: 'Track Pants', price: 799 }
    ],
    Books: [
      { id: 'prod_b1', name: 'Clean Code', price: 499 },
      { id: 'prod_b2', name: 'The Pragmatic Programmer', price: 599 },
      { id: 'prod_b3', name: 'Design Patterns', price: 699 },
      { id: 'prod_b4', name: 'You Don\'t Know JS', price: 449 },
      { id: 'prod_b5', name: 'Refactoring', price: 549 }
    ],
    'Home & Kitchen': [
      { id: 'prod_h1', name: 'Stainless Steel Water Bottle', price: 399 },
      { id: 'prod_h2', name: 'Non-Stick Frying Pan', price: 899 },
      { id: 'prod_h3', name: 'Electric Kettle', price: 1299 },
      { id: 'prod_h4', name: 'Bedside Lamp', price: 749 }
    ],
    Sports: [
      { id: 'prod_s1', name: 'Yoga Mat', price: 699 },
      { id: 'prod_s2', name: 'Resistance Bands Set', price: 499 },
      { id: 'prod_s3', name: 'Running Shoes', price: 2999 },
      { id: 'prod_s4', name: 'Cricket Bat', price: 1999 }
    ]
  };

  const allProducts = [];
  for (const cat of Object.keys(products)) {
    for (const p of products[cat]) {
      allProducts.push({ ...p, category: cat });
    }
  }

  const logs = [];
  let logId = 1;

  function ts(base, offsetMinutes) {
    return new Date(base + offsetMinutes * MIN).toISOString();
  }

  function addLog(timestamp, level, category, action, data, sessionId) {
    logs.push({
      id: logId++,
      timestamp,
      level,
      category,
      action,
      data: data || {},
      sessionId
    });
  }

  // Session 0: Full purchase flow - Rahul
  let base = now - 6 * DAY - 3 * HOUR;
  let s = sessions[0];
  let u = users[0];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 2), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Electronics' }, s);
  addLog(ts(base, 3), 'info', 'product', 'product_list_view', { category: 'Electronics', count: 6 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 2499 }, s);
  addLog(ts(base, 6), 'flow', 'navigation', 'page_view', { page: '/product/prod_e1' }, s);
  addLog(ts(base, 8), 'info', 'product', 'product_view', { productId: 'prod_e3', name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 3499 }, s);
  addLog(ts(base, 9), 'flow', 'navigation', 'page_view', { page: '/product/prod_e3' }, s);
  addLog(ts(base, 11), 'info', 'cart', 'add_to_cart', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', price: 2499, quantity: 1 }, s);
  addLog(ts(base, 12), 'info', 'cart', 'add_to_cart', { productId: 'prod_e3', name: 'Mechanical Gaming Keyboard', price: 3499, quantity: 1 }, s);
  addLog(ts(base, 14), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 15), 'flow', 'navigation', 'page_view', { page: '/checkout' }, s);
  addLog(ts(base, 17), 'info', 'order', 'order_placed', { orderId: 'ord_001', total: 5998, items: 2 }, s);
  addLog(ts(base, 18), 'flow', 'navigation', 'page_view', { page: '/order-confirmation' }, s);

  // Session 1: Browsing clothing, cart abandon - Priya
  base = now - 5 * DAY - 7 * HOUR;
  s = sessions[1];
  u = users[1];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 3), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Clothing' }, s);
  addLog(ts(base, 4), 'info', 'product', 'product_list_view', { category: 'Clothing', count: 5 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_c1', name: 'Cotton Casual T-Shirt', category: 'Clothing', price: 599 }, s);
  addLog(ts(base, 6), 'flow', 'navigation', 'page_view', { page: '/product/prod_c1' }, s);
  addLog(ts(base, 7), 'info', 'product', 'product_view', { productId: 'prod_c2', name: 'Denim Slim Fit Jeans', category: 'Clothing', price: 1299 }, s);
  addLog(ts(base, 8), 'flow', 'navigation', 'page_view', { page: '/product/prod_c2' }, s);
  addLog(ts(base, 9), 'info', 'product', 'product_view', { productId: 'prod_c3', name: 'Hooded Sweatshirt', category: 'Clothing', price: 999 }, s);
  addLog(ts(base, 10), 'info', 'cart', 'add_to_cart', { productId: 'prod_c1', name: 'Cotton Casual T-Shirt', price: 599, quantity: 2 }, s);
  addLog(ts(base, 11), 'info', 'cart', 'add_to_cart', { productId: 'prod_c2', name: 'Denim Slim Fit Jeans', price: 1299, quantity: 1 }, s);
  addLog(ts(base, 12), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  // Abandons cart - no checkout

  // Session 2: Books lover, full purchase - Amit
  base = now - 5 * DAY - 1 * HOUR;
  s = sessions[2];
  u = users[2];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 2), 'info', 'product', 'search', { query: 'programming books' }, s);
  addLog(ts(base, 3), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Books' }, s);
  addLog(ts(base, 4), 'info', 'product', 'product_list_view', { category: 'Books', count: 5 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_b1', name: 'Clean Code', category: 'Books', price: 499 }, s);
  addLog(ts(base, 6), 'flow', 'navigation', 'page_view', { page: '/product/prod_b1' }, s);
  addLog(ts(base, 7), 'info', 'product', 'product_view', { productId: 'prod_b2', name: 'The Pragmatic Programmer', category: 'Books', price: 599 }, s);
  addLog(ts(base, 8), 'flow', 'navigation', 'page_view', { page: '/product/prod_b2' }, s);
  addLog(ts(base, 9), 'info', 'product', 'product_view', { productId: 'prod_b4', name: 'You Don\'t Know JS', category: 'Books', price: 449 }, s);
  addLog(ts(base, 10), 'info', 'cart', 'add_to_cart', { productId: 'prod_b1', name: 'Clean Code', price: 499, quantity: 1 }, s);
  addLog(ts(base, 11), 'info', 'cart', 'add_to_cart', { productId: 'prod_b2', name: 'The Pragmatic Programmer', price: 599, quantity: 1 }, s);
  addLog(ts(base, 12), 'info', 'cart', 'add_to_cart', { productId: 'prod_b4', name: 'You Don\'t Know JS', price: 449, quantity: 1 }, s);
  addLog(ts(base, 14), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 15), 'flow', 'navigation', 'page_view', { page: '/checkout' }, s);
  addLog(ts(base, 17), 'info', 'order', 'order_placed', { orderId: 'ord_002', total: 1547, items: 3 }, s);
  addLog(ts(base, 18), 'flow', 'navigation', 'page_view', { page: '/order-confirmation' }, s);

  // Session 3: Guest browsing, failed login - Guest
  base = now - 4 * DAY - 5 * HOUR;
  s = sessions[3];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 2), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Electronics' }, s);
  addLog(ts(base, 3), 'info', 'product', 'product_list_view', { category: 'Electronics', count: 6 }, s);
  addLog(ts(base, 4), 'info', 'product', 'product_view', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 2499 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_e4', name: 'Portable Bluetooth Speaker', category: 'Electronics', price: 1999 }, s);
  addLog(ts(base, 6), 'info', 'product', 'product_view', { productId: 'prod_e6', name: 'Smartwatch Band', category: 'Electronics', price: 4999 }, s);
  addLog(ts(base, 8), 'info', 'cart', 'add_to_cart', { productId: 'prod_e6', name: 'Smartwatch Band', price: 4999, quantity: 1 }, s);
  addLog(ts(base, 9), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 10), 'flow', 'navigation', 'page_view', { page: '/login' }, s);
  addLog(ts(base, 11), 'error', 'auth', 'login_failed', { reason: 'Invalid credentials', email: 'test@example.com' }, s);
  addLog(ts(base, 12), 'error', 'auth', 'login_failed', { reason: 'Invalid credentials', email: 'test@example.com' }, s);
  addLog(ts(base, 13), 'warn', 'auth', 'account_locked_warning', { attemptsRemaining: 1, email: 'test@example.com' }, s);
  // Gives up

  // Session 4: Sneha - Home & Kitchen + Sports, full purchase
  base = now - 3 * DAY - 2 * HOUR;
  s = sessions[4];
  u = users[3];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 2), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Home & Kitchen' }, s);
  addLog(ts(base, 3), 'info', 'product', 'product_list_view', { category: 'Home & Kitchen', count: 4 }, s);
  addLog(ts(base, 4), 'info', 'product', 'product_view', { productId: 'prod_h1', name: 'Stainless Steel Water Bottle', category: 'Home & Kitchen', price: 399 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_h3', name: 'Electric Kettle', category: 'Home & Kitchen', price: 1299 }, s);
  addLog(ts(base, 6), 'flow', 'navigation', 'page_view', { page: '/product/prod_h3' }, s);
  addLog(ts(base, 7), 'info', 'cart', 'add_to_cart', { productId: 'prod_h3', name: 'Electric Kettle', price: 1299, quantity: 1 }, s);
  addLog(ts(base, 8), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Sports' }, s);
  addLog(ts(base, 9), 'info', 'product', 'product_list_view', { category: 'Sports', count: 4 }, s);
  addLog(ts(base, 10), 'info', 'product', 'product_view', { productId: 'prod_s1', name: 'Yoga Mat', category: 'Sports', price: 699 }, s);
  addLog(ts(base, 11), 'info', 'product', 'product_view', { productId: 'prod_s3', name: 'Running Shoes', category: 'Sports', price: 2999 }, s);
  addLog(ts(base, 12), 'info', 'cart', 'add_to_cart', { productId: 'prod_s1', name: 'Yoga Mat', price: 699, quantity: 1 }, s);
  addLog(ts(base, 13), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 14), 'flow', 'navigation', 'page_view', { page: '/checkout' }, s);
  addLog(ts(base, 16), 'info', 'order', 'order_placed', { orderId: 'ord_003', total: 1998, items: 2 }, s);
  addLog(ts(base, 17), 'flow', 'navigation', 'page_view', { page: '/order-confirmation' }, s);

  // Session 5: Vikram - Multi-category browsing, cart abandon
  base = now - 2 * DAY - 6 * HOUR;
  s = sessions[5];
  u = users[4];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 2), 'info', 'product', 'search', { query: 'headphones' }, s);
  addLog(ts(base, 3), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Electronics' }, s);
  addLog(ts(base, 4), 'info', 'product', 'product_list_view', { category: 'Electronics', count: 6 }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 2499 }, s);
  addLog(ts(base, 6), 'flow', 'navigation', 'page_view', { page: '/product/prod_e1' }, s);
  addLog(ts(base, 7), 'info', 'product', 'product_view', { productId: 'prod_e2', name: 'USB-C Fast Charger', category: 'Electronics', price: 899 }, s);
  addLog(ts(base, 8), 'info', 'cart', 'add_to_cart', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', price: 2499, quantity: 1 }, s);
  addLog(ts(base, 9), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Books' }, s);
  addLog(ts(base, 10), 'info', 'product', 'product_list_view', { category: 'Books', count: 5 }, s);
  addLog(ts(base, 11), 'info', 'product', 'product_view', { productId: 'prod_b3', name: 'Design Patterns', category: 'Books', price: 699 }, s);
  addLog(ts(base, 12), 'info', 'product', 'product_view', { productId: 'prod_b5', name: 'Refactoring', category: 'Books', price: 549 }, s);
  addLog(ts(base, 13), 'info', 'cart', 'add_to_cart', { productId: 'prod_b3', name: 'Design Patterns', price: 699, quantity: 1 }, s);
  addLog(ts(base, 15), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 16), 'warn', 'cart', 'cart_item_removed', { productId: 'prod_b3', name: 'Design Patterns' }, s);
  // Abandons

  // Session 6: Guest - quick browse with network error
  base = now - 1 * DAY - 8 * HOUR;
  s = sessions[6];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Clothing' }, s);
  addLog(ts(base, 2), 'info', 'product', 'product_list_view', { category: 'Clothing', count: 5 }, s);
  addLog(ts(base, 3), 'info', 'product', 'product_view', { productId: 'prod_c4', name: 'Formal Cotton Shirt', category: 'Clothing', price: 1499 }, s);
  addLog(ts(base, 4), 'flow', 'navigation', 'page_view', { page: '/product/prod_c4' }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_view', { productId: 'prod_c5', name: 'Track Pants', category: 'Clothing', price: 799 }, s);
  addLog(ts(base, 6), 'error', 'network', 'api_error', { endpoint: '/api/products/prod_c5/reviews', status: 500, message: 'Internal Server Error' }, s);
  addLog(ts(base, 7), 'warn', 'network', 'slow_response', { endpoint: '/api/products', duration: 3200 }, s);
  addLog(ts(base, 8), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Sports' }, s);
  addLog(ts(base, 9), 'info', 'product', 'product_list_view', { category: 'Sports', count: 4 }, s);
  addLog(ts(base, 10), 'info', 'product', 'product_view', { productId: 'prod_s2', name: 'Resistance Bands Set', category: 'Sports', price: 499 }, s);
  addLog(ts(base, 11), 'info', 'product', 'product_view', { productId: 'prod_s4', name: 'Cricket Bat', category: 'Sports', price: 1999 }, s);

  // Session 7: Ananya - Electronics purchase
  base = now - 10 * HOUR;
  s = sessions[7];
  u = users[7];
  addLog(ts(base, 0), 'flow', 'navigation', 'page_view', { page: '/' }, s);
  addLog(ts(base, 1), 'info', 'auth', 'login_success', { userId: u.id, name: u.name }, s);
  addLog(ts(base, 2), 'flow', 'navigation', 'page_view', { page: '/products' }, s);
  addLog(ts(base, 3), 'info', 'product', 'search', { query: 'mouse keyboard' }, s);
  addLog(ts(base, 4), 'flow', 'navigation', 'page_view', { page: '/products', category: 'Electronics' }, s);
  addLog(ts(base, 5), 'info', 'product', 'product_list_view', { category: 'Electronics', count: 6 }, s);
  addLog(ts(base, 6), 'info', 'product', 'product_view', { productId: 'prod_e5', name: 'Wireless Mouse', category: 'Electronics', price: 699 }, s);
  addLog(ts(base, 7), 'flow', 'navigation', 'page_view', { page: '/product/prod_e5' }, s);
  addLog(ts(base, 8), 'info', 'product', 'product_view', { productId: 'prod_e3', name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 3499 }, s);
  addLog(ts(base, 9), 'flow', 'navigation', 'page_view', { page: '/product/prod_e3' }, s);
  addLog(ts(base, 10), 'info', 'product', 'product_view', { productId: 'prod_e1', name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 2499 }, s);
  addLog(ts(base, 11), 'flow', 'navigation', 'page_view', { page: '/product/prod_e1' }, s);
  addLog(ts(base, 12), 'info', 'cart', 'add_to_cart', { productId: 'prod_e5', name: 'Wireless Mouse', price: 699, quantity: 1 }, s);
  addLog(ts(base, 13), 'info', 'cart', 'add_to_cart', { productId: 'prod_e3', name: 'Mechanical Gaming Keyboard', price: 3499, quantity: 1 }, s);
  addLog(ts(base, 14), 'flow', 'navigation', 'page_view', { page: '/cart' }, s);
  addLog(ts(base, 15), 'flow', 'navigation', 'page_view', { page: '/checkout' }, s);
  addLog(ts(base, 16), 'error', 'order', 'payment_failed', { reason: 'Card declined', orderId: null }, s);
  addLog(ts(base, 17), 'warn', 'order', 'payment_retry', { attempt: 2 }, s);
  addLog(ts(base, 18), 'info', 'order', 'order_placed', { orderId: 'ord_004', total: 4198, items: 2 }, s);
  addLog(ts(base, 19), 'flow', 'navigation', 'page_view', { page: '/order-confirmation' }, s);

  // Add some extra scattered product views to boost numbers
  const extraViews = [
    { base: now - 6 * DAY, s: sessions[0], prod: allProducts.find(p => p.id === 'prod_e4') },
    { base: now - 6 * DAY + 30 * MIN, s: sessions[0], prod: allProducts.find(p => p.id === 'prod_c1') },
    { base: now - 5 * DAY + 2 * HOUR, s: sessions[1], prod: allProducts.find(p => p.id === 'prod_c4') },
    { base: now - 5 * DAY + 2.5 * HOUR, s: sessions[1], prod: allProducts.find(p => p.id === 'prod_c5') },
    { base: now - 4 * DAY, s: sessions[2], prod: allProducts.find(p => p.id === 'prod_b3') },
    { base: now - 4 * DAY + 10 * MIN, s: sessions[2], prod: allProducts.find(p => p.id === 'prod_b5') },
    { base: now - 3 * DAY + 4 * HOUR, s: sessions[3], prod: allProducts.find(p => p.id === 'prod_e2') },
    { base: now - 3 * DAY + 5 * HOUR, s: sessions[3], prod: allProducts.find(p => p.id === 'prod_h2') },
    { base: now - 3 * DAY + 5.5 * HOUR, s: sessions[3], prod: allProducts.find(p => p.id === 'prod_h4') },
    { base: now - 2 * DAY + 1 * HOUR, s: sessions[4], prod: allProducts.find(p => p.id === 'prod_s2') },
    { base: now - 2 * DAY + 1.5 * HOUR, s: sessions[4], prod: allProducts.find(p => p.id === 'prod_s4') },
    { base: now - 2 * DAY + 2 * HOUR, s: sessions[5], prod: allProducts.find(p => p.id === 'prod_e5') },
    { base: now - 1 * DAY + 3 * HOUR, s: sessions[5], prod: allProducts.find(p => p.id === 'prod_c3') },
    { base: now - 1 * DAY + 3.5 * HOUR, s: sessions[6], prod: allProducts.find(p => p.id === 'prod_h1') },
    { base: now - 12 * HOUR, s: sessions[6], prod: allProducts.find(p => p.id === 'prod_b1') },
    { base: now - 11 * HOUR, s: sessions[7], prod: allProducts.find(p => p.id === 'prod_e4') },
    { base: now - 8 * HOUR, s: sessions[7], prod: allProducts.find(p => p.id === 'prod_e2') },
    { base: now - 7 * HOUR, s: sessions[0], prod: allProducts.find(p => p.id === 'prod_e1') },
    { base: now - 5 * HOUR, s: sessions[1], prod: allProducts.find(p => p.id === 'prod_b1') },
    { base: now - 4 * HOUR, s: sessions[2], prod: allProducts.find(p => p.id === 'prod_s3') },
    { base: now - 3 * HOUR, s: sessions[4], prod: allProducts.find(p => p.id === 'prod_h1') },
    { base: now - 2 * HOUR, s: sessions[5], prod: allProducts.find(p => p.id === 'prod_c2') },
  ];

  for (const ev of extraViews) {
    if (ev.prod) {
      addLog(
        new Date(ev.base).toISOString(),
        'info', 'product', 'product_view',
        { productId: ev.prod.id, name: ev.prod.name, category: ev.prod.category, price: ev.prod.price },
        ev.s
      );
    }
  }

  // Add some extra navigation entries
  const navExtras = [
    { base: now - 6 * DAY + 45 * MIN, s: sessions[0], page: '/products', category: 'Clothing' },
    { base: now - 5 * DAY + 2.2 * HOUR, s: sessions[1], page: '/products', category: 'Clothing' },
    { base: now - 4 * DAY + 15 * MIN, s: sessions[2], page: '/products', category: 'Books' },
    { base: now - 3 * DAY + 5.2 * HOUR, s: sessions[3], page: '/products', category: 'Home & Kitchen' },
    { base: now - 2 * DAY + 1.2 * HOUR, s: sessions[4], page: '/products', category: 'Sports' },
    { base: now - 1 * DAY + 3.2 * HOUR, s: sessions[6], page: '/products', category: 'Home & Kitchen' },
  ];

  for (const nav of navExtras) {
    addLog(
      new Date(nav.base).toISOString(),
      'flow', 'navigation', 'page_view',
      { page: nav.page, category: nav.category },
      nav.s
    );
    addLog(
      new Date(nav.base + 1 * MIN).toISOString(),
      'info', 'product', 'product_list_view',
      { category: nav.category, count: Math.floor(Math.random() * 3) + 4 },
      nav.s
    );
  }

  // Sort by timestamp
  logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  // Re-number IDs after sort
  logs.forEach((l, i) => l.id = i + 1);

  return logs;
}

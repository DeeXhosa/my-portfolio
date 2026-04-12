// Storage keys
const STORAGE_PRODUCTS = 'ecom_products';
const STORAGE_ORDERS = 'ecom_orders';
const STORAGE_CUSTOMERS = 'ecom_customers';

// Helper: get data from localStorage
function getProducts() {
  const data = localStorage.getItem(STORAGE_PRODUCTS);
  return data ? JSON.parse(data) : [];
}
function saveProducts(products) {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
}
function getOrders() {
  const data = localStorage.getItem(STORAGE_ORDERS);
  return data ? JSON.parse(data) : [];
}
function saveOrders(orders) {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
}
function getCustomers() {
  const data = localStorage.getItem(STORAGE_CUSTOMERS);
  return data ? JSON.parse(data) : [];
}
function saveCustomers(customers) {
  localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
}

// Initialize sample data
function initSampleData() {
  let products = getProducts();
  if (products.length === 0) {
    products = [
      { id: 1, name: 'Wireless Headphones', price: 79.99, stock: 45, category: 'Electronics', image: '🎧' },
      { id: 2, name: 'Cotton T-Shirt', price: 19.99, stock: 120, category: 'Apparel', image: '👕' },
      { id: 3, name: 'Ceramic Mug', price: 12.99, stock: 80, category: 'Home', image: '☕' },
      { id: 4, name: 'Smart Watch', price: 199.99, stock: 18, category: 'Electronics', image: '⌚' }
    ];
    saveProducts(products);
  }
  let orders = getOrders();
  if (orders.length === 0) {
    orders = [
      { id: 101, customerId: 1, customer: 'John Doe', total: 99.98, status: 'pending', date: '2025-04-01', items: 2 },
      { id: 102, customerId: 2, customer: 'Jane Smith', total: 79.99, status: 'shipped', date: '2025-04-03', items: 1 },
      { id: 103, customerId: 3, customer: 'Robert Brown', total: 32.98, status: 'delivered', date: '2025-03-28', items: 2 },
      { id: 104, customerId: 4, customer: 'Emily Davis', total: 219.99, status: 'pending', date: '2025-04-05', items: 1 }
    ];
    saveOrders(orders);
  }
  let customers = getCustomers();
  if (customers.length === 0) {
    customers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', totalSpent: 299.97, orders: 3, joinDate: '2025-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalSpent: 159.98, orders: 2, joinDate: '2025-02-10' },
      { id: 3, name: 'Robert Brown', email: 'robert@example.com', totalSpent: 89.97, orders: 1, joinDate: '2025-03-01' },
      { id: 4, name: 'Emily Davis', email: 'emily@example.com', totalSpent: 439.98, orders: 2, joinDate: '2025-01-20' }
    ];
    saveCustomers(customers);
  }
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function setupSidebar() {
  const toggleBtn = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
}

function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
    else link.classList.remove('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSampleData();
  setupSidebar();
  setActiveNav();
});

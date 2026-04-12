// Storage keys
const STORAGE_PRODUCTS = 'ecom_products';
const STORAGE_ORDERS = 'ecom_orders';

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

// Initialize sample data if empty
function initSampleData() {
  let products = getProducts();
  if (products.length === 0) {
    products = [
      { id: 1, name: 'Wireless Headphones', price: 79.99, stock: 45, category: 'Electronics' },
      { id: 2, name: 'Cotton T-Shirt', price: 19.99, stock: 120, category: 'Apparel' },
      { id: 3, name: 'Coffee Mug', price: 12.99, stock: 80, category: 'Home' }
    ];
    saveProducts(products);
  }

  let orders = getOrders();
  if (orders.length === 0) {
    orders = [
      { id: 101, customer: 'John Doe', total: 99.98, status: 'pending', date: '2025-04-01' },
      { id: 102, customer: 'Jane Smith', total: 79.99, status: 'shipped', date: '2025-04-03' },
      { id: 103, customer: 'Robert Brown', total: 32.98, status: 'delivered', date: '2025-03-28' }
    ];
    saveOrders(orders);
  }
}

// Format currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Sidebar toggle (call on pages with sidebar)
function setupSidebar() {
  const toggleBtn = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

// Highlight active nav link based on current page
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Run on every page
document.addEventListener('DOMContentLoaded', () => {
  initSampleData();
  setupSidebar();
  setActiveNav();
});
